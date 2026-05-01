// 八字计算（深度版）：四柱、五行、十神、神煞、调候、大运
import { Solar } from 'lunar-javascript';
import {
  GAN_WUXING, GAN_YIN_YANG, ZHI_WUXING, ZHI_HIDDEN, ZHI_ZODIAC,
  SHENSHA, DAYMASTER_DESC,
} from './constants.js';
import { getTrueSolarTime } from './solar.js';

// ==========================================
// 主入口：计算八字
// ==========================================
export function calculateBazi({ year, month, day, hour, minute, longitude, gender, useTrueSolar }) {
  let calc = { year, month, day, hour, minute };
  let offsetMin = 0;
  if (useTrueSolar && longitude !== undefined) {
    calc = getTrueSolarTime(year, month, day, hour, minute, longitude);
    offsetMin = calc.offsetMin;
  }

  const solar = Solar.fromYmdHms(calc.year, calc.month, calc.day, calc.hour, calc.minute, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  const pillars = {
    year: { gz: ec.getYear(), gan: ec.getYearGan(), zhi: ec.getYearZhi(), naYin: ec.getYearNaYin() },
    month: { gz: ec.getMonth(), gan: ec.getMonthGan(), zhi: ec.getMonthZhi(), naYin: ec.getMonthNaYin() },
    day: { gz: ec.getDay(), gan: ec.getDayGan(), zhi: ec.getDayZhi(), naYin: ec.getDayNaYin() },
    time: { gz: ec.getTime(), gan: ec.getTimeGan(), zhi: ec.getTimeZhi(), naYin: ec.getTimeNaYin() },
  };

  const shiShen = {
    year: { gan: ec.getYearShiShenGan(), zhi: ec.getYearShiShenZhi() },
    month: { gan: ec.getMonthShiShenGan(), zhi: ec.getMonthShiShenZhi() },
    time: { gan: ec.getTimeShiShenGan(), zhi: ec.getTimeShiShenZhi() },
  };

  const dayMaster = pillars.day.gan;
  const dayMasterWuxing = GAN_WUXING[dayMaster];
  const dayMasterYY = GAN_YIN_YANG[dayMaster];

  // 大运
  const yunGender = gender === 'male' ? 1 : 0;
  const yun = ec.getYun(yunGender);
  const daYunList = yun.getDaYun().slice(0, 9).map((d) => ({
    startAge: d.getStartAge(),
    endAge: d.getEndAge(),
    startYear: d.getStartYear(),
    endYear: d.getEndYear(),
    ganZhi: d.getGanZhi(),
  }));

  // 五行评分
  const wuxingScore = scoreWuxing(pillars);

  // 喜用神
  const yongShen = analyzeYongShen(dayMasterWuxing, wuxingScore, pillars.month.zhi);

  // 神煞
  const allZhi = [pillars.year.zhi, pillars.month.zhi, pillars.day.zhi, pillars.time.zhi];
  const shenSha = computeShenSha(dayMaster, pillars.year.zhi, allZhi);

  // 地支关系（合冲刑）
  const zhiRelations = computeZhiRelations(allZhi);

  // 阴历表达
  const lunarStr = `农历${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
  const zodiac = ZHI_ZODIAC[pillars.year.zhi];

  // 节气
  let season = '春';
  const monthZhi = pillars.month.zhi;
  if (['寅', '卯', '辰'].includes(monthZhi)) season = '春';
  else if (['巳', '午', '未'].includes(monthZhi)) season = '夏';
  else if (['申', '酉', '戌'].includes(monthZhi)) season = '秋';
  else season = '冬';

  return {
    pillars,
    shiShen,
    dayMaster,
    dayMasterWuxing,
    dayMasterYY,
    dayMasterMeta: DAYMASTER_DESC[dayMaster],
    daYunList,
    wuxingScore,
    yongShen,
    shenSha,
    zhiRelations,
    lunarStr,
    zodiac,
    season,
    offsetMin,
    solarStr: `${calc.year}-${pad(calc.month)}-${pad(calc.day)} ${pad(calc.hour)}:${pad(calc.minute)}`,
    rawSolarStr: `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}`,
    qiYunStr: `${yun.getStartYear()}年${yun.getStartMonth()}月${yun.getStartDay()}日起运`,
  };
}

const pad = (n) => String(n).padStart(2, '0');

// ==========================================
// 五行评分（深度：本气4、中气2、余气1，月令×2 加权）
// ==========================================
function scoreWuxing(pillars) {
  const score = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  ['year', 'month', 'day', 'time'].forEach((p) => {
    const gan = pillars[p].gan;
    score[GAN_WUXING[gan]] += 3;
    const zhi = pillars[p].zhi;
    const hidden = ZHI_HIDDEN[zhi];
    const monthBoost = p === 'month' ? 2 : 1; // 月令藏干加权
    hidden.forEach((g, i) => {
      const w = GAN_WUXING[g];
      const baseScore = i === 0 ? 4 : i === 1 ? 2 : 1;
      score[w] += baseScore * monthBoost;
    });
  });
  return score;
}

// ==========================================
// 喜用神（综合：身强弱 + 调候 + 通关）
// ==========================================
function analyzeYongShen(dayWuxing, wuxingScore, monthZhi) {
  const total = Object.values(wuxingScore).reduce((a, b) => a + b, 0);
  const dayScore = wuxingScore[dayWuxing];
  const dayRatio = dayScore / total;

  // 同党 vs 异党
  const sheng = { 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' }[dayWuxing];
  const ke = { 木: '金', 火: '水', 土: '木', 金: '火', 水: '土' }[dayWuxing];
  const xie = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' }[dayWuxing];
  const cai = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' }[dayWuxing];

  const sameScore = wuxingScore[dayWuxing] + wuxingScore[sheng];
  const oppScore = wuxingScore[ke] + wuxingScore[xie] + wuxingScore[cai];
  const ratio = sameScore / (oppScore || 1);

  let strength, yongShen, jiShen, reason;
  if (ratio > 1.3) {
    strength = '身偏旺';
    yongShen = [xie, cai, ke];
    jiShen = [dayWuxing, sheng];
    reason = '同党之力（比劫+印星）压过克泄耗，宜泄秀生财、官杀制身';
  } else if (ratio > 1.05) {
    strength = '身略旺';
    yongShen = [xie, cai];
    jiShen = [sheng];
    reason = '日主稍旺，宜食伤泄秀、财星疏通';
  } else if (ratio < 0.75) {
    strength = '身偏弱';
    yongShen = [dayWuxing, sheng];
    jiShen = [xie, cai, ke];
    reason = '克泄耗压过同党，宜印星滋扶或比劫帮身';
  } else if (ratio < 0.95) {
    strength = '身略弱';
    yongShen = [sheng, dayWuxing];
    jiShen = [ke, xie];
    reason = '日主稍弱，宜印生比助';
  } else {
    strength = '中和';
    yongShen = [xie, cai];
    jiShen = [];
    reason = '同党与克泄耗大致平衡，盘面流通顺畅';
  }

  // 调候用神（极简：以月令为准）
  const tiaoHou = getTiaoHou(dayWuxing, monthZhi);

  return {
    strength,
    yongShen,
    jiShen,
    reason,
    tiaoHou,
    sameScore,
    oppScore,
    ratio: ratio.toFixed(2),
  };
}

// 调候用神简表（基于穷通宝鉴常见说法）
function getTiaoHou(dayWuxing, monthZhi) {
  const map = {
    '木-子': { yong: '火', why: '冬木寒凝，急需丙火解冻' },
    '木-丑': { yong: '火', why: '冬末木僵，先丙后甲' },
    '木-寅': { yong: '火', why: '初春木嫩，丙火透则贵' },
    '木-卯': { yong: '金', why: '仲春木旺，宜庚金修剪' },
    '木-辰': { yong: '水', why: '春末土厚，需癸水润养' },
    '木-巳': { yong: '水', why: '夏木干枯，急需壬癸润养' },
    '木-午': { yong: '水', why: '盛夏火旺，专取癸水' },
    '木-未': { yong: '水', why: '燥土晒木，必用癸壬' },
    '木-申': { yong: '火', why: '秋木临官，宜丁火制金' },
    '木-酉': { yong: '火', why: '仲秋金旺，丁火炼金' },
    '木-戌': { yong: '水', why: '深秋木枯，宜壬润根' },
    '木-亥': { yong: '火', why: '初冬寒木，急需丙火' },

    '火-子': { yong: '木', why: '寒火无根，专取甲木' },
    '火-丑': { yong: '木', why: '冬末火微，宜甲乙生' },
    '火-寅': { yong: '木', why: '春火渐旺，木助为吉' },
    '火-卯': { yong: '土', why: '春末木盛，宜土泄秀' },
    '火-辰': { yong: '木', why: '春末火相，宜甲木引' },
    '火-巳': { yong: '水', why: '盛夏火炎，必取壬水' },
    '火-午': { yong: '水', why: '正夏火旺，专用壬水' },
    '火-未': { yong: '水', why: '夏末燥极，急需壬癸' },
    '火-申': { yong: '木', why: '秋火渐衰，木以接续' },
    '火-酉': { yong: '木', why: '秋火无根，宜印生' },
    '火-戌': { yong: '木', why: '深秋火死，木为命脉' },
    '火-亥': { yong: '木', why: '冬火气绝，木火通明' },

    '土-子': { yong: '火', why: '冻土难耕，必取丙火' },
    '土-丑': { yong: '火', why: '冬末寒土，丙火解冻' },
    '土-寅': { yong: '火', why: '春土被木克，需丙火' },
    '土-卯': { yong: '火', why: '仲春木旺，丙火制木' },
    '土-辰': { yong: '木', why: '春末湿土，宜甲木疏' },
    '土-巳': { yong: '水', why: '夏土燥裂，急需壬癸' },
    '土-午': { yong: '水', why: '盛夏燥土，必用壬水' },
    '土-未': { yong: '水', why: '燥土晒裂，专取癸水' },
    '土-申': { yong: '火', why: '秋土泄于金，宜丙火' },
    '土-酉': { yong: '火', why: '金旺土泄，丙火助身' },
    '土-戌': { yong: '木', why: '深秋顽土，宜甲木破' },
    '土-亥': { yong: '火', why: '初冬寒土，急需丙火' },

    '金-子': { yong: '火', why: '寒金被冻，丙丁同用' },
    '金-丑': { yong: '火', why: '冬末金寒，丙火解冻' },
    '金-寅': { yong: '土', why: '初春金弱，戊土生扶' },
    '金-卯': { yong: '土', why: '仲春金气退，土生为美' },
    '金-辰': { yong: '土', why: '春末土厚，金赖土生' },
    '金-巳': { yong: '水', why: '夏金被火炼，宜壬水' },
    '金-午': { yong: '水', why: '盛夏火炼，急需壬癸' },
    '金-未': { yong: '水', why: '燥土晒金，专取壬水' },
    '金-申': { yong: '火', why: '金气当令，丁火炼之' },
    '金-酉': { yong: '火', why: '仲秋金旺，丁火制锐' },
    '金-戌': { yong: '木', why: '深秋顽金，宜甲木助火' },
    '金-亥': { yong: '火', why: '初冬寒金，急需丙火' },

    '水-子': { yong: '火', why: '隆冬水寒，急需丙火' },
    '水-丑': { yong: '火', why: '冬末水冻，丙丁解寒' },
    '水-寅': { yong: '金', why: '初春水退，金为水源' },
    '水-卯': { yong: '金', why: '仲春木盗水气，金生水' },
    '水-辰': { yong: '金', why: '春末土克水，金通关' },
    '水-巳': { yong: '金', why: '夏水将干，金生水脉' },
    '水-午': { yong: '金', why: '盛夏水绝，急需庚辛' },
    '水-未': { yong: '金', why: '燥土剋水，金以救之' },
    '水-申': { yong: '火', why: '秋水当令，丙火调候' },
    '水-酉': { yong: '火', why: '金白水清，丙火映彩' },
    '水-戌': { yong: '火', why: '深秋寒水，丙火暖之' },
    '水-亥': { yong: '火', why: '初冬水旺，丙火解寒' },
  };
  return map[`${dayWuxing}-${monthZhi}`] || { yong: '—', why: '—' };
}

// ==========================================
// 神煞
// ==========================================
function computeShenSha(dayGan, yearZhi, allZhi) {
  const result = [];
  Object.entries(SHENSHA).forEach(([name, { desc, rule }]) => {
    let hit = false;
    try {
      // 部分神煞以年支为基，部分以日干为基
      if (['天乙贵人', '文昌'].includes(name)) {
        hit = rule(dayGan, allZhi);
      } else {
        hit = rule(yearZhi, allZhi);
      }
    } catch (e) { hit = false; }
    if (hit) result.push({ name, desc });
  });
  return result;
}

// ==========================================
// 地支关系（六合、三合、六冲、相刑）
// ==========================================
function computeZhiRelations(zhi) {
  const relations = [];
  const liuhe = [['子', '丑'], ['寅', '亥'], ['卯', '戌'], ['辰', '酉'], ['巳', '申'], ['午', '未']];
  const sanhe = [['申', '子', '辰'], ['亥', '卯', '未'], ['寅', '午', '戌'], ['巳', '酉', '丑']];
  const liuchong = [['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥']];
  const xianxing = [['寅', '巳', '申'], ['丑', '戌', '未'], ['子', '卯']];

  liuhe.forEach((pair) => {
    if (pair.every((z) => zhi.includes(z))) {
      relations.push({ type: '六合', items: pair, desc: `${pair.join('')}六合，主合作、和合` });
    }
  });
  sanhe.forEach((triple) => {
    const hits = triple.filter((z) => zhi.includes(z));
    if (hits.length >= 3) {
      relations.push({ type: '三合', items: hits, desc: `${hits.join('')}三合局，主大成` });
    } else if (hits.length === 2) {
      relations.push({ type: '半合', items: hits, desc: `${hits.join('')}半合，需第三字引动` });
    }
  });
  liuchong.forEach((pair) => {
    if (pair.every((z) => zhi.includes(z))) {
      relations.push({ type: '六冲', items: pair, desc: `${pair.join('')}相冲，主动荡变迁` });
    }
  });
  xianxing.forEach((triple) => {
    if (triple.every((z) => zhi.includes(z))) {
      relations.push({ type: '相刑', items: triple, desc: `${triple.join('')}相刑，主刑伤、官非` });
    }
  });
  return relations;
}

// ==========================================
// 当前大运
// ==========================================
export function getCurrentDaYun(daYunList, age) {
  return daYunList.find((d) => age >= d.startAge && age <= d.endAge);
}

// ==========================================
// 当前流年（简化）
// ==========================================
export function getCurrentLiuNian(year) {
  const offset = (year - 4) % 60;
  const gans = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const zhis = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  return gans[offset % 10] + zhis[offset % 12];
}

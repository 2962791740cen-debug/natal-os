// 多体系交叉综述 + 核心画像生成
// 目标：让看的人有"卧槽，说的就是我"的共鸣

const ELEMENT_KEYWORD = {
  火: '热情、行动、自我、燃烧',
  土: '务实、稳定、建设、晚成',
  风: '思辨、表达、社交、变化',
  水: '感性、深度、共情、流动',
};

const WUXING_KEYWORD = {
  木: '生发、向上、开拓、仁',
  火: '热烈、表达、文明、礼',
  土: '稳重、务实、忠厚、信',
  金: '果决、收敛、刚毅、义',
  水: '智慧、流动、深沉、智',
};

// ==========================================
// 核心画像（顶部巨卡用）
// 输入：所有结果。输出：一个比喻 + tagline + 3 句话核心 + 3 个标签
// ==========================================
export function generateArchetype({ bazi, astrology, numerology }) {
  const { dayMasterWuxing: w, yongShen, dayMaster } = bazi;
  const strength = yongShen.strength;
  const isMaster = numerology?.isMasterLife;
  const lp = numerology?.lifePath;
  const sun = astrology?.sunSign;
  const moon = astrology?.moonSign;

  // ====== 优先匹配（特殊组合）======

  // 大师数 22 + 土主 → 晚熟橡树
  if (isMaster && lp === 22 && w === '土') {
    return {
      archetype: '晚熟的橡树',
      en: 'LATE-BLOOMING OAK',
      tagline: '前三十年沉默扎根，第五十年才成林',
      verses: [
        '你不是早慧型选手，是耐力型选手',
        '你身边的人长得比你快，但他们不是橡树',
        '别在隧道里看不见光时，怀疑这辆车不够好',
      ],
      tags: ['老灵魂', '建造者', '马拉松型'],
    };
  }

  // 大师数 11 → 过载灵媒
  if (isMaster && lp === 11) {
    return {
      archetype: '天线过长的人',
      en: 'OVERTUNED ANTENNA',
      tagline: '你接得到别人接不到的频率，也容易被噪音淹没',
      verses: [
        '你比一般人敏感十倍，所以也累十倍',
        '你的"想太多"不是缺点，是天线在工作',
        '需要的不是变迟钝，是学会调音量',
      ],
      tags: ['高敏', '直觉型', '灵性体质'],
    };
  }

  // 大师数 33 → 导师
  if (isMaster && lp === 33) {
    return {
      archetype: '提前出生的老师',
      en: 'TEACHER ARRIVED EARLY',
      tagline: '你的存在本身就是一种"传递"',
      verses: [
        '你身边总有人莫名其妙找你诉苦',
        '不是因为你成熟，是因为你的频率天然让人安心',
        '记得：你也需要一个能装住你的容器',
      ],
      tags: ['治愈型', '高共情', '稀有数'],
    };
  }

  // ====== 普通日主 × 强弱组合 ======

  // 木日主
  if (['甲', '乙'].includes(dayMaster)) {
    if (strength.includes('旺')) {
      return {
        archetype: dayMaster === '甲' ? '等斧子的栋梁' : '攀着墙生长的藤',
        en: dayMaster === '甲' ? 'PILLAR AWAITING THE AXE' : 'VINE ON THE WALL',
        tagline: dayMaster === '甲'
          ? '你想要被"用"，但讨厌被"修剪"'
          : '你看似柔软，却比直立的树更善于活下来',
        verses: [
          dayMaster === '甲'
            ? '你天生有抱负，但又对权威本能地反感'
            : '你不与人正面对抗，但你从不放弃自己的方向',
          '这种"想被看见"和"想自由"的张力是你一生的功课',
          '找到一个允许你"野生"的环境比找一份"好工作"更重要',
        ],
        tags: ['有方向感', '反权威', '需要空间'],
      };
    } else {
      return {
        archetype: dayMaster === '甲' ? '等待春风的幼苗' : '雨夜的细叶',
        en: 'YOUNG WOOD WAITING',
        tagline: '你不缺天赋，缺的是被看见、被滋养',
        verses: [
          '你不是不行，是先天"养分"不够厚',
          '别和"已经成林的橡树"比早熟——你还在扎根',
          '找到能滋养你的人和环境，比拼命努力更重要',
        ],
        tags: ['潜力派', '需要支持', '慢热型'],
      };
    }
  }

  // 火日主
  if (['丙', '丁'].includes(dayMaster)) {
    if (strength.includes('旺')) {
      return {
        archetype: dayMaster === '丙' ? '需要遮挡的太阳' : '不肯熄灭的烛',
        en: dayMaster === '丙' ? 'SUN NEEDING SHADE' : 'EVERLASTING CANDLE',
        tagline: dayMaster === '丙'
          ? '你烈得可爱，也烈得疲惫'
          : '你温柔到看不清，但从未真正熄灭',
        verses: [
          '你的能量需要被合适的容器接住——没有就会自燃',
          '别人看到你"光"的那一面，看不到你"烫"的那一面',
          '学会"暗下来"不是认输，是节能',
        ],
        tags: ['热烈', '高能耗', '渴望被看见'],
      };
    } else {
      return {
        archetype: dayMaster === '丙' ? '欠缺燃料的火' : '风中的小烛',
        en: 'FIRE LACKING FUEL',
        tagline: '你不是不亮，是需要更多东西"喂"你',
        verses: [
          '你需要不断输入（学习、爱、灵感），不然就熄了',
          '所以独处对你不是放松，是消耗',
          '找到能给你"燃料"的人和事，是你这一生最重要的功课',
        ],
        tags: ['高敏感', '需输入', '怕孤独'],
      };
    }
  }

  // 土日主
  if (['戊', '己'].includes(dayMaster)) {
    if (strength.includes('旺')) {
      return {
        archetype: dayMaster === '戊' ? '沉默的山' : '滋养万物的田',
        en: dayMaster === '戊' ? 'SILENT MOUNTAIN' : 'NOURISHING SOIL',
        tagline: dayMaster === '戊'
          ? '你能装下别人的世界，自己却很少被装'
          : '你滋养所有人，却容易让自己干涸',
        verses: [
          '你是天生的承载者——情绪、责任、期待都能装',
          '但承载也是消耗，"懂事"是你最贵的代价',
          '允许自己有一次"我也累了"——这不是软弱，是真实',
        ],
        tags: ['老灵魂', '承载型', '隐形累'],
      };
    } else {
      return {
        archetype: '等待春耕的薄土',
        en: 'THIN SOIL AWAITING SPRING',
        tagline: '你需要先被滋养，才能真正承载',
        verses: [
          '你不是不肯付出，是先天的"库存"不够',
          '别再追求"懂事"了，先把自己喂饱',
          '你这一生的转机，往往不是更努力，是更被爱',
        ],
        tags: ['需被照顾', '内秀型', '慢热'],
      };
    }
  }

  // 金日主
  if (['庚', '辛'].includes(dayMaster)) {
    return {
      archetype: dayMaster === '庚' ? '未开锋的剑' : '埋在土里的玉',
      en: dayMaster === '庚' ? 'UNFORGED BLADE' : 'BURIED JADE',
      tagline: dayMaster === '庚'
        ? '你内心比刀刃硬，外表却比丝绸软'
        : '你美得克制，因此容易被低估',
      verses: [
        '你需要"被淬炼"才能成器——困难对你不是阻碍，是磨刀石',
        dayMaster === '庚'
          ? '你的脾气不是问题，是你的金属性在自我保护'
          : '你的"敏感"不是矫情，是金质天然的精致',
        '别羡慕那些张扬的人，你的光是被打磨出来的',
      ],
      tags: ['内刚外柔', '完美主义', '晚熟'],
    };
  }

  // 水日主
  if (['壬', '癸'].includes(dayMaster)) {
    return {
      archetype: dayMaster === '壬' ? '深处藏光的海' : '看不见的雨露',
      en: dayMaster === '壬' ? 'OCEAN HIDING LIGHT' : 'INVISIBLE DEW',
      tagline: dayMaster === '壬'
        ? '你流动得让人抓不住，但比谁都看得透'
        : '你温柔细腻，能渗进别人的根',
      verses: [
        '你的智慧在表面之下——别人看不见，但能感受到',
        dayMaster === '壬'
          ? '你需要"对的容器"来安顿，不然容易在世界里漂流'
          : '你像雨——下得人不知不觉就湿透了，但你自己常常忘了被照顾',
        '你这辈子的关键是：找到一个能"看穿你"的人',
      ],
      tags: ['深思', '高共情', '需要安顿'],
    };
  }

  // fallback
  return {
    archetype: '一棵正在长的树',
    en: 'A GROWING TREE',
    tagline: '你的故事还在写',
    verses: [
      '盘是底牌，怎么打始终是你自己的事',
      '所有命理都只是"概率与倾向"，不是剧本',
      '你的选择会改变盘',
    ],
    tags: ['探索中', '可塑型', '正在路上'],
  };
}

// ==========================================
// 共鸣金句卡片（综合 Tab 用）
// ==========================================
export function generateSynthesis({ bazi, astrology, numerology, naming }) {
  const cards = [];
  const { dayMaster, dayMasterWuxing, yongShen, shenSha, daYunList } = bazi;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentDaYun = daYunList.find((d) => {
    const ageNow = currentYear - d.startYear + d.startAge;
    return ageNow >= d.startAge && ageNow <= d.endAge;
  }) || daYunList[1];

  // 1. 跨体系元素印证
  const baziTopWuxing = Object.entries(bazi.wuxingScore).sort((a, b) => b[1] - a[1])[0][0];
  if (astrology) {
    const astroTopElement = Object.entries(astrology.elementCount).sort((a, b) => b[1] - a[1])[0][0];
    const wuxingToAstro = { 木: '风', 火: '火', 土: '土', 金: '土', 水: '水' };
    const matched = wuxingToAstro[baziTopWuxing] === astroTopElement;
    cards.push({
      tag: 'CROSS · 东西方共振',
      title: matched ? '你内外是同一个人' : '你的内外有反差',
      body: matched
        ? `八字里你最旺的是${baziTopWuxing}（${WUXING_KEYWORD[baziTopWuxing]}），占星里你最强的是${astroTopElement}元素（${ELEMENT_KEYWORD[astroTopElement]}）——两套完全独立的体系指向同一种气质，说明你的内核统一、自我认同清晰，这是少见的"心口合一"型。`
        : `八字主气${baziTopWuxing}（${WUXING_KEYWORD[baziTopWuxing]}），占星主导${astroTopElement}元素（${ELEMENT_KEYWORD[astroTopElement]}）——两股能量并存，意味着别人看到的你和你内心的你常常不是同一个人。这不是问题，是你的复杂。`,
      accent: matched,
    });
  }

  // 2. 当下议题
  cards.push({
    tag: 'NOW · 你正在经历的章节',
    title: currentDaYun ? `${currentDaYun.startAge}–${currentDaYun.endAge} 岁 · ${currentDaYun.ganZhi} 大运` : '童运期',
    body: `命局结构是「${yongShen.strength}」——${yongShen.reason}。${
      currentDaYun
        ? `这十年${currentDaYun.ganZhi}注入新能量，你能感觉到。喜用神是${yongShen.yongShen.join('、')}，对照大运五行看是助是耗。`
        : ''
    }`,
  });

  // 3. 偏印 vs 食伤（思想 vs 表达）
  const monthShi = bazi.shiShen.month.gan;
  const yearShi = bazi.shiShen.year.gan;
  const timeShi = bazi.shiShen.time.gan;
  const allShi = [yearShi, monthShi, timeShi];
  const yinCount = allShi.filter((s) => s.includes('印')).length;
  const shiShangCount = allShi.filter((s) => s === '食神' || s === '伤官').length;

  if (yinCount >= 2 && shiShangCount >= 1) {
    cards.push({
      tag: 'TENSION · 你的核心张力',
      title: '想法很多，又怕说错',
      body: '你盘里印星与食伤同时显现——前者让你深思熟虑、后者让你想表达，但两者互相压制。这就是为什么你常常"满肚子话却不知道从哪儿开口"。这种内耗不是你性格不行，是命局结构。看见它，就能开始绕过它。',
      accent: true,
    });
  } else if (yinCount >= 2) {
    cards.push({
      tag: 'TENSION · 你的核心张力',
      title: '聪明但容易自我消耗',
      body: '你的印星偏多——主聪明、好学、有第六感，但代价是"想得太多"。你最大的敌人不是别人，是脑子里那个"还不够好"的声音。它会跟你一辈子，但你可以选择不每次都听它的。',
    });
  } else if (shiShangCount >= 2) {
    cards.push({
      tag: 'TENSION · 你的核心张力',
      title: '才华藏不住',
      body: '你食伤旺——主才艺、表达欲、创造力。你压抑这部分会变内伤；释放出去会发光。命里就是要"输出"型的人。',
    });
  }

  // 4. 神煞（华盖、孤辰寡宿）
  const hasHuagai = shenSha.find((s) => s.name === '华盖');
  const hasGuchen = shenSha.find((s) => s.name === '孤辰寡宿');
  if (hasHuagai || hasGuchen) {
    cards.push({
      tag: 'STAR · 你的"独"',
      title: hasHuagai ? '华盖之星：聪慧的孤独' : '孤辰寡宿：婚姻晚成',
      body: hasHuagai
        ? '华盖是聪慧、宗教艺术之缘的星——你天生与"形而上"的东西有缘（哲学、灵性、艺术、深度阅读），但代价是孤独感比一般人强。你不是不合群，是没遇到能聊得到一起的人。'
        : '孤辰寡宿主婚姻晚成、性情独立。你不是不爱人，是你需要的"另一半"门槛比一般人高很多——遇不到合适的，宁可不要。',
    });
  }

  const hasWenchang = shenSha.find((s) => s.name === '文昌');
  if (hasWenchang) {
    cards.push({
      tag: 'STAR · 文昌',
      title: '你和"读书 / 文化"有命定的缘',
      body: '文昌星是文星——主聪明、利文化考试、能通过学习改变命运。这种缘是你的"暗钥"，别浪费。学习对你来说不只是手段，是命定的修炼路径。',
    });
  }

  // 5. 占星太阳-月亮-上升
  if (astrology) {
    cards.push({
      tag: 'TRINITY · 三大核心',
      title: `${astrology.sunSign}日 / ${astrology.moonSign}月 / ${astrology.ascSign}升`,
      body: `太阳在${astrology.sunSign}（你想成为的人）· 月亮在${astrology.moonSign}（你内心真正需要的）· 上升在${astrology.ascSign}（别人看到的你）。三者越和谐你越完整；越冲突你越拧巴。但有意思的是——拧巴的人，往往更深刻。`,
    });
  }

  // 6. 数字命理
  if (numerology?.isMasterLife) {
    const mod = numerology.lifePath === 22 ? '建造者' : numerology.lifePath === 11 ? '直觉者' : '导师';
    cards.push({
      tag: 'NUMEROLOGY · 大师数',
      title: `生命路径 ${numerology.lifePath}（${mod}）`,
      body: `大师数是罕见且沉重的能量——你的灵魂签了一份比一般人更重的合同。这意味着你心里那个"应该做出点什么"的声音会比一般人响。这个声音年轻时让人焦虑，中年时让人成事——别试图关掉它，但也别让它把你压垮。`,
      accent: true,
    });
  }

  // 7. 占星 12 宫木星 / 8 宫金星 等"暗钥"
  if (astrology) {
    const jupiter = astrology.planets.find((p) => p.name === '木星');
    if (jupiter && jupiter.house === 12) {
      cards.push({
        tag: 'HIDDEN KEY · 暗钥',
        title: '木星藏在 12 宫',
        body: '木星是占星里的福星，落在 12 宫（潜意识 / 隐秘 / 灵性）有个反直觉的规律——你的好运不在你"努力争取"的地方，而在你"松手 / 独处 / 做看似没用的事"的时候。越想抓越没有，越放手越来。',
        accent: true,
      });
    }
  }

  // 8. 一句最后的话
  cards.push({
    tag: 'KEY MESSAGE',
    title: getKeyMessage(bazi, numerology),
    body: '把这一句记在心里，比所有命理细节都重要。',
    accent: true,
  });

  return cards;
}

function getKeyMessage(bazi, numerology) {
  const isMaster = numerology?.isMasterLife;
  const isStrong = bazi.yongShen.strength.includes('旺');
  const isWeak = bazi.yongShen.strength.includes('弱');

  if (isMaster && bazi.dayMasterWuxing === '土') {
    return '你不是为短跑设计的，慢慢来';
  }
  if (isMaster) {
    return '你的灵魂签了重合同，但合同不要求你 25 岁就完成';
  }
  if (isStrong && bazi.dayMasterWuxing === '土') {
    return '你能装下别人——但谁来装你？';
  }
  if (isWeak) {
    return '你不是不行，是先天"库存"不够。先把自己喂饱';
  }
  if (bazi.dayMasterWuxing === '火' && isStrong) {
    return '你的烈是好事——但要找到能接住你的容器';
  }
  if (bazi.dayMasterWuxing === '水') {
    return '你的智慧在表面之下——别人看不见，但能感受到';
  }
  return '盘是底牌，怎么打始终是你自己的事';
}

// ==========================================
// 八字数据"翻译给你听"
// 把术语转成人话
// ==========================================
export function translateBazi(bazi) {
  const { dayMaster, dayMasterWuxing, yongShen, shiShen } = bazi;
  const dayMeta = bazi.dayMasterMeta;

  return {
    dayMaster: {
      title: `你像${dayMeta.meta}`,
      body: `${dayMeta.traits}。在五行里这叫"${dayMeta.element}"。`,
    },
    strength: {
      title: yongShen.strength.includes('旺') ? '你能量"自带"，但容易过载' : yongShen.strength.includes('弱') ? '你能量需要"外补"，独处会累' : '你能量基本平衡',
      body: yongShen.reason,
    },
    yongShen: {
      title: '让你顺的能量',
      body: `${yongShen.yongShen.join('、')}——遇到这几个五行的人 / 颜色 / 方位 / 行业，你会"莫名其妙变顺"。这就是你的"加分项"。`,
    },
    monthShi: shiShen?.month?.gan ? {
      title: shiShenToHuman(shiShen.month.gan),
      body: shiShenDeepDesc(shiShen.month.gan),
    } : null,
  };
}

function shiShenToHuman(s) {
  return {
    比肩: '青年期主题：找"同类"',
    劫财: '青年期主题：朋友很多但破财也容易',
    食神: '青年期主题：才艺与口福',
    伤官: '青年期主题：才华会让你出格',
    偏财: '青年期主题：机会财、走外缘',
    正财: '青年期主题：靠勤恳打底',
    七杀: '青年期主题：被压力推着长',
    正官: '青年期主题：在规则里建立位置',
    偏印: '青年期主题：钻研偏门、容易孤独',
    正印: '青年期主题：靠学习与贵人扶持',
  }[s] || s;
}

function shiShenDeepDesc(s) {
  return {
    比肩: '你这个阶段会自然吸引同频的朋友、合伙人——但要小心"同类内耗"',
    劫财: '你身边社交不缺，但要警惕"为面子破财"',
    食神: '你这阶段会通过表达 / 才艺 / 美食被认识',
    伤官: '你的才华会让你不甘心走"安全路线"——这是好事，但容易和权威冲突',
    偏财: '你能抓住别人看不到的机会——但小心钱来得快也走得快',
    正财: '你这阶段适合"老老实实积累"——快是慢，慢是快',
    七杀: '你会被压力推着长大——这种压力是命里给你的"催熟剂"',
    正官: '你这阶段适合在规则、体制、学校里建立位置',
    偏印: '你会沉迷一些"看起来没用"的东西——心理学、玄学、艺术。这不是浪费',
    正印: '你这阶段会遇到"贵人 / 老师 / 庇护"——别错过',
  }[s] || '';
}

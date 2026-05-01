// 多体系交叉综述
// 基于八字 + 占星 + 数字命理 + 姓名学，输出"读懂这个人"的整合性解读

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

export function generateSynthesis({ bazi, astrology, numerology, naming }) {
  const cards = [];

  // 1. 元素一致性卡：八字主旺五行 vs 占星主导元素
  const baziTopWuxing = Object.entries(bazi.wuxingScore).sort((a, b) => b[1] - a[1])[0][0];
  const astroTopElement = astrology
    ? Object.entries(astrology.elementCount).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  // 五行 → 占星元素映射
  const wuxingToAstro = { 木: '风', 火: '火', 土: '土', 金: '土', 水: '水' };
  const matched = astroTopElement && wuxingToAstro[baziTopWuxing] === astroTopElement;

  cards.push({
    tag: 'CROSS-MATCH · 元素印证',
    title: matched ? '东西方元素高度共振' : '东西方能量分化',
    body: matched
      ? `你的八字主气是${baziTopWuxing}（${WUXING_KEYWORD[baziTopWuxing]}），占星主导是${astroTopElement}元素（${ELEMENT_KEYWORD[astroTopElement]}）——两套体系指向同一种气质，说明你性格内核统一、自我认同清晰。`
      : `八字主气${baziTopWuxing}（${WUXING_KEYWORD[baziTopWuxing]}），占星主导${astroTopElement}元素（${ELEMENT_KEYWORD[astroTopElement]}）——两套能量并存，意味着你内在与外显有反差，可能让人看错你。`,
    accent: matched,
  });

  // 2. 当下议题
  const today = new Date();
  const age = today.getFullYear() - bazi.daYunList[0]?.startYear + (bazi.daYunList[0]?.startAge || 0) - 1;
  // 用更稳的方式：从 daYunList 找 currentDaYun
  // 这里简单估算
  const currentDaYun = bazi.daYunList.find((d) => {
    const ageNow = today.getFullYear() - d.startYear + d.startAge;
    return ageNow >= d.startAge && ageNow <= d.endAge;
  }) || bazi.daYunList[1];

  cards.push({
    tag: 'CURRENT · 当下主题',
    title: '你正在经历的章节',
    body: `当前${currentDaYun ? currentDaYun.ganZhi + '大运' : '童运期'}叠加${
      bazi.yongShen.strength
    }的命局结构。${bazi.yongShen.reason}。${
      currentDaYun
        ? `这一阶段${currentDaYun.ganZhi}注入新的能量场，与命局喜忌神（${bazi.yongShen.yongShen.join('、')}）对照看是助还是耗。`
        : ''
    }`,
  });

  // 3. 数字命理叠加
  if (numerology) {
    const lp = numerology.lifePath;
    const isMaster = numerology.isMasterLife;
    cards.push({
      tag: 'NUMEROLOGY · 数字加成',
      title: `生命路径数 ${lp}${isMaster ? '（大师数）' : ''}`,
      body: `${numerology.interpretation.lifePath?.desc || ''}${
        isMaster ? ' 大师数意味着你的灵魂签了一份比一般人更重的合同——别在年轻时被这种"应该做大事"的隐性压力压垮。' : ''
      }`,
      accent: isMaster,
    });
  }

  // 4. 姓名加成
  if (naming && naming.valid) {
    const ren = naming.wuGe['人格'];
    cards.push({
      tag: 'NAMING · 姓名能量',
      title: `名字主格人格${ren.num}（${ren.rate}）`,
      body: `${ren.desc}。三才配置${naming.sanCai.pattern}（${naming.sanCai.result}），代表名字本身在数理层面的能量倾向。`,
    });
  }

  // 5. 当代年轻人独有：占星 + 八字共振的核心建议
  if (astrology) {
    const sun = astrology.planets.find((p) => p.name === '太阳');
    const moon = astrology.planets.find((p) => p.name === '月亮');
    cards.push({
      tag: 'ESSENCE · 你的核心',
      title: `${astrology.sunSign}日 / ${astrology.moonSign}月 / ${astrology.ascSign}升`,
      body: `太阳在${astrology.sunSign}（你想成为的人），月亮在${astrology.moonSign}（你内心真正需要的），上升在${astrology.ascSign}（别人看到的你）。三者越和谐，你越完整；越冲突，你越拧巴。`,
    });
  }

  // 6. 给当事人的"一句话"
  cards.push({
    tag: 'KEY MESSAGE',
    title: getOneLineMessage(bazi, numerology),
    body: '把这一句记在心里，比所有命理细节都重要。',
    accent: true,
  });

  return cards;
}

function getOneLineMessage(bazi, numerology) {
  const isMaster = numerology?.isMasterLife;
  const isLatebloomer = bazi.yongShen.strength.includes('旺') && (bazi.daYunList[5]?.ganZhi || '').length > 0;

  if (isMaster && isLatebloomer) {
    return '你是为长跑设计的运动员——别在 100 米冲刺时拿冠军';
  }
  if (isMaster) {
    return '你的灵魂签了一份比常人更重的合同——慢慢扛得动';
  }
  if (isLatebloomer) {
    return '你不是早慧型选手，是耐力型选手——前半场打底，后半场开花';
  }
  return '盘是底牌，怎么打始终是你自己的事';
}

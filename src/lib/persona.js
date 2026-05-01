// 个性化"你这个人"场景化共鸣生成器
// 目标：让人看完每一句都"卧槽，说的就是我"

// 提取盘面特征
function getFeatures({ bazi, astrology, numerology }) {
  const allShi = [
    bazi.shiShen?.year?.gan,
    bazi.shiShen?.month?.gan,
    bazi.shiShen?.time?.gan,
  ].filter(Boolean);

  const yinCount = allShi.filter((s) => s.includes('印')).length;
  const shiShangCount = allShi.filter((s) => s === '食神' || s === '伤官').length;
  const biJieCount = allShi.filter((s) => s === '比肩' || s === '劫财').length;
  const guanShaCount = allShi.filter((s) => s === '正官' || s === '七杀').length;
  const caiCount = allShi.filter((s) => s === '正财' || s === '偏财').length;

  const shensha = bazi.shenSha.map((s) => s.name);
  const isStrong = bazi.yongShen.strength.includes('旺');
  const isWeak = bazi.yongShen.strength.includes('弱');

  return {
    bazi,
    astrology,
    numerology,
    dayMaster: bazi.dayMaster,
    dayWuxing: bazi.dayMasterWuxing,
    yinCount,
    shiShangCount,
    biJieCount,
    guanShaCount,
    caiCount,
    isStrong,
    isWeak,
    shensha,
    sunSign: astrology?.sunSign,
    moonSign: astrology?.moonSign,
    ascSign: astrology?.ascSign,
    lifePath: numerology?.lifePath,
    isMaster: numerology?.isMasterLife,
  };
}

// ===== 规则库 =====
// 每条规则包含触发条件 + 要推入哪个类别的话
const RULES = [
  // ============ 偏印 ============
  {
    when: (f) => f.yinCount >= 2,
    push: {
      daily: '你常常觉得自己"想得太多"——但这不是缺点，是你大脑的工作方式',
      daily: '你睡前脑子里总有一堆声音，你已经习惯了',
      hidden: '你天生对玄学、心理、哲学这些"看不见的东西"有一种亲切感',
      shadow: '你最大的敌人不是别人，是脑子里那个"我还不够好"的声音',
    },
  },
  // ============ 食神 / 伤官 ============
  {
    when: (f) => f.shiShangCount >= 2,
    push: {
      daily: '你心里总有满肚子话想说出来——憋着会变内伤',
      hidden: '你的表达欲 / 创作欲是命里的——压它会反噬你',
      misunderstood: '别人以为你"会说话"，其实你只是憋不住真话',
    },
  },
  {
    when: (f) => f.shiShangCount >= 1 && f.yinCount >= 2,
    push: {
      shadow: '你最大的内耗：满肚子话想说，又怕说错——这是你命局结构带的张力',
    },
  },
  // ============ 比劫 ============
  {
    when: (f) => f.biJieCount >= 2,
    push: {
      daily: '你不喜欢被指挥——哪怕对方是好意',
      love: '你需要的不是"被照顾"，是"被理解"——这两个不一样',
    },
  },
  // ============ 官杀 ============
  {
    when: (f) => f.guanShaCount >= 2,
    push: {
      daily: '你身上有一种"被压力推着长大"的感觉——这是命局给你的催熟剂',
      hidden: '你扛压能力比同龄人强很多——别人崩溃的事你能撑住',
    },
  },
  // ============ 身强弱 ============
  {
    when: (f) => f.isStrong && f.dayWuxing === '土',
    push: {
      daily: '你能装下别人的世界——但很少有人能装下你',
      loneliness: '你独处时反而最自由——你只是不敢承认',
      shadow: '你最容易忽视的是：你也需要被照顾',
    },
  },
  {
    when: (f) => f.isWeak,
    push: {
      daily: '你容易累——这不是你不够努力，是你的"电池"本来就小',
      shadow: '你最大的功课是：先把自己喂饱再说付出',
      love: '你需要的不是更努力地爱别人，是先允许自己被爱',
    },
  },
  // ============ 各日主特性 ============
  {
    when: (f) => ['己'].includes(f.dayMaster),
    push: {
      daily: '你天生是个"承载者"——朋友的情绪、家人的责任，你都能接住',
      hidden: '你的善良不是软弱，是稀有的资源——别贱卖',
    },
  },
  {
    when: (f) => ['戊'].includes(f.dayMaster),
    push: {
      daily: '你不易动怒，但一旦认定就不轻易变',
      misunderstood: '别人觉得你"无所谓"——其实你心里都有数',
    },
  },
  {
    when: (f) => ['甲'].includes(f.dayMaster),
    push: {
      daily: '你心里总有"我要成为什么"的冲动——这种冲动不要压',
      shadow: '你讨厌被修剪——但有时候修剪是为了你能长得更高',
    },
  },
  {
    when: (f) => ['乙'].includes(f.dayMaster),
    push: {
      daily: '你比你看起来的更坚韧——表面柔软不等于内心软弱',
      hidden: '你善于"借势"——这不是投机，是乙木本能的智慧',
    },
  },
  {
    when: (f) => ['丙'].includes(f.dayMaster),
    push: {
      daily: '你说话直、脾气快——这不是缺点，是丙火的本性',
      misunderstood: '别人以为你"没心机"——其实你心里都明白',
    },
  },
  {
    when: (f) => ['丁'].includes(f.dayMaster),
    push: {
      daily: '你是那种"外表安静但心里有戏"的人',
      hidden: '你内心比表面热烈得多——找到对的人会全心燃烧',
    },
  },
  {
    when: (f) => ['庚'].includes(f.dayMaster),
    push: {
      daily: '你嘴硬心软——别人说错话你脸上不动声色，心里早翻篇了',
      love: '你需要"被磨"才能成器——挫折对你是淬炼，不是打击',
    },
  },
  {
    when: (f) => ['辛'].includes(f.dayMaster),
    push: {
      daily: '你是那种"要么不做，做就要做到精致"的人',
      misunderstood: '别人觉得你"挑剔"——其实你只是有审美',
    },
  },
  {
    when: (f) => ['壬'].includes(f.dayMaster),
    push: {
      daily: '你思绪跳跃很快——别人常常跟不上你的脑子',
      hidden: '你比谁都看得透，但很少说破',
    },
  },
  {
    when: (f) => ['癸'].includes(f.dayMaster),
    push: {
      daily: '你共情能力很强——别人难过时你能感觉到，哪怕他没说',
      misunderstood: '你温柔细腻——但也容易被忽略',
    },
  },
  // ============ 占星：月亮 ============
  {
    when: (f) => f.moonSign === '摩羯',
    push: {
      daily: '你心里有个没人看到的小孩——你早就习惯把他锁起来',
      misunderstood: '别人觉得你成熟稳重——只有你自己知道你有多累',
      hidden: '你 8 岁就在心理上 18 岁了——这不是你的功劳，是你的成本',
      shadow: '你不擅长撒娇 / 求安慰 / 示弱——但你需要',
    },
  },
  {
    when: (f) => f.moonSign === '处女',
    push: {
      daily: '你脑子里总有"再优化一点"的声音',
      shadow: '你最大的内耗是"够不够好"——但其实你已经很好了',
    },
  },
  {
    when: (f) => f.moonSign === '巨蟹',
    push: {
      daily: '你需要一个"家"的感觉——不是房子，是被接纳的归属',
      love: '你的爱是"想护着对方"——这种深度不是所有人都能接住',
    },
  },
  {
    when: (f) => f.moonSign === '天蝎',
    push: {
      daily: '你的情绪深而强烈——一旦动情就翻天覆地',
      love: '你的爱要么 0 要么 100，没有中间值',
    },
  },
  {
    when: (f) => f.moonSign === '双鱼',
    push: {
      daily: '你常常被自己情绪淹没——这不是矫情，是双鱼月的设定',
      hidden: '你能"接收"别人的情绪——所以人多的地方会消耗你',
    },
  },
  {
    when: (f) => f.moonSign === '水瓶',
    push: {
      daily: '你需要"距离"——离太近你会窒息',
      misunderstood: '别人以为你冷漠——你只是怕被卷进别人的情绪',
    },
  },
  // ============ 占星：金星 ============
  {
    when: (f) => f.astrology?.planets?.find((p) => p.name === '金星' && p.sign === '狮子'),
    push: {
      love: '你接受不了"差不多"的爱情——要么不开始，要么就是"我的人"',
      love: '你需要被"看见"——不是被夸奖，是被真正读懂',
    },
  },
  {
    when: (f) => f.astrology?.planets?.find((p) => p.name === '金星' && p.sign === '天蝎'),
    push: {
      love: '你的爱深得让人喘不过气——你也知道',
    },
  },
  {
    when: (f) => f.astrology?.planets?.find((p) => p.name === '金星' && p.sign === '处女'),
    push: {
      love: '你审视另一半的细节——这不是挑剔，是你的爱的方式',
    },
  },
  // ============ 占星：木星 12 宫 ============
  {
    when: (f) => f.astrology?.planets?.find((p) => p.name === '木星' && p.house === 12),
    push: {
      hidden: '你的好运在你"松手"的地方，不在你"拼命"的地方——这反直觉但准',
      hidden: '你天生有"灵性"体质——那些"第六感"是真的，别压',
      shadow: '你最大的功课是学会"信任"，而不是"控制"',
    },
  },
  // ============ 占星：太阳宫位 ============
  {
    when: (f) => f.astrology?.planets?.find((p) => p.name === '太阳' && p.house === 9),
    push: {
      hidden: '你需要"远方"——旅行、留学、跨文化是你的能量来源',
      shadow: '你被困在小圈子里会枯萎——别让自己活小了',
    },
  },
  {
    when: (f) => f.astrology?.planets?.find((p) => p.name === '太阳' && p.house === 10),
    push: {
      daily: '你天生有事业野心——这不是世俗，是你的灵魂方向',
    },
  },
  {
    when: (f) => f.astrology?.planets?.find((p) => p.name === '太阳' && p.house === 1),
    push: {
      daily: '你走到哪都能被记住——身上有一种自然的"存在感"',
    },
  },
  // ============ 数字命理 ============
  {
    when: (f) => f.lifePath === 22,
    push: {
      daily: '你心里那个"应该做点什么"的声音，从小就有',
      shadow: '别人觉得你"已经够好了"，你觉得"还差很远"——这是 22 数的代价',
      hidden: '你这种"不甘平凡"的感觉不是错觉，是你的合同',
    },
  },
  {
    when: (f) => f.lifePath === 11,
    push: {
      daily: '你比一般人敏感得多——这是天线，不是问题',
      hidden: '你能感觉到房间里没人说出来的情绪',
    },
  },
  {
    when: (f) => f.lifePath === 33,
    push: {
      daily: '你身边总有人莫名其妙找你诉苦——你的频率让人安心',
    },
  },
  {
    when: (f) => f.lifePath === 7,
    push: {
      daily: '你需要独处充电——人多的地方会耗你',
      hidden: '你天生是思考者——别强迫自己变"外向"',
    },
  },
  // ============ 神煞 ============
  {
    when: (f) => f.shensha.includes('华盖'),
    push: {
      hidden: '你和"形而上"的东西有缘——哲学、艺术、心理、玄学',
      loneliness: '你的孤独不是没朋友，是没遇到能聊得到一起的人',
    },
  },
  {
    when: (f) => f.shensha.includes('文昌'),
    push: {
      hidden: '你和"读书"是命定的缘——学习对你不是手段，是修炼',
    },
  },
  {
    when: (f) => f.shensha.includes('天乙贵人'),
    push: {
      hidden: '你这辈子关键时刻总有人帮一把——这是命里给的，不是巧合',
    },
  },
  {
    when: (f) => f.shensha.includes('驿马'),
    push: {
      daily: '你坐不住——一个地方待久了就想动',
      hidden: '你的"动"不是浮躁，是你的命格在工作',
    },
  },
  {
    when: (f) => f.shensha.includes('桃花'),
    push: {
      love: '你身上有"被记住"的吸引力——但也容易招感情纠葛',
    },
  },
  {
    when: (f) => f.shensha.includes('孤辰寡宿'),
    push: {
      love: '你婚姻晚成 / 标准高——不是不爱，是你需要的"另一半"门槛比一般人高',
    },
  },
  {
    when: (f) => f.shensha.includes('将星'),
    push: {
      hidden: '你天生有领导力——别人会自然把决策推给你',
    },
  },
  // ============ 当代年轻人共鸣 ============
  {
    when: (f) => f.lifePath === 22 || f.isMaster,
    push: {
      shadow: '你这一生最大的诅咒：把"应该"误当成"想要"',
    },
  },
];

// ===== 主入口 =====
export function generatePersona({ bazi, astrology, numerology }) {
  const f = getFeatures({ bazi, astrology, numerology });

  // 桶（去重用 Set）
  const buckets = {
    daily: new Set(),
    misunderstood: new Set(),
    loneliness: new Set(),
    love: new Set(),
    hidden: new Set(),
    shadow: new Set(),
  };

  // 应用规则
  RULES.forEach((rule) => {
    try {
      if (rule.when(f)) {
        Object.entries(rule.push).forEach(([k, v]) => {
          if (buckets[k]) buckets[k].add(v);
        });
      }
    } catch (e) { /* skip */ }
  });

  // 转回数组
  const categories = [
    { key: 'daily', title: '你常常', tagline: '你自己最熟悉、但很少有人懂的那部分', icon: '✦' },
    { key: 'misunderstood', title: '别人误以为', tagline: '你身上的反差', icon: '◎' },
    { key: 'loneliness', title: '你独处时', tagline: '没人看见的那个你', icon: '☾' },
    { key: 'love', title: '你在感情里', tagline: '你的爱的方式', icon: '♡' },
    { key: 'hidden', title: '你的暗钥', tagline: '你最容易忽视、但其实最珍贵的天赋', icon: '✧' },
    { key: 'shadow', title: '你最该学会松手的', tagline: '你最容易消耗自己的地方', icon: '⊘' },
  ].map((cat) => ({
    ...cat,
    lines: Array.from(buckets[cat.key]).slice(0, 4),
  })).filter((cat) => cat.lines.length > 0);

  return categories;
}

// 运营手册生成器：基于盘面给出实操级建议
// 颜色 / 方位 / 行业 / 健康 / 关键年份

const WUXING_COLORS = {
  木: { good: ['深绿', '青', '草绿'], swatch: ['#22c55e', '#10b981', '#84cc16'] },
  火: { good: ['朱红', '橙', '紫红'], swatch: ['#FF4D00', '#ef4444', '#f59e0b'] },
  土: { good: ['土黄', '咖啡', '米色'], swatch: ['#d4a574', '#a16207', '#fde68a'] },
  金: { good: ['银白', '金属灰', '亮白'], swatch: ['#e5e7eb', '#cbd5e1', '#f3f4f6'] },
  水: { good: ['深蓝', '黑', '海蓝'], swatch: ['#0c4a6e', '#1e293b', '#0ea5e9'] },
};

const WUXING_DIRECTIONS = {
  木: ['东', '东南'],
  火: ['南'],
  土: ['中央', '东北', '西南'],
  金: ['西', '西北'],
  水: ['北'],
};

const WUXING_INDUSTRIES = {
  木: ['教育', '出版', '心理', '医药', '园林', '纺织', '设计', '内容创作'],
  火: ['餐饮', '能源', '电子', '广告', '娱乐', '影视', '主播', '光学'],
  土: ['建筑', '地产', '咨询', '农业', '矿产', '陶瓷', '人力资源'],
  金: ['金融', '机械', '汽车', '科技硬件', '法律', '军警', '珠宝'],
  水: ['物流', '互联网', '海运', '旅游', '咨询', '心理咨询', '研究'],
};

const HEALTH_TIPS = {
  木过旺: ['注意肝胆 / 情绪调节', '少熬夜，避免怒气积压'],
  木过弱: ['养肝护胆，多吃绿色蔬菜', '关注筋骨柔韧'],
  火过旺: ['注意心血管 / 上火 / 失眠', '多喝水，少辛辣，避免熬夜'],
  火过弱: ['关注循环 / 体温偏低', '适当晒太阳，多有氧运动'],
  土过旺: ['注意脾胃 / 湿气 / 体重', '少甜腻，多动减湿'],
  土过弱: ['脾胃虚弱，注意消化', '规律饮食，少生冷'],
  金过旺: ['注意肺 / 皮肤 / 鼻咽', '保持空气湿润'],
  金过弱: ['呼吸道偏弱，注意免疫', '多有氧锻炼，保持空气流通'],
  水过旺: ['注意肾 / 泌尿 / 浮肿', '少冷饮，控制盐分'],
  水过弱: ['肾水不足，注意精神能量', '早睡，多温水，少耗神'],
};

const CITY_BY_DIRECTION = {
  '北': ['北京', '哈尔滨', '沈阳', '长春', '呼和浩特'],
  '西北': ['西安', '兰州', '银川', '乌鲁木齐'],
  '西': ['成都', '重庆', '昆明', '拉萨'],
  '东北': ['沈阳', '大连', '青岛'],
  '东': ['上海', '杭州', '南京', '苏州', '宁波'],
  '东南': ['福州', '厦门', '台北', '广州', '深圳', '香港'],
  '南': ['深圳', '广州', '南宁', '海口', '三亚'],
  '西南': ['成都', '昆明', '贵阳', '南宁'],
  '中央': ['武汉', '郑州', '长沙', '西安'],
};

export function generateManual({ bazi, archetype, astrology }) {
  const yongShen = bazi.yongShen.yongShen || [];
  const jiShen = bazi.yongShen.jiShen || [];
  const dayWuxing = bazi.dayMasterWuxing;

  // ===== 颜色 =====
  const goodColors = [];
  const goodSwatches = [];
  yongShen.forEach((w) => {
    const data = WUXING_COLORS[w];
    if (data) {
      goodColors.push(...data.good);
      goodSwatches.push(...data.swatch);
    }
  });
  const avoidColors = [];
  jiShen.forEach((w) => {
    const data = WUXING_COLORS[w];
    if (data) avoidColors.push(...data.good);
  });

  // ===== 方位 =====
  const goodDirections = [];
  yongShen.forEach((w) => {
    if (WUXING_DIRECTIONS[w]) goodDirections.push(...WUXING_DIRECTIONS[w]);
  });
  const avoidDirections = [];
  jiShen.forEach((w) => {
    if (WUXING_DIRECTIONS[w]) avoidDirections.push(...WUXING_DIRECTIONS[w]);
  });

  // ===== 适合居住的城市（基于方位） =====
  const goodCities = new Set();
  goodDirections.forEach((d) => {
    if (CITY_BY_DIRECTION[d]) {
      CITY_BY_DIRECTION[d].forEach((c) => goodCities.add(c));
    }
  });

  // ===== 行业 =====
  const goodIndustries = new Set();
  yongShen.forEach((w) => {
    if (WUXING_INDUSTRIES[w]) WUXING_INDUSTRIES[w].forEach((i) => goodIndustries.add(i));
  });
  // 加占星宫位推荐
  if (astrology) {
    const sun = astrology.planets.find((p) => p.name === '太阳');
    const mc = astrology.mc?.sign;
    const mcMap = {
      '白羊': ['创业', '运动', '军警'],
      '金牛': ['财务', '美学', '艺术'],
      '双子': ['媒体', '写作', '销售'],
      '巨蟹': ['餐饮', '家居', '心理'],
      '狮子': ['娱乐', '管理', '创意'],
      '处女': ['编辑', '医疗', '咨询'],
      '天秤': ['法律', '设计', '调解'],
      '天蝎': ['研究', '心理', '调查'],
      '射手': ['教育', '旅游', '出版'],
      '摩羯': ['管理', '工程', '体制内'],
      '水瓶': ['科技', '创新', '社群'],
      '双鱼': ['艺术', '心理', '灵性'],
    };
    if (mc && mcMap[mc]) {
      mcMap[mc].forEach((i) => goodIndustries.add(i));
    }
  }

  // ===== 健康 =====
  const wuxingScore = bazi.wuxingScore;
  const total = Object.values(wuxingScore).reduce((a, b) => a + b, 0);
  const healthTips = [];
  Object.entries(wuxingScore).forEach(([w, score]) => {
    const ratio = score / total;
    if (ratio > 0.30) {
      const tips = HEALTH_TIPS[`${w}过旺`];
      if (tips) healthTips.push(...tips);
    } else if (ratio < 0.10) {
      const tips = HEALTH_TIPS[`${w}过弱`];
      if (tips) healthTips.push(...tips);
    }
  });

  // ===== 关键年份 =====
  const keyYears = [];
  bazi.daYunList.forEach((d, i) => {
    if (i === 0) return;
    keyYears.push({
      year: d.startYear,
      age: d.startAge,
      label: `进入 ${d.ganZhi || '童运'} 大运`,
      type: 'turn',
    });
  });
  // 取最近 5 个
  const now = new Date().getFullYear();
  const recentKey = keyYears.filter((k) => k.year >= now - 5 && k.year <= now + 30).slice(0, 5);

  return {
    colors: {
      good: goodColors.slice(0, 6),
      avoid: avoidColors.slice(0, 4),
      swatches: goodSwatches.slice(0, 6),
    },
    directions: {
      good: [...new Set(goodDirections)],
      avoid: [...new Set(avoidDirections)],
      cities: Array.from(goodCities).slice(0, 8),
    },
    industries: {
      good: Array.from(goodIndustries).slice(0, 10),
    },
    health: {
      tips: [...new Set(healthTips)].slice(0, 4),
      season: bazi.season,
    },
    keyYears: recentKey,
    yongShen: yongShen,
    jiShen: jiShen,
    dayWuxing,
  };
}

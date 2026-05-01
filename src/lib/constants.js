// ==========================================
// 五行、天干、地支、十神 等核心常量
// ==========================================

export const WUXING = {
  木: { color: '#4ade80', desc: '生发、向上、伸展', season: '春', direction: '东', emotion: '怒' },
  火: { color: '#FF4D00', desc: '热烈、上升、明亮', season: '夏', direction: '南', emotion: '喜' },
  土: { color: '#d4a574', desc: '承载、稳定、化育', season: '长夏', direction: '中', emotion: '思' },
  金: { color: '#cbd5e1', desc: '收敛、肃杀、坚利', season: '秋', direction: '西', emotion: '悲' },
  水: { color: '#60a5fa', desc: '润下、智慧、流动', season: '冬', direction: '北', emotion: '恐' },
};

export const GAN_WUXING = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水',
};

export const GAN_YIN_YANG = {
  甲: '阳', 丙: '阳', 戊: '阳', 庚: '阳', 壬: '阳',
  乙: '阴', 丁: '阴', 己: '阴', 辛: '阴', 癸: '阴',
};

export const ZHI_WUXING = {
  寅: '木', 卯: '木',
  巳: '火', 午: '火',
  辰: '土', 戌: '土', 丑: '土', 未: '土',
  申: '金', 酉: '金',
  亥: '水', 子: '水',
};

// 地支藏干（本气、中气、余气）
export const ZHI_HIDDEN = {
  子: ['癸'],
  丑: ['己', '癸', '辛'],
  寅: ['甲', '丙', '戊'],
  卯: ['乙'],
  辰: ['戊', '乙', '癸'],
  巳: ['丙', '庚', '戊'],
  午: ['丁', '己'],
  未: ['己', '丁', '乙'],
  申: ['庚', '壬', '戊'],
  酉: ['辛'],
  戌: ['戊', '辛', '丁'],
  亥: ['壬', '甲'],
};

// 地支生肖
export const ZHI_ZODIAC = {
  子: '鼠', 丑: '牛', 寅: '虎', 卯: '兔',
  辰: '龙', 巳: '蛇', 午: '马', 未: '羊',
  申: '猴', 酉: '鸡', 戌: '狗', 亥: '猪',
};

// 时辰对照
export const HOUR_TO_ZHI = (h) => {
  if (h === 23 || h === 0) return '子';
  if (h >= 1 && h <= 2) return '丑';
  if (h >= 3 && h <= 4) return '寅';
  if (h >= 5 && h <= 6) return '卯';
  if (h >= 7 && h <= 8) return '辰';
  if (h >= 9 && h <= 10) return '巳';
  if (h >= 11 && h <= 12) return '午';
  if (h >= 13 && h <= 14) return '未';
  if (h >= 15 && h <= 16) return '申';
  if (h >= 17 && h <= 18) return '酉';
  if (h >= 19 && h <= 20) return '戌';
  return '亥';
};

// 日主象征
export const DAYMASTER_DESC = {
  甲: { meta: '参天大树', traits: '正直、有主见、领袖气质，但有时刚硬不知变通', element: '阳木', shape: '栋梁之材' },
  乙: { meta: '藤蔓花草', traits: '柔韧、灵活、善于生存，善借势而上，但易依赖他人', element: '阴木', shape: '柔木之质' },
  丙: { meta: '太阳之火', traits: '热情、外向、光明磊落，照人也耀己，但易冲动张扬', element: '阳火', shape: '炎上之性' },
  丁: { meta: '烛火灯火', traits: '温柔、敏感、有艺术气质，内心炽热，外柔内刚', element: '阴火', shape: '文明之星' },
  戊: { meta: '高山厚土', traits: '稳重、可靠、包容性强，城府深沉，但保守迟钝', element: '阳土', shape: '镇定之形' },
  己: { meta: '田园之土', traits: '温和、内敛、滋养他人，思虑深、易内耗、谋而少决', element: '阴土', shape: '滋养之德' },
  庚: { meta: '钢铁兵器', traits: '果决、刚毅、行动力强，重义气，但易锋芒太露', element: '阳金', shape: '锐利之锋' },
  辛: { meta: '珠宝首饰', traits: '精致、敏感、追求完美，自尊心强、外柔内刚', element: '阴金', shape: '清贵之器' },
  壬: { meta: '江河湖海', traits: '智慧、流动、包容万物、谋略过人，但易随波逐流', element: '阳水', shape: '奔腾之势' },
  癸: { meta: '雨露之水', traits: '细腻、滋润、善解人意，思虑深、多愁善感', element: '阴水', shape: '润下之灵' },
};

// 十神含义
export const SHISHEN_DESC = {
  比肩: { short: '同我之力', desc: '独立、自尊、固执，朋友兄弟之缘。同性同五行，与日主能量相同。' },
  劫财: { short: '同我之力', desc: '冲动、慷慨、易破财，但社交活络。异性同五行。' },
  食神: { short: '我生之物', desc: '温和、才艺、口福、子女之星。代表创造力的温柔输出。' },
  伤官: { short: '我生之物', desc: '聪明、叛逆、批判、表达欲极强。才华横溢但易伤官星（社会规则）。' },
  偏财: { short: '我克之物', desc: '机会财、外缘、活络。父亲之星（男命）、情人之星。' },
  正财: { short: '我克之物', desc: '稳定收入、妻缘、务实。代表辛苦得来的本分财富。' },
  七杀: { short: '克我之力', desc: '压力、权威、行动力、敌人或贵人。极端的星——制化得当成大器。' },
  正官: { short: '克我之力', desc: '规则、责任、丈夫（女命）、社会地位。中规中矩的成就之星。' },
  偏印: { short: '生我之力', desc: '学问、玄学、孤独、第六感。智慧深远但易孤独多虑。' },
  正印: { short: '生我之力', desc: '母亲、保护、文凭、贵人。光明的庇护与名誉之星。' },
};

// 西方占星：星座
export const SIGNS = ['白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天秤', '天蝎', '射手', '摩羯', '水瓶', '双鱼'];
export const SIGNS_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
export const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export const SIGN_DESC = {
  白羊: { element: '火', mode: '基本', ruler: '火星', traits: '冲动、勇敢、领导、自我' },
  金牛: { element: '土', mode: '固定', ruler: '金星', traits: '稳定、感官、固执、务实' },
  双子: { element: '风', mode: '变动', ruler: '水星', traits: '灵活、好奇、多变、智识' },
  巨蟹: { element: '水', mode: '基本', ruler: '月亮', traits: '感性、家庭、滋养、敏感' },
  狮子: { element: '火', mode: '固定', ruler: '太阳', traits: '热情、骄傲、表演、慷慨' },
  处女: { element: '土', mode: '变动', ruler: '水星', traits: '细致、批判、服务、完美' },
  天秤: { element: '风', mode: '基本', ruler: '金星', traits: '平衡、关系、美感、决策难' },
  天蝎: { element: '水', mode: '固定', ruler: '冥王星', traits: '深度、强烈、转化、占有' },
  射手: { element: '火', mode: '变动', ruler: '木星', traits: '自由、远方、哲学、扩张' },
  摩羯: { element: '土', mode: '基本', ruler: '土星', traits: '务实、责任、成就、保守' },
  水瓶: { element: '风', mode: '固定', ruler: '天王星', traits: '独立、革新、人道、疏离' },
  双鱼: { element: '水', mode: '变动', ruler: '海王星', traits: '感性、共情、艺术、迷幻' },
};

// 行星
export const PLANETS = [
  { name: '太阳', en: 'Sun', symbol: '☉', desc: '核心自我、生命力、自我表达' },
  { name: '月亮', en: 'Moon', symbol: '☽', desc: '情绪、潜意识、安全感来源' },
  { name: '水星', en: 'Mercury', symbol: '☿', desc: '思维、沟通、学习方式' },
  { name: '金星', en: 'Venus', symbol: '♀', desc: '爱情、美感、价值观' },
  { name: '火星', en: 'Mars', symbol: '♂', desc: '行动、欲望、争斗' },
  { name: '木星', en: 'Jupiter', symbol: '♃', desc: '扩展、信仰、好运' },
  { name: '土星', en: 'Saturn', symbol: '♄', desc: '约束、责任、长期功课' },
  { name: '天王星', en: 'Uranus', symbol: '♅', desc: '革新、突变（世代）' },
  { name: '海王星', en: 'Neptune', symbol: '♆', desc: '梦幻、消融（世代）' },
  { name: '冥王星', en: 'Pluto', symbol: '♇', desc: '转化、深度（世代）' },
];

export const HOUSE_DESC = [
  { num: 1, name: '命宫', en: 'Self', desc: '自我形象、外表、本能反应' },
  { num: 2, name: '财帛', en: 'Value', desc: '金钱、价值观、自我价值感' },
  { num: 3, name: '兄弟', en: 'Mind', desc: '兄弟、沟通、短途、初等学习' },
  { num: 4, name: '田宅', en: 'Home', desc: '家庭、根基、童年、内心安全' },
  { num: 5, name: '子女', en: 'Joy', desc: '恋爱、创造力、子女、玩乐' },
  { num: 6, name: '奴仆', en: 'Service', desc: '工作、健康、日常、服务' },
  { num: 7, name: '夫妻', en: 'Other', desc: '伴侣、合作、契约、对手' },
  { num: 8, name: '疾厄', en: 'Death', desc: '深度联结、转化、共有资源、性' },
  { num: 9, name: '迁移', en: 'Far', desc: '远方、高等学问、信仰、出版' },
  { num: 10, name: '事业', en: 'MC', desc: '事业、社会形象、成就、父亲' },
  { num: 11, name: '福德', en: 'Hopes', desc: '朋友、社群、理想、未来' },
  { num: 12, name: '玄秘', en: 'Hidden', desc: '潜意识、隐秘、灵性、退隐' },
];

// 重要相位
export const ASPECTS = [
  { name: '合相', en: 'Conjunction', symbol: '☌', degree: 0, orb: 8, type: 'major' },
  { name: '六分相', en: 'Sextile', symbol: '⚹', degree: 60, orb: 4, type: 'minor' },
  { name: '四分相', en: 'Square', symbol: '□', degree: 90, orb: 6, type: 'tense' },
  { name: '三分相', en: 'Trine', symbol: '△', degree: 120, orb: 6, type: 'flow' },
  { name: '对分相', en: 'Opposition', symbol: '☍', degree: 180, orb: 8, type: 'tense' },
];

// 神煞简表（核心几个）
export const SHENSHA = {
  天乙贵人: {
    desc: '最尊贵的吉星，遇之逢凶化吉、贵人扶持',
    rule: (dayGan, allZhi) => {
      const map = {
        甲: ['丑', '未'], 戊: ['丑', '未'], 庚: ['丑', '未'],
        乙: ['子', '申'], 己: ['子', '申'],
        丙: ['亥', '酉'], 丁: ['亥', '酉'],
        壬: ['卯', '巳'], 癸: ['卯', '巳'],
        辛: ['寅', '午'],
      };
      const targets = map[dayGan] || [];
      return allZhi.some((z) => targets.includes(z));
    },
  },
  文昌: {
    desc: '文星、读书之星，主聪明、利文化考试',
    rule: (dayGan, allZhi) => {
      const map = { 甲: '巳', 乙: '午', 丙: '申', 丁: '酉', 戊: '申', 己: '酉', 庚: '亥', 辛: '子', 壬: '寅', 癸: '卯' };
      return allZhi.includes(map[dayGan]);
    },
  },
  桃花: {
    desc: '人缘、魅力、感情星，过旺易招感情纠葛',
    rule: (yearZhi, allZhi) => {
      const map = {
        申: '酉', 子: '酉', 辰: '酉',
        亥: '子', 卯: '子', 未: '子',
        寅: '卯', 午: '卯', 戌: '卯',
        巳: '午', 酉: '午', 丑: '午',
      };
      return allZhi.includes(map[yearZhi]);
    },
  },
  华盖: {
    desc: '聪慧、孤高、宗教艺术之缘，主孤独才情',
    rule: (yearZhi, allZhi) => {
      const map = {
        申: '辰', 子: '辰', 辰: '辰',
        亥: '未', 卯: '未', 未: '未',
        寅: '戌', 午: '戌', 戌: '戌',
        巳: '丑', 酉: '丑', 丑: '丑',
      };
      return allZhi.includes(map[yearZhi]);
    },
  },
  驿马: {
    desc: '动星、变迁之星，主奔波远行、变动机遇',
    rule: (yearZhi, allZhi) => {
      const map = {
        申: '寅', 子: '寅', 辰: '寅',
        亥: '巳', 卯: '巳', 未: '巳',
        寅: '申', 午: '申', 戌: '申',
        巳: '亥', 酉: '亥', 丑: '亥',
      };
      return allZhi.includes(map[yearZhi]);
    },
  },
  将星: {
    desc: '权威之星，主领导才能、统御之能',
    rule: (yearZhi, allZhi) => {
      const map = {
        申: '子', 子: '子', 辰: '子',
        亥: '卯', 卯: '卯', 未: '卯',
        寅: '午', 午: '午', 戌: '午',
        巳: '酉', 酉: '酉', 丑: '酉',
      };
      return allZhi.includes(map[yearZhi]);
    },
  },
  劫煞: {
    desc: '凶星，主突如其来的损失、被动变动',
    rule: (yearZhi, allZhi) => {
      const map = {
        申: '巳', 子: '巳', 辰: '巳',
        亥: '申', 卯: '申', 未: '申',
        寅: '亥', 午: '亥', 戌: '亥',
        巳: '寅', 酉: '寅', 丑: '寅',
      };
      return allZhi.includes(map[yearZhi]);
    },
  },
  孤辰寡宿: {
    desc: '孤独之星，主婚姻晚成、性情孤僻',
    rule: (yearZhi, allZhi) => {
      const map = {
        亥: ['寅', '戌'], 子: ['寅', '戌'], 丑: ['寅', '戌'],
        寅: ['巳', '丑'], 卯: ['巳', '丑'], 辰: ['巳', '丑'],
        巳: ['申', '辰'], 午: ['申', '辰'], 未: ['申', '辰'],
        申: ['亥', '未'], 酉: ['亥', '未'], 戌: ['亥', '未'],
      };
      const targets = map[yearZhi] || [];
      return targets.some((t) => allZhi.includes(t));
    },
  },
};

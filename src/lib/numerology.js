// 数字命理（毕达哥拉斯）+ 玛雅Kin

const PYTHAGOREAN = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = 'AEIOUY';

function reduce(n, keepMaster = true) {
  while (n > 9) {
    if (keepMaster && [11, 22, 33].includes(n)) return n;
    n = String(n).split('').reduce((s, c) => s + parseInt(c, 10), 0);
  }
  return n;
}

function nameSum(name, filter) {
  if (!name) return 0;
  const sum = name.toUpperCase().split('').reduce((s, c) => {
    if (!PYTHAGOREAN[c]) return s;
    if (filter && !filter(c)) return s;
    return s + PYTHAGOREAN[c];
  }, 0);
  return sum;
}

export function calculateNumerology({ year, month, day, name }) {
  const lifePath = reduce(
    String(year).split('').reduce((s, c) => s + parseInt(c, 10), 0)
    + String(month).split('').reduce((s, c) => s + parseInt(c, 10), 0)
    + String(day).split('').reduce((s, c) => s + parseInt(c, 10), 0)
  );

  const dayNum = reduce(day);
  const destinyNum = reduce(month + day);

  const ascii = name ? nameSum(name) : 0;
  const expressionNum = reduce(ascii);
  const soulNum = reduce(nameSum(name, (c) => VOWELS.includes(c)));
  const personalityNum = reduce(nameSum(name, (c) => !VOWELS.includes(c)));

  return {
    lifePath,
    isMasterLife: [11, 22, 33].includes(lifePath),
    dayNum,
    destinyNum,
    expressionNum,
    soulNum,
    personalityNum,
    nameSum: ascii,
    interpretation: interpret(lifePath, expressionNum),
  };
}

const NUMBER_DESC = {
  1: { keyword: '开创者', desc: '独立、领导、原创、自我驱动。一开始的能量。' },
  2: { keyword: '协作者', desc: '合作、平衡、敏感、调和。关系的能量。' },
  3: { keyword: '表达者', desc: '创造、沟通、艺术、社交。表达的能量。' },
  4: { keyword: '建造者', desc: '务实、秩序、勤奋、稳定。构建的能量。' },
  5: { keyword: '自由者', desc: '冒险、变化、感官、不羁。流动的能量。' },
  6: { keyword: '滋养者', desc: '家庭、责任、爱、服务。滋养的能量。' },
  7: { keyword: '思考者', desc: '内省、灵性、孤独、深度。智慧的能量。' },
  8: { keyword: '掌权者', desc: '权力、物质、商业、效率。物质成就的能量。' },
  9: { keyword: '完成者', desc: '人道、利他、释放、智慧。完结循环的能量。' },
  11: { keyword: '直觉大师', desc: '【大师数】高敏感、灵性、启发他人。压力极大的双刃。', isMaster: true },
  22: { keyword: '建造大师', desc: '【大师数】把宏大愿景落地的稀有能量。理想 + 实践。', isMaster: true },
  33: { keyword: '导师大师', desc: '【大师数】无私的爱与奉献。极少见。', isMaster: true },
};

function interpret(lifePath, expression) {
  return {
    lifePath: NUMBER_DESC[lifePath] || NUMBER_DESC[reduce(lifePath, false)],
    expression: NUMBER_DESC[expression] || NUMBER_DESC[reduce(expression, false)],
  };
}

// 玛雅卓尔金 Kin（基准：1987-7-26 = Kin 34 共振行者）
export function calculateMayaKin(year, month, day) {
  const ref = new Date(1987, 6, 26);
  const target = new Date(year, month - 1, day);
  const days = Math.floor((target - ref) / (1000 * 60 * 60 * 24));
  const kin = ((34 - 1 + days) % 260 + 260) % 260 + 1;
  const sealIdx = (kin - 1) % 20;
  const tone = ((kin - 1) % 13) + 1;
  const seals = ['红龙','白风','蓝夜','黄种子','红蛇','白世界桥','蓝手','黄星星','红月','白狗','蓝猴','黄人','红天行者','白巫师','蓝鹰','黄战士','红地球','白镜','蓝风暴','黄太阳'];
  const tones = ['磁性','月亮','电力','自我存在','超频','韵律','共振','银河','太阳','行星','光谱','水晶','宇宙'];
  return {
    kin,
    seal: seals[sealIdx],
    tone: tones[tone - 1],
    full: `Kin ${kin}：${tones[tone-1]}的${seals[sealIdx]}`,
  };
}

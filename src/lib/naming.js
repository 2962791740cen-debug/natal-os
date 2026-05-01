// 中文姓名学 - 五格三才（康熙笔画）

// 简化的康熙笔画表（覆盖常用字）。完整字库需要专门数据集，这里用近似规则 + 常用字字典。
const COMMON_KANGXI = {
  '王': 4, '李': 7, '张': 11, '刘': 15, '陈': 16, '杨': 13, '黄': 12, '赵': 14, '吴': 7, '周': 8,
  '徐': 10, '孙': 10, '马': 10, '朱': 6, '胡': 11, '林': 8, '郭': 15, '何': 7, '高': 10, '罗': 20,
  '郑': 19, '梁': 11, '谢': 17, '宋': 7, '唐': 10, '许': 11, '韩': 17, '冯': 12, '邓': 19, '曹': 11,
  '彭': 12, '曾': 12, '肖': 9, '田': 5, '董': 13, '袁': 10, '潘': 16, '蔡': 17, '蒋': 17, '余': 7,
  '于': 3, '杜': 7, '叶': 15, '程': 12, '魏': 18, '苏': 22, '吕': 7, '丁': 2, '任': 6, '沈': 8,
  '姚': 9, '卢': 16, '姜': 9, '崔': 11, '钟': 17, '谭': 19, '陆': 16, '汪': 8, '范': 15, '金': 8,
  '石': 5, '廖': 14, '贾': 13, '夏': 10, '韦': 9, '付': 5, '方': 4, '白': 5, '邹': 13, '孟': 8,
  '熊': 14, '秦': 10, '邱': 12, '江': 7, '尹': 4, '薛': 19, '阎': 16, '段': 9, '雷': 13, '侯': 9,
  '龙': 16, '史': 5, '陶': 16, '黎': 15, '贺': 12, '顾': 21, '毛': 4, '郝': 14, '龚': 22, '邵': 12,

  // 常用名字字
  '一': 1, '二': 2, '三': 3, '四': 5, '五': 4, '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
  '嘉': 14, '恒': 10, '伟': 11, '强': 12, '军': 9, '勇': 9, '杰': 12, '涛': 18, '明': 8, '超': 12,
  '华': 14, '建': 9, '文': 4, '志': 7, '俊': 9, '辉': 15, '健': 11, '波': 9, '宁': 14, '贵': 12,
  '福': 14, '生': 5, '龙': 16, '元': 4, '全': 6, '国': 11, '胜': 12, '学': 16, '祥': 11, '才': 3,
  '发': 12, '武': 8, '新': 13, '利': 7, '清': 12, '飞': 9, '彬': 11, '富': 12, '顺': 12, '信': 9,
  '子': 3, '杰': 12, '涛': 18, '昌': 8, '成': 7, '康': 11, '星': 9, '光': 6, '天': 4, '达': 16,
  '安': 6, '岩': 8, '中': 4, '茂': 11, '进': 15, '林': 8, '有': 6, '坚': 11, '义': 13, '兴': 16,
  '良': 7, '海': 11, '山': 3, '仁': 4, '波': 9, '宁': 14, '贵': 12, '福': 14, '生': 5, '龙': 16,
  '芳': 10, '英': 11, '丽': 19, '玉': 5, '琳': 13, '红': 9, '梅': 11, '兰': 23, '凤': 14, '燕': 16,
  '雪': 11, '霞': 17, '婷': 12, '萍': 14, '桂': 10, '美': 9, '静': 16, '春': 9, '秋': 9, '月': 4,
  '雨': 8, '雯': 12, '欣': 8, '怡': 9, '佳': 8, '思': 9, '雅': 12, '琪': 13, '诗': 13, '蕊': 18,

  // 罗马字也可（只是为防止报错）
  '心': 4, '爱': 13, '梦': 16, '语': 14, '梓': 11, '宇': 6, '航': 10, '泽': 17, '辰': 7, '宇': 6,
  '昊': 8, '皓': 12, '炎': 8, '森': 12, '麟': 23, '骞': 20, '骐': 18, '骥': 26,
};

// 估算笔画（不准但能用）
function estimateStrokes(char) {
  if (COMMON_KANGXI[char]) return COMMON_KANGXI[char];
  // fallback：用 unicode 编码区间粗略估计 8 画
  return 8;
}

const NUM_GOOD_BAD = {
  1: { rate: '大吉', desc: '太极首领之数，万物之始，名实皆得' },
  2: { rate: '凶', desc: '混沌未定之数，分离破败' },
  3: { rate: '大吉', desc: '阴阳和合，圆满有成' },
  4: { rate: '凶', desc: '万事休止之数，破败凶恶' },
  5: { rate: '大吉', desc: '福禄寿长，阴阳交感和合' },
  6: { rate: '吉', desc: '万宝集门之数，富贵安稳' },
  7: { rate: '吉', desc: '刚毅果断，独立独行' },
  8: { rate: '吉', desc: '意志刚健，勤勉发展' },
  9: { rate: '凶', desc: '虽有才能，浮沉不定' },
  10: { rate: '凶', desc: '万事休止之数，灾难临头' },
  11: { rate: '大吉', desc: '草木逢春，复兴繁荣' },
  12: { rate: '凶', desc: '薄弱无力，破家亡身' },
  13: { rate: '大吉', desc: '智略超群，富贵荣华' },
  14: { rate: '凶', desc: '沦落天涯，孤独悲叹' },
  15: { rate: '大吉', desc: '福寿圆满，富贵荣华' },
  16: { rate: '大吉', desc: '兴家得助，反凶为吉' },
  17: { rate: '吉', desc: '突破万难，权威刚强' },
  18: { rate: '大吉', desc: '铁石之数，意志坚强' },
  19: { rate: '凶', desc: '风云蔽月，辛苦悲惨' },
  20: { rate: '凶', desc: '空虚无成，破败之数' },
  21: { rate: '大吉', desc: '明月光照，独立权威' },
  22: { rate: '凶', desc: '秋草逢霜，百事不顺' },
  23: { rate: '大吉', desc: '旭日东升，光风霁月' },
  24: { rate: '大吉', desc: '锦绣前程，金钱丰盈' },
  25: { rate: '吉', desc: '资性英敏，怪奇杰出' },
  26: { rate: '半吉', desc: '波澜起伏，英雄豪杰' },
  27: { rate: '半凶', desc: '欲望无止，半途中折' },
  28: { rate: '半凶', desc: '波澜重叠，壮士拔山' },
  29: { rate: '半吉', desc: '智谋兼备，财力雄厚' },
  30: { rate: '凶', desc: '吉凶相伴，浮沉不安' },
  31: { rate: '大吉', desc: '智仁勇兼备，统领众人' },
  32: { rate: '大吉', desc: '池中之龙，逢风雷化龙' },
  33: { rate: '大吉', desc: '家门隆昌，旭日东升' },
  34: { rate: '凶', desc: '破家之数，灾难不绝' },
  35: { rate: '吉', desc: '温和平静，智达之数' },
  36: { rate: '凶', desc: '波澜重叠，常陷困境' },
  37: { rate: '大吉', desc: '权威显达，忠实热诚' },
  38: { rate: '半吉', desc: '艺能成名，意志薄弱' },
  39: { rate: '大吉', desc: '富贵繁荣，权势进达' },
  40: { rate: '凶', desc: '退守保身，富贵浮沉' },
  41: { rate: '大吉', desc: '德望高大，事业繁荣' },
  42: { rate: '半凶', desc: '十艺不成，努力不专' },
  43: { rate: '凶', desc: '雨夜花朵，外华内实' },
  44: { rate: '凶', desc: '愁眉难展，破败凶难' },
  45: { rate: '大吉', desc: '顺风扬帆，新生泰运' },
  46: { rate: '凶', desc: '坎坷不平，离祖成家' },
  47: { rate: '大吉', desc: '权威显达，子孙繁荣' },
  48: { rate: '大吉', desc: '德智兼备，名利双收' },
  49: { rate: '凶', desc: '吉凶难分，宜守不宜进' },
  50: { rate: '半凶', desc: '吉凶互见，先吉后凶' },
};

function rateNum(n) {
  if (n > 50) n = ((n - 1) % 50) + 1;
  return NUM_GOOD_BAD[n] || { rate: '—', desc: '数值超出范围' };
}

const SAN_CAI = {
  '木木木': '吉', '木木火': '大吉', '木木土': '吉', '木木金': '凶', '木木水': '凶',
  '木火木': '大吉', '木火火': '大吉', '木火土': '大吉', '木火金': '凶', '木火水': '凶',
  '火火木': '大吉', '火火火': '吉', '火火土': '大吉', '火火金': '凶', '火火水': '凶',
  '土土木': '凶', '土土火': '大吉', '土土土': '吉', '土土金': '吉', '土土水': '凶',
  '金金木': '凶', '金金火': '凶', '金金土': '吉', '金金金': '吉', '金金水': '吉',
  '水水木': '吉', '水水火': '凶', '水水土': '凶', '水水金': '吉', '水水水': '半吉',
};

function numToWuxing(n) {
  const last = n % 10;
  if ([1, 2].includes(last)) return '木';
  if ([3, 4].includes(last)) return '火';
  if ([5, 6].includes(last)) return '土';
  if ([7, 8].includes(last)) return '金';
  return '水';
}

export function calculateNaming(name) {
  if (!name || name.length < 2) {
    return { valid: false, error: '需要至少 2 个字的中文姓名' };
  }
  const chars = name.split('');
  const xing = chars[0];
  const ming = chars.slice(1);
  const xingStrokes = estimateStrokes(xing);
  const mingStrokes = ming.map(estimateStrokes);

  const tianGe = xingStrokes + 1;
  let renGe, diGe, waiGe, zongGe;
  if (ming.length === 1) {
    renGe = xingStrokes + mingStrokes[0];
    diGe = mingStrokes[0] + 1;
    waiGe = 1 + 1; // ?? 应是 (总-人)+1
    zongGe = xingStrokes + mingStrokes[0];
    waiGe = zongGe - renGe + 1;
  } else {
    renGe = xingStrokes + mingStrokes[0];
    diGe = mingStrokes[0] + mingStrokes[1];
    zongGe = xingStrokes + mingStrokes[0] + mingStrokes[1];
    waiGe = mingStrokes[1] + 1;
  }

  const tianWuxing = numToWuxing(tianGe);
  const renWuxing = numToWuxing(renGe);
  const diWuxing = numToWuxing(diGe);
  const sanCaiKey = `${tianWuxing}${renWuxing}${diWuxing}`;
  const sanCaiResult = SAN_CAI[sanCaiKey] || '中';

  return {
    valid: true,
    chars: chars.map((c, i) => ({ char: c, strokes: i === 0 ? xingStrokes : mingStrokes[i - 1] })),
    wuGe: {
      天格: { num: tianGe, ...rateNum(tianGe), wuxing: tianWuxing },
      人格: { num: renGe, ...rateNum(renGe), wuxing: renWuxing },
      地格: { num: diGe, ...rateNum(diGe), wuxing: diWuxing },
      外格: { num: waiGe, ...rateNum(waiGe), wuxing: numToWuxing(waiGe) },
      总格: { num: zongGe, ...rateNum(zongGe), wuxing: numToWuxing(zongGe) },
    },
    sanCai: {
      pattern: sanCaiKey,
      result: sanCaiResult,
    },
  };
}

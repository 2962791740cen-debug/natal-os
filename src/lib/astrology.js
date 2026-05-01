// 西方占星本命盘计算
import { Body, Equator, Ecliptic, SiderealTime, AstroTime, Observer } from 'astronomy-engine';
import { SIGNS, SIGN_DESC, PLANETS, ASPECTS, HOUSE_DESC } from './constants.js';
import { toUTCDate } from './solar.js';

// ==========================================
// 主入口
// ==========================================
export function calculateAstrology({ year, month, day, hour, minute, longitude, latitude, timezone = 8 }) {
  const utc = toUTCDate(year, month, day, hour, minute, timezone);
  const time = new AstroTime(utc);

  // 行星黄经
  const bodies = [
    { body: Body.Sun, key: '太阳' },
    { body: Body.Moon, key: '月亮' },
    { body: Body.Mercury, key: '水星' },
    { body: Body.Venus, key: '金星' },
    { body: Body.Mars, key: '火星' },
    { body: Body.Jupiter, key: '木星' },
    { body: Body.Saturn, key: '土星' },
    { body: Body.Uranus, key: '天王星' },
    { body: Body.Neptune, key: '海王星' },
    { body: Body.Pluto, key: '冥王星' },
  ];

  const observer = new Observer(0, 0, 0);
  const planets = bodies.map(({ body, key }) => {
    const equ = Equator(body, time, observer, false, true);
    const ecl = Ecliptic(equ.vec);
    const lng = (ecl.elon + 360) % 360;
    return {
      name: key,
      longitude: lng,
      sign: getSign(lng),
      signIdx: Math.floor(lng / 30),
      degInSign: lng % 30,
      planetMeta: PLANETS.find((p) => p.name === key),
    };
  });

  // ASC 和 MC（用本地恒星时 + 标准三角公式）
  // 格林威治恒星时（小时）
  const gst = SiderealTime(time);
  // 本地恒星时（小时）
  const lstHours = (gst + longitude / 15 + 24) % 24;
  // 转弧度
  const lstRad = (lstHours * 15 * Math.PI) / 180; // ARMC
  const latRad = (latitude * Math.PI) / 180;
  const obliquity = (23.4367 * Math.PI) / 180; // 黄道倾角

  // MC = atan2(sin(ARMC), cos(ARMC) * cos(ε))
  const mc = Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(obliquity));
  const mcDeg = ((mc * 180) / Math.PI + 360) % 360;

  // ASC = atan2(-cos(ARMC), sin(ARMC) * cos(ε) + tan(φ) * sin(ε))
  const asc = Math.atan2(
    -Math.cos(lstRad),
    Math.sin(lstRad) * Math.cos(obliquity) + Math.tan(latRad) * Math.sin(obliquity)
  );
  let ascDeg = ((asc * 180) / Math.PI + 360) % 360;
  // ASC 应该在 MC 之后（向东，即黄经增加方向）约 60-180° 范围
  // 北半球出生时这个差值通常在 60-150°；南半球可能不同。简化：保证差值在 60-240°
  const diff = (ascDeg - mcDeg + 360) % 360;
  if (diff < 60 || diff > 240) {
    ascDeg = (ascDeg + 180) % 360;
  }

  // 宫位（Whole Sign 整宫制：从 ASC 所在星座起一宫，每星座一宫）
  const ascSignIdx = Math.floor(ascDeg / 30);
  const houseCusps = Array.from({ length: 12 }, (_, i) => {
    const signIdx = (ascSignIdx + i) % 12;
    return {
      num: i + 1,
      cusp: signIdx * 30,
      sign: SIGNS[signIdx],
      signIdx,
      meta: HOUSE_DESC[i],
    };
  });

  // 行星在哪宫
  planets.forEach((p) => {
    const houseIdx = (p.signIdx - ascSignIdx + 12) % 12;
    p.house = houseIdx + 1;
    p.houseMeta = HOUSE_DESC[houseIdx];
  });

  // 主要相位
  const aspects = computeAspects(planets);

  // 元素与质态分布
  const elementCount = { 火: 0, 土: 0, 风: 0, 水: 0 };
  const modeCount = { 基本: 0, 固定: 0, 变动: 0 };
  planets.forEach((p) => {
    const meta = SIGN_DESC[p.sign];
    if (meta) {
      elementCount[meta.element] += 1;
      modeCount[meta.mode] += 1;
    }
  });

  // 主导：太阳、月亮、上升 三大核心
  return {
    planets,
    asc: {
      longitude: ascDeg,
      sign: getSign(ascDeg),
      degInSign: ascDeg % 30,
    },
    mc: {
      longitude: mcDeg,
      sign: getSign(mcDeg),
      degInSign: mcDeg % 30,
    },
    houseCusps,
    aspects,
    elementCount,
    modeCount,
    sunSign: planets[0].sign,
    moonSign: planets[1].sign,
    ascSign: getSign(ascDeg),
  };
}

function getSign(longitude) {
  return SIGNS[Math.floor(((longitude % 360) + 360) % 360 / 30)];
}

// ==========================================
// 相位计算
// ==========================================
function computeAspects(planets) {
  const aspects = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;

      ASPECTS.forEach((a) => {
        const orb = Math.abs(diff - a.degree);
        if (orb <= a.orb) {
          aspects.push({
            p1: p1.name,
            p2: p2.name,
            aspect: a.name,
            symbol: a.symbol,
            orb: orb.toFixed(1),
            type: a.type,
          });
        }
      });
    }
  }
  return aspects.sort((a, b) => parseFloat(a.orb) - parseFloat(b.orb));
}

// ==========================================
// 通用工具
// ==========================================
export function formatDeg(deg) {
  const d = Math.floor(deg);
  const m = Math.round((deg - d) * 60);
  return `${d}°${String(m).padStart(2, '0')}'`;
}

import React from 'react';
import { SIGNS, SIGN_DESC, SIGN_SYMBOLS, ASPECTS } from '../../lib/constants.js';
import { formatDeg } from '../../lib/astrology.js';
import { ReadingCard, SectionTag, SectionTitle } from '../shared.jsx';

const ELEMENT_COLORS = {
  火: '#FF4D00',
  土: '#d4a574',
  风: '#cbd5e1',
  水: '#60a5fa',
};

const PLANET_SYMBOLS = {
  太阳: '☉', 月亮: '☽', 水星: '☿', 金星: '♀', 火星: '♂',
  木星: '♃', 土星: '♄', 天王星: '♅', 海王星: '♆', 冥王星: '♇',
};

// ===== 占星本命圆盘 SVG =====
export const ChartWheel = ({ astrology, size = 480 }) => {
  const center = size / 2;
  const outerR = size * 0.46;
  const zodiacR = size * 0.40;
  const houseR = size * 0.32;
  const planetR = size * 0.27;

  // ASC 在左侧（9点钟方向，东方升起）
  // 视觉上：黄道圆，0°（白羊起点）旋转使 ASC 出现在左方
  const ascDeg = astrology.asc.longitude;
  const rotation = -ascDeg + 180; // 让 ASC 出现在左侧（180°）

  // 绘制度数到极坐标（注意 SVG y 轴向下）
  const degToXY = (deg, r) => {
    const adjusted = deg + rotation;
    const rad = (adjusted * Math.PI) / 180;
    return [
      center - Math.cos(rad) * r,
      center - Math.sin(rad) * r,
    ];
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* 外圆 */}
      <circle cx={center} cy={center} r={outerR} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <circle cx={center} cy={center} r={zodiacR} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <circle cx={center} cy={center} r={houseR} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

      {/* 12 星座区域 */}
      {SIGNS.map((sign, i) => {
        const startDeg = i * 30;
        const endDeg = (i + 1) * 30;
        const midDeg = startDeg + 15;
        const [x1, y1] = degToXY(startDeg, zodiacR);
        const [x2, y2] = degToXY(startDeg, outerR);
        const [tx, ty] = degToXY(midDeg, (zodiacR + outerR) / 2);
        const meta = SIGN_DESC[sign];
        return (
          <g key={sign}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            <text
              x={tx} y={ty}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={ELEMENT_COLORS[meta.element] || '#fff'}
              fontSize={size / 24}
              opacity={0.85}
            >
              {SIGN_SYMBOLS[i]}
            </text>
          </g>
        );
      })}

      {/* 12 宫位线（用 ASC 起点，每30°一宫，Whole Sign 制） */}
      {astrology.houseCusps.map((h, i) => {
        const cuspDeg = h.cusp;
        const [x1, y1] = degToXY(cuspDeg, 0);
        const [x2, y2] = degToXY(cuspDeg, zodiacR);
        const isAxis = i === 0 || i === 3 || i === 6 || i === 9; // ASC, IC, DSC, MC
        return (
          <line
            key={i}
            x1={center} y1={center}
            x2={x2} y2={y2}
            stroke={isAxis ? '#FF4D00' : 'rgba(255,255,255,0.08)'}
            strokeWidth={isAxis ? 1.2 : 0.5}
          />
        );
      })}

      {/* 宫位编号 */}
      {astrology.houseCusps.map((h, i) => {
        const midDeg = h.cusp + 15;
        const [tx, ty] = degToXY(midDeg, houseR * 0.85);
        return (
          <text
            key={`hn-${i}`}
            x={tx} y={ty}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.3)"
            fontSize={size / 36}
            fontFamily="monospace"
          >
            {h.num}
          </text>
        );
      })}

      {/* 行星 */}
      {astrology.planets.map((p, i) => {
        const [px, py] = degToXY(p.longitude, planetR);
        return (
          <g key={p.name}>
            <circle cx={px} cy={py} r={size / 50} fill="rgba(0,0,0,0.8)" stroke="#FF4D00" strokeWidth="1" />
            <text
              x={px} y={py}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#FF4D00"
              fontSize={size / 28}
            >
              {PLANET_SYMBOLS[p.name]}
            </text>
          </g>
        );
      })}

      {/* ASC / MC 标签 */}
      <text x={size * 0.02} y={center + 5} fill="#FF4D00" fontSize={size / 36} fontFamily="monospace">
        ASC
      </text>
      <text x={center} y={size * 0.05} textAnchor="middle" fill="#FF4D00" fontSize={size / 36} fontFamily="monospace">
        MC
      </text>
    </svg>
  );
};

// ===== 行星表 =====
export const PlanetTable = ({ planets }) => (
  <div className="grid md:grid-cols-2 gap-2">
    {planets.map((p) => {
      const meta = SIGN_DESC[p.sign];
      return (
        <div
          key={p.name}
          className="bg-white/[0.02] border border-white/10 p-4 hover:border-[#FF4D00]/30 transition-colors"
        >
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-2xl text-[#FF4D00]">{PLANET_SYMBOLS[p.name]}</span>
            <span className="text-base font-bold" style={{ fontFamily: 'Noto Serif SC' }}>{p.name}</span>
            <span className="text-xs text-white/50 ml-auto">第 {p.house} 宫</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span style={{ color: ELEMENT_COLORS[meta?.element] }}>{p.sign}座</span>
            <span className="font-mono text-xs text-white/50">{formatDeg(p.degInSign)}</span>
          </div>
          <div className="text-[10px] text-white/40">{p.planetMeta?.desc}</div>
        </div>
      );
    })}
  </div>
);

// ===== 元素 / 质态分布 =====
export const ElementBars = ({ elementCount, modeCount }) => {
  const total = Object.values(elementCount).reduce((a, b) => a + b, 0);
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <div className="text-[10px] font-mono text-white/40 tracking-widest mb-3">ELEMENTS · 元素</div>
        {['火', '土', '风', '水'].map((e) => {
          const pct = total ? (elementCount[e] / total) * 100 : 0;
          return (
            <div key={e} className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color: ELEMENT_COLORS[e], fontFamily: 'Noto Serif SC' }} className="font-bold">
                  {e}象
                </span>
                <span className="text-[10px] text-white/40 ml-auto font-mono">
                  {elementCount[e]} / {total}
                </span>
              </div>
              <div className="h-1.5 bg-white/5">
                <div
                  className="h-full transition-all duration-1000"
                  style={{ width: `${pct}%`, backgroundColor: ELEMENT_COLORS[e] }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <div className="text-[10px] font-mono text-white/40 tracking-widest mb-3">MODES · 质态</div>
        {['基本', '固定', '变动'].map((m) => {
          const pct = total ? (modeCount[m] / total) * 100 : 0;
          return (
            <div key={m} className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontFamily: 'Noto Serif SC' }} className="font-bold">{m}星座</span>
                <span className="text-[10px] text-white/40 ml-auto font-mono">
                  {modeCount[m]} / {total}
                </span>
              </div>
              <div className="h-1.5 bg-white/5">
                <div
                  className="h-full transition-all duration-1000 bg-[#FF4D00]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===== 相位列表 =====
export const AspectList = ({ aspects }) => {
  const major = aspects.filter((a) => ['合相', '对分相', '三分相', '四分相'].includes(a.aspect));
  if (!major.length) return <div className="text-white/40 text-sm">无主要相位（容许度内）</div>;

  return (
    <div className="grid md:grid-cols-2 gap-2">
      {major.map((a, i) => {
        const colorClass =
          a.type === 'flow' ? 'text-green-400' :
          a.type === 'tense' ? 'text-red-400' :
          'text-white/70';
        return (
          <div
            key={i}
            className="bg-white/[0.02] border border-white/10 p-3 flex items-center gap-3 text-sm"
          >
            <span className="text-[#FF4D00]">{PLANET_SYMBOLS[a.p1]}</span>
            <span className={`${colorClass} font-mono text-base`}>{a.symbol}</span>
            <span className="text-[#FF4D00]">{PLANET_SYMBOLS[a.p2]}</span>
            <span className="text-white/70" style={{ fontFamily: 'Noto Serif SC' }}>
              {a.p1} {a.aspect} {a.p2}
            </span>
            <span className="ml-auto font-mono text-[10px] text-white/40">
              {a.orb}°
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ===== 主区块 =====
export default function AstrologySection({ astrology }) {
  const sun = astrology.planets.find((p) => p.name === '太阳');
  const moon = astrology.planets.find((p) => p.name === '月亮');
  const sunMeta = SIGN_DESC[sun.sign];
  const moonMeta = SIGN_DESC[moon.sign];
  const ascMeta = SIGN_DESC[astrology.asc.sign];

  return (
    <div className="space-y-16">
      {/* 三大核心 */}
      <section>
        <SectionTag>CORE.TRINITY</SectionTag>
        <SectionTitle sub="占星学的灵魂三角：你想成为的人 / 你内心需要的 / 别人看到的">
          太阳·月亮·上升
        </SectionTitle>
        <div className="grid md:grid-cols-3 gap-px bg-white/5">
          {[
            { label: '太阳', en: 'SUN', sign: sun.sign, deg: sun.degInSign, meta: sunMeta, desc: '你想成为的人 / 核心驱动' },
            { label: '月亮', en: 'MOON', sign: moon.sign, deg: moon.degInSign, meta: moonMeta, desc: '你内心真正需要的 / 情绪母题' },
            { label: '上升', en: 'ASC', sign: astrology.asc.sign, deg: astrology.asc.degInSign, meta: ascMeta, desc: '别人看到的你 / 外显面具' },
          ].map((item, i) => (
            <div key={i} className="bg-black p-6 md:p-8">
              <div className="text-[10px] font-mono text-white/40 tracking-widest mb-1">{item.en}</div>
              <div className="text-xs text-white/60 mb-4" style={{ fontFamily: 'Noto Serif SC' }}>{item.label}</div>
              <div className="flex items-baseline gap-3 mb-3">
                <span
                  className="text-5xl font-bold leading-none"
                  style={{ fontFamily: 'Noto Serif SC', color: ELEMENT_COLORS[item.meta.element] }}
                >
                  {item.sign}
                </span>
                <span className="text-xs text-white/50 font-mono">{formatDeg(item.deg)}</span>
              </div>
              <div className="text-[10px] text-white/40 tracking-widest mb-2">
                {item.meta.element}象 / {item.meta.mode} / 守护：{item.meta.ruler}
              </div>
              <p className="text-xs text-white/60 mb-3">{item.meta.traits}</p>
              <div className="text-[10px] text-[#FF4D00] tracking-widest">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 圆盘 */}
      <section>
        <SectionTag>NATAL.CHART</SectionTag>
        <SectionTitle sub="出生那一刻天空的样貌（Whole Sign 整宫制）">本命圆盘</SectionTitle>
        <div className="bg-white/[0.02] border border-white/10 p-6 flex justify-center">
          <ChartWheel astrology={astrology} />
        </div>
      </section>

      {/* 行星 */}
      <section>
        <SectionTag>PLANETS</SectionTag>
        <SectionTitle sub="十大行星在哪个星座、哪个宫位">行星定位</SectionTitle>
        <PlanetTable planets={astrology.planets} />
      </section>

      {/* 元素分布 */}
      <section>
        <SectionTag>ELEMENT.MIX</SectionTag>
        <SectionTitle sub="行星在火土风水四元素的分布">能量构成</SectionTitle>
        <div className="bg-white/[0.02] border border-white/10 p-6">
          <ElementBars elementCount={astrology.elementCount} modeCount={astrology.modeCount} />
        </div>
      </section>

      {/* 相位 */}
      <section>
        <SectionTag>ASPECTS</SectionTag>
        <SectionTitle sub="行星之间形成的几何角度">主要相位</SectionTitle>
        <AspectList aspects={astrology.aspects} />
        <div className="mt-4 text-[10px] font-mono text-white/30 flex gap-4 flex-wrap">
          <span><span className="text-green-400">△</span> 三分相 / <span className="text-green-400">⚹</span> 六分相 → 流畅</span>
          <span><span className="text-red-400">□</span> 四分相 / <span className="text-red-400">☍</span> 对分相 → 紧张</span>
          <span><span className="text-white/70">☌</span> 合相 → 融合</span>
        </div>
      </section>
    </div>
  );
}

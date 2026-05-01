import React from 'react';
import {
  WUXING, GAN_WUXING, ZHI_WUXING, SHISHEN_DESC,
} from '../../lib/constants.js';
import { ReadingCard, SectionTag, SectionTitle } from '../shared.jsx';

// ===== 四柱大字展示 =====
export const PillarsDisplay = ({ bazi }) => {
  const pillars = [
    { key: 'year', label: '年柱', en: 'YEAR', sub: '祖辈 · 早年', data: bazi.pillars.year, shi: bazi.shiShen.year },
    { key: 'month', label: '月柱', en: 'MONTH', sub: '父母 · 青年', data: bazi.pillars.month, shi: bazi.shiShen.month },
    { key: 'day', label: '日柱', en: 'DAY', sub: '自己 · 配偶', data: bazi.pillars.day, shi: { gan: '日主', zhi: [] } },
    { key: 'time', label: '时柱', en: 'HOUR', sub: '子女 · 晚年', data: bazi.pillars.time, shi: bazi.shiShen.time },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
      {pillars.map((p, i) => {
        const ganW = GAN_WUXING[p.data.gan];
        const zhiW = ZHI_WUXING[p.data.zhi];
        const isDay = p.key === 'day';
        return (
          <div
            key={p.key}
            className={`bg-black p-5 md:p-7 relative ${isDay ? 'ring-1 ring-[#FF4D00]/50' : ''}`}
          >
            {isDay && (
              <div className="absolute top-2 right-2 text-[9px] font-mono text-[#FF4D00] tracking-widest">
                ★ SELF
              </div>
            )}
            <div className="text-[10px] font-mono text-white/40 tracking-widest mb-1">
              PILLAR.0{i + 1}
            </div>
            <div className="text-xs text-white/60 mb-1" style={{ fontFamily: 'Noto Serif SC' }}>
              {p.label}
            </div>
            <div className="text-[9px] text-white/30 mb-6 tracking-wider">{p.sub}</div>

            <div className="space-y-2 mb-6">
              <div className="flex items-baseline gap-3">
                <span
                  className="text-5xl md:text-6xl font-bold leading-none"
                  style={{ fontFamily: 'Noto Serif SC', color: WUXING[ganW].color }}
                >
                  {p.data.gan}
                </span>
                <span className="text-[10px] text-white/40 tracking-widest">{ganW}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span
                  className="text-5xl md:text-6xl font-bold leading-none"
                  style={{ fontFamily: 'Noto Serif SC', color: WUXING[zhiW].color }}
                >
                  {p.data.zhi}
                </span>
                <span className="text-[10px] text-white/40 tracking-widest">{zhiW}</span>
              </div>
            </div>

            <div className="text-[10px] text-white/40 mb-1 tracking-wider">十神</div>
            <div className="text-xs text-white/70 mb-3" style={{ fontFamily: 'Noto Serif SC' }}>
              {isDay ? (
                <span className="text-[#FF4D00]">日主</span>
              ) : (
                <>
                  {p.shi.gan} / {Array.isArray(p.shi.zhi) ? p.shi.zhi.join('·') : p.shi.zhi}
                </>
              )}
            </div>

            <div className="text-[10px] text-white/40 mb-1 tracking-wider">纳音</div>
            <div className="text-xs text-white/70" style={{ fontFamily: 'Noto Serif SC' }}>
              {p.data.naYin}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ===== 五行雷达图（SVG）=====
export const WuxingRadar = ({ scores }) => {
  const elements = ['木', '火', '土', '金', '水'];
  const max = Math.max(...Object.values(scores), 1);
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const size = 280;
  const center = size / 2;
  const radius = size * 0.38;

  const angle = (i) => (Math.PI * 2 * i) / 5 - Math.PI / 2;
  const point = (i, r) => [
    center + Math.cos(angle(i)) * r,
    center + Math.sin(angle(i)) * r,
  ];

  const polyPoints = elements
    .map((e, i) => {
      const r = (scores[e] / max) * radius;
      return point(i, r).join(',');
    })
    .join(' ');

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <svg width={size} height={size} className="flex-shrink-0">
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <polygon
            key={scale}
            points={elements.map((_, i) => point(i, radius * scale).join(',')).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}
        {elements.map((_, i) => {
          const [x, y] = point(i, radius);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
            />
          );
        })}
        <polygon
          points={polyPoints}
          fill="rgba(255,77,0,0.2)"
          stroke="#FF4D00"
          strokeWidth="2"
        />
        {elements.map((e, i) => {
          const r = (scores[e] / max) * radius;
          const [x, y] = point(i, r);
          return <circle key={e} cx={x} cy={y} r="3" fill="#FF4D00" />;
        })}
        {elements.map((e, i) => {
          const [x, y] = point(i, radius * 1.25);
          return (
            <g key={e}>
              <text
                x={x} y={y}
                textAnchor="middle" dominantBaseline="middle"
                fill={WUXING[e].color}
                fontSize="20" fontWeight="bold"
                style={{ fontFamily: 'Noto Serif SC' }}
              >
                {e}
              </text>
              <text
                x={x} y={y + 18}
                textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,255,255,0.5)"
                fontSize="11" fontFamily="monospace"
              >
                {scores[e]}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex-1 space-y-3 w-full">
        {elements.map((e) => {
          const pct = (scores[e] / max) * 100;
          const sharePct = total ? (scores[e] / total) * 100 : 0;
          return (
            <div key={e}>
              <div className="flex items-center gap-3 mb-1">
                <span
                  className="text-sm font-bold w-6"
                  style={{ fontFamily: 'Noto Serif SC', color: WUXING[e].color }}
                >
                  {e}
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  {scores[e]} / {total}
                </span>
                <span className="text-[10px] text-white/30 ml-auto font-mono">
                  {sharePct.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 bg-white/5 relative overflow-hidden">
                <div
                  className="h-full transition-all duration-1000"
                  style={{ width: `${pct}%`, backgroundColor: WUXING[e].color }}
                />
              </div>
              <div className="text-[10px] text-white/30 mt-1">{WUXING[e].desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===== 大运时间线 =====
export const DaYunTimeline = ({ daYunList, currentAge }) => (
  <div className="overflow-x-auto pb-2 -mx-2 px-2">
    <div className="flex gap-2 min-w-max">
      {daYunList.map((d, i) => {
        const isCurrent = currentAge >= d.startAge && currentAge <= d.endAge;
        const isPast = currentAge > d.endAge;
        const isFuture = currentAge < d.startAge;
        const ganzhi = d.ganZhi || '童运';
        const gan = ganzhi[0];
        const zhi = ganzhi[1];
        const ganW = GAN_WUXING[gan];
        const zhiW = ZHI_WUXING[zhi];
        return (
          <div
            key={i}
            className={`flex-shrink-0 w-32 p-4 border transition-all ${
              isCurrent
                ? 'border-[#FF4D00] bg-[#FF4D00]/10'
                : isPast
                ? 'border-white/5 bg-white/[0.02] opacity-50'
                : 'border-white/10 bg-white/[0.03] hover:border-white/20'
            }`}
          >
            {isCurrent && (
              <div className="text-[9px] font-mono text-[#FF4D00] tracking-widest mb-2">
                ★ NOW
              </div>
            )}
            <div className="text-[10px] font-mono text-white/40 mb-2">
              {d.startAge}–{d.endAge} 岁
            </div>
            {ganzhi && ganzhi.length === 2 ? (
              <div className="flex gap-2 items-baseline">
                <span
                  className="text-3xl font-bold leading-none"
                  style={{ fontFamily: 'Noto Serif SC', color: ganW ? WUXING[ganW].color : '#fff' }}
                >
                  {gan}
                </span>
                <span
                  className="text-3xl font-bold leading-none"
                  style={{ fontFamily: 'Noto Serif SC', color: zhiW ? WUXING[zhiW].color : '#fff' }}
                >
                  {zhi}
                </span>
              </div>
            ) : (
              <div className="text-2xl text-white/40" style={{ fontFamily: 'Noto Serif SC' }}>
                —
              </div>
            )}
            <div className="text-[10px] text-white/30 mt-2 font-mono">
              {d.startYear}-{d.endYear}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ===== 神煞列表 =====
export const ShenShaList = ({ shenSha }) => (
  <div className="grid md:grid-cols-2 gap-3">
    {shenSha.length === 0 ? (
      <div className="col-span-2 text-white/40 text-sm py-6 text-center">
        本命盘未触发常用神煞
      </div>
    ) : (
      shenSha.map((s, i) => (
        <div
          key={i}
          className="bg-white/[0.03] border border-white/10 p-4 hover:border-[#FF4D00]/40 transition-colors"
        >
          <div className="flex items-baseline gap-2 mb-2">
            <span
              className="text-base font-bold text-[#FF4D00]"
              style={{ fontFamily: 'Noto Serif SC' }}
            >
              {s.name}
            </span>
            <span className="text-[10px] font-mono text-white/40 tracking-widest">
              SHENSHA
            </span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">{s.desc}</p>
        </div>
      ))
    )}
  </div>
);

// ===== 地支关系 =====
export const ZhiRelations = ({ relations }) => (
  <div className="grid md:grid-cols-2 gap-3">
    {relations.length === 0 ? (
      <div className="col-span-2 text-white/40 text-sm py-6 text-center">
        地支无明显合冲刑关系
      </div>
    ) : (
      relations.map((r, i) => (
        <div key={i} className="bg-white/[0.03] border border-white/10 p-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span
              className={`text-base font-bold ${
                ['六冲', '相刑'].includes(r.type) ? 'text-red-400' : 'text-green-400'
              }`}
              style={{ fontFamily: 'Noto Serif SC' }}
            >
              {r.items.join(' · ')} {r.type}
            </span>
          </div>
          <p className="text-xs text-white/60">{r.desc}</p>
        </div>
      ))
    )}
  </div>
);

// ===== 八字主区块（聚合所有） =====
export default function BaziSection({ bazi, age, currentDaYun }) {
  return (
    <div className="space-y-16">
      {/* 四柱 */}
      <section>
        <SectionTag>FOUR.PILLARS</SectionTag>
        <SectionTitle sub="出生那一刻的天干地支配置">四柱八字</SectionTitle>
        <PillarsDisplay bazi={bazi} />
      </section>

      {/* 五行 */}
      <section>
        <SectionTag>FIVE.ELEMENTS</SectionTag>
        <SectionTitle sub="天干透干 + 地支藏干（月令加权）的综合权重">五行能量场</SectionTitle>
        <div className="bg-white/[0.02] border border-white/10 p-6 md:p-10">
          <WuxingRadar scores={bazi.wuxingScore} />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <ReadingCard
            tag="STRENGTH"
            title={`${bazi.yongShen.strength}`}
            body={
              <p>
                日主{' '}
                <span style={{ color: WUXING[bazi.dayMasterWuxing].color, fontWeight: 700 }}>
                  {bazi.dayMaster}（{bazi.dayMasterWuxing}）
                </span>{' '}
                — {bazi.yongShen.reason}（同党/异党 = {bazi.yongShen.ratio}）
              </p>
            }
          />
          <ReadingCard
            tag="USE GOD · 喜用神"
            title="助你的能量"
            body={
              <div>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {bazi.yongShen.yongShen.map((w) => (
                    <span
                      key={w}
                      className="px-3 py-1 border text-sm"
                      style={{ borderColor: WUXING[w].color, color: WUXING[w].color }}
                    >
                      {w}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-white/50">
                  这几个五行流入会让你的命局更顺，对应的颜色、方位、行业属"加分项"。
                </p>
              </div>
            }
            accent
          />
          <ReadingCard
            tag="TIAOHOU · 调候"
            title={`${bazi.season}季 · 用${bazi.yongShen.tiaoHou.yong}`}
            body={
              <p className="text-sm">{bazi.yongShen.tiaoHou.why}</p>
            }
          />
        </div>
      </section>

      {/* 大运 */}
      <section>
        <SectionTag>LIFE.PHASES</SectionTag>
        <SectionTitle sub="每十年一步运程的人生剧本提纲">大运时间线</SectionTitle>
        <DaYunTimeline daYunList={bazi.daYunList} currentAge={age} />
        {currentDaYun && (
          <div className="mt-8">
            <ReadingCard
              accent
              tag="CURRENT PHASE · 当下大运"
              title={`${currentDaYun.startAge}–${currentDaYun.endAge}岁 · ${currentDaYun.ganZhi}`}
              body={
                <p>
                  你现在 <span className="text-[#FF4D00] font-bold">{age} 岁</span>
                  ，正走 <span className="text-[#FF4D00] font-bold">{currentDaYun.ganZhi}</span> 大运。
                  注入的能量场（{GAN_WUXING[currentDaYun.ganZhi[0]]} + {ZHI_WUXING[currentDaYun.ganZhi[1]]}）
                  是助你还是耗你，看与喜忌神（喜
                  <span className="text-[#FF4D00]">{bazi.yongShen.yongShen.join('、')}</span>
                  ）的对照。
                </p>
              }
            />
          </div>
        )}
      </section>

      {/* 十神 */}
      <section>
        <SectionTag>TEN.GODS</SectionTag>
        <SectionTitle sub="八字中的十种社会关系角色">十神配置</SectionTitle>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { p: '年柱十神', t: bazi.shiShen.year.gan },
            { p: '月柱十神', t: bazi.shiShen.month.gan },
            { p: '时柱十神', t: bazi.shiShen.time.gan },
          ].map((s, i) => {
            const desc = SHISHEN_DESC[s.t];
            return (
              <div key={i} className="bg-white/[0.02] border border-white/10 p-5">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-[10px] font-mono text-white/40 tracking-widest">
                    {s.p.toUpperCase()}
                  </span>
                  <span
                    className="text-2xl font-bold text-[#FF4D00]"
                    style={{ fontFamily: 'Noto Serif SC' }}
                  >
                    {s.t}
                  </span>
                </div>
                {desc && (
                  <>
                    <div className="text-[10px] text-white/40 mb-1">{desc.short}</div>
                    <p className="text-xs text-white/60 leading-relaxed">{desc.desc}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 神煞 */}
      <section>
        <SectionTag>SHENSHA</SectionTag>
        <SectionTitle sub="特定干支组合形成的吉凶星">神煞分布</SectionTitle>
        <ShenShaList shenSha={bazi.shenSha} />
      </section>

      {/* 地支关系 */}
      <section>
        <SectionTag>ZHI.RELATIONS</SectionTag>
        <SectionTitle sub="地支之间的合、冲、刑、害关系">地支动力学</SectionTitle>
        <ZhiRelations relations={bazi.zhiRelations} />
      </section>
    </div>
  );
}

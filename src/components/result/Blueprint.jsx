import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SubBlock } from './Chapter.jsx';
import { PillarsDisplay, WuxingRadar, ShenShaList, ZhiRelations } from './BaziSection.jsx';
import { ChartWheel, PlanetTable, ElementBars, AspectList } from './AstrologySection.jsx';
import { WUXING } from '../../lib/constants.js';

// 折叠面板（详细数据可选展开）
const Expander = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 mb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors"
      >
        <span className="text-sm tracking-wide" style={{ fontFamily: 'Noto Serif SC' }}>
          {title}
        </span>
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''} text-white/40`} />
      </button>
      {open && <div className="p-5 pt-0">{children}</div>}
    </div>
  );
};

// ===== 整合的「天体配置」章节 =====
export default function Blueprint({ bazi, astrology, numerology, mayaKin, naming }) {
  return (
    <div className="space-y-16">

      {/* ──── 1. 生辰八字 ──── */}
      <SubBlock tag="EAST · 东方" title="生辰八字">
        <p className="text-sm text-white/50 mb-6 leading-relaxed" style={{ fontFamily: 'Noto Serif SC' }}>
          四柱是出生那一刻的天干地支组合。中柱"日柱"代表你自己，其余三柱是你与世界的关系。
        </p>
        <PillarsDisplay bazi={bazi} />

        <div className="mt-10 mb-2 text-sm text-white/50" style={{ fontFamily: 'Noto Serif SC' }}>
          五行能量分布（含天干透干 + 地支藏干）：
        </div>
        <div className="bg-white/[0.02] border border-white/10 p-6 md:p-8">
          <WuxingRadar scores={bazi.wuxingScore} />
        </div>

        {/* 折叠详情 */}
        <div className="mt-6 space-y-3">
          {bazi.shenSha.length > 0 && (
            <Expander title={`神煞 · ${bazi.shenSha.length} 个`}>
              <ShenShaList shenSha={bazi.shenSha} />
            </Expander>
          )}
          {bazi.zhiRelations.length > 0 && (
            <Expander title={`地支动力学 · ${bazi.zhiRelations.length} 组合冲刑关系`}>
              <ZhiRelations relations={bazi.zhiRelations} />
            </Expander>
          )}
        </div>
      </SubBlock>

      {/* ──── 2. 西方占星 ──── */}
      {astrology && (
        <SubBlock tag="WEST · 西方" title="西方占星">
          <p className="text-sm text-white/50 mb-6 leading-relaxed" style={{ fontFamily: 'Noto Serif SC' }}>
            出生那一刻，太阳在哪个星座（你想成为的人）、月亮在哪个星座（你内心需要的）、上升在哪个星座（别人看到的你）。
          </p>

          {/* 太阳 / 月亮 / 上升 */}
          <div className="grid md:grid-cols-3 gap-px bg-white/5 mb-10">
            {[
              { en: 'SUN', cn: '太阳', sign: astrology.sunSign, deg: astrology.planets[0].degInSign, sub: '你想成为的人' },
              { en: 'MOON', cn: '月亮', sign: astrology.moonSign, deg: astrology.planets[1].degInSign, sub: '你内心需要的' },
              { en: 'ASC', cn: '上升', sign: astrology.ascSign, deg: astrology.asc.degInSign, sub: '别人看到的你' },
            ].map((item) => (
              <div key={item.en} className="bg-black p-6">
                <div className="text-[10px] font-mono text-white/40 tracking-widest mb-1">{item.en}</div>
                <div className="text-xs text-white/60 mb-4" style={{ fontFamily: 'Noto Serif SC' }}>{item.cn}</div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl md:text-5xl font-bold leading-none text-[#FF4D00]" style={{ fontFamily: 'Noto Serif SC' }}>
                    {item.sign}
                  </span>
                  <span className="text-xs text-white/50 font-mono">
                    {item.deg.toFixed(0)}°
                  </span>
                </div>
                <p className="text-[11px] text-white/40 tracking-widest" style={{ fontFamily: 'Noto Serif SC' }}>
                  {item.sub}
                </p>
              </div>
            ))}
          </div>

          {/* 圆盘 */}
          <div className="bg-white/[0.02] border border-white/10 p-6 flex justify-center mb-6">
            <ChartWheel astrology={astrology} />
          </div>

          {/* 折叠详情 */}
          <div className="space-y-3">
            <Expander title={`十大行星位置`}>
              <PlanetTable planets={astrology.planets} />
            </Expander>
            <Expander title="元素 / 质态分布">
              <ElementBars elementCount={astrology.elementCount} modeCount={astrology.modeCount} />
            </Expander>
            {astrology.aspects.length > 0 && (
              <Expander title={`相位网络 · ${astrology.aspects.length} 个`}>
                <AspectList aspects={astrology.aspects} />
              </Expander>
            )}
          </div>
        </SubBlock>
      )}

      {/* ──── 3. 数字 + 姓名（横排两个小卡片） ──── */}
      <SubBlock tag="MORE · 补充层" title="数字命理 & 姓名学">
        <div className="grid md:grid-cols-2 gap-4">

          {/* 数字命理 */}
          <div className="bg-white/[0.02] border border-white/10 p-6">
            <div className="text-[10px] font-mono text-[#FF4D00] tracking-widest mb-3">
              NUMEROLOGY · 数字命理
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <span
                className={`text-6xl font-bold leading-none ${numerology.isMasterLife ? 'text-[#FF4D00]' : ''}`}
                style={{ fontFamily: 'Noto Serif SC' }}
              >
                {numerology.lifePath}
              </span>
              <div>
                <div className="text-sm" style={{ fontFamily: 'Noto Serif SC' }}>
                  {numerology.interpretation.lifePath?.keyword}
                </div>
                <div className="text-[10px] text-white/40 tracking-widest">
                  生命路径 {numerology.isMasterLife && '· 大师数'}
                </div>
              </div>
            </div>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              {numerology.interpretation.lifePath?.desc}
            </p>
            {mayaKin && (
              <div className="border-t border-white/5 pt-3 mt-3">
                <div className="text-[10px] font-mono text-white/40 tracking-widest mb-1">MAYAN KIN · 玛雅</div>
                <div className="text-sm" style={{ fontFamily: 'Noto Serif SC' }}>
                  {mayaKin.full}
                </div>
              </div>
            )}
          </div>

          {/* 姓名学 */}
          {naming && naming.valid ? (
            <div className="bg-white/[0.02] border border-white/10 p-6">
              <div className="text-[10px] font-mono text-[#FF4D00] tracking-widest mb-3">
                NAMING · 姓名学
              </div>
              <div className="flex gap-3 mb-4">
                {naming.chars.map((c, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl font-bold text-[#FF4D00] mb-1" style={{ fontFamily: 'Noto Serif SC' }}>
                      {c.char}
                    </div>
                    <div className="text-[10px] font-mono text-white/40">{c.strokes} 画</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-1 mb-3">
                {['天格', '人格', '地格', '外格', '总格'].map((k) => {
                  const it = naming.wuGe[k];
                  const rateColor =
                    it.rate.includes('大吉') ? '#4ade80' :
                    it.rate === '吉' ? '#86efac' :
                    it.rate === '半吉' ? '#fde047' :
                    it.rate === '半凶' ? '#fb923c' :
                    '#ef4444';
                  return (
                    <div key={k} className="bg-black/30 border border-white/5 p-2 text-center">
                      <div className="text-[9px] font-mono text-white/40 mb-1">{k}</div>
                      <div className="text-base font-bold" style={{ color: WUXING[it.wuxing].color }}>
                        {it.num}
                      </div>
                      <div className="text-[9px]" style={{ color: rateColor }}>{it.rate}</div>
                    </div>
                  );
                })}
              </div>

              <div className="text-[10px] text-white/40 mt-3">
                三才：{naming.sanCai.pattern} · {naming.sanCai.result}
              </div>
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/10 p-6 flex items-center justify-center">
              <p className="text-xs text-white/40 text-center">未填写中文姓名</p>
            </div>
          )}
        </div>
      </SubBlock>

    </div>
  );
}

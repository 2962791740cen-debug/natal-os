import React from 'react';
import { SubBlock } from './Chapter.jsx';
import { DaYunTimeline } from './BaziSection.jsx';
import { WUXING, GAN_WUXING, ZHI_WUXING } from '../../lib/constants.js';
import { ReadingCard } from '../shared.jsx';

// ===== 人生弧线 — 大运 + 当下 + 喜忌 =====
export default function LifeArc({ bazi, age, currentDaYun, currentLiuNian }) {
  const yong = bazi.yongShen;

  return (
    <div className="space-y-12">

      {/* 大运时间线 */}
      <SubBlock tag="LIFE PHASES · 大运" title="你这一生的章节">
        <p className="text-sm text-white/50 mb-6 leading-relaxed" style={{ fontFamily: 'Noto Serif SC' }}>
          每十年一步运程。每一步都给当下命局注入新的能量场。
          <span className="text-[#FF4D00]"> 从来不是"运气好坏"，是"打的什么牌不一样"。</span>
        </p>
        <DaYunTimeline daYunList={bazi.daYunList} currentAge={age} />
      </SubBlock>

      {/* 当前阶段 + 流年 */}
      <SubBlock tag="NOW · 当下" title="你正走的这一步">
        <div className="grid md:grid-cols-2 gap-4">

          {currentDaYun && (
            <ReadingCard
              accent
              tag={`${currentDaYun.startAge}-${currentDaYun.endAge} 岁 · 大运`}
              title={currentDaYun.ganZhi}
              body={
                <div>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-5xl font-bold" style={{ fontFamily: 'Noto Serif SC', color: WUXING[GAN_WUXING[currentDaYun.ganZhi[0]]]?.color }}>
                      {currentDaYun.ganZhi[0]}
                    </span>
                    <span className="text-5xl font-bold" style={{ fontFamily: 'Noto Serif SC', color: WUXING[ZHI_WUXING[currentDaYun.ganZhi[1]]]?.color }}>
                      {currentDaYun.ganZhi[1]}
                    </span>
                    <div className="text-xs text-white/40 ml-3">
                      {currentDaYun.startYear}–{currentDaYun.endYear}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">
                    这十年注入 <span className="font-bold">{GAN_WUXING[currentDaYun.ganZhi[0]]}</span> 与 <span className="font-bold">{ZHI_WUXING[currentDaYun.ganZhi[1]]}</span> 的能量。
                    {yong.yongShen.includes(GAN_WUXING[currentDaYun.ganZhi[0]]) || yong.yongShen.includes(ZHI_WUXING[currentDaYun.ganZhi[1]])
                      ? ' 与你喜用神同向 — 这是助力运。'
                      : yong.jiShen.includes(GAN_WUXING[currentDaYun.ganZhi[0]]) || yong.jiShen.includes(ZHI_WUXING[currentDaYun.ganZhi[1]])
                      ? ' 与你忌神同向 — 这一步要慢，少做大决定。'
                      : ' 与喜忌神交错 — 顺逆混合。'}
                  </p>
                </div>
              }
            />
          )}

          <ReadingCard
            tag={`${new Date().getFullYear()} 年 · 流年`}
            title={currentLiuNian}
            body={
              <div>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-5xl font-bold" style={{ fontFamily: 'Noto Serif SC', color: WUXING[GAN_WUXING[currentLiuNian[0]]]?.color }}>
                    {currentLiuNian[0]}
                  </span>
                  <span className="text-5xl font-bold" style={{ fontFamily: 'Noto Serif SC', color: WUXING[ZHI_WUXING[currentLiuNian[1]]]?.color }}>
                    {currentLiuNian[1]}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/70">
                  今年的能量场叠在大运之上 — 共同决定这一年你会经历什么。
                </p>
              </div>
            }
          />
        </div>
      </SubBlock>

      {/* 喜用神 */}
      <SubBlock tag="USE GOD · 喜忌" title="你这一生的加分项和扣分项">
        <div className="grid md:grid-cols-2 gap-4">

          <div className="bg-[#FF4D00]/5 border border-[#FF4D00]/30 p-6">
            <div className="text-[10px] font-mono text-[#FF4D00] tracking-widest mb-3">
              GOOD · 加分项 · 喜用神
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {yong.yongShen.map((w) => (
                <span
                  key={w}
                  className="px-4 py-2 border text-base font-bold"
                  style={{ borderColor: WUXING[w].color, color: WUXING[w].color, fontFamily: 'Noto Serif SC' }}
                >
                  {w}
                </span>
              ))}
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-2">
              <span className="text-[#FF4D00]">{yong.strength}</span> · {yong.reason}
            </p>
            <p className="text-xs text-white/50 leading-relaxed">
              这几个五行流入会让你的命局更顺。具体怎么用 → 看下一章「运营手册」。
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-6">
            <div className="text-[10px] font-mono text-white/50 tracking-widest mb-3">
              AVOID · 扣分项 · 忌神
            </div>
            {yong.jiShen.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {yong.jiShen.map((w) => (
                    <span
                      key={w}
                      className="px-4 py-2 border border-white/20 text-base text-white/70"
                      style={{ fontFamily: 'Noto Serif SC' }}
                    >
                      {w}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  这几个五行过旺时，你容易内耗、决策失误。注意调节。
                </p>
              </>
            ) : (
              <p className="text-sm text-white/50">
                命局相对平衡，无显著禁忌。你是少见的"中和"型。
              </p>
            )}
          </div>

        </div>

        {/* 调候 */}
        {yong.tiaoHou && yong.tiaoHou.yong !== '—' && (
          <div className="bg-white/[0.02] border border-white/10 p-5 mt-4">
            <div className="text-[10px] font-mono text-[#FF4D00] tracking-widest mb-2">
              TIAOHOU · 调候 · 季节性微调
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              你出生在 <span className="text-[#FF4D00] font-bold">{bazi.season}</span> 季 — 调候首选 <span className="text-[#FF4D00] font-bold">{yong.tiaoHou.yong}</span>。
              <span className="block text-xs text-white/50 mt-2">{yong.tiaoHou.why}</span>
            </p>
          </div>
        )}
      </SubBlock>

    </div>
  );
}

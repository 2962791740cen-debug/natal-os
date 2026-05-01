import React, { useState, useMemo } from 'react';
import { RotateCcw, Hexagon, Sparkles, Activity, TreePine, Layers } from 'lucide-react';
import { Brand, NoiseLayer, KeyValue } from './shared.jsx';
import { WUXING } from '../lib/constants.js';
import { getCurrentDaYun, getCurrentLiuNian } from '../lib/bazi.js';
import BaziSection from './result/BaziSection.jsx';
import AstrologySection from './result/AstrologySection.jsx';
import NumerologySection from './result/NumerologySection.jsx';
import NamingSection from './result/NamingSection.jsx';
import SynthesisSection from './result/SynthesisSection.jsx';
import CorePortrait from './result/CorePortrait.jsx';
import PersonaSection from './result/PersonaSection.jsx';

export default function Result({ bazi, astrology, numerology, naming, mayaKin, synthesisCards, archetype, persona, input, onRestart }) {
  const [tab, setTab] = useState('bazi');

  const today = new Date();
  const currentYear = today.getFullYear();
  const age = useMemo(() => {
    let a = currentYear - input.year;
    if (today.getMonth() + 1 < input.month
      || (today.getMonth() + 1 === input.month && today.getDate() < input.day)) {
      a -= 1;
    }
    return a;
  }, [currentYear, input]);

  const currentDaYun = useMemo(() => getCurrentDaYun(bazi.daYunList, age), [bazi, age]);
  const currentLiuNian = getCurrentLiuNian(currentYear);
  const dayMasterColor = WUXING[bazi.dayMasterWuxing].color;

  const tabs = [
    { key: 'bazi', label: '生辰八字', en: 'BAZI', icon: TreePine },
    ...(astrology ? [{ key: 'astrology', label: '西方占星', en: 'ASTRO', icon: Sparkles }] : []),
    { key: 'numerology', label: '数字命理', en: 'NUM', icon: Hexagon },
    { key: 'naming', label: '姓名学', en: 'NAME', icon: Activity },
    { key: 'synthesis', label: '交叉综述', en: 'SYN', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative">
      <NoiseLayer opacity={0.025} />

      {/* 固定顶部 */}
      <div className="sticky top-0 z-30 bg-black/85 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Brand subtitle="REPORT" />
          <button
            onClick={onRestart}
            className="flex items-center gap-2 text-xs text-white/50 hover:text-[#FF4D00] tracking-widest font-mono transition-colors"
          >
            <RotateCcw size={14} /> RESTART
          </button>
        </div>

        {/* Tab Bar */}
        <div className="max-w-6xl mx-auto px-6 border-t border-white/5">
          <div className="flex gap-1 overflow-x-auto -mx-2 px-2 scrollbar-thin">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  window.scrollTo({ top: 320, behavior: 'smooth' });
                }}
                className={`flex-shrink-0 px-4 py-3 flex items-center gap-2 text-sm tracking-wide transition-all ${
                  tab === t.key
                    ? 'text-[#FF4D00] tab-active'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <t.icon size={14} />
                <span style={{ fontFamily: 'Noto Serif SC' }}>{t.label}</span>
                <span className="text-[9px] font-mono text-white/30 tracking-widest">
                  {t.en}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* 主体身份信息 */}
        <section className="mb-16">
          <p className="text-[10px] font-mono text-[#FF4D00] tracking-[0.4em] mb-4">
            // SUBJECT.IDENTIFIED
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold mb-2 tracking-wide"
            style={{ fontFamily: 'Noto Serif SC' }}
          >
            {input.name}
          </h1>
          <div className="flex items-center gap-3 mb-8 text-white/50 text-sm">
            <span>{age} 岁</span>
            <span className="text-white/20">·</span>
            <span>{input.gender === 'male' ? '男' : '女'}</span>
            <span className="text-white/20">·</span>
            <span>属{bazi.zodiac}</span>
            <span className="text-white/20">·</span>
            {astrology && (
              <>
                <span>{astrology.sunSign}日座</span>
                <span className="text-white/20">·</span>
              </>
            )}
            <span>{bazi.dayMasterMeta?.element}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-2 text-white/60">
              <KeyValue label="SOLAR" value={`${bazi.rawSolarStr}（北京时）`} />
              {bazi.offsetMin !== 0 && (
                <KeyValue
                  label="TRUE.SOL"
                  value={`${bazi.solarStr}（真太阳时，校正 ${bazi.offsetMin > 0 ? '+' : ''}${bazi.offsetMin.toFixed(0)}分）`}
                />
              )}
              <KeyValue label="LUNAR" value={bazi.lunarStr} />
              <KeyValue label="PLACE" value={`${input.cityName} (${input.longitude.toFixed(2)}°E, ${input.latitude.toFixed(2)}°N)`} />
              <KeyValue label="QI.YUN" value={bazi.qiYunStr} />
              <KeyValue label="LIUNIAN" value={`${currentYear}年 ${currentLiuNian}`} />
            </div>

            <div className="bg-white/[0.03] border border-white/10 p-6">
              <div className="text-[10px] font-mono text-[#FF4D00] tracking-widest mb-3">
                DAY MASTER · 日主
              </div>
              <div className="flex items-baseline gap-4 mb-4">
                <span
                  className="text-7xl font-bold leading-none"
                  style={{ fontFamily: 'Noto Serif SC', color: dayMasterColor }}
                >
                  {bazi.dayMaster}
                </span>
                <div>
                  <div className="text-lg" style={{ fontFamily: 'Noto Serif SC' }}>
                    {bazi.dayMasterMeta.meta}
                  </div>
                  <div className="text-xs text-white/40 tracking-widest">
                    {bazi.dayMasterMeta.element}
                  </div>
                </div>
              </div>
              <p className="text-xs text-white/60 leading-relaxed mb-3">
                {bazi.dayMasterMeta.traits}
              </p>
              <div className="text-[10px] font-mono text-white/30 tracking-widest">
                {bazi.dayMasterMeta.shape}
              </div>
            </div>
          </div>

          {/* 四柱缩略 */}
          <div className="mt-8 inline-flex items-baseline gap-2 bg-white/[0.02] border border-white/10 px-6 py-4">
            <span className="text-[10px] font-mono text-white/40 tracking-widest mr-3">
              BAZI
            </span>
            {[bazi.pillars.year, bazi.pillars.month, bazi.pillars.day, bazi.pillars.time].map((p, i) => (
              <span
                key={i}
                className="text-2xl font-bold mx-1"
                style={{ fontFamily: 'Noto Serif SC' }}
              >
                <span style={{ color: WUXING[bazi.dayMasterWuxing] && WUXING[bazi.shiShen ? 'huo' : 'huo']?.color || '#fff' }}>
                  {p.gan}
                </span>
                {p.zhi}
              </span>
            ))}
          </div>
        </section>

        <div className="section-divider mb-8" />

        {/* 核心画像 - 第一眼共鸣的关键 */}
        {archetype && (
          <CorePortrait
            archetype={archetype}
            name={input.name}
            age={age}
            gender={input.gender}
          />
        )}

        {/* "你这个人" - 场景化共鸣段落 */}
        {persona && persona.length > 0 && (
          <>
            <div className="section-divider my-8" />
            <PersonaSection categories={persona} />
          </>
        )}

        <div className="section-divider mb-16" />

        {/* Tab Content */}
        {tab === 'bazi' && <BaziSection bazi={bazi} age={age} currentDaYun={currentDaYun} />}
        {tab === 'astrology' && astrology && <AstrologySection astrology={astrology} />}
        {tab === 'numerology' && (
          <NumerologySection numerology={numerology} mayaKin={mayaKin} />
        )}
        {tab === 'naming' && <NamingSection naming={naming} />}
        {tab === 'synthesis' && <SynthesisSection cards={synthesisCards} />}

        {/* 底部 */}
        <div className="border-t border-white/10 mt-20 pt-12 pb-8 text-center">
          <p className="text-[10px] font-mono text-white/30 tracking-widest leading-loose">
            NATAL.OS · GENESIS PROTOCOL v2.0<br />
            生于 {bazi.rawSolarStr} · 算于 {currentYear}-{String(today.getMonth() + 1).padStart(2, '0')}-{String(today.getDate()).padStart(2, '0')}
          </p>
        </div>
      </div>
    </div>
  );
}

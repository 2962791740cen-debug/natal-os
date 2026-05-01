import React, { useMemo, useEffect, useState, useRef } from 'react';
import { RotateCcw, ChevronUp } from 'lucide-react';
import { Brand, NoiseLayer, KeyValue } from './shared.jsx';
import { WUXING } from '../lib/constants.js';
import { getCurrentDaYun, getCurrentLiuNian } from '../lib/bazi.js';
import { generateManual } from '../lib/manual.js';
import CorePortrait from './result/CorePortrait.jsx';
import PersonaSection from './result/PersonaSection.jsx';
import Chapter from './result/Chapter.jsx';
import Blueprint from './result/Blueprint.jsx';
import LifeArc from './result/LifeArc.jsx';
import Manual from './result/Manual.jsx';
import Closing from './result/Closing.jsx';

const CHAPTERS = [
  { id: 'who', num: '01', en: 'WHO YOU ARE', cn: '你是谁' },
  { id: 'how', num: '02', en: 'HOW YOU LIVE', cn: '你怎么活着' },
  { id: 'blueprint', num: '03', en: 'THE BLUEPRINT', cn: '天体配置' },
  { id: 'arc', num: '04', en: 'YOUR LIFE ARC', cn: '人生弧线' },
  { id: 'manual', num: '05', en: 'OPERATING MANUAL', cn: '运营手册' },
];

export default function Result({
  bazi, astrology, numerology, naming, mayaKin,
  archetype, persona, input, onRestart,
}) {
  // 计算补充数据
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

  // 运营手册（在 Result 这层生成，避免每次 render 重算）
  const manual = useMemo(
    () => generateManual({ bazi, archetype, astrology }),
    [bazi, archetype, astrology]
  );

  // 阅读进度
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState('who');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const refs = useRef({});

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total ? Math.min(100, (scrolled / total) * 100) : 0);
      setShowBackToTop(scrolled > 600);

      // 当前章节
      const scrollMid = scrolled + window.innerHeight / 3;
      let active = 'who';
      CHAPTERS.forEach((c) => {
        const el = refs.current[c.id];
        if (el && el.offsetTop <= scrollMid) active = c.id;
      });
      setActiveChapter(active);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToChapter = (id) => {
    refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <NoiseLayer opacity={0.025} />

      {/* ===== 顶部导航 ===== */}
      <div className="sticky top-0 z-40 bg-black/85 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Brand subtitle="REPORT" />
          <button
            onClick={onRestart}
            className="flex items-center gap-2 text-xs text-white/50 hover:text-[#FF4D00] tracking-widest font-mono transition-colors"
          >
            <RotateCcw size={14} /> RESTART
          </button>
        </div>

        {/* 章节小目录（横向 chips） */}
        <div className="max-w-6xl mx-auto px-6 border-t border-white/5">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin py-2">
            {CHAPTERS.map((c) => (
              <button
                key={c.id}
                onClick={() => scrollToChapter(c.id)}
                className={`flex-shrink-0 px-3 py-2 text-xs tracking-wider transition-all whitespace-nowrap ${
                  activeChapter === c.id
                    ? 'text-[#FF4D00]'
                    : 'text-white/40 hover:text-white/70'
                }`}
                style={{ fontFamily: 'Noto Serif SC' }}
              >
                <span className="font-mono text-[10px] mr-1.5 opacity-60">{c.num}</span>
                {c.cn}
              </button>
            ))}
          </div>
        </div>

        {/* 阅读进度条 */}
        <div className="absolute bottom-0 left-0 h-px bg-[#FF4D00] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">

        {/* ===== HERO STRIP ===== */}
        <section className="mb-8 animate-fade-in-up">
          <p className="text-[10px] font-mono text-[#FF4D00] tracking-[0.4em] mb-4">
            // SUBJECT
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold mb-4 tracking-wide"
            style={{ fontFamily: 'Noto Serif SC' }}
          >
            {input.name}
          </h1>
          <div className="flex items-center gap-3 mb-8 text-sm text-white/50 flex-wrap">
            <span>{age} 岁</span>
            <span className="text-white/20">·</span>
            <span>{input.gender === 'male' ? '男' : '女'}</span>
            <span className="text-white/20">·</span>
            <span>属{bazi.zodiac}</span>
            {astrology && (
              <>
                <span className="text-white/20">·</span>
                <span>{astrology.sunSign}日</span>
                <span className="text-white/20">·</span>
                <span>{astrology.moonSign}月</span>
                <span className="text-white/20">·</span>
                <span>{astrology.ascSign}升</span>
              </>
            )}
            <span className="text-white/20">·</span>
            <span>{input.cityName}</span>
          </div>

          {/* 出生信息小字 */}
          <div className="grid md:grid-cols-2 gap-4 text-xs text-white/50 max-w-3xl">
            <KeyValue label="SOLAR" value={bazi.rawSolarStr} />
            {bazi.offsetMin !== 0 && (
              <KeyValue label="TRUE.SOL" value={`${bazi.solarStr}（校正 ${bazi.offsetMin > 0 ? '+' : ''}${bazi.offsetMin.toFixed(0)}分）`} />
            )}
            <KeyValue label="LUNAR" value={bazi.lunarStr} />
            <KeyValue label="DAY MASTER" value={`${bazi.dayMaster} · ${bazi.dayMasterMeta?.meta}`} />
          </div>
        </section>

        {/* ===== CHAPTER 01 · 你是谁 ===== */}
        <div ref={(el) => (refs.current['who'] = el)}>
          <Chapter num="01" en="WHO YOU ARE" cn="你是谁">
            {archetype && (
              <CorePortrait
                archetype={archetype}
                name={input.name}
                age={age}
                gender={input.gender}
              />
            )}
          </Chapter>
        </div>

        {/* ===== CHAPTER 02 · 你怎么活着 ===== */}
        <div ref={(el) => (refs.current['how'] = el)}>
          <Chapter num="02" en="HOW YOU LIVE" cn="你怎么活着">
            {persona && persona.length > 0 ? (
              <PersonaSection categories={persona} />
            ) : (
              <p className="text-white/50">数据不足以生成场景化共鸣</p>
            )}
          </Chapter>
        </div>

        {/* ===== CHAPTER 03 · 天体配置 ===== */}
        <div ref={(el) => (refs.current['blueprint'] = el)}>
          <Chapter num="03" en="THE BLUEPRINT" cn="你的天体配置">
            <Blueprint
              bazi={bazi}
              astrology={astrology}
              numerology={numerology}
              mayaKin={mayaKin}
              naming={naming}
            />
          </Chapter>
        </div>

        {/* ===== CHAPTER 04 · 人生弧线 ===== */}
        <div ref={(el) => (refs.current['arc'] = el)}>
          <Chapter num="04" en="YOUR LIFE ARC" cn="你的人生弧线">
            <LifeArc
              bazi={bazi}
              age={age}
              currentDaYun={currentDaYun}
              currentLiuNian={currentLiuNian}
            />
          </Chapter>
        </div>

        {/* ===== CHAPTER 05 · 运营手册 ===== */}
        <div ref={(el) => (refs.current['manual'] = el)}>
          <Chapter num="05" en="OPERATING MANUAL" cn="运营手册">
            <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-2xl" style={{ fontFamily: 'Noto Serif SC' }}>
              这一章把上面所有的"概念"，翻译成<span className="text-[#FF4D00]">能落地到日常的动作</span>——
              该穿什么颜色、该往哪走、该做什么、该避什么。
            </p>
            <Manual manual={manual} bazi={bazi} />
          </Chapter>
        </div>

        {/* ===== 收束 ===== */}
        <Closing archetype={archetype} onRestart={onRestart} />

      </main>

      {/* 浮动回顶部按钮 */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#FF4D00] text-black flex items-center justify-center hover:bg-white transition-colors animate-fade-in"
          aria-label="回到顶部"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
}

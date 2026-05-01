import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

// ===== 核心画像（结果页顶部的"巨卡"）=====
// 这是用户进入结果页第一眼看到的东西，必须有共鸣
export default function CorePortrait({ archetype, name, age, gender }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3200),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* 渐变光斑 */}
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, #FF4D00 0%, transparent 60%)',
          animation: 'pulse 6s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(circle, #60a5fa 0%, transparent 60%)',
          animation: 'pulse 8s ease-in-out infinite reverse',
        }}
      />

      <div className="relative z-10 py-12 md:py-20">

        {/* 标签 */}
        <div
          className={`text-[10px] font-mono text-[#FF4D00] tracking-[0.5em] mb-6 transition-all duration-700 ${
            phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          // CORE.PORTRAIT · 你这个人
        </div>

        {/* 主标题：核心画像 */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-sm text-white/40 mb-3 tracking-widest" style={{ fontFamily: 'Noto Serif SC' }}>
            如果用一个画面概括你——
          </p>
          <h1
            className="text-5xl md:text-8xl font-bold tracking-wide leading-[1.1]"
            style={{ fontFamily: 'Noto Serif SC' }}
          >
            你是<span className="text-[#FF4D00]">{archetype.archetype}</span>
          </h1>
          <p className="text-[11px] tracking-[0.4em] text-white/30 mt-4" style={{ fontFamily: 'Cinzel' }}>
            {archetype.en}
          </p>
        </div>

        {/* Tagline */}
        <div
          className={`mb-12 transition-all duration-1000 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p
            className="text-2xl md:text-3xl text-white/80 leading-relaxed border-l-2 border-[#FF4D00] pl-6"
            style={{ fontFamily: 'Noto Serif SC' }}
          >
            {archetype.tagline}
          </p>
        </div>

        {/* 三句核心 */}
        <div
          className={`grid md:grid-cols-3 gap-px bg-white/5 mb-12 transition-all duration-1000 ${
            phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {archetype.verses.map((v, i) => (
            <div
              key={i}
              className="bg-black p-6 md:p-8 hover:bg-white/[0.02] transition-colors group"
            >
              <div className="text-[10px] font-mono text-[#FF4D00] tracking-widest mb-3">
                — 0{i + 1}
              </div>
              <p
                className="text-base md:text-lg text-white/80 leading-relaxed group-hover:text-white transition-colors"
                style={{ fontFamily: 'Noto Serif SC' }}
              >
                {v}
              </p>
            </div>
          ))}
        </div>

        {/* 三个核心标签 */}
        <div
          className={`flex flex-wrap items-center gap-3 transition-all duration-1000 ${
            phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="text-[10px] font-mono text-white/40 tracking-widest mr-2">
            // TAGS
          </span>
          {archetype.tags.map((t, i) => (
            <span
              key={i}
              className="px-4 py-2 border border-[#FF4D00]/40 bg-[#FF4D00]/5 text-[#FF4D00] text-sm tracking-wider"
              style={{ fontFamily: 'Noto Serif SC' }}
            >
              {t}
            </span>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </section>
  );
}

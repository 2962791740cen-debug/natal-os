import React, { useState, useEffect } from 'react';

export default function TransitionScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const lines = 6;
    const interval = 700;
    const timers = [];
    for (let i = 0; i <= lines; i++) {
      timers.push(setTimeout(() => setPhase(i), i * interval));
    }
    timers.push(setTimeout(() => onComplete(), lines * interval + 500));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const lines = [
    '> 校准真太阳时（按经度差修正）',
    '> 排定四柱八字 · 推演五行强弱',
    '> 计算行星黄经 · Swiss Ephemeris',
    '> 测算占星宫位 · 相位网络',
    '> 推算大运流年 · 神煞分布',
    '> 综合多体系交叉印证',
  ];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,77,0,0.10) 0%, transparent 70%)',
        }}
      />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FF4D00] to-transparent opacity-50 animate-pulse" />

      <div className="relative z-10 text-center max-w-md w-full px-6">
        <div className="font-mono text-xs tracking-[0.4em] text-[#FF4D00] mb-12">
          DECODING...
        </div>
        {lines.map((l, i) => (
          <div
            key={i}
            className={`font-mono text-sm tracking-wider mb-4 transition-all duration-700 text-left ${
              phase >= i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ fontFamily: 'Cinzel, monospace' }}
          >
            <span className={phase > i ? 'text-white/60' : 'text-[#FF4D00]'}>{l}</span>
            {phase === i && (
              <span className="ml-1 animate-pulse text-[#FF4D00]">_</span>
            )}
            {phase > i && (
              <span className="ml-2 text-green-500/60">[ok]</span>
            )}
          </div>
        ))}

        <div className="mt-12 h-px bg-gradient-to-r from-transparent via-[#FF4D00]/50 to-transparent" />

        <div className="mt-6 text-[10px] font-mono text-white/40 tracking-widest">
          {phase < lines.length ? `${Math.round((phase / lines.length) * 100)}%` : 'COMPLETE'}
        </div>
      </div>
    </div>
  );
}

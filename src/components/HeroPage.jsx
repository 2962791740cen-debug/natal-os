import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Brand, NoiseLayer } from './shared.jsx';

export default function HeroPage({ onStart }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => setPhase(4), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, #1a1a1a 0%, #000 70%)',
        }}
      />
      <NoiseLayer opacity={0.04} />

      {/* 中轴红线 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FF4D00]/30 to-transparent" />

      {/* 顶部品牌 */}
      <div className="absolute top-8 left-8 z-10">
        <Brand />
        <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">
          Genesis Protocol v2.0
        </p>
      </div>

      <div className="absolute top-8 right-8 z-10 text-[10px] font-mono text-white/30 tracking-widest">
        SHULIN.OS // EXTENSION
      </div>

      {/* 主体 */}
      <div className="relative z-10 text-center max-w-3xl px-6">
        <p
          className={`text-[10px] font-mono text-[#FF4D00] tracking-[0.5em] mb-6 transition-all duration-1000 ${
            phase >= 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          // CHAPTER · NATAL
        </p>

        <h1
          className={`text-6xl md:text-8xl font-bold mb-8 tracking-wider leading-tight transition-all duration-1000 ${
            phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ fontFamily: 'Noto Serif SC' }}
        >
          本命<span className="text-[#FF4D00]">·</span>协议
        </h1>

        <div
          className={`transition-all duration-1000 delay-500 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p
            className="text-base md:text-lg text-white/60 leading-loose tracking-wide max-w-xl mx-auto mb-3"
            style={{ fontFamily: 'Noto Serif SC' }}
          >
            你出生那一刻，<br />
            天上的星辰、地上的节气、时间的流速，<br />
            共同写下了一段你还没读过的代码。
          </p>
          <p className="text-[11px] text-white/30 tracking-[0.3em] mb-12" style={{ fontFamily: 'Cinzel' }}>
            DECODE · CROSS-VERIFY · UNDERSTAND
          </p>
        </div>

        <div
          className={`transition-all duration-1000 delay-1000 ${
            phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-4 px-12 py-5 border border-white/30 hover:border-[#FF4D00] hover:bg-[#FF4D00] hover:text-black transition-all duration-500 tracking-[0.4em] text-sm overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-4">
              开始解码
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* 模块预览 */}
        <div
          className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-3xl mx-auto transition-all duration-1000 delay-[1500ms] ${
            phase >= 4 ? 'opacity-60' : 'opacity-0'
          }`}
        >
          {[
            { n: '01', t: '生辰八字', d: '四柱·五行·神煞·大运' },
            { n: '02', t: '西方占星', d: '本命盘·宫位·相位' },
            { n: '03', t: '数字命理', d: '生命路径·大师数' },
            { n: '04', t: '姓名学', d: '五格·三才·数理' },
          ].map((m) => (
            <div key={m.n}>
              <div className="text-[10px] font-mono text-[#FF4D00] tracking-widest mb-2">
                {m.n}
              </div>
              <div
                className="text-sm font-bold mb-1"
                style={{ fontFamily: 'Noto Serif SC' }}
              >
                {m.t}
              </div>
              <div className="text-[10px] text-white/40">{m.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/30 tracking-widest">
        ⓘ 本工具只作认知参考，不作命运预测
      </div>
    </div>
  );
}

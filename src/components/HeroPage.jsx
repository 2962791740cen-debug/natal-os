import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Brand, NoiseLayer } from './shared.jsx';

// ===== 星空背景 =====
const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, stars = [], mouseX = 0, mouseY = 0;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const count = Math.floor((window.innerWidth * window.innerHeight) / 3500);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.003 + Math.random() * 0.005,
      }));
    };

    const onMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      stars.forEach((s) => {
        s.twinkle += s.twinkleSpeed;
        const alpha = 0.3 + Math.abs(Math.sin(s.twinkle)) * 0.7;
        const size = s.z * 1.6;
        const px = s.x + mouseX * s.z;
        const py = s.y + mouseY * s.z;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * s.z})`;
        ctx.fillRect(px, py, size, size);
        if (s.z > 0.85) {
          ctx.fillStyle = `rgba(255, 220, 180, ${alpha * 0.4})`;
          ctx.fillRect(px - 1, py - 1, size + 2, size + 2);
        }
      });
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />;
};

// 流星
const Meteor = ({ delay = 0, top = '20%' }) => (
  <div
    className="absolute w-[2px] h-[80px] bg-gradient-to-b from-white via-white/50 to-transparent rotate-[20deg] pointer-events-none"
    style={{ top, right: '-100px', animation: `meteor 6s linear ${delay}s infinite` }}
  />
);

// ===== 主组件 =====
export default function HeroPage({ onStart }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),    // 钩子第一句
      setTimeout(() => setPhase(2), 2800),   // 钩子第二句
      setTimeout(() => setPhase(3), 5200),   // 巨字标题
      setTimeout(() => setPhase(4), 6800),   // 进入按钮
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const skip = () => setPhase(4);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <StarField />

      {/* 中央暗角 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 60%, #000 100%)',
          zIndex: 2,
        }}
      />

      {/* 中轴红线 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,77,0,0.4), transparent)',
          zIndex: 3,
        }}
      />

      <NoiseLayer opacity={0.05} />

      <Meteor delay={1.5} top="18%" />
      <Meteor delay={5} top="55%" />

      {/* 顶部品牌 */}
      <div className="absolute top-8 left-8 z-20">
        <Brand />
        <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase mt-1">
          Genesis Protocol v2.2
        </p>
      </div>

      {phase < 4 && (
        <button
          onClick={skip}
          className="absolute top-8 right-8 z-20 text-[10px] font-mono text-white/40 hover:text-white tracking-widest transition-colors"
        >
          SKIP →
        </button>
      )}

      {/* 中央叙事 */}
      <div className="absolute inset-0 flex items-center justify-center px-6 z-10">

        {/* 第一幕：钩子第一句 — 直接戳痒点 */}
        <NarrativeLine active={phase === 1}>
          <p className="text-3xl md:text-5xl text-white tracking-wider leading-[1.4] font-bold" style={{ fontFamily: 'Noto Serif SC' }}>
            你是不是常常觉得，<br />
            自己有点<span className="text-[#FF4D00]">不太一样</span>？
          </p>
        </NarrativeLine>

        {/* 第二幕：钩子第二句 — 加深共鸣 */}
        <NarrativeLine active={phase === 2}>
          <p className="text-3xl md:text-5xl text-white tracking-wider leading-[1.4] font-bold" style={{ fontFamily: 'Noto Serif SC' }}>
            又说不出，<br />
            <span className="text-[#FF4D00]">哪里不一样</span>。
          </p>
        </NarrativeLine>

        {/* 第三幕：巨字标题 */}
        <div
          className={`absolute transition-all duration-[1500ms] ${
            phase === 3 ? 'opacity-100 translate-y-0 scale-100' : phase > 3 ? 'opacity-100 -translate-y-12 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <div className="text-center">
            <p className="text-[10px] font-mono text-[#FF4D00] tracking-[0.5em] mb-6">
              // CHAPTER · NATAL
            </p>
            <h1
              className="text-7xl md:text-[10rem] font-bold tracking-[0.05em] leading-none mb-6"
              style={{ fontFamily: 'Noto Serif SC' }}
            >
              本命<span className="text-[#FF4D00] mx-3">·</span>协议
            </h1>
            <p className="text-[11px] tracking-[0.4em] text-white/40" style={{ fontFamily: 'Cinzel' }}>
              GENESIS · DECODE · UNDERSTAND
            </p>
          </div>
        </div>

        {/* 第四幕：进入按钮 */}
        <div
          className={`absolute bottom-32 transition-all duration-1000 ${
            phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
        >
          <div className="flex flex-col items-center gap-6">
            <p className="text-base text-white/60 tracking-wider text-center max-w-md leading-loose" style={{ fontFamily: 'Noto Serif SC' }}>
              用 <span className="text-[#FF4D00]">5 个独立体系</span>，<br />
              交叉印证一次"你到底是谁"。
            </p>

            <button
              onClick={onStart}
              className="group relative px-14 py-5 border border-white/40 hover:border-[#FF4D00] tracking-[0.4em] text-sm overflow-hidden transition-all duration-700"
              style={{ animation: phase >= 4 ? 'glow-pulse 3s ease-in-out infinite' : 'none' }}
            >
              <span className="relative z-10 flex items-center gap-4 group-hover:text-black transition-colors">
                开始解码
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-[#FF4D00] -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
            </button>

            <p className="text-[10px] font-mono text-white/30 tracking-widest mt-2">
              八字 · 占星 · 数字命理 · 姓名学 · 交叉综述
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes meteor {
          0% { transform: translate(0, 0) rotate(20deg); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translate(-120vw, 60vh) rotate(20deg); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 77, 0, 0.2); }
          50% { box-shadow: 0 0 60px rgba(255, 77, 0, 0.5); }
        }
      `}</style>
    </div>
  );
}

const NarrativeLine = ({ active, children }) => (
  <div
    className={`absolute text-center max-w-3xl transition-all duration-[1200ms] ${
      active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    }`}
  >
    {children}
  </div>
);

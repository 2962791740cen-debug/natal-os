import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Brand, NoiseLayer } from './shared.jsx';

// ===== 星空背景（Canvas 绘制）=====
const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let stars = [];
    let mouseX = 0, mouseY = 0;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      // 重新生成星
      const count = Math.floor((window.innerWidth * window.innerHeight) / 4000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 0.8 + 0.2, // 深度（决定大小+亮度）
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

        // 主体
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * s.z})`;
        ctx.fillRect(px, py, size, size);

        // 亮星额外光晕
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

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

// ===== 流星 =====
const Meteor = ({ delay = 0, top = '20%' }) => (
  <div
    className="absolute w-[2px] h-[80px] bg-gradient-to-b from-white via-white/50 to-transparent rotate-[20deg] pointer-events-none"
    style={{
      top,
      right: '-100px',
      animation: `meteor 6s linear ${delay}s infinite`,
    }}
  />
);

// ===== 主组件 =====
export default function HeroPage({ onStart }) {
  const [phase, setPhase] = useState(0); // 0..6 分幕
  const [skipping, setSkipping] = useState(false);

  useEffect(() => {
    if (skipping) return;
    const timers = [
      setTimeout(() => setPhase(1), 600),    // 第一幕：开场字
      setTimeout(() => setPhase(2), 3500),   // 第二幕：第一段叙事
      setTimeout(() => setPhase(3), 6500),   // 第三幕：第二段叙事
      setTimeout(() => setPhase(4), 9500),   // 第四幕：第三段叙事
      setTimeout(() => setPhase(5), 12500),  // 第五幕：标题大字
      setTimeout(() => setPhase(6), 15000),  // 第六幕：进入按钮
    ];
    return () => timers.forEach(clearTimeout);
  }, [skipping]);

  const skip = () => {
    setSkipping(true);
    setPhase(6);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 星空背景 */}
      <StarField />

      {/* 中央径向渐变（暗角） */}
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

      {/* 噪点 */}
      <NoiseLayer opacity={0.05} />

      {/* 流星 */}
      <Meteor delay={2} top="15%" />
      <Meteor delay={8} top="40%" />
      <Meteor delay={14} top="70%" />

      {/* 顶部品牌 */}
      <div className="absolute top-8 left-8 z-20">
        <Brand />
        <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase mt-1">
          Genesis Protocol v2.1
        </p>
      </div>

      {/* 跳过按钮 */}
      {phase < 6 && (
        <button
          onClick={skip}
          className="absolute top-8 right-8 z-20 text-[10px] font-mono text-white/40 hover:text-white tracking-widest transition-colors"
        >
          SKIP →
        </button>
      )}

      {/* 中央叙事容器（每幕单独渐显渐隐） */}
      <div className="absolute inset-0 flex items-center justify-center px-6 z-10">

        {/* 第一幕：仪式开始 */}
        <NarrativeLine active={phase === 1}>
          <span className="text-[10px] font-mono text-[#FF4D00] tracking-[0.5em]">
            // PROTOCOL · ENGAGED
          </span>
        </NarrativeLine>

        {/* 第二幕 */}
        <NarrativeLine active={phase === 2}>
          <p className="text-2xl md:text-4xl text-white/85 tracking-wider leading-[1.7]" style={{ fontFamily: 'Noto Serif SC' }}>
            你出生那一刻，<br />
            <span className="text-[#FF4D00]">宇宙的秒针</span>停了零点几秒。
          </p>
        </NarrativeLine>

        {/* 第三幕 */}
        <NarrativeLine active={phase === 3}>
          <p className="text-2xl md:text-4xl text-white/85 tracking-wider leading-[1.7]" style={{ fontFamily: 'Noto Serif SC' }}>
            天上的星辰、地上的节气、时间的流速——<br />
            共同写下了一段关于你的代码。
          </p>
        </NarrativeLine>

        {/* 第四幕（核心共鸣） */}
        <NarrativeLine active={phase === 4}>
          <p className="text-2xl md:text-4xl text-white/85 tracking-wider leading-[1.7]" style={{ fontFamily: 'Noto Serif SC' }}>
            只是<span className="text-white/40">从来</span>没有人，<br />
            教过你怎么<span className="text-[#FF4D00]">读懂它</span>。
          </p>
        </NarrativeLine>

        {/* 第五幕：标题 */}
        <div
          className={`absolute transition-all duration-[2000ms] ${
            phase >= 5 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          } ${phase >= 6 ? '-translate-y-16' : ''}`}
        >
          <div className="text-center">
            <p className="text-[10px] font-mono text-[#FF4D00] tracking-[0.5em] mb-6">
              // CHAPTER · NATAL
            </p>
            <h1
              className="text-7xl md:text-9xl font-bold tracking-[0.05em] leading-none mb-6"
              style={{ fontFamily: 'Noto Serif SC' }}
            >
              本命<span className="text-[#FF4D00] mx-3">·</span>协议
            </h1>
            <p className="text-[11px] tracking-[0.4em] text-white/40" style={{ fontFamily: 'Cinzel' }}>
              GENESIS · DECODE · UNDERSTAND
            </p>
          </div>
        </div>

        {/* 第六幕：进入按钮 */}
        <div
          className={`absolute bottom-32 transition-all duration-1000 ${
            phase >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
        >
          <div className="flex flex-col items-center gap-8">
            {/* 引导问句 */}
            <p className="text-sm md:text-base text-white/50 tracking-wider text-center max-w-md leading-loose" style={{ fontFamily: 'Noto Serif SC' }}>
              不是预测，不是迷信——<br />
              是给你一面更深的镜子。
            </p>

            {/* 进入按钮 */}
            <button
              onClick={onStart}
              className="group relative px-14 py-5 border border-white/40 hover:border-[#FF4D00] tracking-[0.4em] text-sm overflow-hidden transition-all duration-700"
              style={{
                animation: phase >= 6 ? 'glow-pulse 3s ease-in-out infinite' : 'none',
              }}
            >
              <span className="relative z-10 flex items-center gap-4 group-hover:text-black transition-colors">
                开始解码
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-[#FF4D00] -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
            </button>
          </div>
        </div>
      </div>

      {/* 底部模块预览 */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-1000 ${
          phase >= 6 ? 'opacity-50' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-6 text-[10px] font-mono text-white/40 tracking-widest">
          <span>八字</span><span className="text-white/20">·</span>
          <span>占星</span><span className="text-white/20">·</span>
          <span>数字命理</span><span className="text-white/20">·</span>
          <span>姓名学</span><span className="text-white/20">·</span>
          <span className="text-[#FF4D00]">交叉印证</span>
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

// 单段叙事文字（淡入淡出）
const NarrativeLine = ({ active, children }) => (
  <div
    className={`absolute text-center max-w-3xl transition-all duration-[1500ms] ${
      active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    }`}
  >
    {children}
  </div>
);

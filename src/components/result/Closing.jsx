import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

// ===== 收束 — 一封最后的信 =====
export default function Closing({ archetype, onRestart }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="py-24 md:py-32 max-w-2xl mx-auto text-center">
      <div
        className={`transition-all duration-1000 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <p className="text-[10px] font-mono text-[#FF4D00] tracking-[0.5em] mb-8">
          // CLOSING
        </p>

        <p className="text-2xl md:text-3xl leading-loose tracking-wider text-white/85 mb-12" style={{ fontFamily: 'Noto Serif SC' }}>
          盘是底牌，<br />
          <span className="text-[#FF4D00]">怎么打始终是你自己的事。</span>
        </p>

        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent my-12" />

        <p className="text-sm text-white/50 leading-loose tracking-wide mb-2" style={{ fontFamily: 'Noto Serif SC' }}>
          这份盘不是预言，是一面镜子。
        </p>
        <p className="text-sm text-white/50 leading-loose tracking-wide mb-12" style={{ fontFamily: 'Noto Serif SC' }}>
          所有标签和倾向，都是<span className="text-[#FF4D00]">概率分布</span>，不是<span className="text-red-400">命定剧本</span>。
        </p>

        <div className="flex flex-col items-center gap-6">
          <button
            onClick={onRestart}
            className="group flex items-center gap-3 px-10 py-4 border border-white/30 hover:border-[#FF4D00] hover:bg-[#FF4D00] hover:text-black transition-all tracking-[0.4em] text-sm"
          >
            <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
            <span>退出 · 清空数据</span>
          </button>
          <p className="text-[10px] font-mono text-white/30 tracking-widest">
            🔒 点击退出，所有数据立即从内存清除
          </p>
        </div>
      </div>
    </div>
  );
}

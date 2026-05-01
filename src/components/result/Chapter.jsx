import React, { useEffect, useRef, useState } from 'react';

// 章节标记 — 像翻一本书的章节
export default function Chapter({ num, en, cn, children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-16 md:py-24 first:pt-0">
      {/* 章节标 */}
      <div
        className={`mb-12 md:mb-16 transition-all duration-1000 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-baseline gap-4 md:gap-6 flex-wrap">
          <span className="text-[10px] font-mono text-[#FF4D00] tracking-[0.5em]">
            CHAPTER · {num}
          </span>
          <span className="text-[11px] font-mono text-white/30 tracking-[0.3em]">
            {en}
          </span>
        </div>
        <h2
          className="text-4xl md:text-5xl font-bold tracking-wide mt-3"
          style={{ fontFamily: 'Noto Serif SC' }}
        >
          {cn}
        </h2>
        <div className="mt-6 h-px bg-gradient-to-r from-[#FF4D00]/60 via-white/10 to-transparent" />
      </div>

      <div
        className={`transition-all duration-1000 delay-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {children}
      </div>
    </section>
  );
}

// 章节内的小节
export const SubBlock = ({ tag, title, children }) => (
  <div className="mb-12 last:mb-0">
    {tag && (
      <div className="text-[10px] font-mono text-[#FF4D00] tracking-[0.4em] mb-2">
        // {tag}
      </div>
    )}
    {title && (
      <h3 className="text-2xl md:text-3xl font-bold mb-6 tracking-wide" style={{ fontFamily: 'Noto Serif SC' }}>
        {title}
      </h3>
    )}
    {children}
  </div>
);

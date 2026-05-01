import React, { useState, useEffect } from 'react';
import { SectionTag, SectionTitle } from '../shared.jsx';

// "你这个人" — 让用户被看见的关键章节
export default function PersonaSection({ categories }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="space-y-12 my-16">
      <div>
        <SectionTag>WHO YOU ARE · 被看见</SectionTag>
        <SectionTitle sub="不是术语，是把你拆开告诉你">
          你这个人
        </SectionTitle>
      </div>

      {/* 每个类别一个大段 */}
      <div className="space-y-12">
        {categories.map((cat, idx) => (
          <CategoryBlock key={cat.key} category={cat} idx={idx} />
        ))}
      </div>

      {/* 收尾 */}
      <div className="border-t border-white/10 pt-8">
        <p className="text-sm text-white/50 leading-loose tracking-wide max-w-2xl" style={{ fontFamily: 'Noto Serif SC' }}>
          上面这些不是从一本书里抄的——是基于你的盘面特征
          <span className="text-[#FF4D00]"> 一条条匹配出来 </span>
          的。
          <br />
          有共鸣的，记下来；觉得不对的，跳过——
          <span className="text-[#FF4D00]">命理只是给你一面镜子，怎么照是你自己的事</span>。
        </p>
      </div>
    </section>
  );
}

const CategoryBlock = ({ category, idx }) => {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef(null);

  // 滚动揭示
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-12">
      {/* 左侧：标题 */}
      <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="text-3xl text-[#FF4D00] mb-3">{category.icon}</div>
        <h3
          className="text-3xl md:text-4xl font-bold mb-3 tracking-wide"
          style={{ fontFamily: 'Noto Serif SC' }}
        >
          {category.title}
          <span className="text-[#FF4D00]">…</span>
        </h3>
        <p className="text-xs text-white/40 leading-relaxed">
          {category.tagline}
        </p>
      </div>

      {/* 右侧：句子 */}
      <div className="space-y-4">
        {category.lines.map((line, i) => (
          <div
            key={i}
            className={`group relative pl-6 py-3 transition-all duration-700 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            {/* 左侧竖线 */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 group-hover:bg-[#FF4D00] transition-colors" />
            <p
              className="text-base md:text-lg text-white/80 leading-relaxed group-hover:text-white transition-colors"
              style={{ fontFamily: 'Noto Serif SC' }}
            >
              {line}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { WUXING } from '../../lib/constants.js';
import { ReadingCard, SectionTag, SectionTitle } from '../shared.jsx';

export default function NamingSection({ naming }) {
  if (!naming || !naming.valid) {
    return (
      <div className="space-y-8">
        <section>
          <SectionTag>NAMING</SectionTag>
          <SectionTitle sub="姓名学需要中文姓名（2-4 字）">姓名学</SectionTitle>
          <div className="bg-white/[0.02] border border-white/10 p-6 text-white/40 text-sm">
            未填写中文姓名，跳过此模块。可在重新输入时补充。
          </div>
        </section>
      </div>
    );
  }

  const fives = ['天格', '人格', '地格', '外格', '总格'];
  const fiveDescs = {
    '天格': '父祖运 · 1-15岁',
    '人格': '主运 · 命名核心 · 终生',
    '地格': '前运 · 16-35岁',
    '外格': '副运 · 社交助力',
    '总格': '后运 · 35岁后',
  };

  return (
    <div className="space-y-16">
      <section>
        <SectionTag>NAMING</SectionTag>
        <SectionTitle sub="康熙笔画 + 五格三才数理">姓名学</SectionTitle>

        {/* 字符笔画 */}
        <div className="mb-8">
          <div className="text-[10px] font-mono text-white/40 tracking-widest mb-3">CHARACTERS · 字与笔画</div>
          <div className="flex gap-px bg-white/5">
            {naming.chars.map((c, i) => (
              <div key={i} className="flex-1 bg-black p-6 text-center">
                <div
                  className="text-7xl font-bold mb-3"
                  style={{ fontFamily: 'Noto Serif SC', color: '#FF4D00' }}
                >
                  {c.char}
                </div>
                <div className="text-[10px] font-mono text-white/40">
                  {c.strokes} 画
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 五格 */}
        <div className="mb-8">
          <div className="text-[10px] font-mono text-white/40 tracking-widest mb-3">WU-GE · 五格</div>
          <div className="grid md:grid-cols-5 gap-px bg-white/5">
            {fives.map((key) => {
              const item = naming.wuGe[key];
              const rateColor =
                item.rate.includes('大吉') ? '#4ade80' :
                item.rate === '吉' ? '#86efac' :
                item.rate === '半吉' ? '#fde047' :
                item.rate === '半凶' ? '#fb923c' :
                '#ef4444';
              return (
                <div key={key} className="bg-black p-5">
                  <div className="text-[10px] font-mono text-white/40 tracking-widest mb-2">
                    {fiveDescs[key]}
                  </div>
                  <div className="text-base font-bold mb-2" style={{ fontFamily: 'Noto Serif SC' }}>
                    {key}
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span
                      className="text-3xl font-bold leading-none"
                      style={{ fontFamily: 'Noto Serif SC', color: WUXING[item.wuxing].color }}
                    >
                      {item.num}
                    </span>
                    <span
                      className="text-xs font-bold tracking-widest"
                      style={{ color: rateColor }}
                    >
                      {item.rate}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/50 mb-2 leading-relaxed">
                    {item.desc}
                  </div>
                  <div className="text-[10px] font-mono text-white/30">
                    五行：{item.wuxing}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 三才 */}
        <ReadingCard
          accent
          tag="SAN-CAI · 三才"
          title={`${naming.sanCai.pattern} · ${naming.sanCai.result}`}
          body={
            <p>
              三才是天格、人格、地格三者五行的组合。你的组合
              <span className="text-[#FF4D00] mx-1 font-bold">
                {naming.sanCai.pattern}
              </span>
              在传统姓名学中评级为
              <span className="text-[#FF4D00] mx-1 font-bold">
                {naming.sanCai.result}
              </span>
              。
              {naming.sanCai.result.includes('大吉') && '相生有情，大利各方面发展。'}
              {naming.sanCai.result === '吉' && '相生顺畅，大体平顺。'}
              {naming.sanCai.result === '凶' && '配置相克，注意化解。'}
              {naming.sanCai.result === '中' && '不偏不倚，平稳之配。'}
            </p>
          }
        />
      </section>
    </div>
  );
}

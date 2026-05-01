import React from 'react';
import { ReadingCard, SectionTag, SectionTitle } from '../shared.jsx';

export default function SynthesisSection({ cards }) {
  return (
    <div className="space-y-16">
      <section>
        <SectionTag>SYNTHESIS</SectionTag>
        <SectionTitle sub="把多个体系的信号叠加在一起，看你这个人本质上在玩什么牌">
          多体系交叉综述
        </SectionTitle>
        <div className="grid md:grid-cols-2 gap-4">
          {cards.map((c, i) => (
            <ReadingCard
              key={i}
              tag={c.tag}
              title={c.title}
              body={<p>{c.body}</p>}
              accent={c.accent}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 pt-12">
        <SectionTag color="#666">DISCLAIMER</SectionTag>
        <p className="text-sm text-white/40 leading-loose max-w-2xl">
          命理只是文化心理工具，不是预测引擎。<br />
          盘是底牌，怎么打始终是你自己的事。<br />
          这里所有的标签和倾向，都是 <span className="text-[#FF4D00]">概率分布</span>，不是 <span className="text-red-400">命定剧本</span>。
        </p>
      </section>
    </div>
  );
}

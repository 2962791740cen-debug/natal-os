import React from 'react';
import { ReadingCard, SectionTag, SectionTitle } from '../shared.jsx';

const NumberCard = ({ label, num, desc, hint, accent }) => (
  <div
    className={`p-6 ${
      accent
        ? 'bg-[#FF4D00]/5 border border-[#FF4D00]/40'
        : 'bg-white/[0.02] border border-white/10'
    }`}
  >
    <div className="text-[10px] font-mono text-white/40 tracking-widest mb-2">{label}</div>
    <div className="flex items-baseline gap-3 mb-3">
      <span
        className="text-6xl font-bold leading-none"
        style={{ fontFamily: 'Noto Serif SC', color: accent ? '#FF4D00' : '#fff' }}
      >
        {num}
      </span>
      {desc && (
        <span className="text-sm text-white/60" style={{ fontFamily: 'Noto Serif SC' }}>
          {desc.keyword}
        </span>
      )}
    </div>
    {desc && <p className="text-xs text-white/60 leading-relaxed">{desc.desc}</p>}
    {hint && <p className="text-[10px] text-white/40 mt-2 tracking-wider">{hint}</p>}
  </div>
);

export default function NumerologySection({ numerology, mayaKin }) {
  const lp = numerology.interpretation.lifePath;
  const expr = numerology.interpretation.expression;

  return (
    <div className="space-y-16">
      <section>
        <SectionTag>NUMEROLOGY</SectionTag>
        <SectionTitle sub="毕达哥拉斯数字命理 — 出生日期与名字字母的能量">
          数字命理
        </SectionTitle>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <NumberCard
            label="LIFE PATH · 生命路径数（最重要）"
            num={numerology.lifePath}
            desc={lp}
            accent={numerology.isMasterLife}
            hint={numerology.isMasterLife ? '★ 大师数 · 罕见且沉重的能量' : null}
          />
          {expr && numerology.expressionNum > 0 && (
            <NumberCard
              label="EXPRESSION · 表达数（名字总和）"
              num={numerology.expressionNum}
              desc={expr}
            />
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-white/[0.02] border border-white/10 p-4">
            <div className="text-[10px] font-mono text-white/40 tracking-widest mb-1">DAY · 生日数</div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'Noto Serif SC' }}>
              {numerology.dayNum}
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/10 p-4">
            <div className="text-[10px] font-mono text-white/40 tracking-widest mb-1">DESTINY · 命运数</div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'Noto Serif SC' }}>
              {numerology.destinyNum}
            </div>
          </div>
          {numerology.soulNum > 0 && (
            <div className="bg-white/[0.02] border border-white/10 p-4">
              <div className="text-[10px] font-mono text-white/40 tracking-widest mb-1">SOUL · 灵魂数</div>
              <div className="text-3xl font-bold" style={{ fontFamily: 'Noto Serif SC' }}>
                {numerology.soulNum}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 玛雅 Kin */}
      <section>
        <SectionTag>MAYAN.TZOLKIN</SectionTag>
        <SectionTitle sub="玛雅卓尔金历 260 天循环里的位置">玛雅 Kin</SectionTitle>
        <ReadingCard
          tag="KIN"
          title={`${mayaKin.kin} · ${mayaKin.tone}的${mayaKin.seal}`}
          body={
            <p>
              玛雅历法把每个人的出生日匹配到 260 个 Kin 之一。你是
              <span className="text-[#FF4D00] font-bold mx-1">{mayaKin.full}</span>
              ——{mayaKin.tone === '宇宙' && '出离与超越的能量'}
              {mayaKin.tone === '磁性' && '聚集与启动的能量'}
              {mayaKin.tone === '共振' && '调频与启发的能量'}。
            </p>
          }
        />
      </section>
    </div>
  );
}

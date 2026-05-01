import React from 'react';
import { Compass, Palette, Briefcase, Heart, Calendar } from 'lucide-react';
import { SubBlock } from './Chapter.jsx';
import { WUXING } from '../../lib/constants.js';

// ===== 运营手册 — 把命理翻译成可执行的每日动作 =====
export default function Manual({ manual, bazi }) {
  return (
    <div className="space-y-12">

      {/* 颜色 */}
      <SubBlock tag="COLORS · 你身上对的颜色" title="该穿什么颜色 / 该用什么色调">
        <div className="grid md:grid-cols-2 gap-4">

          <div className="bg-white/[0.02] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette size={14} className="text-[#FF4D00]" />
              <span className="text-[10px] font-mono text-[#FF4D00] tracking-widest">FAVOR · 加分色</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {manual.colors.swatches.map((hex, i) => (
                <div
                  key={i}
                  className="w-12 h-12 border border-white/20"
                  style={{ background: hex }}
                  title={manual.colors.good[i]}
                />
              ))}
            </div>

            <div className="text-sm text-white/70" style={{ fontFamily: 'Noto Serif SC' }}>
              {manual.colors.good.slice(0, 6).join(' · ')}
            </div>
            <p className="text-xs text-white/40 mt-3 leading-relaxed">
              用在衣服、房间主色、屏保、办公桌——这些颜色在你身上会"加分"。
            </p>
          </div>

          {manual.colors.avoid.length > 0 && (
            <div className="bg-white/[0.02] border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette size={14} className="text-white/40" />
                <span className="text-[10px] font-mono text-white/50 tracking-widest">AVOID · 减分色</span>
              </div>

              <div className="text-sm text-white/60 mb-3" style={{ fontFamily: 'Noto Serif SC' }}>
                {manual.colors.avoid.slice(0, 4).join(' · ')}
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                不是不能用，是别让这些颜色长期占主导（比如卧室主色、常穿外套）。
              </p>
            </div>
          )}

        </div>
      </SubBlock>

      {/* 方位 / 城市 */}
      <SubBlock tag="DIRECTIONS · 你向哪走更顺" title="该往哪个方位发展">
        <div className="bg-white/[0.02] border border-white/10 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Compass size={14} className="text-[#FF4D00]" />
            <span className="text-[10px] font-mono text-[#FF4D00] tracking-widest">
              GO · 加分方位
            </span>
          </div>

          {/* 罗盘可视化 */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="relative w-48 h-48 flex-shrink-0">
              <CompassWheel goodDirs={manual.directions.good} avoidDirs={manual.directions.avoid} />
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div>
                <div className="text-[10px] font-mono text-white/40 tracking-widest mb-2">FAVOR</div>
                <div className="flex flex-wrap gap-2">
                  {manual.directions.good.map((d) => (
                    <span
                      key={d}
                      className="px-3 py-1 border border-[#FF4D00] text-[#FF4D00] text-sm"
                      style={{ fontFamily: 'Noto Serif SC' }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {manual.directions.cities.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono text-white/40 tracking-widest mb-2">RECOMMENDED CITIES · 适合发展的城市</div>
                  <div className="flex flex-wrap gap-2">
                    {manual.directions.cities.map((c) => (
                      <span
                        key={c}
                        className="px-3 py-1 bg-white/5 border border-white/10 text-white/70 text-sm"
                        style={{ fontFamily: 'Noto Serif SC' }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-white/40 mt-6 leading-relaxed">
            "方位"不只是搬家——也包括出差走向、工作朝向、卧室床头方向、电脑屏幕朝向。
          </p>
        </div>
      </SubBlock>

      {/* 行业 */}
      {manual.industries.good.length > 0 && (
        <SubBlock tag="CAREER · 你适合什么行业" title="你的能量适合做什么">
          <div className="bg-white/[0.02] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={14} className="text-[#FF4D00]" />
              <span className="text-[10px] font-mono text-[#FF4D00] tracking-widest">
                MATCHED INDUSTRIES · 与你能量同频的方向
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {manual.industries.good.map((ind) => (
                <span
                  key={ind}
                  className="px-4 py-2 bg-[#FF4D00]/10 border border-[#FF4D00]/40 text-white text-sm"
                  style={{ fontFamily: 'Noto Serif SC' }}
                >
                  {ind}
                </span>
              ))}
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              这是基于五行喜用 + 占星 MC（事业宫）联合推算的方向。
              <span className="text-white/60"> 不是必须做这些 — 是这些方向上你比一般人少打一些"逆风球"。</span>
            </p>
          </div>
        </SubBlock>
      )}

      {/* 健康 */}
      {manual.health.tips.length > 0 && (
        <SubBlock tag="HEALTH · 你身体的警告灯" title="该注意什么">
          <div className="bg-white/[0.02] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart size={14} className="text-[#FF4D00]" />
              <span className="text-[10px] font-mono text-[#FF4D00] tracking-widest">
                BODY ALERT · 五行偏颇带来的身体提示
              </span>
            </div>
            <ul className="space-y-3">
              {manual.health.tips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/70 leading-relaxed" style={{ fontFamily: 'Noto Serif SC' }}>
                  <span className="text-[#FF4D00] flex-shrink-0">·</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-white/40 mt-4 leading-relaxed">
              ⚠️ 这是基于五行偏颇的提示，不是医学诊断。身体有具体不适请看医生。
            </p>
          </div>
        </SubBlock>
      )}

      {/* 关键年份 */}
      {manual.keyYears.length > 0 && (
        <SubBlock tag="MILESTONES · 关键年份" title="未来这些年要留意">
          <div className="bg-white/[0.02] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={14} className="text-[#FF4D00]" />
              <span className="text-[10px] font-mono text-[#FF4D00] tracking-widest">
                TURNING POINTS · 大运转换节点
              </span>
            </div>
            <div className="space-y-3">
              {manual.keyYears.map((y, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-b-0">
                  <span className="text-2xl font-bold text-[#FF4D00] w-20 font-mono">
                    {y.year}
                  </span>
                  <span className="text-xs text-white/40 w-12 font-mono">
                    {y.age} 岁
                  </span>
                  <span className="text-sm text-white/70" style={{ fontFamily: 'Noto Serif SC' }}>
                    {y.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-4 leading-relaxed">
              大运的转换点常常是人生的"换章节"。提前 1-2 年留意征兆，做心理准备。
            </p>
          </div>
        </SubBlock>
      )}

    </div>
  );
}

// ===== 罗盘可视化 =====
const CompassWheel = ({ goodDirs, avoidDirs }) => {
  const dirs = [
    { name: '北', angle: 0 },
    { name: '东北', angle: 45 },
    { name: '东', angle: 90 },
    { name: '东南', angle: 135 },
    { name: '南', angle: 180 },
    { name: '西南', angle: 225 },
    { name: '西', angle: 270 },
    { name: '西北', angle: 315 },
  ];

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* 外圆 */}
      <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

      {/* 中心 */}
      <circle cx="100" cy="100" r="2" fill="#FF4D00" />

      {/* 方位 */}
      {dirs.map((d) => {
        const isGood = goodDirs.includes(d.name);
        const isAvoid = avoidDirs.includes(d.name);
        const rad = (d.angle - 90) * Math.PI / 180;
        const x = 100 + Math.cos(rad) * 80;
        const y = 100 + Math.sin(rad) * 80;
        const tx = 100 + Math.cos(rad) * 95;
        const ty = 100 + Math.sin(rad) * 95;

        return (
          <g key={d.name}>
            <line
              x1="100" y1="100"
              x2={x} y2={y}
              stroke={isGood ? '#FF4D00' : isAvoid ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}
              strokeWidth={isGood ? 1.5 : 0.5}
            />
            {isGood && <circle cx={x} cy={y} r="4" fill="#FF4D00" />}
            <text
              x={tx} y={ty}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill={isGood ? '#FF4D00' : isAvoid ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)'}
              style={{ fontFamily: 'Noto Serif SC' }}
              fontWeight={isGood ? 700 : 400}
            >
              {d.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

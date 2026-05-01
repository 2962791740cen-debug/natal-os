// 共享基础组件
import React from 'react';

export const Brand = ({ subtitle = 'Genesis Protocol v2.0' }) => (
  <div className="flex items-center gap-2 mb-1">
    <div className="w-3 h-3 bg-[#FF4D00]" />
    <span className="font-black tracking-tighter text-lg" style={{ fontFamily: 'Noto Serif SC' }}>
      NATAL.OS
    </span>
    {subtitle && (
      <span className="ml-2 hidden md:inline text-[10px] font-mono text-white/40 tracking-widest uppercase">
        {subtitle}
      </span>
    )}
  </div>
);

export const SectionTag = ({ children, color = '#FF4D00' }) => (
  <p className="text-[10px] font-mono tracking-[0.4em] mb-3" style={{ color }}>
    // {children}
  </p>
);

export const SectionTitle = ({ children, sub }) => (
  <>
    <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-wide" style={{ fontFamily: 'Noto Serif SC' }}>
      {children}
    </h2>
    {sub && <p className="text-white/40 text-sm mb-8">{sub}</p>}
  </>
);

export const ReadingCard = ({ tag, title, body, children, accent = false, className = '' }) => (
  <div
    className={`p-6 md:p-8 transition-all ${
      accent
        ? 'bg-[#FF4D00]/5 border border-[#FF4D00]/30 hover:border-[#FF4D00]/60'
        : 'bg-white/[0.02] border border-white/10 hover:border-white/20'
    } ${className}`}
  >
    {tag && (
      <div className="text-[10px] font-mono text-[#FF4D00] tracking-[0.3em] mb-3">
        // {tag}
      </div>
    )}
    {title && (
      <h3 className="text-lg md:text-xl font-bold mb-4 tracking-wide" style={{ fontFamily: 'Noto Serif SC' }}>
        {title}
      </h3>
    )}
    {body && (
      <div className="text-sm md:text-base text-white/70 leading-relaxed space-y-3" style={{ fontFamily: 'Noto Serif SC' }}>
        {body}
      </div>
    )}
    {children}
  </div>
);

export const Field = ({ label, labelEn, icon: Icon, children, hint }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon size={14} className="text-[#FF4D00]" />}
      <span className="text-sm font-bold tracking-wide" style={{ fontFamily: 'Noto Serif SC' }}>
        {label}
      </span>
      {labelEn && (
        <span className="text-[10px] font-mono text-white/30 tracking-widest">{labelEn}</span>
      )}
    </div>
    {children}
    {hint && <p className="text-[10px] text-white/40 mt-2 tracking-wider">{hint}</p>}
  </div>
);

export const NumberInput = ({ value, onChange, min, max, suffix }) => (
  <div className="relative">
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
      min={min}
      max={max}
      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-base focus:border-[#FF4D00] focus:outline-none transition-colors text-center font-mono"
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none">
      {suffix}
    </span>
  </div>
);

export const NoiseLayer = ({ opacity = 0.025 }) => (
  <div
    className="fixed inset-0 pointer-events-none"
    style={{
      opacity,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    }}
  />
);

export const KeyValue = ({ label, value, mono = false }) => (
  <div className="flex gap-3 items-baseline">
    <span className="font-mono text-[#FF4D00] w-24 text-[10px] tracking-widest pt-1 flex-shrink-0">
      {label}
    </span>
    <span className={mono ? 'font-mono text-sm' : 'text-sm'}>{value}</span>
  </div>
);

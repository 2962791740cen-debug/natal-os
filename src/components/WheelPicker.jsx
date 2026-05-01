import React, { useRef, useEffect, useCallback } from 'react';

// ===== 滚轮选择器 =====
// 鼠标滚轮 / 触屏滑动 / 点击都能选；不允许手敲
// CSS scroll-snap 实现，性能好
const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5; // 显示 5 行（中间 1 选中 + 上下各 2 半透明）
const PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

export default function WheelPicker({ items, value, onChange, format, label, suffix }) {
  const ref = useRef(null);
  const scrollTimer = useRef(null);
  const isProgrammaticScroll = useRef(false);

  // value 变化 → scroll 到对应位置
  useEffect(() => {
    if (!ref.current) return;
    const idx = items.indexOf(value);
    if (idx >= 0) {
      isProgrammaticScroll.current = true;
      ref.current.scrollTop = idx * ITEM_HEIGHT;
      // 100ms 后重新接受用户 scroll
      setTimeout(() => { isProgrammaticScroll.current = false; }, 150);
    }
  }, [value, items]);

  const onScrollEnd = useCallback(() => {
    if (!ref.current || isProgrammaticScroll.current) return;
    const scrollTop = ref.current.scrollTop;
    const idx = Math.round(scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    const newVal = items[clamped];
    if (newVal !== undefined && newVal !== value) {
      onChange(newVal);
    }
  }, [items, value, onChange]);

  const onScroll = () => {
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(onScrollEnd, 120);
  };

  const scrollToIndex = (idx) => {
    if (ref.current) {
      ref.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' });
    }
  };

  const currentIdx = items.indexOf(value);

  return (
    <div className="flex-1 select-none">
      {label && (
        <div className="text-[10px] font-mono text-white/40 text-center mb-2 tracking-[0.3em]">
          {label}
        </div>
      )}

      <div className="relative h-[240px] overflow-hidden bg-white/[0.02] border border-white/10">
        {/* 顶部渐变遮罩 */}
        <div
          className="absolute top-0 left-0 right-0 h-[96px] z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)' }}
        />
        {/* 底部渐变遮罩 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[96px] z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)' }}
        />
        {/* 中间高亮框（穿透指示当前选中行） */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-12 border-y border-[#FF4D00]/40 z-[5] pointer-events-none" />

        {/* 上下按钮（PC 端可见，更直观） */}
        <button
          type="button"
          onClick={() => currentIdx > 0 && scrollToIndex(currentIdx - 1)}
          className="absolute top-2 left-1/2 -translate-x-1/2 z-20 text-white/30 hover:text-[#FF4D00] text-xs"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => currentIdx < items.length - 1 && scrollToIndex(currentIdx + 1)}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 text-white/30 hover:text-[#FF4D00] text-xs"
        >
          ▼
        </button>

        {/* 滚动列表 */}
        <div
          ref={ref}
          onScroll={onScroll}
          className="h-full overflow-y-scroll wheel-scroll"
          style={{
            scrollSnapType: 'y mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div style={{ height: PADDING }} />
          {items.map((v, i) => {
            const isSelected = v === value;
            const distance = Math.abs(i - currentIdx);
            return (
              <div
                key={v}
                onClick={() => scrollToIndex(i)}
                style={{
                  height: ITEM_HEIGHT,
                  scrollSnapAlign: 'center',
                  cursor: 'pointer',
                }}
                className={`flex items-center justify-center transition-all ${
                  isSelected
                    ? 'text-[#FF4D00] font-bold text-2xl md:text-3xl'
                    : distance === 1
                    ? 'text-white/60 text-xl'
                    : 'text-white/30 text-base'
                }`}
              >
                <span style={{ fontFamily: 'Noto Serif SC' }}>
                  {format ? format(v) : v}
                </span>
                {isSelected && suffix && (
                  <span className="text-xs text-white/40 ml-2">{suffix}</span>
                )}
              </div>
            );
          })}
          <div style={{ height: PADDING }} />
        </div>
      </div>

      <style>{`
        .wheel-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

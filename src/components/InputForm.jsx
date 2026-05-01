import React, { useState, useMemo } from 'react';
import {
  ArrowRight, ArrowLeft, Calendar, Clock, MapPin, User, Sparkles, Search, X,
} from 'lucide-react';
import { CITIES } from '../lib/cities.js';
import { Brand, NoiseLayer } from './shared.jsx';

// 时辰对照
const SHICHEN = [
  { range: [23, 1], name: '子时', desc: '夜半 · 23:00–01:00' },
  { range: [1, 3], name: '丑时', desc: '鸡鸣 · 01:00–03:00' },
  { range: [3, 5], name: '寅时', desc: '平旦 · 03:00–05:00' },
  { range: [5, 7], name: '卯时', desc: '日出 · 05:00–07:00' },
  { range: [7, 9], name: '辰时', desc: '食时 · 07:00–09:00' },
  { range: [9, 11], name: '巳时', desc: '隅中 · 09:00–11:00' },
  { range: [11, 13], name: '午时', desc: '日中 · 11:00–13:00' },
  { range: [13, 15], name: '未时', desc: '日昳 · 13:00–15:00' },
  { range: [15, 17], name: '申时', desc: '哺时 · 15:00–17:00' },
  { range: [17, 19], name: '酉时', desc: '日入 · 17:00–19:00' },
  { range: [19, 21], name: '戌时', desc: '黄昏 · 19:00–21:00' },
  { range: [21, 23], name: '亥时', desc: '人定 · 21:00–23:00' },
];

const getShichen = (hour) => {
  if (hour === 23 || hour === 0) return SHICHEN[0];
  return SHICHEN.find((s) => hour >= s.range[0] && hour < s.range[1]) || SHICHEN[6];
};

// 主流城市快捷
const TOP_CITIES = ['北京', '上海', '广州', '深圳', '杭州', '成都', '香港', '台北'];

export default function InputForm({ onSubmit, onBack, initialValues }) {
  const today = new Date();
  const [year, setYear] = useState(initialValues?.year ?? 2000);
  const [month, setMonth] = useState(initialValues?.month ?? 1);
  const [day, setDay] = useState(initialValues?.day ?? 1);
  const [hour, setHour] = useState(initialValues?.hour ?? 12);
  const [minute, setMinute] = useState(initialValues?.minute ?? 0);
  const [unknownTime, setUnknownTime] = useState(false);
  const [city, setCity] = useState(initialValues?.city ?? CITIES.find((c) => c.name === '深圳'));
  const [citySearch, setCitySearch] = useState('');
  const [showCityList, setShowCityList] = useState(false);
  const [gender, setGender] = useState(initialValues?.gender ?? 'male');
  const [name, setName] = useState(initialValues?.name ?? '');
  const [enName, setEnName] = useState(initialValues?.enName ?? '');
  const [useTrueSolar, setUseTrueSolar] = useState(true);

  const shichen = useMemo(() => getShichen(hour), [hour]);

  const filteredCities = citySearch
    ? CITIES.filter((c) => c.name.includes(citySearch)).slice(0, 50)
    : CITIES;

  const submit = () => {
    onSubmit({
      year, month, day,
      hour: unknownTime ? 12 : hour,
      minute: unknownTime ? 0 : minute,
      unknownTime,
      longitude: city.lng,
      latitude: city.lat,
      timezone: city.tz ?? 8,
      cityName: city.name,
      gender,
      name: name.trim() || '无名氏',
      enName: enName.trim() || name.trim() || 'Anonymous',
      useTrueSolar,
    });
  };

  const valid = year && month && day && city;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <NoiseLayer opacity={0.03} />

      {/* 中轴红线 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FF4D00]/15 to-transparent pointer-events-none" />

      {/* 顶部 */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Brand />
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs text-white/50 hover:text-white tracking-widest font-mono transition-colors"
          >
            <ArrowLeft size={14} /> BACK
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-16 pb-32 relative">
        {/* 标题 */}
        <div className="mb-16 text-center animate-fade-in-up">
          <p className="text-[10px] font-mono text-[#FF4D00] tracking-[0.5em] mb-6">
            // INPUT.FORM
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-wider leading-tight" style={{ fontFamily: 'Noto Serif SC' }}>
            告诉我<br />
            <span className="text-[#FF4D00]">你来到这里的那一刻</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base leading-loose tracking-wide max-w-md mx-auto" style={{ fontFamily: 'Noto Serif SC' }}>
            时间精度越高，<br />
            解码颗粒度越细。
          </p>
        </div>

        <div className="space-y-12">

          {/* 名字 */}
          <FormSection
            num="01"
            title="你叫什么"
            sub="WHO ARE YOU"
            hint="中文姓名用于姓名学解码；不填也能用"
          >
            <div className="grid md:grid-cols-2 gap-3">
              <BigInput
                value={name}
                onChange={setName}
                placeholder="中文姓名"
                icon="字"
              />
              <BigInput
                value={enName}
                onChange={setEnName}
                placeholder="英文 / 拼音名"
                icon="A"
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { v: 'male', l: '男', en: 'MALE' },
                { v: 'female', l: '女', en: 'FEMALE' },
              ].map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setGender(opt.v)}
                  className={`px-6 py-4 border transition-all flex items-center justify-center gap-3 ${
                    gender === opt.v
                      ? 'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00]'
                      : 'border-white/10 bg-white/[0.02] text-white/50 hover:border-white/30 hover:text-white/80'
                  }`}
                >
                  <span className="text-xl" style={{ fontFamily: 'Noto Serif SC' }}>{opt.l}</span>
                  <span className="text-[10px] font-mono tracking-widest">{opt.en}</span>
                </button>
              ))}
            </div>
          </FormSection>

          {/* 出生时刻 */}
          <FormSection
            num="02"
            title="出生那一秒"
            sub="THAT SECOND"
            hint="差一个时辰，时柱整变；差 4 分钟，上升星座移 1°"
          >
            {/* 年月日 */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <DateInput value={year} onChange={setYear} min={1900} max={today.getFullYear()} suffix="年" big />
              <DateInput value={month} onChange={setMonth} min={1} max={12} suffix="月" big />
              <DateInput value={day} onChange={setDay} min={1} max={31} suffix="日" big />
            </div>

            {/* 时辰可视化 */}
            <div className={`transition-opacity ${unknownTime ? 'opacity-30 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-white/40 tracking-widest">TIME · 时刻</span>
                <span className="text-sm" style={{ fontFamily: 'Noto Serif SC' }}>
                  <span className="text-[#FF4D00]">{shichen.name}</span>
                  <span className="text-white/40 ml-2 text-xs">{shichen.desc}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <DateInput value={hour} onChange={setHour} min={0} max={23} suffix="时" big />
                <DateInput value={minute} onChange={setMinute} min={0} max={59} suffix="分" big />
              </div>

              {/* 12 时辰快捷 */}
              <div className="grid grid-cols-6 md:grid-cols-12 gap-1">
                {SHICHEN.map((sc) => {
                  const active = shichen.name === sc.name;
                  return (
                    <button
                      key={sc.name}
                      type="button"
                      onClick={() => {
                        const start = sc.range[0];
                        setHour(start === 23 ? 23 : start);
                        setMinute(30);
                      }}
                      title={sc.desc}
                      className={`py-2 text-xs transition-all ${
                        active
                          ? 'bg-[#FF4D00] text-black'
                          : 'bg-white/[0.03] text-white/50 hover:bg-white/10 hover:text-white'
                      }`}
                      style={{ fontFamily: 'Noto Serif SC' }}
                    >
                      {sc.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 不知道时辰 */}
            <label className="flex items-center gap-2 mt-5 text-xs text-white/60 cursor-pointer">
              <input
                type="checkbox"
                checked={unknownTime}
                onChange={(e) => setUnknownTime(e.target.checked)}
                className="accent-[#FF4D00]"
              />
              <span style={{ fontFamily: 'Noto Serif SC' }}>不知道具体时辰</span>
              <span className="text-[10px] text-white/30 ml-1">（八字时柱与上升星座精度受影响）</span>
            </label>
          </FormSection>

          {/* 出生地 */}
          <FormSection
            num="03"
            title="那时你在哪"
            sub="WHERE YOU LANDED"
            hint="经度决定真太阳时校正；纬度决定上升与中天星座"
          >
            {/* 快捷城市 */}
            <div className="mb-4">
              <div className="text-[10px] font-mono text-white/30 tracking-widest mb-2">QUICK SELECT</div>
              <div className="flex gap-2 flex-wrap">
                {TOP_CITIES.map((cn) => {
                  const c = CITIES.find((x) => x.name === cn);
                  if (!c) return null;
                  const active = city.name === cn;
                  return (
                    <button
                      key={cn}
                      type="button"
                      onClick={() => setCity(c)}
                      className={`px-4 py-2 text-sm border transition-all ${
                        active
                          ? 'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00]'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30'
                      }`}
                      style={{ fontFamily: 'Noto Serif SC' }}
                    >
                      {cn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 当前选中显示 + 搜索 */}
            <div className="bg-white/[0.03] border border-white/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-[#FF4D00]" />
                  <span className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif SC' }}>
                    {city.name}
                  </span>
                  <span className="text-[11px] font-mono text-white/40">
                    {city.lng.toFixed(2)}°{city.lng >= 0 ? 'E' : 'W'} · {Math.abs(city.lat).toFixed(2)}°{city.lat >= 0 ? 'N' : 'S'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCityList((p) => !p)}
                  className="text-xs text-white/50 hover:text-[#FF4D00] tracking-widest font-mono"
                >
                  {showCityList ? <X size={14} /> : <Search size={14} />}
                </button>
              </div>

              {/* 真太阳时偏移可视化 */}
              {useTrueSolar && (
                <div className="text-[10px] text-white/40 font-mono">
                  ↳ 真太阳时偏移 {((city.lng - 120) * 4).toFixed(1)} 分钟
                  （{(city.lng - 120) > 0 ? '比北京时间提前' : '比北京时间延后'}）
                </div>
              )}

              {showCityList && (
                <div className="mt-4 border border-white/10 max-h-72 overflow-y-auto animate-slide-down">
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="搜索城市…"
                    className="w-full bg-white/5 border-b border-white/10 px-4 py-3 text-sm focus:outline-none focus:bg-white/10"
                    autoFocus
                  />
                  {filteredCities.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setCity(c);
                        setShowCityList(false);
                        setCitySearch('');
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-[#FF4D00]/20 hover:text-[#FF4D00] transition-colors flex justify-between"
                    >
                      <span>{c.name}</span>
                      <span className="text-white/30 text-xs font-mono">{c.lng.toFixed(2)}°</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 mt-3 text-xs text-white/60 cursor-pointer">
              <input
                type="checkbox"
                checked={useTrueSolar}
                onChange={(e) => setUseTrueSolar(e.target.checked)}
                className="accent-[#FF4D00]"
              />
              <span style={{ fontFamily: 'Noto Serif SC' }}>使用真太阳时校正</span>
              <span className="text-[10px] text-white/30 ml-1">（推荐，按经度精修）</span>
            </label>
          </FormSection>

          {/* 提交 */}
          <div className="pt-8">
            <button
              onClick={submit}
              disabled={!valid}
              className="group w-full py-6 bg-[#FF4D00] text-black font-bold tracking-[0.4em] hover:bg-white transition-colors flex items-center justify-center gap-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>开始解码</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="text-center text-[10px] font-mono text-white/30 tracking-widest mt-4">
              一次解码 = 八字 + 占星 + 数字命理 + 姓名学 + 综合
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ 子组件 ============

const FormSection = ({ num, title, sub, hint, children }) => (
  <section className="animate-fade-in-up">
    <div className="flex items-baseline gap-4 mb-2">
      <span className="text-[10px] font-mono text-[#FF4D00] tracking-widest">{num}</span>
      <h2 className="text-2xl md:text-3xl font-bold tracking-wide" style={{ fontFamily: 'Noto Serif SC' }}>
        {title}
      </h2>
      <span className="text-[10px] font-mono text-white/30 tracking-widest hidden md:inline">
        {sub}
      </span>
    </div>
    {hint && (
      <p className="text-xs text-white/40 mb-5 tracking-wide" style={{ fontFamily: 'Noto Serif SC' }}>
        {hint}
      </p>
    )}
    {children}
  </section>
);

const BigInput = ({ value, onChange, placeholder, icon }) => (
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF4D00]/40 text-lg pointer-events-none" style={{ fontFamily: 'Noto Serif SC' }}>
      {icon}
    </span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/[0.02] border border-white/10 pl-12 pr-4 py-4 text-base focus:border-[#FF4D00] focus:outline-none transition-colors"
      style={{ fontFamily: 'Noto Serif SC' }}
    />
  </div>
);

const DateInput = ({ value, onChange, min, max, suffix, big }) => (
  <div className="relative">
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
      min={min}
      max={max}
      className={`w-full bg-white/[0.02] border border-white/10 ${big ? 'py-5 text-2xl' : 'py-3 text-base'} px-4 focus:border-[#FF4D00] focus:outline-none transition-colors text-center font-mono`}
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none" style={{ fontFamily: 'Noto Serif SC' }}>
      {suffix}
    </span>
  </div>
);

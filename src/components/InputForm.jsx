import React, { useState, useMemo } from 'react';
import {
  ArrowRight, ArrowLeft, MapPin, Search, X, Sun, Moon, Sunrise, Sunset, Lock,
} from 'lucide-react';
import { CITIES } from '../lib/cities.js';
import { Brand, NoiseLayer } from './shared.jsx';
import WheelPicker from './WheelPicker.jsx';

// 12 时辰
const SHICHEN = [
  { name: '子时', range: [23, 1], emoji: '🌌', desc: '夜半 23–01' },
  { name: '丑时', range: [1, 3], emoji: '🌃', desc: '鸡鸣 01–03' },
  { name: '寅时', range: [3, 5], emoji: '🌒', desc: '平旦 03–05' },
  { name: '卯时', range: [5, 7], emoji: '🌅', desc: '日出 05–07' },
  { name: '辰时', range: [7, 9], emoji: '☀️', desc: '食时 07–09' },
  { name: '巳时', range: [9, 11], emoji: '🌤', desc: '隅中 09–11' },
  { name: '午时', range: [11, 13], emoji: '☀️', desc: '日中 11–13' },
  { name: '未时', range: [13, 15], emoji: '🌤', desc: '日昳 13–15' },
  { name: '申时', range: [15, 17], emoji: '🌇', desc: '哺时 15–17' },
  { name: '酉时', range: [17, 19], emoji: '🌆', desc: '日入 17–19' },
  { name: '戌时', range: [19, 21], emoji: '🌃', desc: '黄昏 19–21' },
  { name: '亥时', range: [21, 23], emoji: '🌌', desc: '人定 21–23' },
];

const getShichen = (hour) => {
  if (hour === 23 || hour === 0) return SHICHEN[0];
  return SHICHEN.find((s) => hour >= s.range[0] && hour < s.range[1]) || SHICHEN[6];
};

const ROUGH_TIMES = [
  { label: '凌晨', icon: Moon, hour: 3 },
  { label: '早上', icon: Sunrise, hour: 7 },
  { label: '中午', icon: Sun, hour: 12 },
  { label: '下午', icon: Sun, hour: 15 },
  { label: '傍晚', icon: Sunset, hour: 18 },
  { label: '晚上', icon: Moon, hour: 21 },
];

const POPULAR_GROUPS = [
  { region: '一线', cities: ['北京', '上海', '广州', '深圳'] },
  { region: '热门', cities: ['杭州', '成都', '武汉', '西安', '南京', '天津'] },
  { region: '港澳台 & 海外', cities: ['香港', '澳门', '台北', '东京', '新加坡', '纽约', '伦敦'] },
];

const PINYIN_INITIAL = {
  '北京':'B','上海':'S','广州':'G','深圳':'S','惠州':'H','东莞':'D','佛山':'F','珠海':'Z','汕头':'S','中山':'Z','湛江':'Z',
  '杭州':'H','宁波':'N','温州':'W','苏州':'S','无锡':'W','南京':'N','合肥':'H','成都':'C','昆明':'K','贵阳':'G',
  '西安':'X','兰州':'L','银川':'Y','西宁':'X','乌鲁木齐':'W','武汉':'W','长沙':'C','郑州':'Z','南昌':'N',
  '太原':'T','石家庄':'S','济南':'J','青岛':'Q','呼和浩特':'H','沈阳':'S','大连':'D','长春':'C','哈尔滨':'H',
  '南宁':'N','海口':'H','三亚':'S','厦门':'X','福州':'F','香港':'X','澳门':'A','台北':'T','拉萨':'L','天津':'T','重庆':'C',
  '东京':'D','首尔':'S','新加坡':'X','曼谷':'M','伦敦':'L','巴黎':'B','柏林':'B','纽约':'N','洛杉矶':'L','旧金山':'J','悉尼':'X','墨尔本':'M',
};

// 工具：闰年判断
const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const daysInMonth = (y, m) => {
  if ([1, 3, 5, 7, 8, 10, 12].includes(m)) return 31;
  if (m === 2) return isLeap(y) ? 29 : 28;
  return 30;
};

export default function InputForm({ onSubmit, onBack, initialValues }) {
  const [year, setYear] = useState(initialValues?.year ?? 2000);
  const [month, setMonth] = useState(initialValues?.month ?? 6);
  const [day, setDay] = useState(initialValues?.day ?? 15);
  const [hour, setHour] = useState(initialValues?.hour ?? 12);
  const [minute, setMinute] = useState(initialValues?.minute ?? 0);
  const [unknownTime, setUnknownTime] = useState(false);
  const [city, setCity] = useState(initialValues?.city ?? CITIES.find((c) => c.name === '深圳'));
  const [citySearch, setCitySearch] = useState('');
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [gender, setGender] = useState(initialValues?.gender ?? 'male');
  const [name, setName] = useState(initialValues?.name ?? '');
  const [enName, setEnName] = useState(initialValues?.enName ?? '');
  const [useTrueSolar, setUseTrueSolar] = useState(true);

  const today = new Date();
  const yearList = useMemo(() => {
    const arr = [];
    for (let y = today.getFullYear(); y >= 1900; y--) arr.push(y);
    return arr.reverse(); // 从 1900 → 现在，方便上滑找老年
  }, []);
  const monthList = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const maxDay = daysInMonth(year, month);
  const dayList = useMemo(
    () => Array.from({ length: maxDay }, (_, i) => i + 1),
    [maxDay]
  );

  // 月份变化时，如果 day 超过当月最大天数，调整
  React.useEffect(() => {
    if (day > maxDay) setDay(maxDay);
  }, [maxDay]);

  const hourList = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minuteList = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  const shichen = useMemo(() => getShichen(hour), [hour]);

  const filteredCities = useMemo(() => {
    if (!citySearch) return CITIES;
    const q = citySearch.toLowerCase();
    return CITIES.filter((c) => {
      if (c.name.includes(citySearch)) return true;
      const initial = (PINYIN_INITIAL[c.name] || '').toLowerCase();
      return initial.startsWith(q[0] || '');
    });
  }, [citySearch]);

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
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <NoiseLayer opacity={0.03} />

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

      <div className="max-w-3xl mx-auto px-6 pt-12 pb-32 relative">

        {/* 标题 */}
        <div className="mb-10 text-center animate-fade-in-up">
          <p className="text-[10px] font-mono text-[#FF4D00] tracking-[0.5em] mb-5">
            // INPUT
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-wider leading-tight" style={{ fontFamily: 'Noto Serif SC' }}>
            告诉我<br />
            <span className="text-[#FF4D00]">你来到这里的那一刻</span>
          </h1>
        </div>

        {/* 隐私声明 */}
        <div className="mb-10 mx-auto max-w-xl bg-[#FF4D00]/5 border border-[#FF4D00]/20 px-5 py-4 flex items-start gap-3">
          <Lock size={16} className="text-[#FF4D00] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-white/70 leading-relaxed" style={{ fontFamily: 'Noto Serif SC' }}>
            <span className="text-[#FF4D00] font-bold">隐私承诺：</span>
            你输入的一切只在你浏览器的内存里。<br />
            <span className="text-white/50">关闭页面 = 数据自动消失，不存、不传、不卖。</span>
          </div>
        </div>

        <div className="space-y-12">

          {/* 名字 + 性别 */}
          <Section num="01" title="你叫什么">
            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <SoftInput value={name} onChange={setName} placeholder="中文姓名（用于姓名学）" />
              <SoftInput value={enName} onChange={setEnName} placeholder="英文 / 拼音名（选填）" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: 'male', l: '男 · MALE' },
                { v: 'female', l: '女 · FEMALE' },
              ].map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setGender(opt.v)}
                  className={`px-6 py-4 border transition-all tracking-widest text-sm ${
                    gender === opt.v
                      ? 'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00]'
                      : 'border-white/10 bg-white/[0.02] text-white/50 hover:border-white/30'
                  }`}
                  style={{ fontFamily: 'Noto Serif SC' }}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </Section>

          {/* 出生日期 — 三栏滚轮 */}
          <Section num="02" title="出生日期" hint="滚动 / 点击 / 鼠标滚轮 都能选 · 不用手敲">
            <div className="bg-white/[0.02] border border-white/10 p-4 md:p-6">
              <div className="flex gap-2 md:gap-4">
                <WheelPicker
                  items={yearList}
                  value={year}
                  onChange={setYear}
                  label="YEAR · 年"
                />
                <WheelPicker
                  items={monthList}
                  value={month}
                  onChange={setMonth}
                  format={(v) => v}
                  label="MONTH · 月"
                />
                <WheelPicker
                  items={dayList}
                  value={day}
                  onChange={setDay}
                  format={(v) => v}
                  label="DAY · 日"
                />
              </div>
              <p className="text-[11px] text-white/40 text-center mt-3 tracking-wide">
                {year} 年 {month} 月 {day} 日
              </p>
            </div>
          </Section>

          {/* 出生时刻 */}
          <Section num="03" title="出生时刻" hint={unknownTime ? '已选"不知道时辰"模式' : '差一个时辰，时柱整变'}>
            {!unknownTime && (
              <>
                {/* 时分滚轮 + 当前时辰显示 */}
                <div className="bg-white/[0.02] border border-white/10 p-4 md:p-6 mb-4">
                  <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4">
                    <WheelPicker
                      items={hourList}
                      value={hour}
                      onChange={setHour}
                      format={(v) => String(v).padStart(2, '0')}
                      label="HOUR · 时"
                    />
                    <WheelPicker
                      items={minuteList}
                      value={minute}
                      onChange={setMinute}
                      format={(v) => String(v).padStart(2, '0')}
                      label="MINUTE · 分"
                    />
                  </div>
                  <div className="text-center pt-3 border-t border-white/5">
                    <span className="text-2xl mr-2">{shichen.emoji}</span>
                    <span className="text-[#FF4D00] text-lg font-bold" style={{ fontFamily: 'Noto Serif SC' }}>
                      {shichen.name}
                    </span>
                    <span className="text-white/40 text-xs ml-3">{shichen.desc}</span>
                  </div>
                </div>

                {/* 12 时辰快捷标签 */}
                <div className="grid grid-cols-6 md:grid-cols-12 gap-1 mb-4">
                  {SHICHEN.map((sc) => {
                    const active = shichen.name === sc.name;
                    return (
                      <button
                        key={sc.name}
                        type="button"
                        onClick={() => {
                          const h = sc.range[0] === 23 ? 23 : sc.range[0] + 1;
                          setHour(h);
                          setMinute(0);
                        }}
                        title={`${sc.name} · ${sc.desc}`}
                        className={`py-2 text-xs transition-all border ${
                          active
                            ? 'bg-[#FF4D00] text-black border-[#FF4D00]'
                            : 'bg-white/[0.02] text-white/50 border-white/5 hover:border-white/20 hover:text-white'
                        }`}
                        style={{ fontFamily: 'Noto Serif SC' }}
                      >
                        {sc.name[0]}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* 不知道时辰：粗略时间快捷 */}
            {unknownTime && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4 animate-fade-in-up">
                {ROUGH_TIMES.map((rt) => {
                  const active = hour === rt.hour;
                  const Icon = rt.icon;
                  return (
                    <button
                      key={rt.label}
                      type="button"
                      onClick={() => { setHour(rt.hour); setMinute(0); }}
                      className={`py-4 border transition-all flex flex-col items-center gap-1 ${
                        active
                          ? 'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00]'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm" style={{ fontFamily: 'Noto Serif SC' }}>{rt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
              <input
                type="checkbox"
                checked={unknownTime}
                onChange={(e) => setUnknownTime(e.target.checked)}
                className="accent-[#FF4D00]"
              />
              <span style={{ fontFamily: 'Noto Serif SC' }}>不知道具体时辰</span>
              <span className="text-[10px] text-white/30 ml-1">（结果仍可参考，时柱与上升星座精度受影响）</span>
            </label>
          </Section>

          {/* 出生地 */}
          <Section num="04" title="出生地" hint="经度决定真太阳时；纬度决定上升星座">
            {/* 当前选中显示 */}
            <div className="bg-white/[0.03] border border-white/10 p-5 mb-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-[#FF4D00]" />
                  <span className="text-3xl font-bold" style={{ fontFamily: 'Noto Serif SC' }}>
                    {city.name}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-white/40 text-right">
                  <div>{city.lng.toFixed(2)}°{city.lng >= 0 ? 'E' : 'W'}</div>
                  <div>{Math.abs(city.lat).toFixed(2)}°{city.lat >= 0 ? 'N' : 'S'}</div>
                </div>
              </div>
              {useTrueSolar && city.lng !== 120 && (
                <div className="text-[11px] text-white/50 mt-3 font-mono">
                  ↳ 真太阳时偏移 {((city.lng - 120) * 4).toFixed(1)} 分钟
                </div>
              )}
            </div>

            {/* 搜索 */}
            <div className="relative mb-4">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={citySearch}
                onChange={(e) => { setCitySearch(e.target.value); setShowCitySearch(true); }}
                onFocus={() => setShowCitySearch(true)}
                placeholder="搜索城市（中文 / 拼音首字母如 BJ）..."
                className="w-full bg-white/[0.02] border border-white/10 pl-12 pr-12 py-4 text-base focus:border-[#FF4D00] focus:outline-none transition-colors"
                style={{ fontFamily: 'Noto Serif SC' }}
              />
              {citySearch && (
                <button
                  onClick={() => { setCitySearch(''); setShowCitySearch(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {showCitySearch && citySearch && (
              <div className="bg-[#0a0a0a] border border-white/10 max-h-64 overflow-y-auto mb-4 animate-slide-down">
                {filteredCities.length === 0 ? (
                  <div className="p-4 text-center text-white/40 text-sm">没找到这个城市</div>
                ) : (
                  filteredCities.slice(0, 50).map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setCity(c);
                        setCitySearch('');
                        setShowCitySearch(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-[#FF4D00]/20 hover:text-[#FF4D00] transition-colors flex justify-between items-center border-b border-white/5"
                      style={{ fontFamily: 'Noto Serif SC' }}
                    >
                      <span>{c.name}</span>
                      <span className="text-white/30 text-[10px] font-mono">
                        {c.lng.toFixed(2)}°{c.lng >= 0 ? 'E' : 'W'}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}

            {!citySearch && (
              <div className="space-y-3">
                {POPULAR_GROUPS.map((group) => (
                  <div key={group.region}>
                    <div className="text-[10px] font-mono text-white/30 tracking-widest mb-2">
                      {group.region.toUpperCase()}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {group.cities.map((cn) => {
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
                ))}
              </div>
            )}

            <label className="flex items-center gap-2 mt-4 text-xs text-white/60 cursor-pointer">
              <input
                type="checkbox"
                checked={useTrueSolar}
                onChange={(e) => setUseTrueSolar(e.target.checked)}
                className="accent-[#FF4D00]"
              />
              <span style={{ fontFamily: 'Noto Serif SC' }}>使用真太阳时校正</span>
              <span className="text-[10px] text-white/30">（推荐）</span>
            </label>
          </Section>

          {/* 提交 */}
          <div className="pt-6">
            <button
              onClick={submit}
              disabled={!valid}
              className="group w-full py-6 bg-[#FF4D00] text-black font-bold tracking-[0.4em] hover:bg-white transition-colors flex items-center justify-center gap-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>开始解码</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="text-center text-[10px] font-mono text-white/30 tracking-widest mt-4">
              一次解码 = 八字 · 占星 · 数字命理 · 姓名学 · 综合
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const Section = ({ num, title, hint, children }) => (
  <section className="animate-fade-in-up">
    <div className="flex items-baseline gap-3 mb-2">
      <span className="text-[10px] font-mono text-[#FF4D00] tracking-widest">{num}</span>
      <h2 className="text-xl md:text-2xl font-bold tracking-wide" style={{ fontFamily: 'Noto Serif SC' }}>
        {title}
      </h2>
    </div>
    {hint && (
      <p className="text-xs text-white/40 mb-4 tracking-wide">{hint}</p>
    )}
    {children}
  </section>
);

const SoftInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full bg-white/[0.02] border border-white/10 px-4 py-4 text-base focus:border-[#FF4D00] focus:outline-none transition-colors"
    style={{ fontFamily: 'Noto Serif SC' }}
  />
);

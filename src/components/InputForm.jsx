import React, { useState } from 'react';
import {
  ArrowRight, ArrowLeft, Calendar, Clock, MapPin, User, Sparkles, ChevronDown,
} from 'lucide-react';
import { CITIES } from '../lib/cities.js';
import { Brand, Field, NumberInput, NoiseLayer } from './shared.jsx';

export default function InputForm({ onSubmit, onBack, initialValues }) {
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

  const filteredCities = citySearch
    ? CITIES.filter((c) => c.name.includes(citySearch))
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

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <NoiseLayer opacity={0.03} />

      <div className="absolute top-8 left-8 z-10">
        <Brand />
      </div>

      <button
        onClick={onBack}
        className="absolute top-8 right-8 z-10 flex items-center gap-2 text-white/50 hover:text-white text-xs tracking-widest font-mono transition-colors"
      >
        <ArrowLeft size={14} /> BACK
      </button>

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20 relative z-5">
        <div className="mb-12 animate-fade-in-up">
          <p className="text-[10px] font-mono text-[#FF4D00] tracking-[0.4em] mb-4">
            // INPUT.FORM
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide" style={{ fontFamily: 'Noto Serif SC' }}>
            录入你的<span className="text-[#FF4D00]">出生坐标</span>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-xl">
            出生那一刻的天体配置，是宇宙给你的初始参数。<br />
            时间精度越高、地点越精确，解码颗粒度越细。
          </p>
        </div>

        <div className="space-y-8">
          <Field label="公历生日" labelEn="GREGORIAN DATE" icon={Calendar}>
            <div className="grid grid-cols-3 gap-3">
              <NumberInput value={year} onChange={setYear} min={1900} max={2099} suffix="年" />
              <NumberInput value={month} onChange={setMonth} min={1} max={12} suffix="月" />
              <NumberInput value={day} onChange={setDay} min={1} max={31} suffix="日" />
            </div>
          </Field>

          <Field
            label="出生时刻"
            labelEn="BIRTH TIME"
            icon={Clock}
            hint="⚠️ 时辰极为关键。差一个时辰，时柱整变；占星上差 4 分钟，上升度数移 1°。"
          >
            <div className={`grid grid-cols-2 gap-3 transition-opacity ${unknownTime ? 'opacity-30 pointer-events-none' : ''}`}>
              <NumberInput value={hour} onChange={setHour} min={0} max={23} suffix="时" />
              <NumberInput value={minute} onChange={setMinute} min={0} max={59} suffix="分" />
            </div>
            <label className="flex items-center gap-2 mt-3 text-xs text-white/60 cursor-pointer">
              <input
                type="checkbox"
                checked={unknownTime}
                onChange={(e) => setUnknownTime(e.target.checked)}
                className="accent-[#FF4D00]"
              />
              不知道具体时辰（用正午 12:00 替代，结果中时柱与上升星座仅供参考）
            </label>
          </Field>

          <Field label="出生地" labelEn="BIRTHPLACE" icon={MapPin}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCityList((p) => !p)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-left flex items-center justify-between hover:border-[#FF4D00]/50 transition-colors"
              >
                <span>
                  {city.name}{' '}
                  <span className="text-white/30 text-xs ml-2">
                    ({city.lng.toFixed(2)}°{city.lng >= 0 ? 'E' : 'W'} · {Math.abs(city.lat).toFixed(2)}°{city.lat >= 0 ? 'N' : 'S'})
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showCityList ? 'rotate-180' : ''}`}
                />
              </button>
              {showCityList && (
                <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 max-h-72 overflow-y-auto animate-slide-down">
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="搜索城市..."
                    className="w-full bg-transparent border-b border-white/10 px-4 py-3 text-sm focus:outline-none"
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
                      <span className="text-white/30 text-xs">{c.lng.toFixed(2)}°</span>
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
              使用真太阳时校正（按出生地经度修正北京时间，更精准）
            </label>
          </Field>

          <Field label="性别" labelEn="GENDER" icon={User}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: 'male', l: '男 / MALE' },
                { v: 'female', l: '女 / FEMALE' },
              ].map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setGender(opt.v)}
                  className={`px-4 py-3 border transition-all tracking-widest text-sm ${
                    gender === opt.v
                      ? 'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00]'
                      : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30'
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </Field>

          <Field label="姓名" labelEn="NAME" icon={Sparkles}>
            <div className="grid md:grid-cols-2 gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="中文姓名（用于姓名学）"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-[#FF4D00] focus:outline-none transition-colors"
              />
              <input
                type="text"
                value={enName}
                onChange={(e) => setEnName(e.target.value)}
                placeholder="英文/拼音名（用于数字命理，可选）"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-[#FF4D00] focus:outline-none transition-colors"
              />
            </div>
          </Field>

          <button
            onClick={submit}
            className="w-full mt-8 py-5 bg-[#FF4D00] text-black font-bold tracking-[0.4em] hover:bg-white transition-colors flex items-center justify-center gap-3 group"
          >
            开始解码
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

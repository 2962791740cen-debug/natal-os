import React, { useState, useCallback, useEffect } from 'react';
import HeroPage from './components/HeroPage.jsx';
import InputForm from './components/InputForm.jsx';
import TransitionScreen from './components/TransitionScreen.jsx';
import Result from './components/Result.jsx';
import { calculateBazi } from './lib/bazi.js';
import { calculateAstrology } from './lib/astrology.js';
import { calculateNumerology, calculateMayaKin } from './lib/numerology.js';
import { calculateNaming } from './lib/naming.js';
import { generateSynthesis, generateArchetype } from './lib/synthesis.js';
import { generatePersona } from './lib/persona.js';

// 全部数据只在 React state 里
// 不写 localStorage / sessionStorage / cookie / IndexedDB
// 关闭页面 / 刷新 / 退出 → 数据自动消失
const STALE_KEY = 'natal-os-last-input'; // 历史遗留 key，启动时清掉

export default function App() {
  const [step, setStep] = useState('hero');
  const [input, setInput] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // ===== 启动时清空所有可能存在的本地存储（保险） =====
  useEffect(() => {
    try {
      localStorage.removeItem(STALE_KEY);
      sessionStorage.removeItem(STALE_KEY);
      // 清掉所有以 natal-os 开头的 key（防御性）
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('natal-os')) localStorage.removeItem(k);
      });
      Object.keys(sessionStorage).forEach((k) => {
        if (k.startsWith('natal-os')) sessionStorage.removeItem(k);
      });
    } catch (e) { /* ignore */ }
  }, []);

  // ===== 关闭页面 / 刷新前清空 React state（双保险，防 BFCache 残留） =====
  useEffect(() => {
    const wipe = () => {
      setInput(null);
      setResults(null);
    };
    window.addEventListener('beforeunload', wipe);
    window.addEventListener('pagehide', wipe);
    return () => {
      window.removeEventListener('beforeunload', wipe);
      window.removeEventListener('pagehide', wipe);
    };
  }, []);

  const handleSubmit = useCallback((data) => {
    setInput(data);
    setStep('computing');
    setError(null);

    // 异步计算（不持久化任何数据）
    setTimeout(() => {
      try {
        const bazi = calculateBazi(data);

        let astrology = null;
        if (!data.unknownTime) {
          astrology = calculateAstrology(data);
        }

        const numerology = calculateNumerology({
          year: data.year,
          month: data.month,
          day: data.day,
          name: data.enName,
        });

        const mayaKin = calculateMayaKin(data.year, data.month, data.day);

        const naming = data.name && data.name !== '无名氏'
          ? calculateNaming(data.name)
          : null;

        const synthesisCards = generateSynthesis({ bazi, astrology, numerology, naming });
        const archetype = generateArchetype({ bazi, astrology, numerology });
        const persona = generatePersona({ bazi, astrology, numerology });

        setResults({ bazi, astrology, numerology, mayaKin, naming, synthesisCards, archetype, persona });
      } catch (e) {
        console.error('计算失败：', e);
        setError(e.message || '计算失败');
      }
    }, 100);
  }, []);

  const handleComputingComplete = useCallback(() => {
    if (results) {
      setStep('result');
    } else if (error) {
      setStep('input');
    } else {
      setTimeout(() => {
        if (results) setStep('result');
        else setStep('input');
      }, 500);
    }
  }, [results, error]);

  // 退出/重新开始：彻底清空所有数据
  const restart = useCallback(() => {
    setStep('hero');
    setInput(null);
    setResults(null);
    setError(null);
  }, []);

  if (step === 'hero') {
    return <HeroPage onStart={() => setStep('input')} />;
  }
  if (step === 'input') {
    return (
      <InputForm
        onSubmit={handleSubmit}
        onBack={() => { setInput(null); setStep('hero'); }}
        initialValues={input}
      />
    );
  }
  if (step === 'computing') {
    return <TransitionScreen onComplete={handleComputingComplete} />;
  }
  if (step === 'result' && results && input) {
    return (
      <Result
        bazi={results.bazi}
        astrology={results.astrology}
        numerology={results.numerology}
        mayaKin={results.mayaKin}
        naming={results.naming}
        synthesisCards={results.synthesisCards}
        archetype={results.archetype}
        persona={results.persona}
        input={input}
        onRestart={restart}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <p className="text-[#FF4D00] text-xs font-mono tracking-widest mb-4">// ERROR</p>
          <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Noto Serif SC' }}>计算遇到问题</h1>
          <p className="text-white/60 text-sm mb-8">{error}</p>
          <button
            onClick={restart}
            className="px-8 py-3 border border-white/30 hover:border-[#FF4D00] hover:bg-[#FF4D00] hover:text-black transition-all tracking-widest text-sm"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return <HeroPage onStart={() => setStep('input')}
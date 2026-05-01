import React, { useState, useCallback } from 'react';
import HeroPage from './components/HeroPage.jsx';
import InputForm from './components/InputForm.jsx';
import TransitionScreen from './components/TransitionScreen.jsx';
import Result from './components/Result.jsx';
import { calculateBazi } from './lib/bazi.js';
import { calculateAstrology } from './lib/astrology.js';
import { calculateNumerology, calculateMayaKin } from './lib/numerology.js';
import { calculateNaming } from './lib/naming.js';
import { generateSynthesis } from './lib/synthesis.js';

const STORAGE_KEY = 'natal-os-last-input';

export default function App() {
  const [step, setStep] = useState('hero');
  const [input, setInput] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback((data) => {
    setInput(data);
    setStep('computing');
    setError(null);

    // 持久化
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // ignore
    }

    // 异步计算
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

        const synthesisCards = generateSynthesis({
          bazi,
          astrology,
          numerology,
          naming,
        });

        setResults({ bazi, astrology, numerology, mayaKin, naming, synthesisCards });
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
      // 计算还没完成，再等等
      setTimeout(() => {
        if (results) setStep('result');
        else setStep('input');
      }, 500);
    }
  }, [results, error]);

  const restart = useCallback(() => {
    setStep('hero');
    setInput(null);
    setResults(null);
    setError(null);
  }, []);

  // 加载保存的输入（高级功能）
  const loadSaved = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        return data;
      }
    } catch (e) { /* ignore */ }
    return null;
  }, []);

  if (step === 'hero') {
    return <HeroPage onStart={() => setStep('input')} />;
  }
  if (step === 'input') {
    return (
      <InputForm
        onSubmit={handleSubmit}
        onBack={() => setStep('hero')}
        initialValues={input || loadSaved()}
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
        input={input}
        onRestart={restart}
      />
    );
  }

  // 错误兜底
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

  return <HeroPage onStart={() => setStep('input')} />;
}

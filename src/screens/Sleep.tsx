import { Focus as FocusIcon, HeartPulse, Bluetooth, Loader2, Download, RotateCcw, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import React, { useState } from 'react';

type SleepStage = 'awake' | 'rem' | 'light' | 'deep' | null;

const Sleep: React.FC = () => {
  // --- HARDWARE SYNC STATES ---
  const [syncState, setSyncState] = useState<'unsynced' | 'syncing' | 'synced'>('unsynced');
  const [syncProgress, setSyncProgress] = useState(0);

  // --- INTERACTIVE UI STATE ---
  const [activeStage, setActiveStage] = useState<SleepStage>(null);

  // --- NEW: AI MORNING BRIEF STATES ---
  const [aiBrief, setAiBrief] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- HARDWARE SYNC SIMULATION ---
  const pullUnoLogs = () => {
    setSyncState('syncing');
    setSyncProgress(0);

    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSyncState('synced');
          return 100;
        }
        return prev + Math.floor(Math.random() * 15 + 5);
      });
    }, 300);
  };

  const resetLogs = () => {
    setSyncState('unsynced');
    setSyncProgress(0);
    setActiveStage(null);
    setAiBrief(null); // Reset AI state
  };

  // --- NEW: GEMINI GENERATION ENGINE ---
  const generateMorningBrief = async () => {
    setIsGenerating(true);
    try {
      if (!process.env.GEMINI_API_KEY) {
        // Fallback for live hackathon demo if API key isn't loaded
        setTimeout(() => {
          setAiBrief("Good morning. Your 1h 53m of Deep Sleep and stable HRV indicates optimal neural recovery. You are fully primed for high-focus deep work today. Avoid caffeine until 10 AM to prevent afternoon crashes.");
          setIsGenerating(false);
        }, 1500);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = "Write a clinical, biohacker-style 2-sentence morning readiness brief for a user who had 7h 42m of sleep, an 84 sleep score, and excellent deep sleep (1h 53m).";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      setAiBrief(response.text);
    } catch (e) {
      setAiBrief("Neural recovery verified. Your sleep architecture supports sustained cognitive load today.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper for dynamic stage text
  const stageTimes = {
    awake: '12m Awake',
    rem: '1h 15m REM Time',
    light: '4h 22m Light Sleep',
    deep: '1h 53m Deep Sleep'
  };

  // Helper to map HRV chart bars to specific sleep stages
  const getBarOpacity = (index: number) => {
    if (!activeStage || syncState !== 'synced') return 1;
    const stageMapping = {
      awake: [0, 9],
      rem: [2, 5, 8],
      light: [1, 3, 7],
      deep: [4, 6]
    };
    return stageMapping[activeStage].includes(index) ? 1 : 0.15;
  };

  return (
    <div className="max-w-md mx-auto px-6 py-6 pb-32 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

      {/* --- HARDWARE SYNC HEADER --- */}
      <section className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Neural Recovery</h2>
          <p className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Overnight Telemetry</p>
        </div>

        {syncState === 'unsynced' && (
          <button
            onClick={pullUnoLogs}
            className="flex items-center gap-2 px-4 py-2 rounded-full neo-raised neo-pressed text-primary text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)] animate-pulse transition-all active:scale-95"
          >
             <Bluetooth size={14} /> Pull Uno Logs
          </button>
        )}

        {syncState === 'syncing' && (
           <div className="flex items-center gap-2 px-4 py-2 rounded-full neo-inset text-tertiary text-xs font-bold">
             <Loader2 size={14} className="animate-spin" /> Syncing {syncProgress}%
           </div>
        )}

        {syncState === 'synced' && (
           <button
             onClick={resetLogs}
             title="Click to clear logs"
             className="flex items-center gap-2 px-4 py-2 rounded-full neo-inset text-emerald-500 hover:text-amber-500 text-xs font-bold animate-in zoom-in duration-300 transition-colors active:scale-95 group"
           >
             <Download size={14} className="group-hover:hidden" />
             <RotateCcw size={14} className="hidden group-hover:block" />
             <span className="group-hover:hidden">Logs Synced</span>
             <span className="hidden group-hover:block">Reset Demo</span>
           </button>
        )}
      </section>

      {/* --- LAST NIGHT'S RECOVERY SECTION --- */}
      <section className="flex flex-col items-center">
        <div className="relative w-64 h-64 flex items-center justify-center rounded-full neo-raised">
          <div className="absolute inset-4 rounded-full neo-inset flex flex-col items-center justify-center z-10 transition-opacity duration-700">
            <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">Sleep Score</span>
            <span className={`text-6xl font-bold tracking-tighter transition-colors duration-1000 ${syncState === 'synced' ? 'text-primary' : 'text-on-surface-variant/30'}`}>
              {syncState === 'synced' ? '84' : '--'}
            </span>
            <span className={`text-[10px] font-bold tracking-wider mt-2 uppercase transition-opacity duration-1000 ${syncState === 'synced' ? 'text-tertiary opacity-100' : 'opacity-0'}`}>
              Excellent Recovery
            </span>
          </div>
          <svg className="w-full h-full -rotate-90 transform pointer-events-none" viewBox="0 0 100 100">
             <circle className="text-black/5" cx="50" cy="50" fill="transparent" r="42" strokeWidth="8" stroke="currentColor"></circle>
             <circle
                className="text-tertiary shadow-[0_0_12px_rgba(124,58,237,0.5)] transition-all ease-out"
                style={{ transitionDuration: '2000ms' }}
                cx="50" cy="50" fill="transparent" r="42"
                strokeDasharray="264"
                strokeDashoffset={syncState === 'synced' ? 42 : 264}
                strokeLinecap="round" strokeWidth="8" stroke="currentColor"
             ></circle>
          </svg>
        </div>
        <p className={`mt-8 text-on-surface-variant text-center max-w-[280px] text-xs leading-relaxed font-medium transition-opacity duration-1000 ${syncState === 'synced' ? 'opacity-100' : 'opacity-0'}`}>
            Your neural recovery peaked at 3:14 AM. Focus readiness is high for the day ahead.
        </p>
      </section>

      {/* --- SLEEP ARCHITECTURE SECTION --- */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold text-on-surface">Sleep Architecture</h2>
          <span className={`text-[10px] font-bold text-on-surface-variant tracking-wider uppercase transition-all duration-500 ${syncState === 'synced' ? 'opacity-100' : 'opacity-0'} ${activeStage ? 'text-primary' : ''}`}>
            {activeStage ? stageTimes[activeStage] : '7h 42m Total'}
          </span>
        </div>

        {/* Dynamic Segmented Progress Bar */}
        <div className="w-full h-12 flex rounded-2xl overflow-hidden neo-inset p-1.5 gap-1.5">
          <div className={`h-full bg-primary/80 rounded-xl transition-all ease-out ${activeStage && activeStage !== 'rem' ? 'opacity-20' : 'opacity-100'}`} style={{ width: syncState === 'synced' ? '15%' : '0%', transitionDuration: '1000ms', transitionDelay: syncState === 'synced' ? '300ms' : '0ms' }} />
          <div className={`h-full bg-tertiary/90 rounded-xl transition-all ease-out shadow-[0_0_8px_rgba(124,58,237,0.5)] z-10 ${activeStage === 'light' ? 'scale-y-110' : activeStage && activeStage !== 'light' ? 'opacity-20' : 'scale-y-110'}`} style={{ width: syncState === 'synced' ? '55%' : '0%', transitionDuration: '1200ms', transitionDelay: syncState === 'synced' ? '500ms' : '0ms' }} />
          <div className={`h-full bg-indigo-900/80 rounded-xl transition-all ease-out ${activeStage && activeStage !== 'deep' ? 'opacity-20' : 'opacity-100'}`} style={{ width: syncState === 'synced' ? '25%' : '0%', transitionDuration: '1000ms', transitionDelay: syncState === 'synced' ? '700ms' : '0ms' }} />
          <div className={`h-full bg-black/10 rounded-xl transition-all ease-out ${activeStage && activeStage !== 'awake' ? 'opacity-20' : 'opacity-100'}`} style={{ width: syncState === 'synced' ? '5%' : '0%', transitionDuration: '800ms', transitionDelay: syncState === 'synced' ? '900ms' : '0ms' }} />
        </div>

        {/* Interactive Cards */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => syncState === 'synced' && setActiveStage(activeStage === 'awake' ? null : 'awake')}
            className={`neo-raised p-5 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all duration-300 outline-none
              ${syncState === 'synced' ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'}
              ${activeStage === 'awake' ? 'ring-2 ring-on-surface-variant/30 scale-105' : activeStage ? 'opacity-40 scale-95' : ''}
            `}
          >
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Awake</span>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-1000 ${syncState === 'synced' ? 'text-on-surface' : 'text-on-surface-variant/30'}`}>
              {syncState === 'synced' ? '12m' : '--'}
            </span>
          </button>

          <button
            onClick={() => syncState === 'synced' && setActiveStage(activeStage === 'rem' ? null : 'rem')}
            className={`neo-raised p-5 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all duration-300 outline-none
              ${syncState === 'synced' ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'}
              ${activeStage === 'rem' ? 'ring-2 ring-primary scale-105' : activeStage ? 'opacity-40 scale-95' : ''}
            `}
          >
            <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-1000 ${syncState === 'synced' ? 'text-primary' : 'text-on-surface-variant'}`}>REM</span>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-1000 ${syncState === 'synced' ? 'text-on-surface' : 'text-on-surface-variant/30'}`}>
              {syncState === 'synced' ? '1h 15m' : '--'}
            </span>
          </button>

          <button
            onClick={() => syncState === 'synced' && setActiveStage(activeStage === 'light' ? null : 'light')}
            className={`neo-raised p-5 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all duration-300 outline-none
              ${syncState === 'synced' ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'}
              ${activeStage === 'light' ? 'ring-2 ring-tertiary scale-105' : activeStage ? 'opacity-40 scale-95' : ''}
            `}
          >
            <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-1000 ${syncState === 'synced' ? 'text-tertiary' : 'text-on-surface-variant'}`}>Light</span>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-1000 ${syncState === 'synced' ? 'text-on-surface' : 'text-on-surface-variant/30'}`}>
              {syncState === 'synced' ? '4h 22m' : '--'}
            </span>
          </button>

          <button
            onClick={() => syncState === 'synced' && setActiveStage(activeStage === 'deep' ? null : 'deep')}
            className={`neo-raised p-5 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all duration-300 outline-none
              ${syncState === 'synced' ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'}
              ${activeStage === 'deep' ? 'ring-2 ring-indigo-900 scale-105' : activeStage ? 'opacity-40 scale-95' : ''}
            `}
          >
            <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-1000 ${syncState === 'synced' ? 'text-indigo-900' : 'text-on-surface-variant'}`}>Deep</span>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-1000 ${syncState === 'synced' ? 'text-on-surface' : 'text-on-surface-variant/30'}`}>
              {syncState === 'synced' ? '1h 53m' : '--'}
            </span>
          </button>
        </div>
      </section>

      {/* --- NIGHTLY HRV CHART --- */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold text-on-surface">Nightly HRV</h2>
          <span className={`text-[10px] font-bold tracking-wider text-primary uppercase bg-primary/10 px-2 py-1 rounded-md transition-opacity duration-1000 delay-500 ${syncState === 'synced' ? 'opacity-100' : 'opacity-0'}`}>
            Avg 68 ms
          </span>
        </div>
        <div className="neo-raised p-6 rounded-3xl space-y-6">
          <div className="h-32 flex items-end justify-between gap-1.5 px-2">
             {[40, 55, 70, 85, 65, 90, 75, 60, 45, 35].map((h, i) => (
                <div
                  key={i}
                  className="w-full rounded-t-full transition-all ease-out"
                  style={{
                    height: syncState === 'synced' ? `${h}%` : '0%',
                    backgroundColor: h > 55 ? 'var(--color-primary)' : 'rgba(0,0,0,0.05)',
                    boxShadow: h > 55 ? '0 0 8px rgba(99,102,241,0.4)' : 'none',
                    opacity: getBarOpacity(i),
                    transitionDuration: '1500ms',
                    transitionDelay: syncState === 'synced' ? `${i * 100}ms` : '0ms'
                  }}
                />
             ))}
          </div>
          <div className="flex justify-between px-2 text-[9px] font-bold tracking-widest text-on-surface-variant uppercase">
            <span>11 PM</span>
            <span>2 AM</span>
            <span>5 AM</span>
            <span>7 AM</span>
          </div>
        </div>
      </section>

      {/* --- NEW: AI MORNING READINESS BRIEF --- */}
      <section className={`space-y-4 transition-all duration-1000 delay-1000 ${syncState === 'synced' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <div className="flex items-center justify-between px-1">
          <h3 className="font-semibold text-on-surface">Morning Readiness</h3>
          <button
            onClick={generateMorningBrief}
            disabled={isGenerating || aiBrief !== null}
            className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${aiBrief ? 'bg-black/5 text-on-surface-variant neo-inset cursor-default' : 'bg-tertiary/10 text-tertiary neo-raised active:scale-95'}`}
          >
            {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {isGenerating ? 'ANALYZING...' : aiBrief ? 'ANALYZED' : 'ASK GEMINI'}
          </button>
        </div>

        {aiBrief && (
          <div className="neo-raised rounded-2xl p-5 bg-background border-l-4 border-tertiary animate-in fade-in slide-in-from-bottom-2">
            <p className="text-xs text-on-surface-variant leading-relaxed italic">
              "{aiBrief}"
            </p>
          </div>
        )}
      </section>

      {/* --- EXISTING: STATIC INSIGHT CARDS --- */}
      <section className={`space-y-4 transition-all duration-1000 delay-1000 ${syncState === 'synced' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <div className="neo-raised p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl neo-inset">
              <FocusIcon className="text-primary" size={24} />
            </div>
            <h3 className="font-semibold text-sm">Focus Correlation</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
              Higher Deep sleep correlates with your 92% Focus score yesterday. Maintain this rhythm for peak cognitive performance.
          </p>
        </div>

        <div className="neo-raised p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl neo-inset">
              <HeartPulse className="text-tertiary" size={24} />
            </div>
            <h3 className="font-semibold text-sm">Stress Resilience</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
              Your HRV stayed stable during REM cycles, suggesting high emotional resilience to recent stressors.
          </p>
        </div>
      </section>

    </div>
  );
};

export default Sleep;
import { GoogleGenAI } from '@google/genai';
import { Activity, Play, Wind, Sparkles, HeartPulse, Scale, ChevronRight, Loader2, Bluetooth, Battery, Terminal } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface Props {
  onNavigate?: (tab: string) => void;
}

const Dashboard: React.FC<Props> = ({ onNavigate }) => {
  // Hardware Connection & Dev Mode States
  const [isHardwareConnected, setIsHardwareConnected] = useState(true);
  const [isDevMode, setIsDevMode] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);

  // Neural Readiness State
  const [readinessScore, setReadinessScore] = useState(82);

  // AI Insights State
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulate hardware data polling and raw telemetry logs
  useEffect(() => {
    if (!isHardwareConnected) return;

    const interval = setInterval(() => {
      // Fluctuate readiness score
      setReadinessScore(prev => Math.min(100, Math.max(60, prev + (Math.floor(Math.random() * 5) - 2))));

      // Generate realistic mock serial data from an "Arduino Uno"
      const timestamp = new Date().toISOString().split('T')[1].slice(0,8);
      const mockPPG = Math.floor(Math.random() * 15 + 65);
      const mockGSR = Math.floor(Math.random() * 200 + 300);
      const mockIMU = (Math.random() * 0.5 - 0.25).toFixed(2);
      const newLog = `> [${timestamp}] UNO_TX: PPG=${mockPPG} | GSR=${mockGSR}Ω | IMU_Z=${mockIMU}g`;

      setTelemetryLogs(prev => [newLog, ...prev].slice(0, 5)); // Keep the last 5 logs for the terminal
    }, 2000); // Updates every 2 seconds for a realistic data stream feel

    return () => clearInterval(interval);
  }, [isHardwareConnected]);

  const generateInsight = async () => {
    setIsAnalyzing(true);
    try {
      if (!process.env.GEMINI_API_KEY) {
        setTimeout(() => {
          setAiInsight("Your Heart Rate Variability is stabilizing after yesterday's high cognitive load. You are in a prime state for deep work. Consider a 45-minute focus session before lunch.");
          setIsAnalyzing(false);
        }, 1500);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze this user vitals data: Stress Level Low (24%), Stability 94%, Current Neural Readiness ${readinessScore}. Write a short, two-sentence encouraging daily insight for optimal cognitive performance. Keep it scientific but accessible.`
      });

      setAiInsight(response.text);
    } catch (error) {
      console.error("AI Generation Error:", error);
      setAiInsight("Your neural metrics are optimal today. Your physiological state is primed for deep cognitive work.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-6 pb-32 space-y-6 animate-in fade-in zoom-in duration-500">

      {/* Hardware Connection Status Badge */}
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Hello, Aritra</h2>
        </div>
        <button
          onClick={() => setIsHardwareConnected(!isHardwareConnected)}
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${
            isHardwareConnected
              ? 'bg-emerald-500/10 text-emerald-600 neo-inset'
              : 'bg-red-500/10 text-red-500 neo-raised'
          }`}
        >
          <div className="relative flex items-center justify-center">
            {isHardwareConnected && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-40 animate-ping"></span>
            )}
            <Bluetooth size={14} className={isHardwareConnected ? 'text-emerald-600' : 'text-red-500'} />
          </div>
          {isHardwareConnected ? 'Uno Linked' : 'Uno Offline'}
        </button>
      </section>

      {/* Wearable Battery & Sensor Health Pill */}
      <section className={`transition-all duration-500 ${!isHardwareConnected && 'opacity-60'}`}>
        <div className="mx-auto w-full max-w-[280px] h-12 rounded-full neo-inset p-1.5 flex items-center justify-between">
          <div className={`flex items-center gap-1.5 px-3 h-full rounded-full transition-colors ${isHardwareConnected ? 'neo-raised text-emerald-500' : 'bg-transparent text-on-surface-variant'}`}>
            <Battery size={14} />
            <span className="text-[11px] font-bold">{isHardwareConnected ? '88%' : '--'}</span>
          </div>
          <div className="flex items-center gap-3 px-4">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isHardwareConnected ? 'bg-primary animate-pulse shadow-[0_0_4px_rgba(99,102,241,0.8)]' : 'bg-red-500'}`}></span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">PPG</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isHardwareConnected ? 'bg-tertiary animate-pulse shadow-[0_0_4px_rgba(236,72,153,0.8)]' : 'bg-red-500'}`}></span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">GSR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isHardwareConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`}></span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">IMU</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section: Neural Readiness Score */}
      <section className="flex flex-col items-center justify-center py-2">
        <div className={`relative w-64 h-64 rounded-full flex items-center justify-center transition-all duration-500 ${isHardwareConnected ? 'neo-raised' : 'neo-inset opacity-60'}`}>
          <div className="w-48 h-48 rounded-full neo-inset flex flex-col items-center justify-center z-10">
            <span className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">Neural Readiness</span>
            <span className={`text-6xl font-bold py-1 tracking-tighter ${isHardwareConnected ? 'text-primary' : 'text-on-surface-variant'}`}>
              {isHardwareConnected ? readinessScore : '--'}
            </span>
            <span className={`text-[10px] font-medium px-3 py-1 rounded-full mt-1 ${isHardwareConnected ? 'text-primary bg-primary/10' : 'text-red-500 bg-red-500/10'}`}>
              {isHardwareConnected ? 'Optimal State' : 'Sensor Disconnected'}
            </span>
          </div>
          <svg className={`absolute inset-0 w-full h-full -rotate-90 pointer-events-none transition-all duration-1000 ${!isHardwareConnected && 'opacity-0'}`} viewBox="0 0 256 256">
            <circle cx="128" cy="128" fill="transparent" r="108" stroke="rgba(0,0,0,0.03)" strokeWidth="12" />
            <circle
              cx="128"
              cy="128"
              fill="transparent"
              r="108"
              stroke="#6366f1"
              strokeDasharray="678"
              strokeDashoffset={678 - (678 * readinessScore) / 100}
              strokeLinecap="round"
              strokeWidth="12"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
        </div>
      </section>

      {/* Primary Action Section */}
      <section className="space-y-4 pt-2">
        <button onClick={() => onNavigate?.('focus')} className="w-full neo-raised neo-pressed rounded-2xl p-6 flex items-center justify-between group transition-all duration-300">
          <div className="text-left">
            <h3 className="text-xl font-semibold text-on-surface">Start Focus Session</h3>
            <p className="text-sm text-on-surface-variant mt-1">Activate deep work neural protocol</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Play fill="currentColor" size={24} className="translate-x-0.5" />
          </div>
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => onNavigate?.('focus')} className="neo-raised neo-pressed rounded-2xl flex flex-col items-center justify-center p-5 space-y-2">
            <Activity className="text-primary" size={24} />
            <span className="text-xs font-medium text-on-surface">Deep Focus</span>
          </button>
          <button onClick={() => onNavigate?.('stress')} className="neo-raised neo-pressed rounded-2xl flex flex-col items-center justify-center p-5 space-y-2">
            <Wind className="text-tertiary" size={24} />
            <span className="text-xs font-medium text-on-surface">Coherence</span>
          </button>
        </div>
      </section>

      {/* Live Neural Flow Chart with Developer Mode Toggle */}
      <section className="neo-raised bg-background rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                {isDevMode ? 'Raw Telemetry (COM3)' : 'Live Neural Flow'}
              </p>
              <span className={`flex h-2 w-2 rounded-full ${isHardwareConnected ? 'bg-primary animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-red-500'}`} />
            </div>

            {/* Dev Mode Toggle Button */}
            <button
              onClick={() => setIsDevMode(!isDevMode)}
              className={`p-1.5 rounded-lg transition-colors ${isDevMode ? 'bg-primary/20 text-primary' : 'bg-black/5 text-on-surface-variant hover:text-primary'}`}
              title="Toggle Developer Telemetry"
            >
              <Terminal size={14} />
            </button>
          </div>

          <div className="h-24 w-full flex items-center justify-center overflow-hidden rounded-xl">
            {!isHardwareConnected ? (
              <div className="w-full h-0.5 bg-red-500/50 rounded-full"></div>
            ) : isDevMode ? (
              // Developer Console View
              <div className="w-full h-full bg-slate-900 rounded-lg p-2 overflow-hidden flex flex-col-reverse font-mono text-[9px] text-emerald-400 leading-tight">
                {telemetryLogs.map((log, index) => (
                  <div key={index} className="opacity-80 hover:opacity-100">{log}</div>
                ))}
              </div>
            ) : (
              // Standard Wave View
              <svg className="w-[200%] h-full stroke-primary stroke-[3px] fill-none" viewBox="0 0 400 60" preserveAspectRatio="none">
                <path className="animate-[wave-slide_3s_linear_infinite]" d="M0,30 C20,10 30,50 50,30 C70,10 80,50 100,30 C120,10 130,50 150,30 C170,10 180,50 200,30 C220,10 230,50 250,30 C270,10 280,50 300,30 C320,10 330,50 350,30 C370,10 380,50 400,30" strokeLinecap="round" />
                <path className="animate-[wave-slide-reverse_4s_linear_infinite]" d="M0,35 C20,15 30,55 50,35 C70,15 80,55 100,35 C120,15 130,55 150,35 C170,15 180,55 200,35 C220,15 230,55 250,35 C270,15 280,55 300,35 C320,15 330,55 350,35 C370,15 380,55 400,35" stroke="#7c3aed" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
              </svg>
            )}
          </div>

          <div className="flex justify-between text-[10px] text-on-surface-variant font-medium mt-4">
            <span>{isDevMode ? 'RX/TX Active' : 'Alpha Waves'}</span>
            <span>{isDevMode ? 'Baud: 9600' : 'Gamma Waves'}</span>
          </div>
        </div>
      </section>

      {/* AI Daily Insights Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-semibold text-on-surface">Gemini Insights</h3>
          <button
            onClick={generateInsight}
            disabled={isAnalyzing || !isHardwareConnected}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-transform ${isHardwareConnected ? 'text-tertiary bg-tertiary/10 active:scale-95' : 'text-on-surface-variant bg-black/5 opacity-50 cursor-not-allowed'}`}
          >
            {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </button>
        </div>

        <div className="space-y-4">
          {aiInsight ? (
            <div className="neo-raised rounded-2xl p-5 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/10 rounded-full blur-xl pointer-events-none"></div>
              <p className="text-sm text-on-surface-variant leading-relaxed relative z-10">
                {aiInsight}
              </p>
            </div>
          ) : (
             <div className="neo-raised rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.8)] transition-shadow">
               <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 neo-inset">
                 <img
                   src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=150&q=80"
                   alt="Water drop"
                   className="w-full h-full object-cover opacity-80"
                 />
               </div>
               <div className="flex-1">
                 <h4 className="text-sm font-semibold text-on-surface">Morning Peak detected</h4>
                 <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">Neural clarity peaked at 9:15 AM today. Optimal for complex problem solving.</p>
               </div>
               <div className="w-8 h-8 rounded-full neo-raised flex items-center justify-center text-primary shrink-0">
                 <ChevronRight size={16} />
               </div>
             </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes wave-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100px); }
        }
        @keyframes wave-slide-reverse {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
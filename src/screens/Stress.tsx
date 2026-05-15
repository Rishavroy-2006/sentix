import { Wind, Info, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const Stress: React.FC = () => {
  const [bars, setBars] = useState([40, 60, 85, 55, 70, 90, 45, 30, 65, 80, 95, 60]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathText, setBreathText] = useState('Inhale');

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => prev.map(h => Math.max(20, Math.min(100, h + (Math.random() * 20 - 10)))));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isBreathing) return;
    
    let isMounted = true;
    const runCycle = () => {
        if(!isMounted) return;
        setBreathText('Inhale');
        setTimeout(() => {
            if(!isMounted) return;
            setBreathText('Hold');
            setTimeout(() => {
                if(!isMounted) return;
                setBreathText('Exhale');
            }, 2000);
        }, 4000);
    };

    runCycle();
    const interval = setInterval(runCycle, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    }
  }, [isBreathing]);

  return (
    <div className="max-w-md mx-auto px-6 py-6 pb-32 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Top Score Card */}
      <section className="neo-raised rounded-3xl p-8 flex flex-col items-center justify-center space-y-6 text-center">
        <div className="relative w-48 h-48 flex items-center justify-center rounded-full neo-inset">
          <div className="absolute inset-4 rounded-full neo-raised flex flex-col items-center justify-center bg-background z-10">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">State</span>
            <span className="text-5xl font-extrabold text-primary">84</span>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">Very Calm</span>
          </div>
          <svg className="w-full h-full transform -rotate-90 pointer-events-none">
            <circle cx="96" cy="96" fill="transparent" r="80" stroke="rgba(0,0,0,0.03)" strokeWidth="12" />
            <circle
              className="text-primary rounded-full transition-all duration-1000"
              cx="96" cy="96" fill="transparent" r="80"
              stroke="currentColor" strokeDasharray="502" strokeDashoffset="80" strokeWidth="12" strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-on-surface">Daily Stress Resilience</h2>
          <p className="text-xs text-on-surface-variant mt-2 max-w-[250px] mx-auto leading-relaxed">
            You're performing 12% better than average today.
          </p>
        </div>
      </section>

      {/* Breathe to Focus Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-semibold text-on-surface">Breathe to Focus</h3>
          <span className="text-[11px] text-primary font-bold tracking-wide">10 Min Session</span>
        </div>
        
        {!isBreathing ? (
          <div className="neo-raised rounded-2xl p-5 bg-background flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl neo-inset flex items-center justify-center">
                <Wind className="text-tertiary" size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold">Guided Coherence</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Sync heart rate with breath</p>
              </div>
            </div>
            <button 
              onClick={() => setIsBreathing(true)}
              className="neo-raised neo-pressed bg-background px-5 py-2.5 rounded-xl text-primary font-semibold text-xs tracking-wide transition-all"
            >
              Start
            </button>
          </div>
        ) : (
          <div className="neo-raised rounded-2xl p-8 bg-background flex flex-col items-center justify-center relative overflow-hidden h-48 animate-in fade-in zoom-in duration-300">
             <button onClick={() => setIsBreathing(false)} className="absolute top-4 right-4 text-on-surface-variant z-20 hover:text-primary transition-colors">
               <X size={20} />
             </button>
             <div className="w-24 h-24 rounded-full bg-primary/10 absolute animate-[breathe-glow_10s_ease-in-out_infinite]" />
             <div className="w-16 h-16 rounded-full bg-primary/20 absolute animate-[breathe_10s_ease-in-out_infinite]" />
             <div className="w-8 h-8 rounded-full bg-primary absolute shadow-[0_0_20px_rgba(99,102,241,0.5)] animate-[breathe-core_10s_ease-in-out_infinite]" />
             <p className="absolute bottom-4 text-[10px] font-bold text-primary tracking-widest uppercase transition-opacity duration-500">{breathText}</p>
             
             <style>{`
                @keyframes breathe {
                   0%, 100% { transform: scale(1); }
                   40%, 60% { transform: scale(3.5); }
                }
                @keyframes breathe-glow {
                   0%, 100% { transform: scale(1); opacity: 0.5; }
                   40%, 60% { transform: scale(3); opacity: 1; }
                }
                @keyframes breathe-core {
                   0%, 100% { transform: scale(1); }
                   40%, 60% { transform: scale(1.5); }
                }
             `}</style>
          </div>
        )}
      </section>

      {/* Live Alpha Waves Chart Area */}
      <section className="space-y-4">
        <h3 className="font-semibold px-1">Live Alpha Waves</h3>
        <div className="neo-raised rounded-2xl p-6 bg-background space-y-4">
          <div className="h-28 flex items-end justify-between gap-1.5 px-2">
            {bars.map((height, i) => (
              <div 
                key={i} 
                className={`w-full rounded-t-full neo-raised transition-all duration-500 ease-in-out`}
                style={{ 
                  height: `${height}%`,
                  backgroundColor: i === 10 ? 'var(--color-primary)' : 'rgba(99, 102, 241, 0.2)'
                }} 
              />
            ))}
          </div>
          <div className="flex justify-between items-center text-[9px] text-on-surface-variant font-bold tracking-widest pt-2">
            <span>8HZ</span>
            <span className="text-primary bg-primary/10 px-2 py-1 rounded-md">CURRENT: 11.4HZ</span>
            <span>12HZ</span>
          </div>
        </div>
      </section>

      {/* Stress Resilience Stats Grid */}
      <section className="space-y-4">
        <h3 className="font-semibold px-1">Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="neo-raised rounded-2xl p-5">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Average</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-on-surface tracking-tighter">72</span>
              <span className="text-[10px] font-medium text-on-surface-variant">bpm</span>
            </div>
          </div>
          <div className="neo-raised rounded-2xl p-5">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Peak</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-red-500 tracking-tighter">104</span>
              <span className="text-[10px] font-medium text-on-surface-variant">bpm</span>
            </div>
          </div>
          <div className="neo-raised rounded-2xl p-5">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Calm Time</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-tertiary tracking-tighter">6.4</span>
              <span className="text-[10px] font-medium text-on-surface-variant">hrs</span>
            </div>
          </div>
          <div className="neo-raised rounded-2xl p-5">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Recovery</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold text-primary">High</span>
            </div>
          </div>
        </div>
      </section>

      {/* 24h Trend Line */}
      <section className="neo-raised rounded-2xl p-6 bg-background space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">24h Heart Rate Variability</h4>
          <Info size={16} className="text-on-surface-variant" />
        </div>
        <div className="h-28 w-full relative">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 100">
            <defs>
              <linearGradient id="hrvGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <path d="M0,80 Q30,70 60,85 T120,60 T180,75 T240,40 T300,55 V100 H0 Z" fill="url(#hrvGrad)" />
            <path d="M0,80 Q30,70 60,85 T120,60 T180,75 T240,40 T300,55" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex justify-between text-[10px] font-bold text-on-surface-variant tracking-widest pt-2">
          <span>12 AM</span>
          <span>8 AM</span>
          <span>4 PM</span>
          <span>NOW</span>
        </div>
      </section>
      
    </div>
  );
};

export default Stress;

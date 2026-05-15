import { Focus as FocusIcon, HeartPulse } from 'lucide-react';
import React from 'react';

const Sleep: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-6 py-6 pb-32 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Last Night's Recovery Section */}
      <section className="flex flex-col items-center">
        <div className="relative w-64 h-64 flex items-center justify-center rounded-full neo-raised">
          <div className="absolute inset-4 rounded-full neo-inset flex flex-col items-center justify-center z-10">
            <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">Sleep Score</span>
            <span className="text-6xl font-bold text-primary tracking-tighter">84</span>
            <span className="text-[10px] font-bold tracking-wider text-tertiary mt-2 uppercase">Excellent Recovery</span>
          </div>
          <svg className="w-full h-full -rotate-90 transform pointer-events-none" viewBox="0 0 100 100">
             <circle className="text-black/5" cx="50" cy="50" fill="transparent" r="42" strokeWidth="8" stroke="currentColor"></circle>
             <circle 
                className="text-tertiary shadow-[0_0_12px_rgba(124,58,237,0.5)]" 
                cx="50" cy="50" fill="transparent" r="42" 
                strokeDasharray="264" strokeDashoffset="42" strokeLinecap="round" strokeWidth="8" stroke="currentColor"
             ></circle>
          </svg>
        </div>
        <p className="mt-8 text-on-surface-variant text-center max-w-[280px] text-xs leading-relaxed font-medium">
            Your neural recovery peaked at 3:14 AM. Focus readiness is high for the day ahead.
        </p>
      </section>

      {/* Sleep Architecture Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold text-on-surface">Sleep Architecture</h2>
          <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">7h 42m Total</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-12 flex rounded-2xl overflow-hidden neo-inset p-1.5 gap-1.5">
          <div className="h-full bg-primary/80 rounded-xl transition-all" style={{ width: '15%' }} />
          <div className="h-full bg-tertiary/90 rounded-xl transition-all shadow-[0_0_8px_rgba(124,58,237,0.5)] z-10 scale-y-110" style={{ width: '55%' }} />
          <div className="h-full bg-indigo-900/80 rounded-xl transition-all" style={{ width: '25%' }} />
          <div className="h-full bg-black/10 rounded-xl transition-all" style={{ width: '5%' }} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="neo-raised p-5 rounded-2xl flex flex-col items-center justify-center space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Awake</span>
            <span className="text-xl font-bold text-on-surface tracking-tight">12m</span>
          </div>
          <div className="neo-raised p-5 rounded-2xl flex flex-col items-center justify-center space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">REM</span>
            <span className="text-xl font-bold text-on-surface tracking-tight">1h 15m</span>
          </div>
          <div className="neo-raised p-5 rounded-2xl flex flex-col items-center justify-center space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-tertiary font-bold">Light</span>
            <span className="text-xl font-bold text-on-surface tracking-tight">4h 22m</span>
          </div>
          <div className="neo-raised p-5 rounded-2xl flex flex-col items-center justify-center space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-indigo-900 font-bold">Deep</span>
            <span className="text-xl font-bold text-on-surface tracking-tight">1h 53m</span>
          </div>
        </div>
      </section>

      {/* Insight Cards */}
      <section className="space-y-4">
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

      {/* Nightly HRV Chart */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold text-on-surface">Nightly HRV</h2>
          <span className="text-[10px] font-bold tracking-wider text-primary uppercase bg-primary/10 px-2 py-1 rounded-md">Avg 68 ms</span>
        </div>
        <div className="neo-raised p-6 rounded-3xl space-y-6">
          <div className="h-32 flex items-end justify-between gap-1.5 px-2">
             {[40, 55, 70, 85, 65, 90, 75, 60, 45, 35].map((h, i) => (
                <div 
                  key={i} 
                  className="w-full rounded-t-full transition-all duration-500 ease-in-out"
                  style={{
                    height: `${h}%`,
                    backgroundColor: h > 55 ? 'var(--color-primary)' : 'rgba(0,0,0,0.05)',
                    boxShadow: h > 55 ? '0 0 8px rgba(99,102,241,0.4)' : 'none'
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

    </div>
  );
};

export default Sleep;

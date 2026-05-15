import { Activity, Play, SlidersHorizontal, History, HeartPulse, Scale, ChevronRight } from 'lucide-react';
import React from 'react';

interface Props {
  onNavigate?: (tab: string) => void;
}

const Dashboard: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="max-w-md mx-auto px-6 py-6 pb-32 space-y-8 animate-in fade-in zoom-in duration-500">
      
      {/* Hero Section: Central Focus Ring */}
      <section className="flex flex-col items-center justify-center py-4">
        <div className="relative w-64 h-64 rounded-full neo-raised flex items-center justify-center">
          <div className="w-48 h-48 rounded-full neo-inset flex flex-col items-center justify-center z-10">
            <span className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">Focus Score</span>
            <span className="text-6xl font-bold text-primary py-1 tracking-tighter">82</span>
            <span className="text-[10px] font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mt-1">
              +4% vs yesterday
            </span>
          </div>
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 256 256">
            <circle cx="128" cy="128" fill="transparent" r="108" stroke="rgba(0,0,0,0.03)" strokeWidth="12" />
            <circle
              cx="128"
              cy="128"
              fill="transparent"
              r="108"
              stroke="#6366f1"
              strokeDasharray="678"
              strokeDashoffset="122"
              strokeLinecap="round"
              strokeWidth="12"
            />
          </svg>
        </div>
      </section>

      {/* Primary Action Section */}
      <section className="space-y-4">
        <button onClick={() => onNavigate?.('focus')} className="w-full neo-raised neo-pressed rounded-2xl p-6 flex items-center justify-between group transition-all duration-300">
          <div className="text-left">
            <h3 className="text-xl font-semibold text-on-surface">Start Focus Session</h3>
            <p className="text-sm text-on-surface-variant mt-1">Activate deep work neural protocol</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Play fill="currentColor" size={24} />
          </div>
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button className="neo-raised neo-pressed rounded-2xl flex flex-col items-center justify-center p-5 space-y-2">
            <SlidersHorizontal className="text-tertiary" size={24} />
            <span className="text-xs font-medium text-on-surface">Calibrate</span>
          </button>
          <button className="neo-raised neo-pressed rounded-2xl flex flex-col items-center justify-center p-5 space-y-2">
            <History className="text-on-surface-variant" size={24} />
            <span className="text-xs font-medium text-on-surface">History</span>
          </button>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="grid grid-cols-2 gap-4">
        {/* Stress Card */}
        <div className="neo-raised rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Stress Level</p>
              <h4 className="text-2xl font-semibold text-on-surface mt-1">Low</h4>
            </div>
            <div className="bg-primary/10 p-2 rounded-xl">
              <HeartPulse className="text-primary" size={20} />
            </div>
          </div>
          <div>
            <div className="h-2 w-full neo-inset rounded-full overflow-hidden mb-2">
              <div className="h-full bg-primary rounded-full shadow-inner" style={{ width: '24%' }} />
            </div>
            <p className="text-[10px] text-on-surface-variant">24% of daily neural threshold</p>
          </div>
        </div>

        {/* Stability Card */}
        <div className="neo-raised rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Stability</p>
              <h4 className="text-2xl font-semibold text-on-surface mt-1">94%</h4>
            </div>
            <div className="bg-tertiary/10 p-2 rounded-xl">
              <Scale className="text-tertiary" size={20} />
            </div>
          </div>
          <div>
            <div className="flex items-end gap-1 h-8 mb-2">
              <div className="w-full bg-tertiary/20 h-4 rounded-sm" />
              <div className="w-full bg-tertiary/20 h-6 rounded-sm" />
              <div className="w-full bg-tertiary/20 h-3 rounded-sm" />
              <div className="w-full bg-tertiary/20 h-8 rounded-sm" />
              <div className="w-full bg-tertiary h-7 rounded-sm shadow-sm" />
            </div>
            <p className="text-[10px] text-on-surface-variant">Consistent flow across 3h</p>
          </div>
        </div>
      </section>

      {/* Live Neural Flow Chart */}
      <section className="neo-raised bg-background rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Live Neural Flow</p>
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          </div>
          <div className="h-24 w-full flex items-center justify-center overflow-hidden">
            <svg className="w-[200%] h-full stroke-primary stroke-[3px] fill-none" viewBox="0 0 400 60" preserveAspectRatio="none">
              <path className="animate-[wave-slide_3s_linear_infinite]" d="M0,30 C20,10 30,50 50,30 C70,10 80,50 100,30 C120,10 130,50 150,30 C170,10 180,50 200,30 C220,10 230,50 250,30 C270,10 280,50 300,30 C320,10 330,50 350,30 C370,10 380,50 400,30" strokeLinecap="round" />
              <path className="animate-[wave-slide-reverse_4s_linear_infinite]" d="M0,35 C20,15 30,55 50,35 C70,15 80,55 100,35 C120,15 130,55 150,35 C170,15 180,55 200,35 C220,15 230,55 250,35 C270,15 280,55 300,35 C320,15 330,55 350,35 C370,15 380,55 400,35" stroke="#7c3aed" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-on-surface-variant font-medium mt-4">
            <span>Alpha Waves</span>
            <span>Gamma Waves</span>
          </div>
        </div>
        <div className="absolute inset-0 neural-wave pointer-events-none" />
      </section>

      {/* Daily Insights Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-on-surface px-1">Daily Insights</h3>
        
        <div className="space-y-4">
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

          <div className="neo-raised rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.8)] transition-shadow">
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 neo-inset">
              <img 
                src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=150&q=80" 
                alt="Abstract waves"
                className="w-full h-full object-cover filter contrast-125 saturate-50"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-on-surface">Restorative Gap</h4>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">Focus declined after 2 hours. Consider a 10-minute NSDR session.</p>
            </div>
            <div className="w-8 h-8 rounded-full neo-raised flex items-center justify-center text-primary shrink-0">
              <ChevronRight size={16} />
            </div>
          </div>
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

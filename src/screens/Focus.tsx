import { Pause, RotateCcw, ActivitySquare, Trees, Rocket, Droplets, Play } from 'lucide-react';
import React, { useState, useEffect } from 'react';

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private nodes: AudioNode[] = [];
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  play(id: string) {
    this.stop();
    this.init();
    if (!this.ctx) return;

    if (id === 'white_noise') this.playWhiteNoise();
    if (id === 'forest') this.playForest();
    if (id === 'cosmos') this.playCosmos();
  }

  stop() {
    this.nodes.forEach(n => {
      try { if ('stop' in n) (n as any).stop(); } catch (e) {}
      try { n.disconnect(); } catch (e) {}
    });
    this.nodes = [];
  }

  private playWhiteNoise() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = 0.05;
    source.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    source.start();
    this.nodes.push(source, gainNode);
  }

  private playForest() {
    // Brown noise mimicking heavy rain/forest ambience
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    // Low pass filter to dull the harshness
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = 0.5;
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    source.start();
    this.nodes.push(source, filter, gainNode);
  }

  private playCosmos() {
    // Binaural beats (theta frequency approx)
    if (!this.ctx) return;
    const createDrone = (freq: number, vol: number) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const mainGain = this.ctx!.createGain();
        mainGain.gain.value = vol;
        osc.connect(mainGain);
        mainGain.connect(this.ctx!.destination);
        osc.start();
        this.nodes.push(osc, mainGain);
    };
    createDrone(110, 0.2);    // Base A2
    createDrone(116, 0.2);    // 6Hz interference beat
    createDrone(220, 0.1);    // Octave up for depth
  }
}

const engine = new SoundscapeEngine();

const Focus: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [focusPercentage, setFocusPercentage] = useState(92);

  useEffect(() => {
    return () => engine.stop();
  }, []);

  const togglePlay = (id: string) => {
    setIsPlaying(prev => {
      const isCurrentlyPlaying = !!prev[id];
      const newState: Record<string, boolean> = {};
      
      if (isCurrentlyPlaying) {
        engine.stop();
      } else {
        engine.play(id);
        newState[id] = true;
      }
      
      return newState;
    });
  };

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
     const interval = setInterval(() => {
        if(isTimerRunning) {
          setFocusPercentage(prev => Math.max(75, Math.min(100, Math.round(prev + (Math.random() * 6 - 3)))));
        }
     }, 2000);
     return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(25 * 60);
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="max-w-md mx-auto px-6 py-6 pb-32 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Timer Section */}
      <section className="flex flex-col items-center justify-center py-4">
        <div className="w-72 h-72 rounded-full neo-raised flex items-center justify-center relative shadow-[8px_8px_16px_rgba(0,0,0,0.08),-8px_-8px_16px_rgba(255,255,255,0.7)]">
          <div className="w-64 h-64 rounded-full neo-inset flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase mb-2">Deep Focus</span>
            <h2 className="text-6xl font-bold font-mono text-primary tracking-tighter" style={{ textShadow: '2px 2px 0px rgba(255,255,255,0.8), -1px -1px 0px rgba(0,0,0,0.05)' }}>
              {mins}:{secs}
            </h2>
            <div className="mt-6 flex gap-6">
              <button onClick={toggleTimer} className="neo-raised neo-pressed w-14 h-14 rounded-full flex items-center justify-center text-primary transition-all">
                {isTimerRunning ? <Pause size={24} className="fill-primary" /> : <Play size={24} className="fill-primary translate-x-0.5" />}
              </button>
              <button onClick={resetTimer} className="neo-raised neo-pressed w-14 h-14 rounded-full flex items-center justify-center text-on-surface-variant transition-all hover:text-primary">
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live EEG Focus Bar */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="font-semibold text-on-surface">Live EEG Focus</h3>
          <span className="text-primary font-semibold text-xs transition-all duration-500">{focusPercentage}% Optimal</span>
        </div>
        <div className="h-6 w-full rounded-full neo-inset p-1 flex items-center">
          <div className="h-full bg-primary rounded-full relative overflow-hidden transition-all duration-1000" style={{ width: `${focusPercentage}%` }}>
             <div className="absolute inset-0 bg-white/20 w-1/2 skew-x-12 translate-x-full animate-[shimmer_2s_infinite]" />
             <div className="absolute inset-0 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] rounded-full" />
          </div>
        </div>
      </section>

      {/* Neural Activity Card */}
      <section className="neo-raised rounded-2xl p-6 bg-background space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="neo-inset p-2 rounded-lg">
              <ActivitySquare className="text-tertiary" size={20} />
            </div>
            <h3 className="font-semibold text-on-surface">Neural Activity</h3>
          </div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Stable Alpha</span>
        </div>
        <div className="h-28 w-full neo-inset rounded-xl overflow-hidden flex items-center justify-center relative">
          <svg className="w-[200%] h-full stroke-primary stroke-[2.5px] fill-none opacity-80" preserveAspectRatio="none" viewBox="0 0 400 100">
            <path className={`${isTimerRunning ? 'animate-[wave-slide_2s_linear_infinite]' : ''}`} d="M0,50 Q25,30 50,50 T100,50 T150,50 T200,50 T250,50 T300,50 T350,50 T400,50 Q425,30 450,50 T500,50 T550,50 T600,50" />
            <path className={`${isTimerRunning ? 'animate-[wave-slide-reverse_3s_linear_infinite]' : ''} opacity-30 stroke-tertiary`} d="M0,50 Q25,40 50,50 T100,50 T150,50 T200,50 T250,50 T300,50 T350,50 T400,50 Q425,40 450,50 T500,50 T550,50 T600,50" strokeWidth="1.5" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>
      </section>

      {/* Focus Soundscapes List */}
      <section className="space-y-4">
        <h3 className="font-semibold text-on-surface px-1">Focus Soundscapes</h3>
        <div className="space-y-4">
          
          {/* Soundscape 1 */}
          <div className="flex items-center justify-between neo-raised p-4 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl neo-inset flex items-center justify-center text-primary">
                <Trees size={24} />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm text-on-surface">Emerald Forest</p>
                <p className="text-[10px] text-on-surface-variant font-medium">Ambient Rainfall • 12Hz</p>
              </div>
            </div>
            <button 
              onClick={() => togglePlay('forest')}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying['forest'] ? 'neo-inset text-tertiary' : 'neo-raised neo-pressed text-primary'}`}
            >
              {isPlaying['forest'] ? <Pause size={20} className="fill-tertiary" /> : <Play size={20} className="fill-primary translate-x-0.5" />}
            </button>
          </div>

          {/* Soundscape 2 */}
          <div className="flex items-center justify-between neo-raised p-4 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl neo-inset flex items-center justify-center text-tertiary">
                <Rocket size={24} />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm text-on-surface">Deep Cosmos</p>
                <p className="text-[10px] text-on-surface-variant font-medium">Binaural Beats • 10Hz</p>
              </div>
            </div>
            <button 
              onClick={() => togglePlay('cosmos')}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying['cosmos'] ? 'neo-inset text-tertiary' : 'neo-raised neo-pressed text-primary'}`}
            >
              {isPlaying['cosmos'] ? <Pause size={20} className="fill-tertiary" /> : <Play size={20} className="fill-primary translate-x-0.5" />}
            </button>
          </div>

          {/* Soundscape 3 */}
          <div className="flex items-center justify-between neo-raised p-4 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl neo-inset flex items-center justify-center text-on-surface-variant">
                <Droplets size={24} />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm text-on-surface">White Noise Pure</p>
                <p className="text-[10px] text-on-surface-variant font-medium">Static Flux • Mixed</p>
              </div>
            </div>
            <button 
              onClick={() => togglePlay('white_noise')}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying['white_noise'] ? 'neo-inset text-tertiary' : 'neo-raised neo-pressed text-primary'}`}
            >
               {isPlaying['white_noise'] ? <Pause size={20} className="fill-tertiary" /> : <Play size={20} className="fill-primary translate-x-0.5" />}
            </button>
          </div>
          
        </div>
      </section>

      {/* Session Stats */}
      <section className="grid grid-cols-2 gap-4 pb-4">
        <div className="neo-raised p-5 rounded-2xl text-center space-y-2">
          <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Session Total</span>
          <span className="block text-2xl font-bold text-primary">125 min</span>
        </div>
        <div className="neo-raised p-5 rounded-2xl text-center space-y-2">
          <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Peak Flow</span>
          <span className="block text-2xl font-bold text-tertiary">42 min</span>
        </div>
      </section>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(-100%); }
        }
        @keyframes wave-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-200px); }
        }
        @keyframes wave-slide-reverse {
          0% { transform: translateX(-200px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Focus;

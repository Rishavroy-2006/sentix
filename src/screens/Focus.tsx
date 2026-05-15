import { GoogleGenAI } from '@google/genai';
import {
  Pause, RotateCcw, ActivitySquare, Trees, Rocket, Droplets, Play,
  AlertTriangle, Smartphone, Activity, Sparkles, Loader2, ChevronRight
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

// --- UPGRADED: ADAPTIVE SOUNDSCAPE ENGINE ---
class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private nodes: AudioNode[] = [];
  private activeId: string | null = null;

  private activeFilter: BiquadFilterNode | null = null;
  private activeOscs: OscillatorNode[] = [];
  private activeGain: GainNode | null = null;

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
    this.activeId = id;

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
    this.activeFilter = null;
    this.activeOscs = [];
    this.activeGain = null;
    this.activeId = null;
  }

  updateStress(stressLevel: number) {
    if (!this.ctx || !this.activeId) return;

    const normalizedStress = Math.max(0, Math.min(100, stressLevel)) / 100;

    if (this.activeId === 'forest' && this.activeFilter) {
      const targetFreq = 400 + (normalizedStress * 1200);
      this.activeFilter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.5);
    }

    if (this.activeId === 'cosmos' && this.activeOscs.length >= 2) {
      const baseFreq = 110;
      const beatDiff = 2 + (normalizedStress * 12);
      this.activeOscs[1].frequency.setTargetAtTime(baseFreq + beatDiff, this.ctx.currentTime, 0.5);
    }

    if (this.activeId === 'white_noise' && this.activeGain) {
      const targetVolume = 0.02 + (normalizedStress * 0.06);
      this.activeGain.gain.setTargetAtTime(targetVolume, this.ctx.currentTime, 0.5);
    }
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
    this.activeGain = gainNode;
  }

  private playForest() {
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
    this.activeFilter = filter;
  }

  private playCosmos() {
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
        this.activeOscs.push(osc);
    };
    createDrone(110, 0.2);
    createDrone(116, 0.2);
    createDrone(220, 0.1);
  }
}

const engine = new SoundscapeEngine();

interface Props {
  onNavigate?: (tab: string) => void;
}

const Focus: React.FC<Props> = ({ onNavigate }) => {
  const TOTAL_TIME = 25 * 60;

  // Audio State
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});

  // Timer State
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Neural, Hardware & Distraction States
  const [flowState, setFlowState] = useState(0);
  const [stressLevel, setStressLevel] = useState(30);
  const [isDistracted, setIsDistracted] = useState(false);
  const [gracePeriod, setGracePeriod] = useState<number | null>(null);
  const [strikes, setStrikes] = useState(0);

  // --- NEW: AI Debrief State ---
  const [aiDebrief, setAiDebrief] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  // Distraction Grace Period Loop
  useEffect(() => {
    if (isDistracted && gracePeriod !== null && gracePeriod > 0) {
      const timer = setTimeout(() => setGracePeriod(gracePeriod - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isDistracted && gracePeriod === 0) {
      setFlowState(prev => Math.max(0, prev - 25));
      setStrikes(prev => prev + 1);
      setGracePeriod(null);
    }
  }, [isDistracted, gracePeriod]);

  // Neural Engine Loop (Spike & Decay)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning && !isDistracted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);

        const triggerSpike = Math.random() < 0.15;
        let nextStress;
        if (triggerSpike) {
          nextStress = Math.min(100, stressLevel + Math.floor(Math.random() * 20) + 25);
        } else {
          const cooling = (30 - stressLevel) * 0.25;
          const jitter = Math.floor(Math.random() * 5) - 2;
          nextStress = Math.max(10, stressLevel + cooling + jitter);
        }

        setStressLevel(nextStress);

        // Push live stress data to the audio engine
        engine.updateStress(nextStress);

        if (nextStress > 65) {
          setFlowState((prev) => Math.max(0, prev - 4));
        } else if (nextStress < 45) {
          setFlowState((prev) => Math.min(100, prev + 2.5));
        } else {
          setFlowState((prev) => Math.min(100, prev + 0.5));
        }

      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isDistracted, timeLeft, stressLevel]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(TOTAL_TIME);
    setFlowState(0);
    setStrikes(0);
    setAiDebrief(null); // Clear previous debrief
  };

  const triggerDistractionDemo = () => {
    if (isTimerRunning) {
      setIsDistracted(true);
      setGracePeriod(10);
    }
  };

  const dismissDistraction = () => {
    setIsDistracted(false);
    setGracePeriod(null);
  };

  // --- NEW: Post-Session Gemini Analysis Logic ---
  const generateSessionDebrief = async () => {
    setIsAnalyzing(true);

    // Format the data we collected during the run
    const sessionLengthMins = 25 - Math.floor(timeLeft / 60);
    const finalFlow = Math.floor(flowState);
    const totalStrikes = strikes;

    try {
      if (!process.env.GEMINI_API_KEY) {
        // Safe fallback for hackathon demo if API key isn't loaded
        setTimeout(() => {
          if (totalStrikes > 0) {
             setAiDebrief(`A solid ${sessionLengthMins}-minute session, but your flow state took a hit ending at ${finalFlow}%. The ${totalStrikes} physical distraction(s) detected by the IMU caused significant cognitive friction. Try a deep-breathing cycle before your next block.`);
          } else {
             setAiDebrief(`Outstanding focus! You maintained an unbroken ${sessionLengthMins}-minute block. Your flow state reached an impressive ${finalFlow}%, driven by steady alpha wave consistency. You are clear for continued deep work.`);
          }
          setIsAnalyzing(false);
        }, 1500);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const promptText = `Write a short, analytical two-sentence debrief for a user who just finished a study session.
      Session Length: ${sessionLengthMins} minutes.
      Final Flow State Score: ${finalFlow}%.
      Physical Distractions (Phone Pickups): ${totalStrikes}.
      Keep the tone clinical but encouraging. Mention the data points.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText
      });

      setAiDebrief(response.text);
    } catch (error) {
      console.error("AI Generation Error:", error);
      setAiDebrief("Session recorded successfully. Neural metrics indicate stable cognitive load throughout the duration.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / TOTAL_TIME) * circumference;
  const isHighStress = stressLevel > 65;
  const ringColor = isHighStress ? '#f59e0b' : '#6366f1';

  return (
    <div className="max-w-md mx-auto px-6 py-6 pb-32 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 relative">

      {/* Top Navigation */}
      <section className="flex items-center justify-center px-1">
        <div className="text-center">
          <h2 className="text-lg font-bold text-on-surface">Neural Protocol</h2>
          <p className={`text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 ${isHighStress ? 'text-amber-500' : 'text-emerald-500'}`}>
            <Activity size={10} /> {isHighStress ? 'Friction Detected' : 'Uno Serial Active'}
          </p>
        </div>
      </section>

      {/* The Distraction Overlay */}
      {isDistracted && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center px-6 animate-in zoom-in duration-300">
          <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-6 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.4)]">
            <AlertTriangle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-on-surface text-center mb-1">IMU Motion Spike</h2>

          {gracePeriod !== null && gracePeriod > 0 ? (
            <>
              <p className="text-sm text-red-400 font-bold tracking-widest uppercase mb-6">Device Picked Up</p>
              <div className="text-7xl font-mono font-bold text-on-surface mb-2 tracking-tighter">
                00:{gracePeriod.toString().padStart(2, '0')}
              </div>
              <p className="text-xs text-on-surface-variant text-center mb-8 max-w-[280px]">
                Return device to a flat surface within the grace period to protect your Flow State percentage.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-red-500 font-bold tracking-widest uppercase mb-6">Flow State Lost</p>
              <div className="text-6xl font-mono font-bold text-red-500 mb-2 tracking-tighter">-25%</div>
              <p className="text-xs text-on-surface-variant text-center mb-8 max-w-[280px]">
                Penalty applied. Distraction strike recorded in session logs.
              </p>
            </>
          )}

          <div className="w-full h-16 max-w-[280px] mb-10 flex items-end justify-between gap-1 opacity-60">
            {[10, 12, 15, 11, 14, 90, 95, 85, 92, 18, 15, 12, 10].map((height, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm transition-all ${height > 50 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-primary'}`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          <button
            onClick={dismissDistraction}
            className="w-full max-w-[280px] neo-raised neo-pressed p-4 rounded-2xl font-bold text-primary active:scale-95 transition-transform"
          >
            {gracePeriod !== null && gracePeriod > 0 ? 'Acknowledge & Resume' : 'Return to Deep Work'}
          </button>
        </div>
      )}

      {/* The Glowing Pomodoro Ring */}
      <section className="flex flex-col items-center justify-center py-2">
        <div className={`relative w-80 h-80 rounded-full flex items-center justify-center transition-all duration-700 ${isTimerRunning ? 'neo-inset' : 'neo-raised shadow-[8px_8px_16px_rgba(0,0,0,0.08),-8px_-8px_16px_rgba(255,255,255,0.7)]'}`}>
          <div className="w-64 h-64 rounded-full neo-raised flex flex-col items-center justify-center z-10 relative overflow-hidden">

            <div
              className="absolute bottom-0 w-full bg-primary/10 transition-all duration-1000 ease-linear"
              style={{ height: `${flowState}%` }}
            />

            <span className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase relative z-10 mb-2">
              Deep Work
            </span>

            <span className={`text-6xl font-bold font-mono tracking-tighter relative z-10 transition-colors duration-500 ${isHighStress ? 'text-amber-500' : 'text-primary'}`} style={{ textShadow: '2px 2px 0px rgba(255,255,255,0.8), -1px -1px 0px rgba(0,0,0,0.05)' }}>
              {mins}:{secs}
            </span>

            <span className="text-[11px] font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full mt-4 relative z-10 flex items-center gap-1.5">
              <Activity size={12} />
              Flow State: {Math.floor(flowState)}%
            </span>
          </div>

          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 256 256">
            <circle cx="128" cy="128" fill="transparent" r={radius} stroke="rgba(0,0,0,0.03)" strokeWidth="8" />
            <circle
              cx="128"
              cy="128"
              fill="transparent"
              r={radius}
              stroke={ringColor}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              strokeWidth="8"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
        </div>

        {/* Control Deck */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button onClick={resetTimer} className="w-14 h-14 rounded-full neo-raised flex items-center justify-center text-on-surface-variant hover:text-red-500 active:scale-95 transition-all">
            <RotateCcw size={20} />
          </button>

          <button onClick={toggleTimer} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isTimerRunning ? 'neo-inset text-amber-500' : 'neo-raised neo-pressed text-primary shadow-lg'}`}>
            {isTimerRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="translate-x-0.5" />}
          </button>

          <button
            onClick={triggerDistractionDemo}
            className={`w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-all ${isTimerRunning ? 'neo-raised text-on-surface-variant hover:text-amber-500' : 'neo-inset text-black/10'}`}
            title="Simulate IMU Motion Spike"
          >
            <Smartphone size={20} />
          </button>
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
            <path className={`${isTimerRunning && !isDistracted ? 'animate-[wave-slide_2s_linear_infinite]' : ''}`} d="M0,50 Q25,30 50,50 T100,50 T150,50 T200,50 T250,50 T300,50 T350,50 T400,50 Q425,30 450,50 T500,50 T550,50 T600,50" />
            <path className={`${isTimerRunning && !isDistracted ? 'animate-[wave-slide-reverse_3s_linear_infinite]' : ''} opacity-30 stroke-tertiary`} d="M0,50 Q25,40 50,50 T100,50 T150,50 T200,50 T250,50 T300,50 T350,50 T400,50 Q425,40 450,50 T500,50 T550,50 T600,50" strokeWidth="1.5" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>
      </section>

      {/* Focus Soundscapes List */}
      <section className="space-y-4">
        <h3 className="font-semibold text-on-surface px-1">Adaptive Soundscapes</h3>
        <div className="space-y-4">

          <div className="flex items-center justify-between neo-raised p-4 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl neo-inset flex items-center justify-center text-primary">
                <Trees size={24} />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm text-on-surface">Emerald Forest</p>
                <p className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
                  {isPlaying['forest'] ? (
                    <><Activity size={10} className="text-emerald-500 animate-pulse"/> Filter Cutoff: {Math.floor(400 + ((Math.max(0, Math.min(100, stressLevel)))/100)*1200)}Hz</>
                  ) : 'Adaptive Rain Filter'}
                </p>
              </div>
            </div>
            <button onClick={() => togglePlay('forest')} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying['forest'] ? 'neo-inset text-tertiary' : 'neo-raised neo-pressed text-primary'}`}>
              {isPlaying['forest'] ? <Pause size={20} className="fill-tertiary" /> : <Play size={20} className="fill-primary translate-x-0.5" />}
            </button>
          </div>

          <div className="flex items-center justify-between neo-raised p-4 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl neo-inset flex items-center justify-center text-tertiary">
                <Rocket size={24} />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm text-on-surface">Deep Cosmos</p>
                <p className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
                  {isPlaying['cosmos'] ? (
                    <><Activity size={10} className="text-tertiary animate-pulse"/> Beat Freq: {Math.floor(2 + ((Math.max(0, Math.min(100, stressLevel)))/100)*12)}Hz</>
                  ) : 'Adaptive Binaural Drones'}
                </p>
              </div>
            </div>
            <button onClick={() => togglePlay('cosmos')} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying['cosmos'] ? 'neo-inset text-tertiary' : 'neo-raised neo-pressed text-primary'}`}>
              {isPlaying['cosmos'] ? <Pause size={20} className="fill-tertiary" /> : <Play size={20} className="fill-primary translate-x-0.5" />}
            </button>
          </div>

          <div className="flex items-center justify-between neo-raised p-4 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl neo-inset flex items-center justify-center text-on-surface-variant">
                <Droplets size={24} />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm text-on-surface">White Noise Pure</p>
                <p className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
                  {isPlaying['white_noise'] ? (
                    <><Activity size={10} className="text-on-surface animate-pulse"/> Masking: {Math.floor(((Math.max(0, Math.min(100, stressLevel)))/100)*100)}% Volume</>
                  ) : 'Adaptive Distraction Mask'}
                </p>
              </div>
            </div>
            <button onClick={() => togglePlay('white_noise')} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying['white_noise'] ? 'neo-inset text-tertiary' : 'neo-raised neo-pressed text-primary'}`}>
               {isPlaying['white_noise'] ? <Pause size={20} className="fill-tertiary" /> : <Play size={20} className="fill-primary translate-x-0.5" />}
            </button>
          </div>
        </div>
      </section>

      {/* Session Stats */}
      <section className="grid grid-cols-3 gap-3 pb-2">
        <div className="neo-raised p-4 rounded-2xl text-center space-y-2">
          <span className="block text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Length</span>
          <span className="block text-xl font-bold text-primary">{25 - Math.floor(timeLeft / 60)}m</span>
        </div>
        <div className="neo-raised p-4 rounded-2xl text-center space-y-2">
          <span className="block text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Peak</span>
          <span className="block text-xl font-bold text-tertiary">42m</span>
        </div>
        <div className={`neo-raised p-4 rounded-2xl text-center space-y-2 transition-colors ${strikes > 0 ? 'bg-red-500/5' : ''}`}>
          <span className={`block text-[9px] font-bold uppercase tracking-widest ${strikes > 0 ? 'text-red-500' : 'text-on-surface-variant'}`}>Strikes</span>
          <span className={`block text-xl font-bold ${strikes > 0 ? 'text-red-500' : 'text-on-surface'}`}>{strikes}</span>
        </div>
      </section>

      {/* --- NEW: AI Post-Session Debrief --- */}
      <section className="space-y-4 pt-4 border-t border-black/5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-semibold text-on-surface">Post-Session Debrief</h3>
          <button
            onClick={generateSessionDebrief}
            disabled={isAnalyzing || isTimerRunning}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-transform ${(!isTimerRunning && (25 - Math.floor(timeLeft / 60) > 0)) ? 'text-tertiary bg-tertiary/10 active:scale-95' : 'text-on-surface-variant bg-black/5 opacity-50 cursor-not-allowed'}`}
          >
            {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {isAnalyzing ? 'Analyzing...' : 'Generate'}
          </button>
        </div>

        <div className="space-y-4">
          {aiDebrief ? (
            <div className="neo-raised rounded-2xl p-5 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/10 rounded-full blur-xl pointer-events-none"></div>
              <p className="text-sm text-on-surface-variant leading-relaxed relative z-10 font-medium">
                {aiDebrief}
              </p>
            </div>
          ) : (
             <div className="neo-inset rounded-2xl p-6 text-center">
               <p className="text-[11px] text-on-surface-variant uppercase tracking-widest font-bold">Awaiting Session Data</p>
               <p className="text-xs text-on-surface-variant mt-2 max-w-[250px] mx-auto">Complete a focus session and click Generate to analyze your flow state metrics.</p>
             </div>
          )}
        </div>
      </section>

      <style>{`
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
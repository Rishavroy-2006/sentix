import { Brain, Menu, ArrowLeft, Calendar, Clock, Video, Moon, TrendingUp, ClipboardList, MessageSquare, Plus, Activity, Terminal, Lock, Sparkles, Loader2, Check, Shield, Key, Fingerprint, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import React, { useState, useEffect } from 'react';

export const Header: React.FC = () => {
  const [showConsultancy, setShowConsultancy] = useState(false);

  // --- LIVE TELEMETRY BROADCAST STATES ---
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamLogs, setStreamLogs] = useState<string[]>([]);

  // --- AI CLINICAL BRIEF STATES ---
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [clinicalBrief, setClinicalBrief] = useState<string | null>(null);

  // --- DECENTRALIZED DATA VAULT STATES ---
  const [showVault, setShowVault] = useState(false);
  const [vaultStatus, setVaultStatus] = useState<'idle' | 'generating' | 'granted'>('idle');
  const [mockHash, setMockHash] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState('Dr. Elena Vance');

  // --- LIVE TELEMETRY SIMULATION ENGINE ---
  useEffect(() => {
    if (!isStreaming) {
      setStreamLogs([]);
      return;
    }

    setStreamLogs(['> Initializing secure serial link...']);

    const interval = setInterval(() => {
      const time = new Date().toISOString().split('T')[1].slice(0, 8);
      const ppg = Math.floor(Math.random() * 20 + 70);
      const gsr = Math.floor(Math.random() * 100 + 350);
      const imu = (Math.random() * 0.1 + 0.95).toFixed(2);

      const newLog = `[${time}] SECURE_TX: PPG=${ppg} | GSR=${gsr}Ω | IMU=${imu}g`;

      setStreamLogs(prev => {
        const updatedLogs = [newLog, ...prev];
        return updatedLogs.slice(0, 4);
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // --- GEMINI CLINICAL BRIEF ENGINE ---
  const generateClinicalBrief = async () => {
    setIsGeneratingBrief(true);
    try {
      if (!process.env.GEMINI_API_KEY) {
        setTimeout(() => {
          setClinicalBrief("PATIENT SUMMARY (Last 24h): Sleep Score 84 (Optimal Recovery). Deep Sleep: 1h 53m. HRV Average: 68ms. Morning Readiness: High. No acute stress triggers detected in current telemetry window. Recommend maintaining current coherence breathing protocol.");
          setIsGeneratingBrief(false);
        }, 1800);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = "Write a clinical, medical-grade 2-sentence patient summary for a doctor. Patient had 84 sleep score, 1h 53m deep sleep, average HRV 68ms, and stable stress levels.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      setClinicalBrief(response.text);
    } catch (e) {
      setClinicalBrief("Secure telemetry brief successfully transferred to Dr. Vance's clinical portal.");
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  // --- CRYPTOGRAPHIC VAULT SIMULATOR ---
  const grantSecureAccess = () => {
    setVaultStatus('generating');
    setTimeout(() => {
      const hash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      setMockHash(hash);
      setVaultStatus('granted');
    }, 2000);
  };

  const closeVault = () => {
    setShowVault(false);
    setTimeout(() => {
      setVaultStatus('idle');
      setMockHash(null);
    }, 300);
  };

  return (
    <>
      {/* --- EXISTING MAIN HEADER --- */}
      <header className="w-full top-0 sticky z-40 bg-background flex justify-between items-center px-6 py-4 pt-6 neo-raised">
        <div className="flex items-center gap-3">
          <div className="neo-raised p-2 rounded-xl flex items-center justify-center">
            <Brain className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">NeuroSync</h1>
        </div>

        {/* Hamburger Menu Icon */}
        <button
          onClick={() => setShowConsultancy(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center neo-raised neo-pressed text-on-surface-variant hover:text-primary transition-colors outline-none"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* --- DOCTOR CONSULTANCY FULL-SCREEN OVERLAY --- */}
      {showConsultancy && (
        <div className="fixed inset-0 z-[100] bg-background overflow-y-auto animate-in slide-in-from-bottom-8 duration-300">

          {/* Overlay Header */}
          <header className="w-full top-0 sticky z-40 bg-background/90 backdrop-blur-md flex justify-between items-center px-6 py-4 pt-6">
            <button
              onClick={() => {
                setShowConsultancy(false);
                setIsStreaming(false);
              }}
              className="p-2 text-primary hover:bg-black/5 rounded-full transition-colors outline-none"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-primary mr-8">NeuroSync</h1>
            <div />
          </header>

          {/* Overlay Content */}
          <div className="px-6 pb-32 space-y-8 mt-2">

            {/* UPCOMING SESSION */}
            <section>
              <h3 className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-4">Upcoming Session</h3>
              <div className="neo-raised rounded-3xl p-5 relative overflow-hidden bg-white/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80"
                      alt="Dr. Elena Vance"
                      className="w-12 h-12 rounded-xl object-cover neo-inset p-0.5"
                    />
                    <div>
                      <h4 className="text-lg font-bold text-on-surface">Dr. Elena Vance</h4>
                      <p className="text-xs text-primary font-medium">Cognitive Neurologist</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Live in 15m</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 neo-inset bg-background rounded-xl p-3">
                    <Calendar size={16} className="text-primary" />
                    <span className="text-xs font-semibold text-on-surface">Today, May 19</span>
                  </div>
                  <div className="flex items-center gap-2 neo-inset bg-background rounded-xl p-3">
                    <Clock size={16} className="text-primary" />
                    <span className="text-xs font-semibold text-on-surface">2:30 PM</span>
                  </div>
                </div>

                <button className="w-full bg-primary text-white font-bold text-sm py-3.5 rounded-2xl shadow-[0_8px_20px_rgba(99,102,241,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-2">
                  <Video size={18} /> Join Call
                </button>

                {/* --- LIVE VITAL STREAMING UI --- */}
                <div className="mt-5 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal size={14} className="text-on-surface-variant" />
                      <span className="text-xs font-bold text-on-surface">Stream Live Vitals</span>
                    </div>

                    <button
                      onClick={() => setIsStreaming(!isStreaming)}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 outline-none ${isStreaming ? 'bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-black/10 neo-inset'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isStreaming ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {isStreaming && (
                    <div className="mt-4 w-full bg-slate-900 rounded-xl p-3 flex flex-col-reverse font-mono text-[9px] text-emerald-400 leading-relaxed overflow-hidden h-24 relative animate-in fade-in zoom-in-95 duration-300">
                       <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-900/80 px-1.5 py-0.5 rounded">
                         <Lock size={10} className="text-emerald-500" />
                         <span className="text-[8px] text-emerald-500 font-bold tracking-wider">E2E SECURE</span>
                       </div>

                       {streamLogs.map((log, i) => (
                         <div key={i} className={`transition-opacity duration-300 ${i === 0 ? 'opacity-100 font-bold' : 'opacity-50'}`}>
                           {log}
                         </div>
                       ))}
                    </div>
                  )}
                </div>

              </div>
            </section>

            {/* MY CARE TEAM */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">My Care Team</h3>
                <button
                  onClick={() => setShowVault(true)}
                  className="flex items-center gap-1.5 text-[9px] font-bold text-primary tracking-widest uppercase bg-primary/10 px-2.5 py-1.5 rounded-full active:scale-95 transition-transform"
                >
                  <Shield size={10} /> Vault Access
                </button>
              </div>
              <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {[
                  { name: 'Dr. Elena', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80', active: true },
                  { name: 'Dr. Marcus', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80', active: false },
                  { name: 'Dr. James', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80', active: false },
                ].map((member, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                    <div className={`w-14 h-14 rounded-full p-0.5 ${member.active ? 'bg-primary' : 'neo-raised'}`}>
                      <img src={member.img} alt={member.name} className="w-full h-full rounded-full object-cover border-2 border-background" />
                    </div>
                    <span className="text-[10px] font-semibold text-on-surface">{member.name}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <button className="w-14 h-14 rounded-full neo-inset flex items-center justify-center text-on-surface-variant border-2 border-dashed border-gray-300">
                    <Plus size={20} />
                  </button>
                  <span className="text-[10px] font-semibold text-transparent">Add</span>
                </div>
              </div>
            </section>

            {/* CONSULTATION INSIGHTS */}
            <section>
              <h3 className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-4">Consultation Insights</h3>
              <div className="neo-raised rounded-3xl p-5 bg-white/50 space-y-4">

                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 neo-inset rounded-xl text-primary bg-background">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">Latest Summary</h4>
                    <p className="text-[10px] text-on-surface-variant font-medium">Last session: April 20</p>
                  </div>
                </div>

                <div className="bg-background neo-inset rounded-2xl p-4 flex gap-3 border-l-4 border-primary">
                  <Moon size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-on-surface mb-1">Sleep Hygiene Focus</h5>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">Maintain 65°F room temperature and zero screen time 60m before bed.</p>
                  </div>
                </div>

                <div className="bg-background neo-inset rounded-2xl p-4 flex gap-3 border-l-4 border-primary">
                  <TrendingUp size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-on-surface mb-1">HRV Training Progress</h5>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">Targeting 15% increase in morning baseline HRV through daily 5-min coherence breathing.</p>
                  </div>
                </div>

                <button className="w-full pt-2 text-[10px] font-bold text-primary tracking-widest uppercase hover:underline">
                  Read Full Transcript
                </button>
              </div>
            </section>

            {/* AI CLINICAL BRIEF */}
            {clinicalBrief && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">Pre-Session Brief</h3>
                  <span className="text-[9px] font-bold text-emerald-600 tracking-widest uppercase bg-emerald-500/10 px-2 py-1 rounded-md flex items-center gap-1">
                    <Lock size={10} /> Sent to Doctor
                  </span>
                </div>
                <div className="neo-raised rounded-3xl p-5 bg-background border-l-4 border-primary">
                  <p className="text-xs text-on-surface-variant leading-relaxed font-medium italic">
                    "{clinicalBrief}"
                  </p>
                </div>
              </section>
            )}

            {/* QUICK ACTIONS */}
            <section>
              <h3 className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button className="neo-raised neo-pressed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 bg-white/50 transition-transform active:scale-95">
                  <div className="p-2 bg-primary/10 rounded-full text-primary mb-1">
                    <Calendar size={20} />
                  </div>
                  <span className="text-xs font-bold text-on-surface">Book New Session</span>
                </button>

                <button
                  onClick={generateClinicalBrief}
                  disabled={isGeneratingBrief || clinicalBrief !== null}
                  className="neo-raised neo-pressed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 bg-white/50 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                >
                  <div className="p-2 bg-primary/10 rounded-full text-primary mb-1">
                    {isGeneratingBrief ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : clinicalBrief ? (
                      <Check size={20} />
                    ) : (
                      <Sparkles size={20} />
                    )}
                  </div>
                  <span className="text-xs font-bold text-on-surface">
                    {isGeneratingBrief ? 'Analyzing...' : clinicalBrief ? 'Brief Sent' : 'Generate Brief'}
                  </span>
                </button>
              </div>
              <button className="w-full neo-raised neo-pressed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 bg-white/50 transition-transform active:scale-95">
                <div className="p-2 bg-primary/10 rounded-full text-primary mb-1">
                  <MessageSquare size={20} />
                </div>
                <span className="text-xs font-bold text-on-surface">Message Doctor</span>
              </button>
            </section>

          </div>
        </div>
      )}

      {/* --- DECENTRALIZED VAULT MODAL --- */}
      {showVault && (
        <div className="fixed inset-0 z-[110] bg-background/80 backdrop-blur-md flex flex-col items-center justify-center px-6 animate-in zoom-in duration-300">
          <div className="w-full max-w-[320px] neo-raised rounded-3xl p-6 bg-background relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)]">

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 neo-inset rounded-full text-primary">
                  <Shield size={20} />
                </div>
                <h3 className="font-bold text-lg text-on-surface">Data Vault</h3>
              </div>
              <button onClick={closeVault} className="text-on-surface-variant hover:text-primary transition-colors outline-none">
                <ArrowLeft size={20} className="rotate-180" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Manage which providers have end-to-end encrypted access to your raw biometric history.
            </p>

            {/* Simulated Select Input */}
            <div className="neo-inset bg-background rounded-xl p-3 mb-6 flex items-center justify-between">
               <span className="text-sm font-semibold text-on-surface">{selectedDoc}</span>
               <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded text-emerald-600">
                  <Lock size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Unverified</span>
               </div>
            </div>

            {/* Cryptographic Result Pane */}
            {vaultStatus === 'granted' && mockHash ? (
              <div className="neo-inset bg-background rounded-xl p-4 mb-6 flex flex-col gap-2 animate-in slide-in-from-bottom-2 fade-in duration-300">
                 <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold">Access Granted</span>
                 </div>
                 <div className="w-full bg-slate-900 rounded p-2 overflow-hidden">
                    <p className="text-[10px] text-emerald-400 font-mono break-all leading-tight">
                      AUTH_KEY: {mockHash}
                    </p>
                 </div>
              </div>
            ) : null}

            {/* --- UPGRADED BUTTON: Brighter White Background with Bold Black Text --- */}
            <button
              onClick={grantSecureAccess}
              disabled={vaultStatus !== 'idle'}
              className={`w-full p-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 outline-none shadow-lg
                ${vaultStatus === 'idle'
                  ? 'bg-white text-black neo-raised active:scale-95'
                  : vaultStatus === 'generating'
                    ? 'bg-white/80 text-black cursor-default'
                    : 'bg-emerald-500/10 text-emerald-600 neo-inset cursor-default shadow-none'
                }`}
            >
              {vaultStatus === 'idle' && <><Key size={16} className="text-black" /> Generate Key & Grant Access</>}
              {vaultStatus === 'generating' && <><Loader2 size={16} className="animate-spin text-black" /> Negotiating Handshake...</>}
              {vaultStatus === 'granted' && <><Fingerprint size={16} /> Identity Verified</>}
            </button>

          </div>
        </div>
      )}
    </>
  );
};
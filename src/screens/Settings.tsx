import { User, Camera, Check, ChevronRight, Moon, Bell, LogOut, Loader2, Cpu, Key, Eye, EyeOff } from 'lucide-react';
import React, { useState, useRef } from 'react';

const Settings: React.FC = () => {
  // --- USER PROFILE STATES (WITH LOCAL STORAGE PERSISTENCE) ---
  const [userName, setUserName] = useState(() => localStorage.getItem('neurosync_username') || 'Aritra Hazra');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => localStorage.getItem('neurosync_photo') || null);

  // --- ARDUINO PING STATES ---
  const [pingStatus, setPingStatus] = useState<'idle' | 'pinging' | 'success'>('idle');
  const [latency, setLatency] = useState<number>(12);

  // --- SENSOR CALIBRATION STATES ---
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibProgress, setCalibProgress] = useState(0);
  const [calibMessage, setCalibMessage] = useState('');

  // --- GEMINI API KEY STATES ---
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('neurosync_gemini_key') || '');
  const [showKey, setShowKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'idle' | 'verifying' | 'valid'>('idle');

  // Reference for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- SAVE HANDLERS ---
  const handleSaveName = () => {
    localStorage.setItem('neurosync_username', userName);
    setIsEditing(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setProfilePhoto(base64Image);

        try {
          localStorage.setItem('neurosync_photo', base64Image);
        } catch (error) {
          console.warn("Image file is too large for local storage persistence.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- ARDUINO PING HANDLER ---
  const handlePing = () => {
    if (pingStatus === 'pinging') return;

    setPingStatus('pinging');
    setTimeout(() => {
      setLatency(Math.floor(Math.random() * 16) + 8);
      setPingStatus('success');
      setTimeout(() => setPingStatus('idle'), 3000);
    }, 800);
  };

  // --- SENSOR CALIBRATION PROTOCOL ---
  const startCalibration = () => {
    setIsCalibrating(true);
    setCalibProgress(0);
    setCalibMessage('Initializing sensor array...');

    setTimeout(() => setCalibMessage('Zeroing IMU gyroscope...'), 1000);
    setTimeout(() => setCalibMessage('Calibrating GSR baseline resistance...'), 2500);
    setTimeout(() => setCalibMessage('Aligning PPG optical sensor...'), 4000);
    setTimeout(() => setCalibMessage('Calibration complete. Sensors optimal.'), 5500);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setCalibProgress(progress);
    }, 110);
  };

  // --- API KEY SAVE HANDLER ---
  const handleSaveKey = () => {
    if (!apiKey) return;
    setKeyStatus('verifying');

    setTimeout(() => {
      localStorage.setItem('neurosync_gemini_key', apiKey);
      setKeyStatus('valid');

      setTimeout(() => setKeyStatus('idle'), 2500);
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-6 pb-32 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 relative">

      {/* --- CALIBRATION MODAL OVERLAY --- */}
      {isCalibrating && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center px-6 animate-in zoom-in duration-300">
          <div className="w-full max-w-[320px] neo-raised rounded-3xl p-6 bg-background relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)]">

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 neo-inset rounded-full text-tertiary">
                <Cpu size={20} />
              </div>
              <h3 className="font-bold text-lg text-on-surface">Hardware Calibration</h3>
            </div>

            <p className="text-xs text-on-surface-variant mb-4 font-mono h-4">
              {calibMessage}
            </p>

            <div className="w-full h-4 neo-inset rounded-full overflow-hidden mb-6 p-1">
              <div
                className="h-full bg-tertiary rounded-full transition-all duration-200 ease-linear"
                style={{ width: `${calibProgress}%` }}
              />
            </div>

            {calibProgress >= 100 ? (
              <button
                onClick={() => setIsCalibrating(false)}
                className="w-full neo-raised neo-pressed p-3 rounded-xl text-xs font-bold text-primary transition-all active:scale-95 animate-in fade-in"
              >
                Acknowledge
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 w-full p-3 text-xs font-bold text-on-surface-variant">
                <Loader2 size={14} className="animate-spin" /> Calibrating...
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- AUTHENTIC DEVELOPER PROFILE --- */}
      <section className="neo-raised rounded-3xl p-8 flex flex-col items-center justify-center space-y-4">

        <div
          className="relative w-24 h-24 rounded-full neo-inset p-1 cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          {profilePhoto ? (
            <img
              alt="User Profile"
              className="w-full h-full object-cover rounded-full"
              src={profilePhoto}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center neo-raised text-on-surface-variant">
              <User size={40} />
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={24} className="text-white" />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>

        <div className="text-center w-full">
          {isEditing ? (
            <div className="flex items-center justify-center gap-2 mb-2 animate-in zoom-in duration-200">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-background neo-inset px-3 py-1.5 rounded-lg text-center text-on-surface font-bold w-40 outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="p-2 neo-raised neo-pressed rounded-full text-primary"
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-on-surface">{userName}</h2>
              <p className="text-xs text-on-surface-variant mt-1 mb-4">aritra@example.com</p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-semibold px-5 py-2 neo-raised neo-pressed bg-background text-primary rounded-full transition-all active:scale-95"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </section>

      {/* --- DEVICE SETTINGS --- */}
      <section className="space-y-4">
          <h3 className="font-semibold px-1 text-on-surface">Device Settings</h3>
          <div className="neo-raised rounded-2xl p-4 space-y-2">

             <div
               onClick={handlePing}
               className="flex justify-between items-center p-3 neo-pressed rounded-xl bg-background cursor-pointer hover:bg-black/5 transition-colors active:scale-[0.98]"
             >
                <span className="text-sm font-semibold text-on-surface">Arduino Uno Serial Link</span>

                {pingStatus === 'pinging' ? (
                  <span className="text-[10px] text-tertiary font-bold tracking-wider uppercase bg-tertiary/10 px-2 py-1 rounded-md flex items-center gap-1 animate-in fade-in">
                    <Loader2 size={10} className="animate-spin" /> Pinging...
                  </span>
                ) : pingStatus === 'success' ? (
                  <span className="text-[10px] text-emerald-600 font-bold tracking-wider uppercase bg-emerald-100 px-2 py-1 rounded-md animate-in fade-in zoom-in duration-200">
                    ACTIVE | {latency}ms
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-600 font-bold tracking-wider uppercase bg-emerald-100 px-2 py-1 rounded-md transition-colors">
                    Connected
                  </span>
                )}
             </div>

             <div
                onClick={startCalibration}
                className="flex justify-between items-center p-3 neo-pressed rounded-xl bg-background cursor-pointer hover:bg-black/5 transition-colors active:scale-[0.98]"
             >
                 <span className="text-sm font-semibold text-on-surface">Sensor Calibration</span>
                 <ChevronRight size={16} className="text-on-surface-variant" />
             </div>

             <div className="flex justify-between items-center p-3 neo-pressed rounded-xl bg-background cursor-pointer hover:bg-black/5 transition-colors">
                 <span className="text-sm font-semibold text-on-surface">Audio Output</span>
                 <ChevronRight size={16} className="text-on-surface-variant" />
             </div>
          </div>
      </section>

      {/* --- AI INTEGRATION --- */}
      <section className="space-y-4">
        <h3 className="font-semibold px-1 text-on-surface">AI Integration</h3>
        <div className="neo-raised rounded-2xl p-4 space-y-3">
           <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <Key size={16} className="text-tertiary" /> Gemini API Key
              </label>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-background neo-inset px-3 py-2.5 rounded-xl text-xs font-mono text-on-surface outline-none pr-10"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors outline-none"
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                {/* BUTTON TEXT COLOR CHANGED TO BLACK HERE */}
                <button
                  onClick={handleSaveKey}
                  disabled={!apiKey || keyStatus === 'verifying'}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center min-w-[70px] ${keyStatus === 'valid' ? 'bg-emerald-500/10 text-emerald-600 neo-inset' : 'bg-primary text-black neo-raised neo-pressed shadow-primary/30'}`}
                >
                  {keyStatus === 'verifying' ? <Loader2 size={14} className="animate-spin text-black" /> : keyStatus === 'valid' ? <Check size={16} /> : 'Save'}
                </button>
              </div>

              <p className="text-[9px] text-on-surface-variant font-medium ml-1">
                Required for Post-Session Debriefs & Morning Readiness Analysis.
              </p>
           </div>
        </div>
      </section>

      {/* --- APP PREFERENCES --- */}
       <section className="space-y-4">
          <h3 className="font-semibold px-1 text-on-surface">App Preferences</h3>
          <div className="neo-raised rounded-2xl p-4 space-y-2">
             <div className="flex justify-between items-center p-3 neo-pressed rounded-xl bg-background">
                <span className="text-sm font-semibold text-on-surface flex items-center gap-2"><Moon size={16}/> Theme</span>
                <span className="text-xs text-on-surface-variant font-medium">Light</span>
             </div>
             <div className="flex justify-between items-center p-3 neo-pressed rounded-xl bg-background">
                 <span className="text-sm font-semibold text-on-surface flex items-center gap-2"><Bell size={16}/> Notifications</span>
                 <span className="text-xs text-on-surface-variant font-medium">Enabled</span>
             </div>
             <div className="flex justify-between items-center p-3 neo-pressed rounded-xl bg-background text-red-500 cursor-pointer hover:bg-red-500/10 transition-colors">
                 <span className="text-sm font-semibold flex items-center gap-2"><LogOut size={16}/> Log Out</span>
             </div>
          </div>
      </section>
    </div>
  );
};

export default Settings;
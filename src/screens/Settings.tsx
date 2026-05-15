import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-6 py-6 pb-32 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <section className="neo-raised rounded-3xl p-8 flex flex-col items-center justify-center space-y-4">
        <div className="w-24 h-24 rounded-full neo-inset p-1">
            <img
            alt="User Profile"
            className="w-full h-full object-cover rounded-full"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
            />
        </div>
        <div className="text-center">
            <h2 className="text-xl font-bold">Sarah Jenkins</h2>
            <p className="text-xs text-on-surface-variant mt-1 mb-4">sarah.j@example.com</p>
            <button className="text-xs font-semibold px-4 py-2 bg-primary text-white rounded-full">Edit Profile</button>
        </div>
      </section>

      <section className="space-y-4">
          <h3 className="font-semibold px-1">Device Settings</h3>
          <div className="neo-raised rounded-2xl p-4 space-y-2">
             <div className="flex justify-between items-center p-3 neo-pressed rounded-xl bg-background">
                <span className="text-sm font-semibold">NeuroSync Earpiece</span>
                <span className="text-[10px] text-green-600 font-bold tracking-wider uppercase bg-green-100 px-2 py-1 rounded-md">Connected (94%)</span>
             </div>
             <div className="flex justify-between items-center p-3 neo-pressed rounded-xl bg-background">
                 <span className="text-sm font-semibold">Sensor Calibration</span>
             </div>
             <div className="flex justify-between items-center p-3 neo-pressed rounded-xl bg-background">
                 <span className="text-sm font-semibold">Audio Output</span>
             </div>
          </div>
      </section>

       <section className="space-y-4">
          <h3 className="font-semibold px-1">App Preferences</h3>
          <div className="neo-raised rounded-2xl p-4 space-y-2">
             <div className="flex justify-between items-center p-3 neo-pressed rounded-xl bg-background">
                <span className="text-sm font-semibold">Theme</span>
                <span className="text-xs text-on-surface-variant font-medium">Light</span>
             </div>
             <div className="flex justify-between items-center p-3 neo-pressed rounded-xl bg-background">
                 <span className="text-sm font-semibold">Notifications</span>
                 <span className="text-xs text-on-surface-variant font-medium">Enabled</span>
             </div>
             <div className="flex justify-between items-center p-3 neo-pressed rounded-xl bg-background text-red-500">
                 <span className="text-sm font-semibold">Log Out</span>
             </div>
          </div>
      </section>
    </div>
  );
};

export default Settings;

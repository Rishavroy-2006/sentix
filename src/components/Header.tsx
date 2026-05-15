import { Brain } from 'lucide-react';
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full top-0 sticky z-40 bg-background flex justify-between items-center px-6 py-4 pt-6 neo-raised">
      <div className="flex items-center gap-3">
        <div className="neo-raised p-2 rounded-xl flex items-center justify-center">
          <Brain className="text-primary w-6 h-6" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-primary">NeuroSync</h1>
      </div>
      <div className="w-10 h-10 rounded-full overflow-hidden neo-raised p-0.5 cursor-pointer neo-pressed">
        <img
          alt="User Profile"
          className="w-full h-full object-cover rounded-full"
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
        />
      </div>
    </header>
  );
};

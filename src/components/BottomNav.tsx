import { Brain, LayoutDashboard, Focus, ActivitySquare, Moon, Settings } from 'lucide-react';
import React, { useState } from 'react';

type Tab = 'dashboard' | 'focus' | 'stress' | 'sleep' | 'settings';

interface BottomNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'focus', label: 'Focus', icon: Focus },
    { id: 'stress', label: 'Stress', icon: ActivitySquare },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <nav className="fixed bottom-0 w-full z-50 rounded-t-2xl neo-raised flex justify-around items-center px-2 py-4 pb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as Tab)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
              isActive
                ? 'text-primary neo-inset scale-95'
                : 'text-on-surface-variant hover:text-tertiary hover:scale-105 neo-pressed'
            }`}
          >
            <Icon size={24} className={isActive ? 'fill-primary/20' : ''} />
            <span className="text-[10px] font-medium mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

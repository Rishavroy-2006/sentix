import React, { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { Dashboard, Focus, Stress, Sleep, Settings } from './screens';

type Tab = 'dashboard' | 'focus' | 'stress' | 'sleep' | 'settings';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');

  const handleNavigate = (tab: Tab | string) => {
    setCurrentTab(tab as Tab);
  };

  const renderScreen = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'focus':
        return <Focus />;
      case 'stress':
        return <Stress />;
      case 'sleep':
        return <Sleep />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans selection:bg-primary/30">
      <Header />
      <main className="w-full h-full relative overflow-x-hidden">
        {renderScreen()}
      </main>
      <BottomNav currentTab={currentTab} onTabChange={handleNavigate} />
    </div>
  );
}

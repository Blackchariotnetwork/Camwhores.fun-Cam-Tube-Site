import React from 'react';
import { useTube } from '../context/TubeContext';
import { Film, Hash, Users, Clock, LayoutDashboard } from 'lucide-react';
import { ViewTab } from '../types';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedModelId, watchHistory } = useTube();

  const navItems: { tab: ViewTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { tab: 'feed', label: 'Feed', icon: Film },
    { tab: 'categories', label: 'Tags', icon: Hash },
    { tab: 'models', label: 'Models', icon: Users },
    { tab: 'history', label: 'History', icon: Clock },
    { tab: 'dashboard', label: 'CMS', icon: LayoutDashboard },
  ];

  const handleSelect = (tab: ViewTab) => {
    setSelectedModelId(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg border-t border-zinc-800"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-stretch">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => handleSelect(item.tab)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors relative focus:outline-none ${
                isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.tab === 'history' && watchHistory.length > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight uppercase mt-1 font-mono ${isActive ? 'font-bold' : 'font-normal'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-4 h-0.5 bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

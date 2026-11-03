import React from 'react';
import { AnimatedLogo } from './AnimatedLogo';
import { useTube } from '../context/TubeContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedModelId, isPureNoir } = useTube();

  const handleNav = (tab: any) => {
    setSelectedModelId(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-black border-t border-zinc-800 py-12 text-zinc-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-zinc-900">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <AnimatedLogo size="md" monochrome={isPureNoir} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-white uppercase tracking-tight">
                  KONEKO TUBE
                </span>
                <span className="text-[10px] bg-white text-black px-1 font-bold">
                  CMS
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                High-Contrast Monochrome Video & Creator Platform
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-zinc-400 uppercase text-[11px] tracking-wider">
            <button
              onClick={() => handleNav('feed')}
              className="hover:text-white transition-colors"
            >
              Feed
            </button>
            <button
              onClick={() => handleNav('categories')}
              className="hover:text-white transition-colors"
            >
              Categories
            </button>
            <button
              onClick={() => handleNav('models')}
              className="hover:text-white transition-colors"
            >
              Creator Bios
            </button>
            <button
              onClick={() => handleNav('history')}
              className="hover:text-white transition-colors"
            >
              Watch History
            </button>
            <button
              onClick={() => handleNav('cms')}
              className="hover:text-white transition-colors"
            >
              CMS Studio
            </button>
          </div>
        </div>

        {/* Quiet Copyright & Spec Line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <p>© {new Date().getFullYear()} Koneko Tube CMS. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>4K Master Audio/Visual</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Buffer Touch Engine</span>
            <span aria-hidden="true">·</span>
            <span>Monochrome Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

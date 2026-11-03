import React, { useState } from 'react';
import { useTube } from '../context/TubeContext';
import { AnimatedLogo } from './AnimatedLogo';
import {
  Search,
  X,
  SlidersHorizontal,
  Flame,
  Film,
  Users,
  Clock,
  LayoutDashboard,
  PlusSquare,
  Contrast,
} from 'lucide-react';
import { ViewTab } from '../types';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    setSelectedModelId,
    isPureNoir,
    togglePureNoir,
  } = useTube();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleNavClick = (tab: ViewTab) => {
    setSelectedModelId(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black/95 backdrop-blur-md border-b border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark with Animated Mascot Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <AnimatedLogo
              size="sm"
              showLabel={false}
              monochrome={isPureNoir}
              onClick={() => handleNavClick('feed')}
            />
            <button
              onClick={() => handleNavClick('feed')}
              className="text-left group flex flex-col justify-center focus:outline-none"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white uppercase group-hover:text-zinc-300 transition-colors">
                  KONEKO
                </span>
                <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 bg-white text-black tracking-wider uppercase">
                  TUBE
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                Noir Video CMS
              </span>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos, models, tags (#noir, #4k, tokyo)..."
                className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs px-3.5 py-2 pl-9 rounded-none focus:outline-none focus:border-white transition-colors font-mono"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium uppercase tracking-wider text-zinc-400">
            <button
              onClick={() => handleNavClick('feed')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'feed'
                  ? 'text-white border-white'
                  : 'border-transparent'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'categories'
                  ? 'text-white border-white'
                  : 'border-transparent'
              }`}
            >
              Categories & Tags
            </button>
            <button
              onClick={() => handleNavClick('models')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'models'
                  ? 'text-white border-white'
                  : 'border-transparent'
              }`}
            >
              Model Bios
            </button>
            <button
              onClick={() => handleNavClick('history')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'history'
                  ? 'text-white border-white'
                  : 'border-transparent'
              }`}
            >
              Watch History
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'dashboard'
                  ? 'text-white border-white'
                  : 'border-transparent'
              }`}
            >
              Dashboard
            </button>
          </nav>

          {/* Zone 3: Actions (Pure Noir Toggle & CMS Upload Button) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle mobile search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* High-Contrast Noir Filter Mode */}
            <button
              onClick={togglePureNoir}
              className={`min-h-[44px] px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-mono border transition-colors ${
                isPureNoir
                  ? 'bg-white text-black border-white'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
              }`}
              title="Toggle Pure Noir B&W Film Filter"
            >
              <Contrast className="w-3.5 h-3.5" />
              <span className="hidden sm:inline uppercase text-[11px] font-bold">
                {isPureNoir ? 'Noir Mode ON' : 'Noir Mode'}
              </span>
            </button>

            {/* CMS / Upload Button */}
            <button
              onClick={() => handleNavClick('cms')}
              className={`min-h-[44px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'cms'
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              <PlusSquare className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">CMS Studio</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Drawer */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t border-zinc-800 animate-fadeIn">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos, models, tags..."
                className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm px-4 py-2.5 pl-10 focus:outline-none focus:border-white font-mono"
                autoFocus
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

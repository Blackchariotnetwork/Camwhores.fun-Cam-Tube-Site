import React from 'react';
import { useTube } from '../context/TubeContext';
import { Filter, X, ArrowUpDown, Sparkles, Check } from 'lucide-react';

export const TagFilterBar: React.FC = () => {
  const {
    categories,
    allTags,
    selectedCategory,
    setSelectedCategory,
    selectedTags,
    toggleTag,
    clearTags,
    sortBy,
    setSortBy,
    qualityFilter,
    setQualityFilter,
    filteredVideos,
  } = useTube();

  return (
    <div className="w-full bg-black border-b border-zinc-800/80 py-3 space-y-3">
      {/* Category Horizontal Scroller */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 px-4 sm:px-6 lg:px-8">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`min-h-[44px] px-3.5 py-1.5 text-xs uppercase tracking-wider font-mono whitespace-nowrap shrink-0 transition-colors border ${
                isSelected
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Filter Options & Tag Quick Selector Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 text-xs font-mono">
        {/* Left: Quick Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          <span className="text-zinc-500 uppercase text-[11px] shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Tags:
          </span>

          {allTags.map((tag) => {
            const isTagActive = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`min-h-[36px] px-2.5 py-1 text-[11px] whitespace-nowrap shrink-0 transition-colors border ${
                  isTagActive
                    ? 'bg-zinc-200 text-black border-white font-semibold'
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            );
          })}

          {selectedTags.length > 0 && (
            <button
              onClick={clearTags}
              className="min-h-[36px] px-2.5 py-1 text-[11px] text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700 flex items-center gap-1 shrink-0"
              title="Clear active tags"
            >
              <X className="w-3 h-3" />
              Reset ({selectedTags.length})
            </button>
          )}
        </div>

        {/* Right: Quality Filter & Sort Control */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          {/* Quality selector */}
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 p-0.5">
            {(['all', '4K', '1080p', '60FPS'] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQualityFilter(q)}
                className={`px-2 py-1 text-[10px] uppercase font-bold transition-colors ${
                  qualityFilter === q
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {q === 'all' ? 'All Res' : q}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 px-2 py-1">
            <ArrowUpDown className="w-3 h-3 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white text-[11px] focus:outline-none cursor-pointer uppercase font-mono"
            >
              <option value="trending" className="bg-zinc-900 text-white">Trending</option>
              <option value="recent" className="bg-zinc-900 text-white">Most Recent</option>
              <option value="views" className="bg-zinc-900 text-white">Most Viewed</option>
              <option value="rating" className="bg-zinc-900 text-white">Highest Rated</option>
              <option value="duration" className="bg-zinc-900 text-white">Longest</option>
            </select>
          </div>

          {/* Video count */}
          <span className="text-zinc-400 text-[11px] hidden sm:inline tabular-nums">
            {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
          </span>
        </div>
      </div>
    </div>
  );
};

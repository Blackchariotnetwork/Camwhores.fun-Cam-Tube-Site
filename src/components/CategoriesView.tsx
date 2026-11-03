import React from 'react';
import { useTube } from '../context/TubeContext';
import { Film, Tv, Camera, User, Clapperboard, Sparkles, Mic, Hash, ArrowRight } from 'lucide-react';
import { Category } from '../types';

export const CategoriesView: React.FC = () => {
  const {
    categories,
    allTags,
    videos,
    setSelectedCategory,
    selectedTags,
    toggleTag,
    clearTags,
    setActiveTab,
  } = useTube();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Tv': return Tv;
      case 'Camera': return Camera;
      case 'User': return User;
      case 'Clapperboard': return Clapperboard;
      case 'Sparkles': return Sparkles;
      case 'Mic': return Mic;
      default: return Film;
    }
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setActiveTab('feed');
  };

  const handleTagSelect = (tag: string) => {
    toggleTag(tag);
    setActiveTab('feed');
  };

  // Calculate tag occurrences
  const tagCounts = allTags.map((tag) => {
    const count = videos.filter((v) =>
      v.tags.some((vt) => vt.toLowerCase() === tag.toLowerCase())
    ).length;
    return { tag, count };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Category Section Header */}
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          Categories & Filterable Genres
        </h1>
        <p className="text-xs font-mono text-zinc-400 mt-1 max-w-xl">
          Curated categories and tag taxonomy designed for lightning-fast mobile navigation. Filter by lighting styles, resolutions, production environments, and creator formats.
        </p>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.iconName);
          const count = cat.slug === 'all'
            ? videos.length
            : videos.filter((v) => v.category === cat.name).length;

          return (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className="group p-5 bg-zinc-950 border border-zinc-800 hover:border-white transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-zinc-400 font-bold tabular-nums">
                    {count} {count === 1 ? 'VIDEO' : 'VIDEOS'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mt-4 group-hover:underline">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs font-mono text-zinc-400 group-hover:text-white">
                <span className="uppercase tracking-wider">Browse Category</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tag Taxonomy Section */}
      <div className="pt-8 border-t border-zinc-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-white font-mono flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Tag Explorer Cloud
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Select one or multiple tags to filter videos in the main feed.
            </p>
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={clearTags}
              className="text-xs font-mono text-zinc-400 hover:text-white underline min-h-[44px] px-2"
            >
              Clear Active Tags ({selectedTags.length})
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5">
          {tagCounts.map(({ tag, count }) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`min-h-[44px] px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all border ${
                  isSelected
                    ? 'bg-white text-black border-white font-bold shadow-md shadow-white/10'
                    : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white'
                }`}
              >
                <span>#{tag}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 ${
                    isSelected ? 'bg-black text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

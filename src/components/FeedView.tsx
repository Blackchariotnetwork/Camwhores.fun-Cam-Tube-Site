import React from 'react';
import { useTube } from '../context/TubeContext';
import { VideoCard } from './VideoCard';
import { TagFilterBar } from './TagFilterBar';
import { AnimatedLogo } from './AnimatedLogo';
import { Play, Bookmark, Sparkles, Flame, Eye, Film } from 'lucide-react';

export const FeedView: React.FC = () => {
  const {
    filteredVideos,
    videos,
    setActiveVideo,
    savedVideoIds,
    toggleSaveVideo,
    setSelectedModelId,
    setActiveTab,
    selectedTags,
    clearTags,
    searchQuery,
    setSearchQuery,
    isPureNoir,
  } = useTube();

  // Featured Hero Video (first featured video)
  const heroVideo = videos.find((v) => v.isFeatured) || videos[0];
  const isHeroSaved = heroVideo ? savedVideoIds.includes(heroVideo.id) : false;

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Hero Spotlight (Only show when not actively filtering by search or multiple tags) */}
      {!searchQuery && selectedTags.length === 0 && heroVideo && (
        <section className="relative w-full bg-black border-b border-zinc-800 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Editorial Info */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-white text-black text-[10px] font-mono font-black px-2 py-0.5 uppercase tracking-wider">
                    FEATURED MASTER CUT
                  </span>
                  <span className="border border-zinc-700 text-zinc-300 text-[10px] font-mono px-1.5 py-0.5 uppercase">
                    {heroVideo.quality}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">
                  {heroVideo.title}
                </h1>

                {/* Model Credit with Animated Logo if Koneko */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-10 h-10 border border-zinc-600 overflow-hidden bg-black shrink-0">
                    {heroVideo.modelId === 'model-koneko' ? (
                      <AnimatedLogo size="sm" monochrome={isPureNoir} />
                    ) : (
                      <img
                        src={heroVideo.modelAvatar}
                        alt={heroVideo.modelName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setSelectedModelId(heroVideo.modelId);
                        setActiveTab('models');
                      }}
                      className="text-sm font-bold text-white hover:underline focus:outline-none"
                    >
                      {heroVideo.modelName}
                    </button>
                    <div className="text-[11px] font-mono text-zinc-400">
                      {heroVideo.category}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
                  {heroVideo.description}
                </p>

                {/* Unboxed Metadata Line */}
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 tabular-nums">
                  <span className="text-white font-semibold">{heroVideo.durationFormatted}</span>
                  <span aria-hidden="true">·</span>
                  <span>{(heroVideo.views / 1000).toFixed(0)}K views</span>
                  <span aria-hidden="true">·</span>
                  <span>{heroVideo.ratingPercentage}% rating</span>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveVideo(heroVideo)}
                    className="min-h-[44px] px-6 py-2.5 bg-white text-black text-xs font-mono font-black uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-lg shadow-white/10"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Watch Now</span>
                  </button>

                  <button
                    onClick={() => toggleSaveVideo(heroVideo.id)}
                    className={`min-h-[44px] px-4 py-2.5 border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                      isHeroSaved
                        ? 'bg-zinc-800 text-white border-zinc-700'
                        : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-white hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isHeroSaved ? 'fill-current' : ''}`} />
                    <span>{isHeroSaved ? 'Saved' : 'Watch Later'}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Hero Video Frame Preview */}
              <div className="lg:col-span-7">
                <div
                  onClick={() => setActiveVideo(heroVideo)}
                  className="relative aspect-video w-full bg-zinc-900 border border-zinc-800 hover:border-white transition-all cursor-pointer overflow-hidden group shadow-2xl"
                >
                  <img
                    src={heroVideo.thumbnailUrl}
                    alt={heroVideo.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                      isPureNoir ? 'grayscale contrast-125' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Big Center Play Circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </div>
                  </div>

                  {/* Corner Badges */}
                  <div className="absolute bottom-3 left-3 bg-black/80 border border-zinc-700 text-white font-mono text-xs px-2.5 py-1">
                    4K ULTRA HD · DIRECTORS CUT
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 border border-zinc-700 text-white font-mono text-xs px-2 py-1 tabular-nums">
                    {heroVideo.durationFormatted}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter and Taxonomy Bar */}
      <TagFilterBar />

      {/* Main Video Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Results Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
              <Film className="w-4 h-4 text-zinc-400" />
              <span>Catalog Releases</span>
            </h2>
            <span className="text-xs font-mono text-zinc-400 tabular-nums">
              ({filteredVideos.length})
            </span>
          </div>

          {(searchQuery || selectedTags.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery('');
                clearTags();
              }}
              className="text-xs font-mono text-zinc-400 hover:text-white underline min-h-[44px] px-2"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 ? (
          <div className="py-20 text-center bg-zinc-950 border border-zinc-800 p-8 space-y-3">
            <Film className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white font-mono uppercase">
              No matching videos found
            </h3>
            <p className="text-xs font-mono text-zinc-400 max-w-sm mx-auto">
              No videos match your active query or tag combinations. Try clearing some tags or search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                clearTags();
              }}
              className="min-h-[44px] px-4 py-2 bg-white text-black text-xs font-mono font-bold uppercase hover:bg-zinc-200 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

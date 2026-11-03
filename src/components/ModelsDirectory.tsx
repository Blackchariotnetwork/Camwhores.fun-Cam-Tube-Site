import React from 'react';
import { useTube } from '../context/TubeContext';
import { AnimatedLogo } from './AnimatedLogo';
import { CheckCircle, Eye, Film, Users, ArrowUpRight } from 'lucide-react';
import { ModelProfile } from '../types';

export const ModelsDirectory: React.FC = () => {
  const {
    models,
    setSelectedModelId,
    subscribedModelIds,
    toggleSubscribeModel,
    isPureNoir,
  } = useTube();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Directory Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Verified Creator Bios & Models
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1 max-w-xl">
            Explore exclusive verified performers, directors, and models. View detailed physical specs, platform rankings, and complete production video filmographies.
          </p>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          Showing <span className="text-white font-bold">{models.length}</span> creators
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => {
          const isSubscribed = subscribedModelIds.includes(model.id);
          return (
            <div
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              className="group bg-zinc-950 border border-zinc-800/80 hover:border-white transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Model Top Cover/Avatar area */}
                <div className="relative aspect-[16/10] bg-zinc-900 overflow-hidden">
                  <img
                    src={model.coverUrl}
                    alt={model.stageName}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                      isPureNoir ? 'grayscale contrast-125' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 bg-black/90 border border-zinc-700 text-[10px] font-mono font-bold px-2 py-0.5 text-white">
                    RANK #{model.rank}
                  </div>

                  {/* Avatar inset */}
                  <div className="absolute bottom-3 left-3 flex items-end gap-3">
                    <div className="w-14 h-14 bg-black border-2 border-white overflow-hidden shadow-xl shrink-0">
                      {model.id === 'model-koneko' ? (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                          <AnimatedLogo size="sm" monochrome={isPureNoir} />
                        </div>
                      ) : (
                        <img
                          src={model.avatarUrl}
                          alt={model.stageName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-bold text-white group-hover:underline">
                          {model.stageName}
                        </span>
                        {model.verified && (
                          <span className="bg-white text-black text-[9px] font-mono font-bold px-1">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-zinc-300">
                        {model.city}, {model.country}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio text teaser */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {model.bio}
                  </p>

                  {/* Unboxed Stats */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-zinc-900 text-[11px] font-mono">
                    <div>
                      <span className="text-zinc-600 block text-[9px] uppercase">Subs</span>
                      <span className="text-white font-bold tabular-nums">
                        {(model.subscriberCount / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block text-[9px] uppercase">Views</span>
                      <span className="text-white font-bold tabular-nums">
                        {(model.totalViews / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block text-[9px] uppercase">Videos</span>
                      <span className="text-white font-bold tabular-nums">
                        {model.videoCount}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-zinc-400">
                    {model.tags.map((tag) => (
                      <span key={tag} className="bg-zinc-900 border border-zinc-800 px-2 py-0.5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action footer */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-zinc-900 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSubscribeModel(model.id);
                  }}
                  className={`flex-1 min-h-[44px] text-xs font-mono font-bold uppercase transition-colors ${
                    isSubscribed
                      ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
                <div className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

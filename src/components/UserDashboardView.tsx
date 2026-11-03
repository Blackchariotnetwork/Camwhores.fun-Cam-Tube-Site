import React, { useState } from 'react';
import { useTube } from '../context/TubeContext';
import { VideoCard } from './VideoCard';
import { AnimatedLogo } from './AnimatedLogo';
import {
  Clock,
  Bookmark,
  Heart,
  Users,
  Play,
  Trash2,
  CheckCircle,
  BarChart2,
  Download,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const UserDashboardView: React.FC = () => {
  const {
    watchHistory,
    clearWatchHistory,
    removeWatchHistoryItem,
    videos,
    models,
    savedVideoIds,
    likedVideoIds,
    subscribedModelIds,
    setActiveVideo,
    setSelectedModelId,
    setActiveTab,
    showToast,
    isPureNoir,
  } = useTube();

  const [activeTab, setActiveTabState] = useState<'history' | 'saved' | 'liked' | 'subs' | 'stats'>('history');

  // Map history items to video objects
  const historyVideosWithProgress = watchHistory
    .map((item) => {
      const video = videos.find((v) => v.id === item.videoId);
      return { item, video };
    })
    .filter((entry): entry is { item: typeof entry.item; video: NonNullable<typeof entry.video> } => !!entry.video);

  const savedVideos = videos.filter((v) => savedVideoIds.includes(v.id));
  const likedVideos = videos.filter((v) => likedVideoIds.includes(v.id));
  const subscribedModels = models.filter((m) => subscribedModelIds.includes(m.id));

  // Compute viewing metrics
  const totalWatchedSeconds = watchHistory.reduce((acc, h) => acc + h.progressSec, 0);
  const totalHours = (totalWatchedSeconds / 3600).toFixed(1);
  const completedCount = watchHistory.filter((h) => h.completed).length;

  const handleResumeVideo = (video: any, progressSec: number) => {
    setActiveVideo(video);
  };

  const handleExportData = () => {
    const data = {
      watchHistory,
      savedVideoIds,
      likedVideoIds,
      subscribedModelIds,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `koneko-tube-history-${Date.now()}.json`;
    a.click();
    showToast('Exported watch history & preferences');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* User Header Profile */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-black border-2 border-white overflow-hidden shadow-2xl shrink-0">
            <AnimatedLogo size="md" monochrome={isPureNoir} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                Personal Viewer Dashboard
              </h1>
              <span className="bg-white text-black text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase">
                VIP
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Member · Real-time local storage watch synchronization
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="min-h-[44px] px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-white text-xs font-mono uppercase flex items-center gap-2 transition-colors"
            title="Export Watch History JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Data</span>
          </button>
        </div>
      </div>

      {/* 4-Stat Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-zinc-950 border border-zinc-800 p-4">
          <span className="text-zinc-500 uppercase text-[10px] block">Videos Watched</span>
          <span className="text-2xl font-black text-white mt-1 block tabular-nums">
            {watchHistory.length}
          </span>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">
            {completedCount} finished
          </span>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-4">
          <span className="text-zinc-500 uppercase text-[10px] block">Hours Watched</span>
          <span className="text-2xl font-black text-white mt-1 block tabular-nums">
            {totalHours}h
          </span>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">
            {(totalWatchedSeconds / 60).toFixed(0)} mins logged
          </span>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-4">
          <span className="text-zinc-500 uppercase text-[10px] block">Saved Watchlist</span>
          <span className="text-2xl font-black text-white mt-1 block tabular-nums">
            {savedVideos.length}
          </span>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">
            Bookmarked clips
          </span>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-4">
          <span className="text-zinc-500 uppercase text-[10px] block">Subscribed Models</span>
          <span className="text-2xl font-black text-white mt-1 block tabular-nums">
            {subscribedModels.length}
          </span>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">
            Followed creators
          </span>
        </div>
      </div>

      {/* Dashboard Navigation Tabs */}
      <div className="flex items-center gap-2 sm:gap-4 border-b border-zinc-800 text-xs font-mono uppercase tracking-wider overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTabState('history')}
          className={`pb-3 border-b-2 transition-colors min-h-[44px] flex items-center gap-1.5 whitespace-nowrap px-1 ${
            activeTab === 'history'
              ? 'border-white text-white font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          Watch History ({watchHistory.length})
        </button>

        <button
          onClick={() => setActiveTabState('saved')}
          className={`pb-3 border-b-2 transition-colors min-h-[44px] flex items-center gap-1.5 whitespace-nowrap px-1 ${
            activeTab === 'saved'
              ? 'border-white text-white font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved Watchlist ({savedVideos.length})
        </button>

        <button
          onClick={() => setActiveTabState('liked')}
          className={`pb-3 border-b-2 transition-colors min-h-[44px] flex items-center gap-1.5 whitespace-nowrap px-1 ${
            activeTab === 'liked'
              ? 'border-white text-white font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          Liked Videos ({likedVideos.length})
        </button>

        <button
          onClick={() => setActiveTabState('subs')}
          className={`pb-3 border-b-2 transition-colors min-h-[44px] flex items-center gap-1.5 whitespace-nowrap px-1 ${
            activeTab === 'subs'
              ? 'border-white text-white font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Subscribed Models ({subscribedModels.length})
        </button>
      </div>

      {/* TAB 1: WATCH HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">
              Showing chronologically tracked viewing sessions
            </span>
            {watchHistory.length > 0 && (
              <button
                onClick={clearWatchHistory}
                className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 min-h-[44px] px-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All History
              </button>
            )}
          </div>

          {historyVideosWithProgress.length === 0 ? (
            <div className="py-16 text-center bg-zinc-950 border border-zinc-900 p-8 space-y-3">
              <Clock className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-mono text-zinc-400">
                Your watch history is currently empty.
              </p>
              <button
                onClick={() => setActiveTab('feed')}
                className="min-h-[44px] px-4 py-2 bg-white text-black text-xs font-mono font-bold uppercase hover:bg-zinc-200 transition-colors"
              >
                Browse Videos Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {historyVideosWithProgress.map(({ item, video }) => (
                <div
                  key={item.videoId}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  {/* Left: Thumbnail & Progress */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      onClick={() => handleResumeVideo(video, item.progressSec)}
                      className="relative w-32 aspect-video bg-zinc-900 shrink-0 cursor-pointer overflow-hidden group"
                    >
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                        <Play className="w-5 h-5 text-white fill-current" />
                      </div>
                      {/* Progress bar on thumbnail */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                        <div
                          className={`h-full ${item.completed ? 'bg-zinc-400' : 'bg-white'}`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => handleResumeVideo(video, item.progressSec)}
                        className="text-sm font-bold text-white hover:underline cursor-pointer truncate"
                      >
                        {video.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs font-mono text-zinc-400">
                        <span className="text-zinc-300">{video.modelName}</span>
                        <span>·</span>
                        <span>{video.category}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-zinc-500 tabular-nums">
                        <span>
                          {item.completed
                            ? 'Finished (100%)'
                            : `Watched ${item.percent}% (${Math.floor(item.progressSec / 60)}:${(item.progressSec % 60).toString().padStart(2, '0')})`}
                        </span>
                        <span>·</span>
                        <span>{new Date(item.watchedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleResumeVideo(video, item.progressSec)}
                      className="min-h-[44px] px-4 py-2 bg-white text-black text-xs font-mono font-bold uppercase hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{item.completed ? 'Replay' : 'Resume'}</span>
                    </button>
                    <button
                      onClick={() => removeWatchHistoryItem(video.id)}
                      className="min-h-[44px] min-w-[44px] p-2 text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 flex items-center justify-center transition-colors"
                      title="Remove from history"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED WATCHLIST */}
      {activeTab === 'saved' && (
        <div>
          {savedVideos.length === 0 ? (
            <div className="py-16 text-center bg-zinc-950 border border-zinc-900 p-8">
              <Bookmark className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-mono text-zinc-400">
                No saved videos in your watchlist yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {savedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LIKED VIDEOS */}
      {activeTab === 'liked' && (
        <div>
          {likedVideos.length === 0 ? (
            <div className="py-16 text-center bg-zinc-950 border border-zinc-900 p-8">
              <Heart className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-mono text-zinc-400">
                You haven't liked any videos yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {likedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SUBSCRIBED MODELS */}
      {activeTab === 'subs' && (
        <div>
          {subscribedModels.length === 0 ? (
            <div className="py-16 text-center bg-zinc-950 border border-zinc-900 p-8">
              <Users className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-mono text-zinc-400">
                You aren't subscribed to any creators yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscribedModels.map((model) => (
                <div
                  key={model.id}
                  onClick={() => {
                    setSelectedModelId(model.id);
                    setActiveTab('models');
                  }}
                  className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 hover:border-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black border border-zinc-700 overflow-hidden shrink-0">
                      <img
                        src={model.avatarUrl}
                        alt={model.stageName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">
                          {model.stageName}
                        </span>
                        {model.verified && (
                          <span className="text-[10px] bg-white text-black font-bold px-1">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-zinc-400">
                        {(model.subscriberCount / 1000).toFixed(0)}K subscribers
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    View Bio →
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

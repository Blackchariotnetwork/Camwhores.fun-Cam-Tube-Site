import React, { useState, useRef } from 'react';
import { Video } from '../types';
import { useTube } from '../context/TubeContext';
import { Play, Bookmark, Heart, Check, Clock } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  priority?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const {
    setActiveVideo,
    setSelectedModelId,
    setActiveTab,
    savedVideoIds,
    toggleSaveVideo,
    likedVideoIds,
    toggleLikeVideo,
    watchHistory,
    isPureNoir,
  } = useTube();

  const [isHovered, setIsHovered] = useState(false);
  const [scrubPercent, setScrubPercent] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const isSaved = savedVideoIds.includes(video.id);
  const isLiked = likedVideoIds.includes(video.id);
  const historyItem = watchHistory.find((h) => h.videoId === video.id);

  // Calculate scrub time on mouse move or touch move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = x / rect.width;
    setScrubPercent(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !e.touches[0]) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = x / rect.width;
    setScrubPercent(percent);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setScrubPercent(null);
  };

  const formatScrubTime = (percent: number) => {
    const currentSec = Math.floor(video.duration * percent);
    const mins = Math.floor(currentSec / 60);
    const secs = currentSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const openModelProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedModelId(video.modelId);
    setActiveTab('models');
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveVideo(video.id);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLikeVideo(video.id);
  };

  return (
    <div
      onClick={() => setActiveVideo(video)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={handleMouseLeave}
      className="group flex flex-col cursor-pointer bg-zinc-950 border border-zinc-800/80 hover:border-zinc-500 transition-all duration-200 select-none overflow-hidden"
    >
      {/* 16:9 Thumbnail Container */}
      <div
        ref={cardRef}
        className="relative aspect-video w-full overflow-hidden bg-zinc-900"
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          } ${isPureNoir ? 'grayscale contrast-125' : 'contrast-105'}`}
        />

        {/* Dark contrast vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Quality Badge (Top Left) */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
          <span className="bg-black/90 text-white border border-zinc-600 text-[10px] font-mono font-bold px-1.5 py-0.5 tracking-wider uppercase">
            {video.quality}
          </span>
          {video.isTrending && (
            <span className="bg-white text-black text-[9px] font-mono font-black px-1.5 py-0.5 tracking-wider uppercase">
              HOT
            </span>
          )}
        </div>

        {/* Duration Badge (Bottom Right) */}
        <div className="absolute bottom-2 right-2 z-10">
          <span className="bg-black/90 text-white font-mono text-[11px] font-medium px-2 py-0.5 border border-zinc-700 tabular-nums">
            {scrubPercent !== null
              ? formatScrubTime(scrubPercent)
              : video.durationFormatted}
          </span>
        </div>

        {/* Center Play Button on Hover */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-12 h-12 bg-white text-black flex items-center justify-center shadow-2xl transform active:scale-95 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Quick Action Overlay Buttons (Top Right) */}
        <div
          className={`absolute top-2 right-2 flex items-center gap-1.5 z-20 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleLikeClick}
            className={`p-1.5 border min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors ${
              isLiked
                ? 'bg-white text-black border-white'
                : 'bg-black/80 text-white border-zinc-700 hover:border-white'
            }`}
            title="Like Video"
            aria-label="Like Video"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleSaveClick}
            className={`p-1.5 border min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors ${
              isSaved
                ? 'bg-white text-black border-white'
                : 'bg-black/80 text-white border-zinc-700 hover:border-white'
            }`}
            title="Watch Later"
            aria-label="Watch Later"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Interactive Scrubbing Bar (Bottom of Thumbnail) */}
        {scrubPercent !== null && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 z-20">
            <div
              className="h-full bg-white transition-all duration-75"
              style={{ width: `${Math.round(scrubPercent * 100)}%` }}
            />
          </div>
        )}

        {/* Watch History Progress Indicator if previously watched */}
        {historyItem && scrubPercent === null && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800/80 z-10">
            <div
              className={`h-full ${
                historyItem.completed ? 'bg-zinc-400' : 'bg-white'
              }`}
              style={{ width: `${historyItem.percent}%` }}
            />
          </div>
        )}
      </div>

      {/* Video Details & Typography */}
      <div className="p-3 flex gap-3 flex-1">
        {/* Model Avatar */}
        <button
          onClick={openModelProfile}
          className="shrink-0 w-9 h-9 border border-zinc-700 overflow-hidden hover:border-white transition-colors focus:outline-none"
          title={`View ${video.modelName}'s profile`}
        >
          <img
            src={video.modelAvatar}
            alt={video.modelName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </button>

        {/* Title & Metadata */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-zinc-300 transition-colors">
            {video.title}
          </h3>

          {/* Model Link */}
          <div className="mt-1 flex items-center gap-1.5">
            <button
              onClick={openModelProfile}
              className="text-xs font-medium text-zinc-300 hover:text-white transition-colors truncate focus:outline-none"
            >
              {video.modelName}
            </button>
            <span className="w-1 h-1 bg-zinc-600 rounded-full" />
            <span className="text-[11px] font-mono text-zinc-400">
              {video.category}
            </span>
          </div>

          {/* Clean Unboxed Metadata Line (No pills, quiet typographic separators) */}
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 tabular-nums">
            <span>{(video.views / 1000).toFixed(0)}K views</span>
            <span aria-hidden="true">·</span>
            <span>{video.ratingPercentage}% rating</span>
            <span aria-hidden="true">·</span>
            <span>{video.uploadedAt}</span>
          </div>

          {/* Tags list (quiet inline text) */}
          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-400">
            {video.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="hover:text-white transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

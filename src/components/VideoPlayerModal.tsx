import React, { useState, useRef, useEffect } from 'react';
import { useTube } from '../context/TubeContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Heart,
  Bookmark,
  Share2,
  Check,
  Contrast,
  Sliders,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Tv,
} from 'lucide-react';
import { Video } from '../types';

interface Comment {
  id: string;
  author: string;
  timeAgo: string;
  text: string;
  likes: number;
}

export const VideoPlayerModal: React.FC = () => {
  const {
    activeVideo,
    setActiveVideo,
    videos,
    models,
    setSelectedModelId,
    setActiveTab,
    toggleTag,
    toggleLikeVideo,
    likedVideoIds,
    toggleSaveVideo,
    savedVideoIds,
    subscribedModelIds,
    toggleSubscribeModel,
    recordWatchProgress,
    watchHistory,
    showToast,
    isPureNoir,
  } = useTube();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isNoirFilter, setIsNoirFilter] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Comments state
  const [newCommentText, setNewCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      author: 'StudioKuro',
      timeAgo: '1 day ago',
      text: 'The dynamic range in these shadow scenes is incredible. True monochrome mastery.',
      likes: 42,
    },
    {
      id: 'c2',
      author: 'CinematographerGuy',
      timeAgo: '2 days ago',
      text: 'What lens was used for the rain reflections at 04:30? Flawless bokeh.',
      likes: 19,
    },
    {
      id: 'c3',
      author: 'NoirVoyeur',
      timeAgo: '3 days ago',
      text: 'Koneko always delivers the best high-contrast aesthetics. Subscribed instantly.',
      likes: 31,
    },
  ]);

  if (!activeVideo) return null;

  const isLiked = likedVideoIds.includes(activeVideo.id);
  const isSaved = savedVideoIds.includes(activeVideo.id);
  const isSubscribed = subscribedModelIds.includes(activeVideo.modelId);
  const model = models.find((m) => m.id === activeVideo.modelId);

  // Resume progress if in watch history
  useEffect(() => {
    const historyItem = watchHistory.find((h) => h.videoId === activeVideo.id);
    if (historyItem && historyItem.progressSec > 5 && !historyItem.completed) {
      if (videoRef.current) {
        videoRef.current.currentTime = historyItem.progressSec;
        setCurrentTime(historyItem.progressSec);
      }
    }
  }, [activeVideo.id]);

  // Periodic watch progress recording
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused && duration > 0) {
        recordWatchProgress(activeVideo.id, videoRef.current.currentTime, duration);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeVideo.id, duration]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      recordWatchProgress(activeVideo.id, videoRef.current.currentTime, duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.parentElement?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Video link copied to clipboard');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newC: Comment = {
      id: `c-${Date.now()}`,
      author: 'You (Viewer)',
      timeAgo: 'Just now',
      text: newCommentText.trim(),
      likes: 1,
    };
    setComments([newC, ...comments]);
    setNewCommentText('');
    showToast('Comment posted');
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const relatedVideos = videos
    .filter((v) => v.id !== activeVideo.id)
    .slice(0, 4);

  const handleTagClick = (tag: string) => {
    toggleTag(tag);
    setActiveVideo(null);
    setActiveTab('feed');
  };

  const handleModelClick = () => {
    setSelectedModelId(activeVideo.modelId);
    setActiveVideo(null);
    setActiveTab('models');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-xl flex flex-col justify-start">
      {/* Modal Top Close Bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-black/90 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Playing Cinema Cut
          </span>
          <span className="text-zinc-600">·</span>
          <span className="text-xs font-mono text-zinc-300 truncate max-w-xs sm:max-w-md">
            {activeVideo.title}
          </span>
        </div>
        <button
          onClick={() => {
            if (videoRef.current) {
              recordWatchProgress(activeVideo.id, videoRef.current.currentTime, duration);
            }
            setActiveVideo(null);
          }}
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 hover:text-white transition-colors border border-zinc-800 hover:border-white"
          aria-label="Close Player"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className={`w-full mx-auto transition-all duration-300 ${isCinemaMode ? 'max-w-full px-0' : 'max-w-5xl px-4 sm:px-6 py-6'}`}>
        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black border border-zinc-800 overflow-hidden group">
          <video
            ref={videoRef}
            src={activeVideo.videoUrl}
            poster={activeVideo.thumbnailUrl}
            autoPlay
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            className={`w-full h-full object-contain cursor-pointer transition-all ${
              isNoirFilter || isPureNoir
                ? 'grayscale contrast-125 brightness-95'
                : ''
            }`}
          />

          {/* Big Center Play/Pause Indicator when paused */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
            >
              <div className="w-16 h-16 bg-white text-black flex items-center justify-center shadow-2xl">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Minimalist Player Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 sm:p-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Scrubber Bar */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-zinc-700 accent-white cursor-pointer"
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between gap-2 text-white text-xs font-mono">
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="p-1 hover:text-zinc-300 focus:outline-none min-h-[36px] min-w-[36px] flex items-center justify-center"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current" />
                  )}
                </button>

                {/* Volume */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={toggleMute}
                    className="p-1 hover:text-zinc-300 min-h-[36px] min-w-[36px] flex items-center justify-center"
                    aria-label="Mute / Unmute"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-14 sm:w-20 h-1 bg-zinc-700 accent-white hidden sm:inline-block cursor-pointer"
                  />
                </div>

                {/* Time Display */}
                <span className="text-[11px] tabular-nums text-zinc-300">
                  {formatSeconds(currentTime)} / {formatSeconds(duration || activeVideo.duration)}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* Noir B&W toggle */}
                <button
                  onClick={() => setIsNoirFilter(!isNoirFilter)}
                  className={`px-2 py-1 text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                    isNoirFilter
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-white'
                  }`}
                  title="Toggle Noir B&W Grade"
                >
                  <Contrast className="w-3 h-3" />
                  <span className="hidden sm:inline">B&W NOIR</span>
                </button>

                {/* Speed selector */}
                <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-700 px-1.5 py-0.5">
                  <span className="text-[10px] text-zinc-400">SPD:</span>
                  <select
                    value={playbackRate}
                    onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                    className="bg-transparent text-white text-[10px] focus:outline-none cursor-pointer"
                  >
                    <option value={0.5} className="bg-zinc-900 text-white">0.5x</option>
                    <option value={1} className="bg-zinc-900 text-white">1.0x</option>
                    <option value={1.25} className="bg-zinc-900 text-white">1.25x</option>
                    <option value={1.5} className="bg-zinc-900 text-white">1.5x</option>
                    <option value={2} className="bg-zinc-900 text-white">2.0x</option>
                  </select>
                </div>

                {/* Cinema Mode Toggle */}
                <button
                  onClick={() => setIsCinemaMode(!isCinemaMode)}
                  className={`p-1.5 border min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors ${
                    isCinemaMode
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-white'
                  }`}
                  title="Cinema Mode"
                >
                  <Tv className="w-3.5 h-3.5" />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 bg-zinc-900 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white min-h-[36px] min-w-[36px] flex items-center justify-center"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info Section */}
        <div className="mt-4 px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {activeVideo.title}
              </h1>
              {/* Unboxed metadata line */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 tabular-nums">
                <span className="text-white font-semibold">{activeVideo.views.toLocaleString()} views</span>
                <span aria-hidden="true">·</span>
                <span>{activeVideo.uploadedAt}</span>
                <span aria-hidden="true">·</span>
                <span className="text-white font-bold">{activeVideo.ratingPercentage}% Rating</span>
                <span aria-hidden="true">·</span>
                <span className="border border-zinc-700 px-1 py-0.2 text-[10px] text-zinc-300">
                  {activeVideo.quality}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleLikeVideo(activeVideo.id)}
                className={`min-h-[44px] px-3 py-1.5 border flex items-center gap-1.5 text-xs font-mono uppercase transition-colors ${
                  isLiked
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{activeVideo.likes}</span>
              </button>

              <button
                onClick={() => toggleSaveVideo(activeVideo.id)}
                className={`min-h-[44px] px-3 py-1.5 border flex items-center gap-1.5 text-xs font-mono uppercase transition-colors ${
                  isSaved
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Watch Later'}</span>
              </button>

              <button
                onClick={handleShare}
                className="min-h-[44px] px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-white hover:text-white flex items-center gap-1.5 text-xs font-mono uppercase transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Model Bio Spotlight Card */}
          <div className="py-4 border-b border-zinc-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleModelClick}
                className="w-12 h-12 border border-zinc-700 overflow-hidden hover:border-white transition-colors shrink-0"
              >
                <img
                  src={activeVideo.modelAvatar}
                  alt={activeVideo.modelName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
              <div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleModelClick}
                    className="text-base font-bold text-white hover:underline"
                  >
                    {activeVideo.modelName}
                  </button>
                  {model?.verified && (
                    <span className="text-[10px] font-mono bg-white text-black px-1 font-bold">
                      VERIFIED
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-zinc-400 mt-0.5">
                  {model?.subscriberCount.toLocaleString()} subscribers · {model?.city}, {model?.country}
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleSubscribeModel(activeVideo.modelId)}
              className={`min-h-[44px] px-4 py-1.5 text-xs font-bold font-mono uppercase tracking-wider transition-colors ${
                isSubscribed
                  ? 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700'
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Description & Tags */}
          <div className="py-4 border-b border-zinc-800 space-y-3">
            <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
              {activeVideo.description}
            </p>

            {/* Clickable tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {activeVideo.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-2 py-1 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Comments Section & Up Next Grid */}
          <div className="py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Comments */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                  Community Discussion ({comments.length})
                </h3>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Add a high-contrast critique or comment..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs px-3.5 py-2.5 focus:outline-none focus:border-white font-mono"
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-4 bg-white text-black text-xs font-bold uppercase font-mono hover:bg-zinc-200 transition-colors shrink-0"
                >
                  Post
                </button>
              </form>

              {/* Comments list */}
              <div className="space-y-4">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 bg-zinc-950 border border-zinc-900 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white font-bold">{c.author}</span>
                      <span className="text-zinc-500">{c.timeAgo}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {c.text}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                      <Heart className="w-3 h-3" />
                      <span>{c.likes} likes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Up Next Queue */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold uppercase tracking-wider">
                  Up Next
                </span>
                <span className="text-zinc-500">Autoplay ON</span>
              </div>

              <div className="space-y-3">
                {relatedVideos.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveVideo(item)}
                    className="flex gap-3 group cursor-pointer bg-zinc-950 p-2 border border-zinc-900 hover:border-zinc-700 transition-colors"
                  >
                    <div className="relative w-28 aspect-video bg-zinc-900 shrink-0 overflow-hidden">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/90 text-white font-mono text-[9px] px-1">
                        {item.durationFormatted}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-zinc-300">
                        {item.title}
                      </h4>
                      <p className="text-[10px] font-mono text-zinc-400 mt-1">
                        {item.modelName}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 tabular-nums">
                        {(item.views / 1000).toFixed(0)}K views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useTube } from '../context/TubeContext';
import { VideoCard } from './VideoCard';
import { AnimatedLogo } from './AnimatedLogo';
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  Video as VideoIcon,
  Users,
  Award,
  Globe,
  Share2,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface ModelProfileViewProps {
  modelId: string;
  onBack: () => void;
}

export const ModelProfileView: React.FC<ModelProfileViewProps> = ({ modelId, onBack }) => {
  const {
    models,
    videos,
    subscribedModelIds,
    toggleSubscribeModel,
    showToast,
    isPureNoir,
  } = useTube();

  const model = models.find((m) => m.id === modelId) || models[0];
  const isSubscribed = subscribedModelIds.includes(model.id);
  const [activeTab, setActiveTab] = useState<'videos' | 'bio' | 'details'>('videos');

  // Videos by this model
  const modelVideos = videos.filter((v) => v.modelId === model.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(`Copied ${model.stageName}'s profile link`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Top back navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase text-zinc-400 hover:text-white transition-colors min-h-[44px] px-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
      </div>

      {/* Model Cover Banner */}
      <div className="relative w-full h-48 sm:h-72 lg:h-80 bg-zinc-900 overflow-hidden border-y border-zinc-800">
        <img
          src={model.coverUrl}
          alt={`${model.stageName} Cover`}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover ${isPureNoir ? 'grayscale contrast-125' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Profile Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800">
          {/* Avatar and Name */}
          <div className="flex items-end gap-4 sm:gap-6">
            <div className="relative w-24 h-24 sm:w-36 sm:h-36 bg-black border-2 border-white overflow-hidden shadow-2xl shrink-0">
              {model.id === 'model-koneko' ? (
                <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                  <AnimatedLogo size="lg" monochrome={isPureNoir} />
                </div>
              ) : (
                <img
                  src={model.avatarUrl}
                  alt={model.stageName}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover ${isPureNoir ? 'grayscale contrast-125' : ''}`}
                />
              )}
            </div>

            <div className="space-y-1 mb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  {model.stageName}
                </h1>
                {model.verified && (
                  <span className="bg-white text-black text-[10px] font-mono font-black px-1.5 py-0.5 uppercase tracking-wider">
                    VERIFIED
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-zinc-400">
                {model.name} · {model.city}, {model.country} · Rank #{model.rank}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleSubscribeModel(model.id)}
              className={`min-h-[44px] px-6 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                isSubscribed
                  ? 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700'
                  : 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>

            <button
              onClick={handleShare}
              className="min-h-[44px] p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-white transition-colors"
              title="Share Model Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-KPI Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-zinc-800 text-xs font-mono">
          <div className="bg-zinc-950 border border-zinc-800 p-3">
            <span className="text-zinc-500 uppercase text-[10px]">Subscribers</span>
            <p className="text-lg font-bold text-white mt-1 tabular-nums">
              {model.subscriberCount.toLocaleString()}
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-3">
            <span className="text-zinc-500 uppercase text-[10px]">Total Views</span>
            <p className="text-lg font-bold text-white mt-1 tabular-nums">
              {(model.totalViews / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-3">
            <span className="text-zinc-500 uppercase text-[10px]">Videos Released</span>
            <p className="text-lg font-bold text-white mt-1 tabular-nums">
              {modelVideos.length}
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-3">
            <span className="text-zinc-500 uppercase text-[10px]">Platform Rank</span>
            <p className="text-lg font-bold text-white mt-1 tabular-nums">
              Top #{model.rank} Creator
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 border-b border-zinc-800 my-6 text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 border-b-2 transition-colors min-h-[44px] flex items-center ${
              activeTab === 'videos'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Videos ({modelVideos.length})
          </button>
          <button
            onClick={() => setActiveTab('bio')}
            className={`pb-3 border-b-2 transition-colors min-h-[44px] flex items-center ${
              activeTab === 'bio'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Bio & Specs
          </button>
        </div>

        {/* Tab Content: Videos */}
        {activeTab === 'videos' && (
          <div>
            {modelVideos.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 font-mono text-xs">
                No videos published by this creator yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {modelVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Bio & Physical Specs */}
        {activeTab === 'bio' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-400 mb-2">
                  Creator Biography
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">
                  {model.bio}
                </p>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-400 mb-2">
                  Specialties & Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Model Physical Specs Table */}
            <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white pb-2 border-b border-zinc-800">
                Model Profile Specs
              </h3>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Origin</span>
                  <span className="text-white font-medium">{model.city}, {model.country}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Age</span>
                  <span className="text-white font-medium">{model.age} years</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Height</span>
                  <span className="text-white font-medium">{model.height}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Hair</span>
                  <span className="text-white font-medium">{model.hairColor}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Eyes</span>
                  <span className="text-white font-medium">{model.eyeColor}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Status</span>
                  <span className="text-white font-medium">Active · Verified</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono block mb-2">
                  Official Channels
                </span>
                <div className="space-y-1.5 text-xs font-mono">
                  {model.socials.twitter && (
                    <div className="text-zinc-400 hover:text-white flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3 text-zinc-500" />
                      <span>{model.socials.twitter}</span>
                    </div>
                  )}
                  {model.socials.instagram && (
                    <div className="text-zinc-400 hover:text-white flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3 text-zinc-500" />
                      <span>{model.socials.instagram}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useTube } from '../context/TubeContext';
import {
  PlusSquare,
  Trash2,
  Edit3,
  Film,
  Users,
  Check,
  X,
  Upload,
  RefreshCw,
  Eye,
  Sliders,
} from 'lucide-react';
import { Video, ModelProfile } from '../types';

export const CMSPanel: React.FC = () => {
  const {
    videos,
    models,
    categories,
    allTags,
    addVideo,
    updateVideo,
    deleteVideo,
    addModel,
    updateModel,
    deleteModel,
    resetToDefaults,
    setActiveVideo,
    showToast,
  } = useTube();

  const [activeTab, setActiveTab] = useState<'videos' | 'models'>('videos');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  // New/Edit Video Form State
  const [videoForm, setVideoForm] = useState({
    title: '',
    modelId: models[0]?.id || '',
    category: 'Cinematic Noir',
    quality: '4K' as '4K' | '1080p' | '60FPS',
    durationFormatted: '12:30',
    tags: 'Noir, 4K, Studio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    description: 'High-contrast monochrome cinema piece.',
  });

  // Open Add Video Modal
  const openAddVideo = () => {
    setEditingVideoId(null);
    setVideoForm({
      title: '',
      modelId: models[0]?.id || '',
      category: 'Cinematic Noir',
      quality: '4K',
      durationFormatted: '12:30',
      tags: 'Noir, 4K, Studio',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      description: 'High-contrast monochrome cinema piece.',
    });
    setShowVideoModal(true);
  };

  // Open Edit Video Modal
  const openEditVideo = (video: Video) => {
    setEditingVideoId(video.id);
    setVideoForm({
      title: video.title,
      modelId: video.modelId,
      category: video.category,
      quality: video.quality,
      durationFormatted: video.durationFormatted,
      tags: video.tags.join(', '),
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      description: video.description,
    });
    setShowVideoModal(true);
  };

  // Submit Video
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title.trim()) {
      showToast('Video title is required');
      return;
    }

    const tagsArray = videoForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // parse duration formatted (mm:ss) into seconds
    const parts = videoForm.durationFormatted.split(':');
    let totalSec = 600;
    if (parts.length === 2) {
      totalSec = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }

    if (editingVideoId) {
      updateVideo(editingVideoId, {
        title: videoForm.title,
        modelId: videoForm.modelId,
        modelName: models.find((m) => m.id === videoForm.modelId)?.stageName || 'Koneko Noir',
        modelAvatar: models.find((m) => m.id === videoForm.modelId)?.avatarUrl || '',
        category: videoForm.category,
        quality: videoForm.quality,
        duration: totalSec,
        durationFormatted: videoForm.durationFormatted,
        tags: tagsArray,
        thumbnailUrl: videoForm.thumbnailUrl,
        videoUrl: videoForm.videoUrl,
        description: videoForm.description,
      });
    } else {
      addVideo({
        title: videoForm.title,
        modelId: videoForm.modelId,
        category: videoForm.category,
        quality: videoForm.quality,
        duration: totalSec,
        durationFormatted: videoForm.durationFormatted,
        tags: tagsArray,
        thumbnailUrl: videoForm.thumbnailUrl,
        videoUrl: videoForm.videoUrl,
        description: videoForm.description,
      });
    }

    setShowVideoModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Studio Banner */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-white text-black px-1.5 py-0.5 uppercase">
              CMS Studio
            </span>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              Content Management System
            </h1>
          </div>
          <p className="text-xs font-mono text-zinc-400 mt-1 max-w-xl">
            Full admin control over videos, model profiles, category taxonomy, and tag indexes. All edits are persisted live in client storage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openAddVideo}
            className="min-h-[44px] px-4 py-2 bg-white text-black text-xs font-mono font-bold uppercase hover:bg-zinc-200 transition-colors flex items-center gap-2"
          >
            <PlusSquare className="w-4 h-4" />
            <span>Upload New Video</span>
          </button>

          <button
            onClick={resetToDefaults}
            className="min-h-[44px] px-3.5 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 text-xs font-mono uppercase flex items-center gap-1.5 transition-colors"
            title="Reset to factory sample catalog"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-zinc-800 text-xs font-mono uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('videos')}
          className={`pb-3 border-b-2 transition-colors min-h-[44px] flex items-center gap-1.5 ${
            activeTab === 'videos'
              ? 'border-white text-white font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          Manage Videos ({videos.length})
        </button>
        <button
          onClick={() => setActiveTab('models')}
          className={`pb-3 border-b-2 transition-colors min-h-[44px] flex items-center gap-1.5 ${
            activeTab === 'models'
              ? 'border-white text-white font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Manage Models ({models.length})
        </button>
      </div>

      {/* TAB 1: VIDEOS TABLE */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <div className="overflow-x-auto bg-zinc-950 border border-zinc-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Video</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Creator</th>
                  <th className="py-3 px-4 hidden md:table-cell">Category</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Quality</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Views</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {videos.map((video) => (
                  <tr key={video.id} className="hover:bg-zinc-900/50 transition-colors">
                    {/* Video cell */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 aspect-video bg-zinc-900 shrink-0 overflow-hidden border border-zinc-800">
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-white truncate">
                            {video.title}
                          </p>
                          <span className="text-[10px] text-zinc-400">
                            {video.durationFormatted}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Creator */}
                    <td className="py-3 px-4 hidden sm:table-cell whitespace-nowrap">
                      {video.modelName}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 hidden md:table-cell whitespace-nowrap text-zinc-400">
                      {video.category}
                    </td>

                    {/* Quality */}
                    <td className="py-3 px-4 hidden lg:table-cell whitespace-nowrap">
                      <span className="border border-zinc-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {video.quality}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="py-3 px-4 hidden sm:table-cell whitespace-nowrap tabular-nums text-zinc-400">
                      {video.views.toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveVideo(video)}
                          className="min-h-[36px] min-w-[36px] p-1.5 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 transition-colors"
                          title="Preview Video Player"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditVideo(video)}
                          className="min-h-[36px] min-w-[36px] p-1.5 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 transition-colors"
                          title="Edit Video"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteVideo(video.id)}
                          className="min-h-[36px] min-w-[36px] p-1.5 text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 transition-colors"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MODELS LIST */}
      {activeTab === 'models' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((model) => (
            <div
              key={model.id}
              className="p-4 bg-zinc-950 border border-zinc-800 space-y-3"
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
                  <h4 className="text-sm font-bold text-white">
                    {model.stageName}
                  </h4>
                  <p className="text-xs font-mono text-zinc-400">
                    {model.city}, {model.country} · Rank #{model.rank}
                  </p>
                </div>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2">
                {model.bio}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-xs font-mono text-zinc-400">
                <span>{model.videoCount} Videos</span>
                <span className="tabular-nums">{(model.subscriberCount / 1000).toFixed(0)}K Subs</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD / EDIT VIDEO */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-700 w-full max-w-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold uppercase tracking-wider text-white font-mono">
                {editingVideoId ? 'Edit Video Metadata' : 'Publish New Video to CMS'}
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-zinc-400 hover:text-white p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4 text-xs font-mono">
              {/* Title */}
              <div>
                <label className="block text-zinc-400 uppercase text-[10px] mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. Noir Shadow Aesthetics 4K"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 focus:outline-none focus:border-white"
                />
              </div>

              {/* Model & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 uppercase text-[10px] mb-1">
                    Featured Creator Model *
                  </label>
                  <select
                    value={videoForm.modelId}
                    onChange={(e) => setVideoForm({ ...videoForm, modelId: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 focus:outline-none focus:border-white cursor-pointer"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.id} className="bg-zinc-950">
                        {m.stageName} ({m.country})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase text-[10px] mb-1">
                    Category *
                  </label>
                  <select
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 focus:outline-none focus:border-white cursor-pointer"
                  >
                    {categories.filter((c) => c.slug !== 'all').map((c) => (
                      <option key={c.id} value={c.name} className="bg-zinc-950">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration & Quality Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 uppercase text-[10px] mb-1">
                    Duration (MM:SS) *
                  </label>
                  <input
                    type="text"
                    required
                    value={videoForm.durationFormatted}
                    onChange={(e) => setVideoForm({ ...videoForm, durationFormatted: e.target.value })}
                    placeholder="14:24"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase text-[10px] mb-1">
                    Quality
                  </label>
                  <select
                    value={videoForm.quality}
                    onChange={(e) => setVideoForm({ ...videoForm, quality: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 focus:outline-none focus:border-white cursor-pointer"
                  >
                    <option value="4K" className="bg-zinc-950">4K Ultra HD</option>
                    <option value="1080p" className="bg-zinc-950">1080p Full HD</option>
                    <option value="60FPS" className="bg-zinc-950">60FPS High-Speed</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-zinc-400 uppercase text-[10px] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={videoForm.tags}
                  onChange={(e) => setVideoForm({ ...videoForm, tags: e.target.value })}
                  placeholder="Noir, 4K, Tokyo, Studio"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 focus:outline-none focus:border-white"
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-zinc-400 uppercase text-[10px] mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  value={videoForm.thumbnailUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 focus:outline-none focus:border-white"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-zinc-400 uppercase text-[10px] mb-1">
                  Video Stream MP4 URL
                </label>
                <input
                  type="url"
                  value={videoForm.videoUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 focus:outline-none focus:border-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-zinc-400 uppercase text-[10px] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 focus:outline-none focus:border-white font-sans"
                />
              </div>

              {/* Form buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="min-h-[44px] px-4 py-2 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-6 py-2 bg-white text-black font-bold uppercase hover:bg-zinc-200 transition-colors"
                >
                  {editingVideoId ? 'Save Changes' : 'Publish Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

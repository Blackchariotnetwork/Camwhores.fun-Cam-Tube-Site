import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, ModelProfile, Video, WatchHistoryItem, ViewTab } from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_MODELS,
  INITIAL_TAGS,
  INITIAL_VIDEOS,
} from '../data/seedData';

interface ToastInfo {
  id: number;
  message: string;
}

interface TubeContextType {
  // Data
  videos: Video[];
  models: ModelProfile[];
  categories: Category[];
  allTags: string[];

  // Navigation & Filtering
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'trending' | 'recent' | 'views' | 'rating' | 'duration';
  setSortBy: (sort: 'trending' | 'recent' | 'views' | 'rating' | 'duration') => void;
  qualityFilter: 'all' | '4K' | '1080p' | '60FPS';
  setQualityFilter: (quality: 'all' | '4K' | '1080p' | '60FPS') => void;

  // Viewing
  selectedModelId: string | null;
  setSelectedModelId: (id: string | null) => void;
  activeVideo: Video | null;
  setActiveVideo: (video: Video | null) => void;
  isPureNoir: boolean;
  togglePureNoir: () => void;

  // User state
  watchHistory: WatchHistoryItem[];
  likedVideoIds: string[];
  savedVideoIds: string[];
  subscribedModelIds: string[];
  recordWatchProgress: (videoId: string, progressSec: number, durationSec: number) => void;
  clearWatchHistory: () => void;
  removeWatchHistoryItem: (videoId: string) => void;
  toggleLikeVideo: (videoId: string) => void;
  toggleSaveVideo: (videoId: string) => void;
  toggleSubscribeModel: (modelId: string) => void;

  // CMS functions
  addVideo: (videoData: Partial<Video>) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  addModel: (modelData: Partial<ModelProfile>) => void;
  updateModel: (id: string, updates: Partial<ModelProfile>) => void;
  deleteModel: (id: string) => void;
  resetToDefaults: () => void;

  // Notification
  toast: ToastInfo | null;
  showToast: (message: string) => void;

  // Filtered views
  filteredVideos: Video[];
}

const TubeContext = createContext<TubeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VIDEOS: 'koneko_videos_v1',
  MODELS: 'koneko_models_v1',
  HISTORY: 'koneko_watch_history_v1',
  LIKED: 'koneko_liked_v1',
  SAVED: 'koneko_saved_v1',
  SUBS: 'koneko_subs_v1',
  NOIR: 'koneko_pure_noir_v1',
};

export const TubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial persistent state
  const [videos, setVideos] = useState<Video[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
    } catch {
      return INITIAL_VIDEOS;
    }
  });

  const [models, setModels] = useState<ModelProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MODELS);
      return saved ? JSON.parse(saved) : INITIAL_MODELS;
    } catch {
      return INITIAL_MODELS;
    }
  });

  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [
        {
          videoId: 'vid-1',
          watchedAt: Date.now() - 3600000,
          progressSec: 520,
          durationSec: 864,
          percent: 60,
          completed: false,
        },
        {
          videoId: 'vid-2',
          watchedAt: Date.now() - 86400000,
          progressSec: 1120,
          durationSec: 1120,
          percent: 100,
          completed: true,
        },
      ];
    } catch {
      return [];
    }
  });

  const [likedVideoIds, setLikedVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIKED);
      return saved ? JSON.parse(saved) : ['vid-1', 'vid-8'];
    } catch {
      return ['vid-1'];
    }
  });

  const [savedVideoIds, setSavedVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED);
      return saved ? JSON.parse(saved) : ['vid-3', 'vid-5'];
    } catch {
      return ['vid-3'];
    }
  });

  const [subscribedModelIds, setSubscribedModelIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBS);
      return saved ? JSON.parse(saved) : ['model-koneko', 'model-elena'];
    } catch {
      return ['model-koneko'];
    }
  });

  const [isPureNoir, setIsPureNoir] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOIR);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // App UI State
  const [activeTab, setActiveTab] = useState<ViewTab>('feed');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'views' | 'rating' | 'duration'>('trending');
  const [qualityFilter, setQualityFilter] = useState<'all' | '4K' | '1080p' | '60FPS'>('all');

  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models));
  }, [models]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(watchHistory));
  }, [watchHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIKED, JSON.stringify(likedVideoIds));
  }, [likedVideoIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedVideoIds));
  }, [savedVideoIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBS, JSON.stringify(subscribedModelIds));
  }, [subscribedModelIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOIR, JSON.stringify(isPureNoir));
  }, [isPureNoir]);

  const showToast = (message: string) => {
    const id = Date.now();
    setToast({ id, message });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2800);
  };

  const togglePureNoir = () => {
    setIsPureNoir((prev) => {
      const next = !prev;
      showToast(next ? 'Noir High-Contrast B&W Mode ON' : 'Cinema Original Color Mode ON');
      return next;
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  // Watch history tracking
  const recordWatchProgress = (videoId: string, progressSec: number, durationSec: number) => {
    if (!videoId || durationSec <= 0) return;
    const percent = Math.min(100, Math.round((progressSec / durationSec) * 100));
    const completed = percent >= 92;

    setWatchHistory((prev) => {
      const filtered = prev.filter((item) => item.videoId !== videoId);
      return [
        {
          videoId,
          watchedAt: Date.now(),
          progressSec: Math.round(progressSec),
          durationSec: Math.round(durationSec),
          percent,
          completed,
        },
        ...filtered,
      ].slice(0, 50); // limit to last 50
    });
  };

  const clearWatchHistory = () => {
    setWatchHistory([]);
    showToast('Watch history cleared');
  };

  const removeWatchHistoryItem = (videoId: string) => {
    setWatchHistory((prev) => prev.filter((item) => item.videoId !== videoId));
    showToast('Removed from history');
  };

  const toggleLikeVideo = (videoId: string) => {
    const isLiked = likedVideoIds.includes(videoId);
    if (isLiked) {
      setLikedVideoIds((prev) => prev.filter((id) => id !== videoId));
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, likes: Math.max(0, v.likes - 1) } : v))
      );
      showToast('Removed like');
    } else {
      setLikedVideoIds((prev) => [...prev, videoId]);
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, likes: v.likes + 1 } : v))
      );
      showToast('Added to Liked Videos');
    }
  };

  const toggleSaveVideo = (videoId: string) => {
    const isSaved = savedVideoIds.includes(videoId);
    if (isSaved) {
      setSavedVideoIds((prev) => prev.filter((id) => id !== videoId));
      showToast('Removed from Saved Watchlist');
    } else {
      setSavedVideoIds((prev) => [...prev, videoId]);
      showToast('Saved to Watchlist');
    }
  };

  const toggleSubscribeModel = (modelId: string) => {
    const isSubbed = subscribedModelIds.includes(modelId);
    if (isSubbed) {
      setSubscribedModelIds((prev) => prev.filter((id) => id !== modelId));
      setModels((prev) =>
        prev.map((m) =>
          m.id === modelId ? { ...m, subscriberCount: Math.max(0, m.subscriberCount - 1) } : m
        )
      );
      showToast('Unsubscribed from creator');
    } else {
      setSubscribedModelIds((prev) => [...prev, modelId]);
      setModels((prev) =>
        prev.map((m) => (m.id === modelId ? { ...m, subscriberCount: m.subscriberCount + 1 } : m))
      );
      showToast('Subscribed to creator');
    }
  };

  // CMS Operations
  const addVideo = (videoData: Partial<Video>) => {
    const id = `vid-${Date.now()}`;
    const slug = (videoData.title || 'untitled')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const newVideo: Video = {
      id,
      title: videoData.title || 'Untitled Video',
      slug,
      description: videoData.description || 'High-contrast production.',
      modelId: videoData.modelId || models[0]?.id || 'model-koneko',
      modelName:
        models.find((m) => m.id === videoData.modelId)?.stageName || 'Koneko Noir',
      modelAvatar:
        models.find((m) => m.id === videoData.modelId)?.avatarUrl ||
        '/assets/aistudio/b9Ofn_1c5c8d7e.png',
      duration: videoData.duration || 600,
      durationFormatted: videoData.durationFormatted || '10:00',
      views: 120,
      likes: 12,
      dislikes: 0,
      ratingPercentage: 100,
      quality: videoData.quality || '4K',
      category: videoData.category || 'Cinematic Noir',
      tags: videoData.tags?.length ? videoData.tags : ['Noir', '4K'],
      thumbnailUrl:
        videoData.thumbnailUrl ||
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
      videoUrl:
        videoData.videoUrl ||
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      uploadedAt: 'Just now',
      isFeatured: false,
      isTrending: true,
    };

    setVideos((prev) => [newVideo, ...prev]);

    // Update model video count
    setModels((prev) =>
      prev.map((m) =>
        m.id === newVideo.modelId ? { ...m, videoCount: m.videoCount + 1 } : m
      )
    );

    showToast(`Published: "${newVideo.title}"`);
  };

  const updateVideo = (id: string, updates: Partial<Video>) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
    showToast('Video updated successfully');
  };

  const deleteVideo = (id: string) => {
    const videoToDelete = videos.find((v) => v.id === id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
    if (videoToDelete) {
      setModels((prev) =>
        prev.map((m) =>
          m.id === videoToDelete.modelId
            ? { ...m, videoCount: Math.max(0, m.videoCount - 1) }
            : m
        )
      );
    }
    showToast('Video removed from CMS');
  };

  const addModel = (modelData: Partial<ModelProfile>) => {
    const id = `model-${Date.now()}`;
    const newModel: ModelProfile = {
      id,
      name: modelData.name || 'New Model',
      stageName: modelData.stageName || 'Model Noir',
      avatarUrl:
        modelData.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      coverUrl:
        modelData.coverUrl ||
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      bio: modelData.bio || 'Professional creative model.',
      verified: modelData.verified ?? true,
      country: modelData.country || 'Japan',
      city: modelData.city || 'Tokyo',
      age: modelData.age || 24,
      height: modelData.height || "5'7\"",
      hairColor: modelData.hairColor || 'Black',
      eyeColor: modelData.eyeColor || 'Dark',
      subscriberCount: 1200,
      totalViews: 45000,
      videoCount: 0,
      rank: models.length + 1,
      socials: modelData.socials || {},
      tags: modelData.tags || ['Noir'],
    };
    setModels((prev) => [...prev, newModel]);
    showToast(`Model profile added: "${newModel.stageName}"`);
  };

  const updateModel = (id: string, updates: Partial<ModelProfile>) => {
    setModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    showToast('Model profile updated');
  };

  const deleteModel = (id: string) => {
    setModels((prev) => prev.filter((m) => m.id !== id));
    showToast('Model removed from CMS');
  };

  const resetToDefaults = () => {
    setVideos(INITIAL_VIDEOS);
    setModels(INITIAL_MODELS);
    setWatchHistory([]);
    setLikedVideoIds(['vid-1', 'vid-8']);
    setSavedVideoIds(['vid-3']);
    setSubscribedModelIds(['model-koneko']);
    localStorage.removeItem(STORAGE_KEYS.VIDEOS);
    localStorage.removeItem(STORAGE_KEYS.MODELS);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.LIKED);
    localStorage.removeItem(STORAGE_KEYS.SAVED);
    localStorage.removeItem(STORAGE_KEYS.SUBS);
    showToast('Reset catalog to factory defaults');
  };

  // Filter & Sort calculation
  const filteredVideos = React.useMemo(() => {
    return videos
      .filter((video) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = video.title.toLowerCase().includes(q);
          const matchesModel = video.modelName.toLowerCase().includes(q);
          const matchesTags = video.tags.some((t) => t.toLowerCase().includes(q));
          const matchesCategory = video.category.toLowerCase().includes(q);
          if (!matchesTitle && !matchesModel && !matchesTags && !matchesCategory) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all') {
          const targetCategory = INITIAL_CATEGORIES.find((c) => c.slug === selectedCategory);
          if (targetCategory && targetCategory.name !== 'All Videos') {
            if (video.category !== targetCategory.name) {
              return false;
            }
          }
        }

        // Tags filter (AND condition: video must include all selected tags)
        if (selectedTags.length > 0) {
          const hasAllTags = selectedTags.every((st) =>
            video.tags.some((vt) => vt.toLowerCase() === st.toLowerCase())
          );
          if (!hasAllTags) {
            return false;
          }
        }

        // Quality filter
        if (qualityFilter !== 'all') {
          if (video.quality !== qualityFilter) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'trending') return (b.views * 0.7 + b.likes) - (a.views * 0.7 + a.likes);
        if (sortBy === 'recent') return b.id.localeCompare(a.id);
        if (sortBy === 'views') return b.views - a.views;
        if (sortBy === 'rating') return b.ratingPercentage - a.ratingPercentage;
        if (sortBy === 'duration') return b.duration - a.duration;
        return 0;
      });
  }, [videos, searchQuery, selectedCategory, selectedTags, qualityFilter, sortBy]);

  return (
    <TubeContext.Provider
      value={{
        videos,
        models,
        categories: INITIAL_CATEGORIES,
        allTags: INITIAL_TAGS,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        selectedTags,
        toggleTag,
        clearTags,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        qualityFilter,
        setQualityFilter,
        selectedModelId,
        setSelectedModelId,
        activeVideo,
        setActiveVideo,
        isPureNoir,
        togglePureNoir,
        watchHistory,
        likedVideoIds,
        savedVideoIds,
        subscribedModelIds,
        recordWatchProgress,
        clearWatchHistory,
        removeWatchHistoryItem,
        toggleLikeVideo,
        toggleSaveVideo,
        toggleSubscribeModel,
        addVideo,
        updateVideo,
        deleteVideo,
        addModel,
        updateModel,
        deleteModel,
        resetToDefaults,
        toast,
        showToast,
        filteredVideos,
      }}
    >
      {children}
    </TubeContext.Provider>
  );
};

export const useTube = () => {
  const context = useContext(TubeContext);
  if (!context) {
    throw new Error('useTube must be used within a TubeProvider');
  }
  return context;
};

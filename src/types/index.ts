export interface Video {
  id: string;
  title: string;
  slug: string;
  description: string;
  modelId: string;
  modelName: string;
  modelAvatar: string;
  duration: number; // in seconds
  durationFormatted: string; // e.g. "14:28"
  views: number;
  likes: number;
  dislikes: number;
  ratingPercentage: number;
  quality: '4K' | '1080p' | '60FPS';
  category: string;
  tags: string[];
  thumbnailUrl: string;
  previewFrames?: string[]; // thumbnail frames for scrubbing
  videoUrl: string;
  uploadedAt: string;
  isFeatured?: boolean;
  isTrending?: boolean;
}

export interface ModelProfile {
  id: string;
  name: string;
  stageName: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  verified: boolean;
  country: string;
  city: string;
  age: number;
  height: string;
  hairColor: string;
  eyeColor: string;
  subscriberCount: number;
  totalViews: number;
  videoCount: number;
  rank: number;
  socials: {
    twitter?: string;
    instagram?: string;
    onlyfans?: string;
  };
  tags: string[];
}

export interface WatchHistoryItem {
  videoId: string;
  watchedAt: number; // timestamp
  progressSec: number;
  durationSec: number;
  percent: number;
  completed: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  videoCount: number;
  iconName: string;
}

export type ViewTab = 'feed' | 'categories' | 'models' | 'history' | 'dashboard' | 'cms';

export type CategoryId =
  | 'cyberpunk'
  | 'abstract'
  | 'space'
  | 'amoled'
  | 'nature'
  | 'neon'
  | 'anime'
  | 'cars'
  | 'gaming'
  | 'minimal'
  | 'luxury'
  | 'fantasy'
  | 'ocean'
  | 'scifi'
  | 'technology';

export type EngineType =
  | 'cyberpunk_city'
  | 'matrix'
  | 'cybergrid'
  | 'galaxy'
  | 'nebula'
  | 'blackhole'
  | 'aurora'
  | 'waves'
  | 'jellyfish'
  | 'supercar'
  | 'synthwave'
  | 'liquidgold'
  | 'particles'
  | 'hologram'
  | 'lightning'
  | 'sakura'
  | 'plasma'
  | 'flames'
  | 'crystals'
  | 'portal';

export interface Wallpaper {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  tags: string[];
  thumbnailUrl: string;
  previewUrl: string;
  downloadUrl: string;
  duration: number; // in seconds
  resolution: string;
  fileSize: string;
  creator: string;
  isPremium: boolean;
  downloadCount: number;
  favoriteCount: number;
  createdAt: string;
  engineType: EngineType;
  colors: [string, string, string]; // [primary, secondary, glow]
  aspectRatio: '19.5:9' | '20:9' | '16:9';
  featured?: boolean;
  trendingScore?: number;
}

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  coverGradient: string;
  wallpaperCount: number;
  description: string;
  accentColor: string;
  previewImage?: string;
}

export interface UserSettings {
  theme: 'oled' | 'dark' | 'cyber' | 'light';
  autoPlay: boolean;
  quality: 'high' | 'saver';
  reduceMotion: boolean;
  haptics: boolean;
  wifiOnly: boolean;
  language: 'en' | 'vi';
  autoDownload: boolean;
  isVip: boolean;
  targetPlatform: 'android' | 'ios';
  deviceFrame: boolean;
  soundEnabled?: boolean;
  hapticsEnabled?: boolean;
  autoPlayPreview?: boolean;
  hasCompletedOnboarding?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  isVip: boolean;
  joinedDate: string;
}

export interface Collection {
  id: string;
  name: string;
  wallpaperIds: string[];
  createdAt: string;
}

export interface DownloadItem {
  wallpaperId: string;
  downloadedAt: string;
  fileSizeMB: number;
}

export type NavTab = 'home' | 'explore' | 'categories' | 'favorites' | 'profile';

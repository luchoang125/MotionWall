import React from 'react';
import { Wallpaper, UserSettings } from '../types';
import { WallpaperEngine } from '../components/WallpaperEngine';
import {
  Sparkles,
  Heart,
  Download,
  Flame,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { translations } from '../data/i18n';
import { triggerHaptic } from '../utils/audio';

interface HomeScreenProps {
  wallpapers: Wallpaper[];
  settings: UserSettings;
  favorites: string[];
  onSelectWallpaper: (wp: Wallpaper) => void;
  onApplyWallpaper: (wp: Wallpaper) => void;
  onToggleFavorite: (id: string) => void;
  onNavigateExplore: (category?: string) => void;
  onNavigateCategories: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  wallpapers,
  settings,
  favorites,
  onSelectWallpaper,
  onApplyWallpaper,
  onToggleFavorite,
  onNavigateExplore,
  onNavigateCategories,
}) => {
  const t = translations[settings.language].home;
  const lang = translations[settings.language];

  // Hero item (e.g. Gargantua Black Hole or Cyberpunk Metropolis)
  const heroWallpaper = wallpapers.find((w) => w.id === 'wp-021') || wallpapers[0];

  // Featured Collection
  const featured = wallpapers.filter((w) => w.featured).slice(0, 10);

  // Trending Now
  const trending = [...wallpapers].sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0)).slice(0, 8);

  // New Releases
  const newReleases = [...wallpapers].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);

  // Quick categories
  const popularCategories = [
    { id: 'cyberpunk', label: 'Cyberpunk', icon: '⚡', color: 'from-fuchsia-600 to-cyan-500' },
    { id: 'amoled', label: 'AMOLED Dark', icon: '🌑', color: 'from-zinc-800 to-black' },
    { id: 'space', label: 'Cosmic Space', icon: '🪐', color: 'from-blue-600 to-purple-800' },
    { id: 'nature', label: 'Bioluminescent', icon: '🌿', color: 'from-emerald-600 to-teal-800' },
    { id: 'cars', label: 'Hypercars', icon: '🏎️', color: 'from-orange-600 to-red-700' },
    { id: 'luxury', label: 'Liquid Gold', icon: '👑', color: 'from-amber-400 to-yellow-700' },
  ];

  return (
    <div className="w-full pb-28 pt-2 px-3 sm:px-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Header Brand */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-400 to-fuchsia-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#080a12] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 font-sans">
              MotionWall
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                PRO
              </span>
            </h1>
          </div>
        </div>

        <button
          onClick={() => onNavigateExplore()}
          className="text-xs font-semibold px-3 py-1.5 rounded-full glass-pill text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <span>{lang.explore.filters.all}</span>
          <ArrowRight className="w-3 h-3 text-cyan-400" />
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl group">
        {/* Full-width Animated Live Engine */}
        <div className="relative w-full h-[380px] sm:h-[450px] overflow-hidden">
          <WallpaperEngine
            wallpaper={heroWallpaper}
            aspectRatio="16:9"
            interactive={true}
            autoPlay={true}
            showControls={true}
            className="w-full h-full"
          />

          {/* Gradient overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-[#06070a]/40 to-transparent pointer-events-none" />

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 flex flex-col justify-end z-20">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500 text-black shadow-md shadow-cyan-500/30">
                Featured 60FPS
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md border border-white/15 text-white">
                {heroWallpaper.category.toUpperCase()}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2 drop-shadow-md">
              {heroWallpaper.title}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mb-5 line-clamp-2 drop-shadow">
              {lang.tagline} {lang.subTagline}
            </p>

            {/* Hero Action Row */}
            <div className="flex items-center gap-3">
              <button
                id="btn-hero-apply"
                onClick={() => {
                  onApplyWallpaper(heroWallpaper);
                  triggerHaptic('medium');
                }}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-500/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
                <span>{t.applyNow}</span>
              </button>

              <button
                id="btn-hero-preview"
                onClick={() => {
                  onSelectWallpaper(heroWallpaper);
                  triggerHaptic('light');
                }}
                className="py-3 px-4 rounded-2xl glass-pill text-white text-xs sm:text-sm font-semibold hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-zinc-300" />
                <span>{t.preview}</span>
              </button>

              <button
                id="btn-hero-favorite"
                onClick={() => {
                  onToggleFavorite(heroWallpaper.id);
                  triggerHaptic('light');
                }}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                  favorites.includes(heroWallpaper.id)
                    ? 'bg-rose-500/30 border border-rose-500/50 text-rose-400'
                    : 'glass-pill text-white hover:bg-white/20'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorites.includes(heroWallpaper.id) ? 'fill-current text-rose-400' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {popularCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              onNavigateExplore(cat.id);
              triggerHaptic('light');
            }}
            className="flex-shrink-0 px-3.5 py-2 rounded-2xl bg-[#10131e] border border-white/10 hover:border-cyan-500/50 hover:bg-[#141826] transition-all flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white group"
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
        <button
          onClick={onNavigateCategories}
          className="flex-shrink-0 px-3.5 py-2 rounded-2xl border border-dashed border-white/20 text-zinc-400 hover:text-white hover:border-cyan-400 transition-colors text-xs font-medium"
        >
          {t.viewAll} →
        </button>
      </div>

      {/* Featured Collection (Horizontally scrollable premium cards) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">
              {t.featured}
            </h3>
          </div>
          <button
            onClick={() => onNavigateExplore('featured')}
            className="text-xs text-zinc-400 hover:text-cyan-400 transition-colors font-medium"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="flex gap-3.5 overflow-x-auto pb-3 no-scrollbar scroll-smooth">
          {featured.map((wp) => (
            <div
              key={wp.id}
              onClick={() => {
                onSelectWallpaper(wp);
                triggerHaptic('light');
              }}
              className="group relative flex-shrink-0 w-44 sm:w-52 h-72 sm:h-80 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer shadow-lg bg-neutral-900"
            >
              <img
                src={wp.thumbnailUrl}
                alt={wp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-between p-3.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 backdrop-blur-md border border-white/15 text-cyan-400">
                    60 FPS
                  </span>
                  {wp.isPremium && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-black">
                      VIP
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    {wp.category}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug line-clamp-1 mb-1">
                    {wp.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>{wp.downloadCount.toLocaleString()} dl</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(wp.id);
                        triggerHaptic('light');
                      }}
                      className="p-1 text-white/80 hover:text-rose-400"
                    >
                      <Heart
                        className={`w-4 h-4 ${favorites.includes(wp.id) ? 'fill-current text-rose-500' : ''}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Now (Popular animated wallpapers grid) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <h3 className="text-base font-extrabold text-white tracking-tight">
              {t.trending}
            </h3>
          </div>
          <button
            onClick={() => onNavigateExplore('trending')}
            className="text-xs text-zinc-400 hover:text-cyan-400 transition-colors font-medium"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {trending.map((wp) => (
            <div
              key={wp.id}
              onClick={() => {
                onSelectWallpaper(wp);
                triggerHaptic('light');
              }}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer shadow-md bg-neutral-900"
            >
              <img
                src={wp.thumbnailUrl}
                alt={wp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {wp.resolution.split(' ')[0]}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(wp.id);
                      triggerHaptic('light');
                    }}
                    className="p-1 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-rose-400"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${favorites.includes(wp.id) ? 'fill-current text-rose-500' : ''}`}
                    />
                  </button>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 mb-0.5">
                    {wp.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span>{wp.category}</span>
                    <span>{wp.downloadCount.toLocaleString()} uses</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Releases Section */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">
              {t.newReleases}
            </h3>
          </div>
          <button
            onClick={() => onNavigateExplore('new')}
            className="text-xs text-zinc-400 hover:text-cyan-400 transition-colors font-medium"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {newReleases.map((wp) => (
            <div
              key={wp.id}
              onClick={() => {
                onSelectWallpaper(wp);
                triggerHaptic('light');
              }}
              className="group relative h-60 sm:h-64 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer shadow-md bg-neutral-900"
            >
              <img
                src={wp.thumbnailUrl}
                alt={wp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    NEW
                  </span>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 mb-0.5">
                    {wp.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span>{wp.category}</span>
                    <span>{wp.duration}s loop</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

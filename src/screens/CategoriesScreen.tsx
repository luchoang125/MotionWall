import React, { useState } from 'react';
import { Category, Wallpaper, UserSettings } from '../types';
import { CATEGORIES } from '../data/categories';
import { Grid, Sparkles, ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { translations } from '../data/i18n';
import { triggerHaptic } from '../utils/audio';

interface CategoriesScreenProps {
  wallpapers: Wallpaper[];
  settings: UserSettings;
  favorites: string[];
  onSelectWallpaper: (wp: Wallpaper) => void;
  onToggleFavorite: (id: string) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  wallpapers,
  settings,
  favorites,
  onSelectWallpaper,
  onToggleFavorite,
}) => {
  const t = translations[settings.language].categories;
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // If a category is selected, show its wallpaper gallery
  if (activeCategory) {
    const categoryWallpapers = wallpapers.filter((w) => w.category === activeCategory.id);

    return (
      <div className="w-full pb-28 pt-2 px-3 sm:px-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Header Back Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              setActiveCategory(null);
              triggerHaptic('light');
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-pill text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToCategories}</span>
          </button>
          <span className="text-xs text-zinc-400 font-mono">
            {categoryWallpapers.length} {t.wallpapersCount}
          </span>
        </div>

        {/* Category Banner Hero */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 h-44 sm:h-52 bg-black">
          <img
            src={activeCategory.previewImage}
            alt={activeCategory.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{activeCategory.icon}</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{activeCategory.name}</h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-lg">
              {activeCategory.description}
            </p>
          </div>
        </div>

        {/* Grid of category wallpapers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {categoryWallpapers.map((wp) => (
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
                    60 FPS
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
                      className={`w-3.5 h-3.5 ${
                        favorites.includes(wp.id) ? 'fill-current text-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 mb-0.5">
                    {wp.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span>{wp.duration}s</span>
                    <span>{wp.downloadCount.toLocaleString()} dl</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-28 pt-2 px-3 sm:px-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-1">
          <Grid className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-extrabold text-white tracking-tight">{t.title}</h2>
        </div>
        <p className="text-xs text-zinc-400">{t.subtitle}</p>
      </div>

      {/* Categories Bento / Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => {
          const count = wallpapers.filter((w) => w.category === category.id).length;
          return (
            <div
              key={category.id}
              onClick={() => {
                setActiveCategory(category);
                triggerHaptic('light');
              }}
              className="group relative h-48 rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer shadow-lg bg-neutral-900"
            >
              {/* Cover Image */}
              <img
                src={category.previewImage}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-xl shadow-md">
                    {category.icon}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                    {count} {t.wallpapersCount}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                    <span>{category.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-cyan-400" />
                  </h3>
                  <p className="text-xs text-zinc-300 line-clamp-1">{category.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

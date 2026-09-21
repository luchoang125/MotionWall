import React, { useState } from 'react';
import { Wallpaper, UserSettings } from '../types';
import { Heart, Download, Trash2, ArrowRight, HardDrive, Sparkles } from 'lucide-react';
import { translations } from '../data/i18n';
import { triggerHaptic } from '../utils/audio';

interface FavoritesScreenProps {
  wallpapers: Wallpaper[];
  settings: UserSettings;
  favorites: string[];
  downloads: string[];
  onSelectWallpaper: (wp: Wallpaper) => void;
  onApplyWallpaper: (wp: Wallpaper) => void;
  onToggleFavorite: (id: string) => void;
  onRemoveDownload: (id: string) => void;
  onNavigateExplore: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  wallpapers,
  settings,
  favorites,
  downloads,
  onSelectWallpaper,
  onApplyWallpaper,
  onToggleFavorite,
  onRemoveDownload,
  onNavigateExplore,
}) => {
  const t = translations[settings.language].favorites;
  const [activeTab, setActiveTab] = useState<'favorites' | 'downloads'>('favorites');

  const favoriteWallpapers = wallpapers.filter((w) => favorites.includes(w.id));
  const downloadedWallpapers = wallpapers.filter((w) => downloads.includes(w.id));

  const currentList = activeTab === 'favorites' ? favoriteWallpapers : downloadedWallpapers;

  // Approximate downloaded storage MB
  const totalMb = downloadedWallpapers.reduce((acc, wp) => {
    const num = parseFloat(wp.fileSize) || 12;
    return acc + num;
  }, 0);

  return (
    <div className="w-full pb-28 pt-2 px-3 sm:px-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">{t.title}</h2>
          </div>
          <p className="text-xs text-zinc-400">{t.subtitle}</p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveTab('favorites');
              triggerHaptic('light');
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'favorites'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved ({favoriteWallpapers.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('downloads');
              triggerHaptic('light');
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'downloads'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Downloaded ({downloadedWallpapers.length})</span>
          </button>
        </div>
      </div>

      {/* Storage stat badge if in downloads tab */}
      {activeTab === 'downloads' && downloadedWallpapers.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span>Offline Motion Storage</span>
          </div>
          <span className="font-mono text-cyan-400 font-bold">~{totalMb.toFixed(1)} MB used</span>
        </div>
      )}

      {/* Empty State */}
      {currentList.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-600 shadow-xl">
            {activeTab === 'favorites' ? (
              <Heart className="w-9 h-9 text-zinc-500" />
            ) : (
              <Download className="w-9 h-9 text-zinc-500" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{t.emptyTitle}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{t.emptyDesc}</p>
          </div>
          <button
            onClick={() => {
              onNavigateExplore();
              triggerHaptic('medium');
            }}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <span>{t.discoverBtn}</span>
            <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
          </button>
        </div>
      ) : (
        /* Wallpapers Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {currentList.map((wp) => (
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
                      if (activeTab === 'favorites') {
                        onToggleFavorite(wp.id);
                      } else {
                        onRemoveDownload(wp.id);
                      }
                      triggerHaptic('light');
                    }}
                    title={activeTab === 'favorites' ? 'Remove from favorites' : 'Delete download'}
                    className="p-1 rounded-full bg-black/50 backdrop-blur-md text-white/80 hover:text-rose-400 transition-colors"
                  >
                    {activeTab === 'favorites' ? (
                      <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5 text-zinc-400 hover:text-rose-400" />
                    )}
                  </button>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 mb-0.5">
                    {wp.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-2">
                    <span>{wp.category}</span>
                    <span>{wp.fileSize}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onApplyWallpaper(wp);
                      triggerHaptic('medium');
                    }}
                    className="w-full py-1.5 px-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

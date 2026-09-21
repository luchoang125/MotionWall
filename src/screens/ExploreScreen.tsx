import React, { useState, useMemo } from 'react';
import { Wallpaper, UserSettings, CategoryId } from '../types';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Heart,
  LayoutGrid,
  Grid2X2,
  ArrowUpDown,
} from 'lucide-react';
import { translations } from '../data/i18n';
import { triggerHaptic } from '../utils/audio';

interface ExploreScreenProps {
  wallpapers: Wallpaper[];
  settings: UserSettings;
  favorites: string[];
  initialCategory?: string;
  onSelectWallpaper: (wp: Wallpaper) => void;
  onToggleFavorite: (id: string) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  wallpapers,
  settings,
  favorites,
  initialCategory,
  onSelectWallpaper,
  onToggleFavorite,
}) => {
  const t = translations[settings.language].explore;

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<'rating' | 'downloads' | 'latest'>('downloads');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<'masonry' | 'grid'>('masonry');

  const trendingPills = [
    'cyberpunk',
    'black AMOLED',
    'space galaxy',
    'neon supercar',
    'purple galaxy',
    'liquid gold',
    'jellyfish',
    'sakura',
    'matrix code',
  ];

  const colorSwatches = [
    { label: 'Cyan', hex: '#00f0ff', colorClass: 'bg-cyan-400' },
    { label: 'Magenta', hex: '#ff0077', colorClass: 'bg-pink-500' },
    { label: 'Purple', hex: '#a855f7', colorClass: 'bg-purple-500' },
    { label: 'Emerald', hex: '#10b981', colorClass: 'bg-emerald-500' },
    { label: 'Gold', hex: '#eab308', colorClass: 'bg-yellow-500' },
    { label: 'Crimson', hex: '#ef4444', colorClass: 'bg-red-500' },
    { label: 'AMOLED Black', hex: '#000000', colorClass: 'bg-black border border-white/20' },
  ];

  // Filtering Logic
  const filteredWallpapers = useMemo(() => {
    return wallpapers.filter((wp) => {
      // Query search
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesTitle = wp.title.toLowerCase().includes(q);
        const matchesCat = wp.category.toLowerCase().includes(q);
        const matchesTags = wp.tags.some((tg) => tg.toLowerCase().includes(q));
        const matchesCreator = wp.creator.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesTags && !matchesCreator) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && wp.category !== selectedCategory) {
        return false;
      }

      // Filter tabs
      if (activeFilter === 'trending' && (wp.trendingScore || 0) < 90) return false;
      if (activeFilter === 'new' && new Date(wp.createdAt) < new Date('2026-04-01')) return false;
      if (activeFilter === 'mostDownloaded' && wp.downloadCount < 18000) return false;
      if (activeFilter === 'premium' && !wp.isPremium) return false;

      // Color filter
      if (selectedColor) {
        const hasColor = wp.colors.some((c) => c.toLowerCase().includes(selectedColor.toLowerCase()));
        if (!hasColor) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'downloads') return b.downloadCount - a.downloadCount;
      if (sortBy === 'latest') return b.createdAt.localeCompare(a.createdAt);
      return (b.trendingScore || 0) - (a.trendingScore || 0);
    });
  }, [wallpapers, query, selectedCategory, activeFilter, selectedColor, sortBy]);

  return (
    <div className="w-full pb-28 pt-2 px-3 sm:px-6 max-w-6xl mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Search Bar Input */}
      <div className="relative pt-2">
        <div className="relative flex items-center bg-[#0d101a] border border-white/10 rounded-2xl px-4 py-3 shadow-lg focus-within:border-cyan-400 focus-within:shadow-cyan-500/10 transition-all">
          <Search className="w-5 h-5 text-zinc-400 shrink-0 mr-3" />
          <input
            id="input-explore-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Trending Search Pills */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          {t.trendingSearches}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {trendingPills.map((pill) => (
            <button
              key={pill}
              onClick={() => {
                setQuery(pill);
                triggerHaptic('light');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                query.toLowerCase() === pill.toLowerCase()
                  ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                  : 'bg-white/5 text-zinc-300 border-white/10 hover:border-cyan-400/50 hover:text-white'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter Swatches */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          {t.colorPalette}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => {
              setSelectedColor(null);
              triggerHaptic('light');
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              selectedColor === null ? 'bg-white text-black font-bold' : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            All Colors
          </button>
          {colorSwatches.map((swatch) => (
            <button
              key={swatch.label}
              onClick={() => {
                setSelectedColor(selectedColor === swatch.hex ? null : swatch.hex);
                triggerHaptic('light');
              }}
              title={swatch.label}
              className={`w-7 h-7 rounded-full ${swatch.colorClass} flex items-center justify-center transition-transform ${
                selectedColor === swatch.hex ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black' : 'hover:scale-110'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Filter Tabs & Layout Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {[
            { id: 'all', label: t.filters.all },
            { id: 'trending', label: t.filters.trending },
            { id: 'popular', label: t.filters.popular },
            { id: 'new', label: t.filters.new },
            { id: 'mostDownloaded', label: t.filters.mostDownloaded },
            { id: 'premium', label: t.filters.premium },
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => {
                setActiveFilter(flt.id);
                triggerHaptic('light');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === flt.id
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {/* Sort & Layout toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'downloads' | 'latest')}
              className="bg-transparent text-xs text-white outline-none cursor-pointer"
            >
              <option value="downloads" className="bg-zinc-900 text-white">
                {t.sort.downloads}
              </option>
              <option value="rating" className="bg-zinc-900 text-white">
                {t.sort.rating}
              </option>
              <option value="latest" className="bg-zinc-900 text-white">
                {t.sort.latest}
              </option>
            </select>
          </div>

          {/* Layout Grid Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setLayoutMode('masonry')}
              title="Masonry View"
              className={`p-1.5 rounded-lg transition-colors ${
                layoutMode === 'masonry' ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('grid')}
              title="Compact 2-Col View"
              className={`p-1.5 rounded-lg transition-colors ${
                layoutMode === 'grid' ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Header Counter */}
      <div className="text-xs text-zinc-400 font-medium">
        {filteredWallpapers.length} {t.resultsCount}
      </div>

      {/* Wallpapers Presentation */}
      {filteredWallpapers.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-zinc-500">
            <Search className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-white">{t.noResults}</h4>
          <button
            onClick={() => {
              setQuery('');
              setSelectedColor(null);
              setActiveFilter('all');
              setSelectedCategory('all');
            }}
            className="text-xs text-cyan-400 underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div
          className={
            layoutMode === 'masonry'
              ? 'columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3'
              : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'
          }
        >
          {filteredWallpapers.map((wp, index) => {
            // Masonry height variation
            const isTall = layoutMode === 'masonry' && index % 3 === 0;
            return (
              <div
                key={wp.id}
                onClick={() => {
                  onSelectWallpaper(wp);
                  triggerHaptic('light');
                }}
                className={`break-inside-avoid group relative rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer shadow-md bg-neutral-900 ${
                  layoutMode === 'grid'
                    ? 'h-64 sm:h-72'
                    : isTall
                    ? 'h-80 sm:h-96'
                    : 'h-60 sm:h-68'
                }`}
              >
                <img
                  src={wp.thumbnailUrl}
                  alt={wp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 backdrop-blur-md border border-white/15 text-cyan-400">
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
                    <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">
                      {wp.category}
                    </span>
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
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Wallpaper, UserSettings } from '../types';
import { WallpaperEngine } from './WallpaperEngine';
import {
  X,
  Heart,
  Download,
  Share2,
  Sparkles,
  Sliders,
  Check,
  Maximize2,
  ExternalLink,
  Info,
  Layers,
} from 'lucide-react';
import { translations } from '../data/i18n';
import { triggerHaptic } from '../utils/audio';

interface WallpaperDetailModalProps {
  wallpaper: Wallpaper | null;
  allWallpapers: Wallpaper[];
  settings: UserSettings;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  onApply: (wp: Wallpaper) => void;
  onDownload: (wp: Wallpaper) => void;
  onSelectWallpaper: (wp: Wallpaper) => void;
  onClose: () => void;
}

export const WallpaperDetailModal: React.FC<WallpaperDetailModalProps> = ({
  wallpaper,
  allWallpapers,
  settings,
  isFavorited,
  onToggleFavorite,
  onApply,
  onDownload,
  onSelectWallpaper,
  onClose,
}) => {
  if (!wallpaper) return null;

  const t = translations[settings.language].detail;
  const [aspectRatio, setAspectRatio] = useState<'19.5:9' | '16:9' | 'full'>('19.5:9');
  const [speed, setSpeed] = useState<number>(1.0);
  const [bloom, setBloom] = useState<number>(1.0);
  const [showTuning, setShowTuning] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Related wallpapers from same category or tag
  const related = allWallpapers
    .filter((w) => w.id !== wallpaper.id && (w.category === wallpaper.category || w.tags.some((tg) => wallpaper.tags.includes(tg))))
    .slice(0, 6);

  const handleShare = async () => {
    triggerHaptic('light');
    const shareData = {
      title: `${wallpaper.title} - MotionWall Live Wallpaper`,
      text: `Check out this stunning 60FPS animated wallpaper "${wallpaper.title}" on MotionWall!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-0 sm:p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200 overflow-y-auto">
      {/* Fullscreen Overlay Mode */}
      {isFullScreen ? (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <WallpaperEngine
            wallpaper={wallpaper}
            aspectRatio="full"
            interactive={true}
            speedMultiplier={speed}
            bloomIntensity={bloom}
            className="w-full h-full"
          />
          <button
            id="btn-exit-fullscreen"
            onClick={() => setIsFullScreen(false)}
            className="absolute top-6 right-6 z-50 px-4 py-2 rounded-full glass-pill text-white text-xs font-semibold flex items-center gap-2 hover:bg-white/20"
          >
            <X className="w-4 h-4" /> Close Fullscreen
          </button>
        </div>
      ) : null}

      <div className="relative w-full max-w-4xl min-h-screen sm:min-h-0 sm:max-h-[90vh] flex flex-col md:flex-row bg-[#0a0c14] border-0 sm:border border-white/10 rounded-none sm:rounded-3xl overflow-hidden shadow-2xl">
        {/* Header Close */}
        <button
          id="btn-close-detail-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full glass-pill flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Interactive Live Wallpaper Canvas */}
        <div className="relative flex-1 min-h-[420px] md:min-h-[560px] bg-black flex items-center justify-center overflow-hidden">
          <WallpaperEngine
            wallpaper={wallpaper}
            aspectRatio={aspectRatio}
            interactive={true}
            speedMultiplier={speed}
            bloomIntensity={bloom}
            onFullScreen={() => setIsFullScreen(true)}
            className="w-full h-full max-h-[580px]"
          />

          {/* Floating Aspect Ratio & Tuning toggles */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
            <div className="glass-pill rounded-full p-1 flex items-center gap-1 text-[11px] font-medium text-white/90">
              <button
                onClick={() => {
                  setAspectRatio('19.5:9');
                  triggerHaptic('light');
                }}
                className={`px-2.5 py-0.5 rounded-full transition-colors ${
                  aspectRatio === '19.5:9' ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400'
                }`}
              >
                19.5:9 Phone
              </button>
              <button
                onClick={() => {
                  setAspectRatio('16:9');
                  triggerHaptic('light');
                }}
                className={`px-2.5 py-0.5 rounded-full transition-colors ${
                  aspectRatio === '16:9' ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400'
                }`}
              >
                16:9 Wide
              </button>
            </div>

            <button
              id="btn-toggle-tuning"
              onClick={() => {
                setShowTuning(!showTuning);
                triggerHaptic('light');
              }}
              title="Tune Live Engine"
              className={`w-8 h-8 rounded-full glass-pill flex items-center justify-center text-white/80 transition-colors ${
                showTuning ? 'bg-cyan-500/30 text-cyan-400 border-cyan-400/50' : 'hover:bg-white/20'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Engine Tuning Drawer */}
          {showTuning && (
            <div className="absolute top-16 left-4 z-30 p-3.5 rounded-2xl glass-panel text-xs text-white space-y-3 w-56 shadow-2xl border border-white/20 animate-in fade-in">
              <div>
                <div className="flex justify-between text-[11px] text-zinc-300 mb-1">
                  <span>{t.motionSpeed}</span>
                  <span className="font-mono text-cyan-400">{speed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-zinc-300 mb-1">
                  <span>{t.glowIntensity}</span>
                  <span className="font-mono text-purple-400">{bloom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.0"
                  step="0.1"
                  value={bloom}
                  onChange={(e) => setBloom(parseFloat(e.target.value))}
                  className="w-full accent-purple-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Wallpaper Metadata & Primary CTAs */}
        <div className="w-full md:w-[390px] p-5 sm:p-6 flex flex-col justify-between bg-[#080a10] overflow-y-auto max-h-[500px] md:max-h-[640px]">
          <div>
            {/* Badges */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                {wallpaper.category}
              </span>
              {wallpaper.isPremium && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PRO VIP
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-zinc-400 bg-white/5">
                {wallpaper.resolution}
              </span>
            </div>

            {/* Title & Creator */}
            <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">{wallpaper.title}</h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
              <span>By {wallpaper.creator}</span>
              <span>•</span>
              <span>{wallpaper.downloadCount.toLocaleString()} downloads</span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-5">{wallpaper.description}</p>

            {/* Technical Specs Bento Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/8 mb-5 text-center">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{t.fps}</div>
                <div className="text-xs font-bold text-cyan-400 mt-0.5">60 FPS HDR</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{t.duration}</div>
                <div className="text-xs font-bold text-purple-300 mt-0.5">{wallpaper.duration}s Loop</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{t.fileSize}</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">{wallpaper.fileSize}</div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {wallpaper.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[10px] text-zinc-400 bg-white/5 border border-white/5 hover:text-white transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Related Wallpapers Carousel */}
            {related.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5">
                  {t.related}
                </h4>
                <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                  {related.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => {
                        onSelectWallpaper(rel);
                        triggerHaptic('light');
                      }}
                      className="group relative flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/80 transition-all text-left"
                    >
                      <img
                        src={rel.thumbnailUrl}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[9px] font-medium text-white truncate w-full">
                          {rel.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-white/10 space-y-2.5">
            {/* Primary Set As Wallpaper Button */}
            <button
              id="btn-detail-set-wallpaper"
              onClick={() => {
                onApply(wallpaper);
                triggerHaptic('medium');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-200 fill-current" />
              {t.setAsWallpaper}
            </button>

            {/* Download & Favorite & Share secondary actions */}
            <div className="grid grid-cols-3 gap-2">
              <button
                id="btn-detail-download"
                onClick={() => {
                  onDownload(wallpaper);
                  triggerHaptic('light');
                }}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.download}</span>
              </button>

              <button
                id="btn-detail-favorite"
                onClick={() => {
                  onToggleFavorite(wallpaper.id);
                  triggerHaptic('light');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  isFavorited
                    ? 'bg-rose-500/25 border border-rose-500/40 text-rose-400'
                    : 'bg-white/10 hover:bg-white/15 text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current text-rose-400' : ''}`} />
                <span>{isFavorited ? 'Saved' : t.favorite}</span>
              </button>

              <button
                id="btn-detail-share"
                onClick={handleShare}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-zinc-300" />}
                <span>{copiedLink ? 'Copied' : t.share}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

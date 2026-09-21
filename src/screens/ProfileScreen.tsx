import React, { useState } from 'react';
import { UserSettings, UserProfile } from '../types';
import {
  User,
  Crown,
  Smartphone,
  Zap,
  Volume2,
  Trash2,
  Globe,
  HelpCircle,
  Shield,
  Sparkles,
  Check,
  HardDrive,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { translations } from '../data/i18n';
import { triggerHaptic } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ProfileScreenProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  favoritesCount: number;
  downloadsCount: number;
  onResetOnboarding: () => void;
  onClearCache: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  settings,
  onUpdateSettings,
  favoritesCount,
  downloadsCount,
  onResetOnboarding,
  onClearCache,
}) => {
  const t = translations[settings.language].profile;
  const [showProModal, setShowProModal] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [isVip, setIsVip] = useState(true);

  const handleClear = () => {
    onClearCache();
    triggerHaptic('medium');
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  const handleProUpgrade = () => {
    triggerHaptic('heavy');
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#00f0ff', '#ff0077', '#ffd700'],
    });
    setShowProModal(false);
  };

  return (
    <div className="w-full pb-28 pt-2 px-3 sm:px-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* User Header Profile Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#101426] to-[#0a0c16] border border-white/10 shadow-xl relative overflow-hidden">
        {/* Neon decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-0.5 shadow-xl shadow-cyan-500/20">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                alt="Profile"
                className="w-full h-full rounded-[22px] object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-black flex items-center justify-center text-[10px] text-black font-bold shadow-md">
              👑
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h2 className="text-xl font-extrabold text-white">Motion Architect</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 self-center sm:self-auto">
                <Crown className="w-3 h-3 text-amber-400" />
                MotionWall VIP
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-4">alex.creator@motionwall.io</p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/8 text-center">
                <div className="text-base font-black text-cyan-400 font-sans">{downloadsCount + 14}</div>
                <div className="text-[10px] text-zinc-400 font-medium">Applied</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/8 text-center">
                <div className="text-base font-black text-rose-400 font-sans">{favoritesCount}</div>
                <div className="text-[10px] text-zinc-400 font-medium">Saved</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/8 text-center">
                <div className="text-base font-black text-emerald-400 font-sans">{downloadsCount}</div>
                <div className="text-[10px] text-zinc-400 font-medium">Offline</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRO Upgrade VIP Banner */}
      <div
        onClick={() => {
          setShowProModal(true);
          triggerHaptic('light');
        }}
        className="group relative p-5 rounded-3xl bg-gradient-to-r from-cyan-600/30 via-purple-600/30 to-fuchsia-600/30 border border-cyan-500/30 cursor-pointer hover:border-cyan-400/80 transition-all shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-black shadow-lg">
              <Crown className="w-6 h-6 fill-current text-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-white">{t.proBanner.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-black">
                  LIFETIME
                </span>
              </div>
              <p className="text-xs text-zinc-300">{t.proBanner.subtitle}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Settings Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">
          {t.settingsTitle}
        </h3>

        <div className="rounded-3xl bg-[#0d101a] border border-white/10 divide-y divide-white/5 overflow-hidden">
          {/* Target Platform Option */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{t.platform}</div>
                <div className="text-[11px] text-zinc-400">
                  {settings.targetPlatform === 'android' ? 'Android 15 Live Service' : 'iOS 18 Motion / Live Photo'}
                </div>
              </div>
            </div>

            <div className="flex items-center p-1 bg-white/5 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  onUpdateSettings({ targetPlatform: 'android' });
                  triggerHaptic('light');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  settings.targetPlatform === 'android' ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400'
                }`}
              >
                Android
              </button>
              <button
                onClick={() => {
                  onUpdateSettings({ targetPlatform: 'ios' });
                  triggerHaptic('light');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  settings.targetPlatform === 'ios' ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400'
                }`}
              >
                iOS
              </button>
            </div>
          </div>

          {/* Engine Quality (60 FPS vs 30 FPS saver) */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{t.quality}</div>
                <div className="text-[11px] text-zinc-400">
                  {settings.quality === 'high' ? t.qualityHigh : t.qualitySaver}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onUpdateSettings({ quality: settings.quality === 'high' ? 'saver' : 'high' });
                triggerHaptic('light');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                settings.quality === 'high'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {settings.quality === 'high' ? '60 FPS Ultra' : '30 FPS Eco'}
            </button>
          </div>

          {/* Sound & Haptics toggle */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{t.soundEffects}</div>
                <div className="text-[11px] text-zinc-400">Ambient audio & subtle haptic feedback</div>
              </div>
            </div>

            <button
              onClick={() => {
                onUpdateSettings({ soundEnabled: !settings.soundEnabled });
                triggerHaptic('light');
              }}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                settings.soundEnabled ? 'bg-cyan-500' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Language Selection */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{t.language}</div>
                <div className="text-[11px] text-zinc-400">English / Tiếng Việt</div>
              </div>
            </div>

            <div className="flex items-center p-1 bg-white/5 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  onUpdateSettings({ language: 'en' });
                  triggerHaptic('light');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  settings.language === 'en' ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => {
                  onUpdateSettings({ language: 'vi' });
                  triggerHaptic('light');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  settings.language === 'vi' ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400'
                }`}
              >
                Tiếng Việt
              </button>
            </div>
          </div>

          {/* Clear Cache */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{t.clearCache}</div>
                <div className="text-[11px] text-zinc-400">Free temporary preview buffers</div>
              </div>
            </div>

            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white border border-white/10 transition-colors"
            >
              {cacheCleared ? 'Cleared ✓' : 'Clear'}
            </button>
          </div>

          {/* Reset Onboarding walkthrough */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Replay Onboarding</div>
                <div className="text-[11px] text-zinc-400">View introductory animation cards</div>
              </div>
            </div>

            <button
              onClick={onResetOnboarding}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white border border-white/10 transition-colors"
            >
              Replay
            </button>
          </div>
        </div>
      </div>

      {/* About App Footer */}
      <div className="text-center pt-4 space-y-1 text-xs text-zinc-500">
        <div className="font-bold text-zinc-400">MotionWall Live Wallpaper v2.4.0 (Build 2026)</div>
        <div>Hardware GPU-Accelerated 60 FPS Procedural Motion Engine</div>
        <div className="text-[11px]">Engineered for iOS 18 & Android 15</div>
      </div>

      {/* Pro VIP Subscription Modal */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0d101a] border border-cyan-500/40 shadow-2xl space-y-5">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Crown className="w-8 h-8 text-black fill-current" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">MotionWall PRO</h3>
              <p className="text-xs text-zinc-300 max-w-xs mx-auto">
                Unlock the complete archive of 100+ Ultra 4K 60FPS live wallpapers with zero ads and unlimited downloads.
              </p>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              {[
                'Full access to all 100+ live motion wallpapers',
                'Native Android 15 & iOS 18 Live Photo export tools',
                'Ultra 60 FPS HDR rendering engine',
                'Custom speed and bloom lighting controls',
                'Ambient synthesized sound loop generator',
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleProUpgrade}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black font-black text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Unlock Lifetime VIP ($9.99)</span>
              </button>
              <button
                onClick={() => setShowProModal(false)}
                className="w-full py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

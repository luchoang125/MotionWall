import React, { useState, useEffect } from 'react';
import { Wallpaper, UserSettings } from '../types';
import { WallpaperEngine } from './WallpaperEngine';
import {
  X,
  Smartphone,
  Check,
  Download,
  Share2,
  Sliders,
  Sparkles,
  Flashlight,
  Camera,
  Layers,
  HelpCircle,
  Clock,
  Battery,
  Wifi,
  Sun,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { translations } from '../data/i18n';
import { triggerHaptic } from '../utils/audio';

interface DeviceSimulatorModalProps {
  wallpaper: Wallpaper | null;
  settings: UserSettings;
  onClose: () => void;
  onDownload: (wp: Wallpaper) => void;
}

export const DeviceSimulatorModal: React.FC<DeviceSimulatorModalProps> = ({
  wallpaper,
  settings,
  onClose,
  onDownload,
}) => {
  if (!wallpaper) return null;

  const t = translations[settings.language].applyModal;
  const [platform, setPlatform] = useState<'android' | 'ios'>(settings.targetPlatform || 'android');
  const [viewMode, setViewMode] = useState<'lock' | 'home'>('lock');
  const [showOverlays, setShowOverlays] = useState(true);
  const [appliedTarget, setAppliedTarget] = useState<'both' | 'home' | 'lock' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');
  const [currentDate, setCurrentDate] = useState('Sunday, September 20');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString(settings.language === 'vi' ? 'vi-VN' : 'en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [settings.language]);

  const handleApply = (target: 'both' | 'home' | 'lock') => {
    triggerHaptic('medium');
    setAppliedTarget(target);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: [wallpaper.colors[0], wallpaper.colors[1], '#ffffff'],
    });
    // Trigger download of loop asset as part of setting wallpaper
    onDownload(wallpaper);
  };

  const handleExportLoop = async () => {
    setIsExporting(true);
    triggerHaptic('light');
    setTimeout(() => {
      onDownload(wallpaper);
      setIsExporting(false);
      triggerHaptic('medium');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col md:flex-row bg-[#0c0e17] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          id="btn-close-apply-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full glass-pill flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Interactive Phone Mockup Simulator */}
        <div className="relative flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#0e1220] to-[#08090f] overflow-hidden">
          {/* Phone Bezel Container */}
          <div className="relative w-[280px] sm:w-[310px] h-[580px] sm:h-[620px] rounded-[44px] p-2.5 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black border-[3px] border-neutral-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Inner Phone Screen */}
            <div className="relative w-full h-full rounded-[36px] overflow-hidden bg-black select-none">
              {/* Dynamic Island / Punch hole */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 w-24 h-5 rounded-full bg-black flex items-center justify-between px-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-white/10" />
                <span className="w-2 h-2 rounded-full bg-cyan-500/80 animate-pulse" />
              </div>

              {/* Top Status Bar */}
              <div className="absolute top-2 left-0 right-0 z-30 px-6 pt-1 flex items-center justify-between text-[11px] font-semibold text-white/90 drop-shadow">
                <span>{currentTime}</span>
                <div className="flex items-center gap-1.5 text-white/90">
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Wallpaper Live Engine Canvas */}
              <WallpaperEngine
                wallpaper={wallpaper}
                aspectRatio="19.5:9"
                showControls={false}
                speedMultiplier={1.0}
                className="w-full h-full"
              />

              {/* Interactive Phone Overlays Toggle */}
              {showOverlays && (
                <>
                  {/* LOCK SCREEN OVERLAY */}
                  {viewMode === 'lock' && (
                    <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 pointer-events-none">
                      {/* Clock & Date */}
                      <div className="pt-10 flex flex-col items-center text-center">
                        <Lock className="w-4 h-4 text-white/70 mb-1 drop-shadow" />
                        <span className="text-xs font-medium text-white/80 tracking-wide uppercase drop-shadow">
                          {currentDate}
                        </span>
                        <h2 className="text-6xl font-extrabold tracking-tight text-white/95 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-sans">
                          {currentTime}
                        </h2>
                        {platform === 'ios' ? (
                          <div className="mt-2 flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] text-white/80">
                            <Sun className="w-3.5 h-3.5 text-amber-400" /> 74°F Mostly Clear
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] text-white/80">
                            <Sparkles className="w-3 h-3 text-cyan-400" /> Motion Engine Active
                          </div>
                        )}
                      </div>

                      {/* Bottom Flashlight & Camera Buttons */}
                      <div className="flex items-center justify-between pb-3">
                        <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 shadow-lg">
                          <Flashlight className="w-5 h-5" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-white/60">
                          {platform === 'ios' ? 'Swipe up to unlock' : 'Swipe up to open'}
                        </div>
                        <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 shadow-lg">
                          <Camera className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* HOME SCREEN OVERLAY */}
                  {viewMode === 'home' && (
                    <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 pt-12 pointer-events-none">
                      {/* Search / Clock Widget */}
                      <div className="bg-black/45 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-white flex items-center justify-between shadow-lg">
                        <div>
                          <div className="text-xl font-bold">{currentTime}</div>
                          <div className="text-[11px] text-white/70">{currentDate}</div>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[10px] text-white/90">
                          <Sun className="w-3.5 h-3.5 text-amber-400" /> 74°F
                        </div>
                      </div>

                      {/* App Icons Grid */}
                      <div className="grid grid-cols-4 gap-3 py-4 text-center">
                        {[
                          { name: 'MotionWall', color: 'bg-gradient-to-tr from-cyan-500 to-fuchsia-500', icon: '✦' },
                          { name: 'Camera', color: 'bg-zinc-700', icon: '📷' },
                          { name: 'Photos', color: 'bg-white text-zinc-900', icon: '🌸' },
                          { name: 'Music', color: 'bg-red-500', icon: '🎵' },
                          { name: 'Messages', color: 'bg-emerald-500', icon: '💬' },
                          { name: 'Maps', color: 'bg-blue-500', icon: '🗺️' },
                          { name: 'Settings', color: 'bg-zinc-600', icon: '⚙️' },
                          { name: 'Files', color: 'bg-sky-500', icon: '📁' },
                        ].map((app, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div
                              className={`w-11 h-11 rounded-2xl ${app.color} flex items-center justify-center text-white font-bold text-sm shadow-md border border-white/15`}
                            >
                              {app.icon}
                            </div>
                            <span className="text-[10px] text-white/90 mt-1 drop-shadow truncate w-full">
                              {app.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Dock */}
                      <div className="bg-black/50 backdrop-blur-xl border border-white/20 rounded-3xl p-2.5 flex items-center justify-around shadow-xl mb-3">
                        {['📞', '🧭', '✉️', '⚙️'].map((ico, idx) => (
                          <div
                            key={idx}
                            className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-lg border border-white/10"
                          >
                            {ico}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Bottom Home Indicator Bar */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-40 w-32 h-1 rounded-full bg-white/60" />
            </div>
          </div>

          {/* Quick Mockup View Controls */}
          <div className="mt-4 flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 text-xs">
            <button
              id="btn-switch-lock"
              onClick={() => {
                setViewMode('lock');
                triggerHaptic('light');
              }}
              className={`px-3.5 py-1 rounded-full font-medium transition-colors ${
                viewMode === 'lock' ? 'bg-cyan-500 text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.lockScreen}
            </button>
            <button
              id="btn-switch-home"
              onClick={() => {
                setViewMode('home');
                triggerHaptic('light');
              }}
              className={`px-3.5 py-1 rounded-full font-medium transition-colors ${
                viewMode === 'home' ? 'bg-cyan-500 text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.homeScreen}
            </button>
            <button
              id="btn-toggle-overlays"
              onClick={() => setShowOverlays(!showOverlays)}
              title="Show / Hide UI overlays"
              className={`px-2.5 py-1 rounded-full transition-colors ${
                showOverlays ? 'text-zinc-300 bg-white/10' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Platform-Specific Setup Workflow & Actions */}
        <div className="w-full md:w-[380px] p-6 flex flex-col justify-between overflow-y-auto bg-[#090b12] border-t md:border-t-0 md:border-l border-white/10">
          <div>
            {/* Title & Info */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                {wallpaper.resolution}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                60 FPS HDR
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{wallpaper.title}</h3>
            <p className="text-xs text-zinc-400 mb-5">{wallpaper.description}</p>

            {/* Platform Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 mb-5">
              <button
                id="tab-platform-android"
                onClick={() => {
                  setPlatform('android');
                  triggerHaptic('light');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  platform === 'android'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                {t.androidTab}
              </button>
              <button
                id="tab-platform-ios"
                onClick={() => {
                  setPlatform('ios');
                  triggerHaptic('light');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  platform === 'ios'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                {t.iosTab}
              </button>
            </div>

            {/* Platform Explanation */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/8 text-xs text-zinc-300 leading-relaxed mb-5">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-1">
                    {platform === 'android' ? 'Native Android Live Service' : 'iOS Motion / Live Photo Standard'}
                  </p>
                  <p className="text-zinc-400">
                    {platform === 'android' ? t.androidDesc : t.iosDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Guidance */}
            <div className="space-y-2 mb-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                {t.instructionsTitle}
              </div>
              <div className="flex items-start gap-2 text-xs text-zinc-300">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  1
                </span>
                <span>{t.step1}</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-zinc-300">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  2
                </span>
                <span>{platform === 'android' ? t.step2_android : t.step2_ios}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-white/10">
            {appliedTarget ? (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                {t.appliedSuccess}
              </div>
            ) : null}

            {platform === 'android' ? (
              <>
                <button
                  id="btn-apply-both-screens"
                  onClick={() => handleApply('both')}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-black font-bold text-sm shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {t.setBothScreens}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="btn-apply-home-only"
                    onClick={() => handleApply('home')}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/10 transition-colors"
                  >
                    {t.setHomeScreen}
                  </button>
                  <button
                    id="btn-apply-lock-only"
                    onClick={() => handleApply('lock')}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/10 transition-colors"
                  >
                    {t.setLockScreen}
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  id="btn-export-ios-live"
                  onClick={handleExportLoop}
                  disabled={isExporting}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold text-sm shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Generating iOS Motion Loop...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      {t.exportLivePhoto}
                    </>
                  )}
                </button>
                <button
                  id="btn-export-video-file"
                  onClick={handleExportLoop}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  {t.exportVideo}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

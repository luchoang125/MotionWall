import React, { useState } from 'react';
import { UserSettings, Wallpaper } from '../types';
import { WallpaperEngine } from './WallpaperEngine';
import { translations } from '../data/i18n';
import { ChevronRight, Sparkles, Check } from 'lucide-react';
import { triggerHaptic } from '../utils/audio';

interface OnboardingModalProps {
  sampleWallpapers: Wallpaper[];
  settings: UserSettings;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  sampleWallpapers,
  settings,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const t = translations[settings.language].onboarding;
  const screens = t.screens;

  const currentWallpaper = sampleWallpapers[currentStep % sampleWallpapers.length] || sampleWallpapers[0];

  const handleNext = () => {
    triggerHaptic('light');
    if (currentStep < screens.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    triggerHaptic('medium');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      {/* Background Animated Canvas Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        {currentWallpaper && (
          <WallpaperEngine
            wallpaper={currentWallpaper}
            aspectRatio="full"
            interactive={false}
            showControls={false}
            className="w-full h-full scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50" />
      </div>

      {/* Main Glass Onboarding Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-3xl glass-panel border border-white/15 flex flex-col justify-between min-h-[500px] shadow-2xl">
        {/* Top Header & Skip */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              MotionWall
            </span>
          </div>
          <button
            id="btn-onboarding-skip"
            onClick={handleSkip}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors px-2 py-1"
          >
            {t.skip}
          </button>
        </div>

        {/* Center Animated Content */}
        <div className="my-8 text-center flex flex-col items-center">
          {/* Animated Mini Device Badge */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-0.5 shadow-xl shadow-cyan-500/20 mb-6 flex items-center justify-center animate-bounce duration-1000">
            <div className="w-full h-full bg-[#090a12] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-cyan-300" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-3">
            {screens[currentStep].title}
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed max-w-xs">
            {screens[currentStep].desc}
          </p>
        </div>

        {/* Bottom Navigation & Dots */}
        <div>
          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {screens.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStep(idx);
                  triggerHaptic('light');
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-8 bg-cyan-400 shadow-sm shadow-cyan-400/50' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            id="btn-onboarding-next"
            onClick={handleNext}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 text-black font-extrabold text-sm shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {currentStep === screens.length - 1 ? (
              <>
                <Check className="w-4 h-4 text-black stroke-[3]" />
                <span>{t.start}</span>
              </>
            ) : (
              <>
                <span>{t.next}</span>
                <ChevronRight className="w-4 h-4 text-black stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

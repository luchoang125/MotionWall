import React, { useState, useEffect } from 'react';
import { Wallpaper, NavTab, UserSettings } from './types';
import { WALLPAPERS } from './data/wallpapers';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { WallpaperDetailModal } from './components/WallpaperDetailModal';
import { DeviceSimulatorModal } from './components/DeviceSimulatorModal';
import { OnboardingModal } from './components/OnboardingModal';
import { triggerHaptic } from './utils/audio';
import { Sparkles, Download, CheckCircle2 } from 'lucide-react';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  autoPlay: true,
  quality: 'high',
  reduceMotion: false,
  haptics: true,
  wifiOnly: false,
  language: 'en',
  autoDownload: false,
  isVip: true,
  targetPlatform: 'android',
  deviceFrame: true,
  autoPlayPreview: true,
  soundEnabled: true,
  hapticsEnabled: true,
  hasCompletedOnboarding: false,
};

export default function App() {
  // Persistence states
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('motionwall_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('motionwall_favorites');
      return saved ? JSON.parse(saved) : ['wp-001', 'wp-021', 'wp-006', 'wp-004'];
    } catch {
      return ['wp-001', 'wp-021', 'wp-006'];
    }
  });

  const [downloads, setDownloads] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('motionwall_downloads');
      return saved ? JSON.parse(saved) : ['wp-021', 'wp-001'];
    } catch {
      return ['wp-021'];
    }
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [applyingWallpaper, setApplyingWallpaper] = useState<Wallpaper | null>(null);
  const [exploreCategory, setExploreCategory] = useState<string | undefined>(undefined);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(!settings.hasCompletedOnboarding);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync settings
  useEffect(() => {
    try {
      localStorage.setItem('motionwall_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem('motionwall_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Sync downloads
  useEffect(() => {
    try {
      localStorage.setItem('motionwall_downloads', JSON.stringify(downloads));
    } catch {
      // ignore
    }
  }, [downloads]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from Saved');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Saved to Favorites ❤️');
        return [...prev, id];
      }
    });
  };

  // Handle download wallpaper asset
  const handleDownloadWallpaper = (wp: Wallpaper) => {
    if (!downloads.includes(wp.id)) {
      setDownloads((prev) => [...prev, wp.id]);
    }
    showToast(`Downloading 4K loop: "${wp.title}" (${wp.fileSize})...`);
    triggerHaptic('medium');

    // Simulate saving high res motion asset / Live Photo
    setTimeout(() => {
      showToast(`Ready! "${wp.title}" saved to local cache ✓`);
    }, 1500);
  };

  // Handle remove downloaded
  const handleRemoveDownload = (id: string) => {
    setDownloads((prev) => prev.filter((item) => item !== id));
    showToast('Removed offline wallpaper from storage');
  };

  // Navigate to explore with optional category filter
  const handleNavigateExplore = (category?: string) => {
    setExploreCategory(category);
    setCurrentTab('explore');
  };

  // Update settings partial
  const handleUpdateSettings = (newPartial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newPartial }));
  };

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    handleUpdateSettings({ hasCompletedOnboarding: true });
  };

  const handleResetOnboarding = () => {
    setShowOnboarding(true);
    handleUpdateSettings({ hasCompletedOnboarding: false });
  };

  const handleClearCache = () => {
    setDownloads([]);
    showToast('Cache cleared successfully ✓');
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Dynamic Background Noise / Glow ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl" />
      </div>

      {/* Main Screen Views Container */}
      <main className="relative z-10 flex-1 flex flex-col">
        {currentTab === 'home' && (
          <HomeScreen
            wallpapers={WALLPAPERS}
            settings={settings}
            favorites={favorites}
            onSelectWallpaper={(wp) => setSelectedWallpaper(wp)}
            onApplyWallpaper={(wp) => setApplyingWallpaper(wp)}
            onToggleFavorite={handleToggleFavorite}
            onNavigateExplore={handleNavigateExplore}
            onNavigateCategories={() => setCurrentTab('categories')}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreScreen
            wallpapers={WALLPAPERS}
            settings={settings}
            favorites={favorites}
            initialCategory={exploreCategory}
            onSelectWallpaper={(wp) => setSelectedWallpaper(wp)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesScreen
            wallpapers={WALLPAPERS}
            settings={settings}
            favorites={favorites}
            onSelectWallpaper={(wp) => setSelectedWallpaper(wp)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentTab === 'favorites' && (
          <FavoritesScreen
            wallpapers={WALLPAPERS}
            settings={settings}
            favorites={favorites}
            downloads={downloads}
            onSelectWallpaper={(wp) => setSelectedWallpaper(wp)}
            onApplyWallpaper={(wp) => setApplyingWallpaper(wp)}
            onToggleFavorite={handleToggleFavorite}
            onRemoveDownload={handleRemoveDownload}
            onNavigateExplore={() => setCurrentTab('explore')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            favoritesCount={favorites.length}
            downloadsCount={downloads.length}
            onResetOnboarding={handleResetOnboarding}
            onClearCache={handleClearCache}
          />
        )}
      </main>

      {/* Persistent Floating Bottom Navigation Bar */}
      <Navigation
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab !== 'explore') setExploreCategory(undefined);
          setCurrentTab(tab);
        }}
        favoritesCount={favorites.length}
        settings={settings}
      />

      {/* Wallpaper Detail View Modal */}
      {selectedWallpaper && (
        <WallpaperDetailModal
          wallpaper={selectedWallpaper}
          allWallpapers={WALLPAPERS}
          settings={settings}
          isFavorited={favorites.includes(selectedWallpaper.id)}
          onToggleFavorite={handleToggleFavorite}
          onApply={(wp) => {
            setApplyingWallpaper(wp);
          }}
          onDownload={handleDownloadWallpaper}
          onSelectWallpaper={(wp) => setSelectedWallpaper(wp)}
          onClose={() => setSelectedWallpaper(null)}
        />
      )}

      {/* Device Simulator & Wallpaper Application Modal (Android & iOS workflows) */}
      {applyingWallpaper && (
        <DeviceSimulatorModal
          wallpaper={applyingWallpaper}
          settings={settings}
          onClose={() => setApplyingWallpaper(null)}
          onDownload={handleDownloadWallpaper}
        />
      )}

      {/* First-time / Replay Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal
          sampleWallpapers={WALLPAPERS.slice(0, 4)}
          settings={settings}
          onComplete={handleCompleteOnboarding}
        />
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0e1220]/95 backdrop-blur-xl border border-cyan-500/40 text-white text-xs font-semibold shadow-2xl shadow-cyan-500/20 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

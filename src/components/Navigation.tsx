import React from 'react';
import { NavTab, UserSettings } from '../types';
import { Home, Compass, Grid, Heart, User } from 'lucide-react';
import { translations } from '../data/i18n';
import { triggerHaptic } from '../utils/audio';

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  favoritesCount: number;
  settings: UserSettings;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  favoritesCount,
  settings,
}) => {
  const t = translations[settings.language].tabs;

  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.home, icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: t.explore, icon: <Compass className="w-5 h-5" /> },
    { id: 'categories', label: t.categories, icon: <Grid className="w-5 h-5" /> },
    {
      id: 'favorites',
      label: t.favorites,
      icon: (
        <div className="relative">
          <Heart className="w-5 h-5" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border border-black shadow-sm">
              {favoritesCount > 99 ? '99+' : favoritesCount}
            </span>
          )}
        </div>
      ),
    },
    { id: 'profile', label: t.profile, icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center p-3 sm:pb-5 pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-md bg-[#0a0c14]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        <ul className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <li key={tab.id} className="flex-1">
                <button
                  id={`nav-tab-${tab.id}`}
                  onClick={() => {
                    onTabChange(tab.id);
                    triggerHaptic('light');
                  }}
                  className={`w-full py-2 flex flex-col items-center justify-center relative transition-all duration-200 ${
                    isActive ? 'text-cyan-400' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {/* Icon container */}
                  <div
                    className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                      isActive ? 'bg-cyan-500/15 shadow-md shadow-cyan-500/20 scale-110' : ''
                    }`}
                  >
                    {tab.icon}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[10px] tracking-wide mt-0.5 whitespace-nowrap ${
                      isActive ? 'font-bold text-white' : 'font-medium'
                    }`}
                  >
                    {tab.label}
                  </span>

                  {/* Active Bottom Glow Pill */}
                  {isActive && (
                    <span className="absolute -bottom-1 w-6 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_#06b6d4]" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

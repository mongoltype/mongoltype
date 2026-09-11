import React, { useState } from 'react';
import {
  Keyboard,
  Trophy,
  Users,
  Target,
  Award,
  User,
  Volume2,
  VolumeX,
  Database,
  Moon,
  Sun,
  LogIn,
  Sparkles,
  Zap,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { AGE_CATEGORIES } from '../lib/mongolian-text';

export type NavTab =
  | 'home'
  | 'typing'
  | 'race'
  | 'leaderboard'
  | 'features'
  | 'how-to'
  | 'help'
  | 'missions'
  | 'achievements'
  | 'profile';

interface NavbarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
}

// Stylized geometric italic M logo matching image.png
export const MongolTypeLogo: React.FC<{ className?: string }> = ({ className = 'w-8 h-7' }) => (
  <svg
    viewBox="0 0 34 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 24L8.8 6H13.8L10.5 15L17 6H21.5L16.2 24H11.8L14.2 15L8 24H3Z"
      fill="#4ADE80"
    />
    <path
      d="M20.5 24L25.8 6H30.5L25.2 24H20.5Z"
      fill="#22C55E"
    />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const {
    user,
    soundEnabled,
    toggleSound,
    onlineUsersCount,
    activeAgeCategory,
    setShowAgeCategoryModal,
    setShowAuthModal,
    setShowSupabaseModal,
  } = useAppStore();

  const [isDarkMode, setIsDarkMode] = useState(true);

  const activeCategoryInfo = AGE_CATEGORIES.find((c) => c.id === activeAgeCategory) || AGE_CATEGORIES[2];

  // Core nav links matching screenshot: "Нүүр", "Онцлог", "Хэрхэн ашиглах", "Тусламж"
  // Plus direct access to "Бичих" & "Уралдаан"
  const mainLinks: Array<{ id: NavTab; label: string }> = [
    { id: 'home', label: 'Нүүр' },
    { id: 'typing', label: 'Бичих дасгал' },
    { id: 'race', label: 'Уралдаан' },
    { id: 'features', label: 'Онцлог' },
    { id: 'how-to', label: 'Хэрхэн ашиглах' },
    { id: 'help', label: 'Тусламж' },
    { id: 'leaderboard', label: 'Чансаа' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050608]/95 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo: Mongol (white) + Type (neon green) with custom M icon */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <MongolTypeLogo className="w-8 h-7 text-emerald-400 group-hover:scale-105 transition-transform" />
            <span className="font-extrabold text-xl sm:text-2xl text-white tracking-tight">
              Mongol<span className="text-emerald-400">Type</span>
            </span>
          </button>

          {/* Online badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-400 font-bold">{onlineUsersCount}</span>
            <span>онлайн</span>
          </div>
        </div>

        {/* Center Nav Links (Exact style from screenshot with green underline indicator) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {mainLinks.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className="flex flex-col items-center group py-1 cursor-pointer transition-colors"
              >
                <span
                  className={`text-sm font-medium tracking-normal transition-colors ${
                    isActive ? 'text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {item.label}
                </span>
                {/* Active Underline indicator from screenshot */}
                {isActive ? (
                  <span className="w-6 h-[2px] bg-emerald-400 rounded-full mt-1 transition-all" />
                ) : (
                  <span className="w-0 h-[2px] bg-emerald-400/0 rounded-full mt-1 group-hover:w-4 group-hover:bg-emerald-400/40 transition-all duration-200" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Age Category + Sound + Moon Theme Toggle + "Эхлэх" Pill Button + Profile Chip */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Age Category Quick Trigger */}
          <button
            id="navbar-age-category-btn"
            onClick={() => setShowAgeCategoryModal(true)}
            title="Насны ангилал солих / дэлгэрэнгүй харах"
            className="group relative flex items-center gap-2 pl-2 pr-2.5 sm:pr-3 py-1.5 rounded-full border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-emerald-950/40 to-zinc-900/90 hover:from-emerald-500/25 hover:via-emerald-900/60 hover:to-zinc-800/90 hover:border-emerald-400/90 text-white text-xs font-semibold transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.12)] hover:shadow-[0_0_24px_rgba(52,211,153,0.35)] active:scale-95 ring-1 ring-white/5"
          >
            {/* span 1: Badge Emoji with soft glowing circular container */}
            <span className="w-6 h-6 rounded-full bg-black/50 border border-emerald-500/40 flex items-center justify-center text-sm leading-none transition-transform group-hover:scale-110 duration-200 shadow-sm shrink-0">
              {activeCategoryInfo.badgeEmoji}
            </span>

            {/* span 2: Category Name */}
            <span className="hidden sm:inline font-bold text-xs tracking-tight text-emerald-300 group-hover:text-emerald-200 transition-colors">
              {activeCategoryInfo.nameMn}
            </span>

            {/* span 3: Age Range Tag */}
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 tracking-tight shadow-inner group-hover:border-emerald-300/60 transition-colors">
              {activeCategoryInfo.ageRange}
            </span>

            <ChevronDown size={12} className="text-emerald-400/70 group-hover:text-emerald-300 group-hover:translate-y-0.5 transition-all hidden sm:block shrink-0" />
          </button>

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Дууг хаах' : 'Дууг нээх'}
            className={`p-2 rounded-full border transition-colors ${
              soundEnabled
                ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Theme Moon Toggle (Icon from screenshot) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Сэдэв солих"
            className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            {isDarkMode ? <Moon size={18} /> : <Sun size={18} className="text-amber-400" />}
          </button>

          {/* "Эхлэх" Pill Button (Exact match to top right in image.png) */}
          <button
            onClick={() => {
              if (currentTab === 'typing') {
                setShowAuthModal(true);
              } else {
                setCurrentTab('typing');
              }
            }}
            className="px-5 sm:px-6 py-2 rounded-full border border-zinc-700 bg-transparent hover:bg-zinc-800 hover:border-zinc-500 text-white text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-sm active:scale-95"
          >
            Эхлэх
          </button>

          {/* Profile / Auth trigger */}
          <button
            onClick={() => setCurrentTab('profile')}
            title="Профайл харах"
            className="flex items-center gap-2 p-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-emerald-400/50 transition-all"
          >
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-400/40"
            />
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Scrollable Nav Links */}
      <div className="md:hidden flex items-center gap-4 px-4 py-2.5 border-t border-zinc-800/80 overflow-x-auto bg-[#07080d] no-scrollbar">
        {mainLinks.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`text-xs font-medium whitespace-nowrap transition-colors flex flex-col items-center ${
                isActive ? 'text-white font-bold' : 'text-zinc-400'
              }`}
            >
              <span>{item.label}</span>
              {isActive && <span className="w-4 h-[2px] bg-emerald-400 rounded-full mt-0.5" />}
            </button>
          );
        })}
      </div>
    </header>
  );
};

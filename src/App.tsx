import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar, NavTab } from './components/Navbar';
import { MongolTypeHome } from './components/MongolTypeHome';
import { TypingEngine } from './components/TypingEngine';
import { MultiplayerRace } from './components/MultiplayerRace';
import { LeaderboardView } from './components/LeaderboardView';
import { MissionsView } from './components/MissionsView';
import { AchievementsView } from './components/AchievementsView';
import { ProfileView } from './components/ProfileView';
import { LevelUpModal } from './components/LevelUpModal';
import { SupabaseModal } from './components/SupabaseModal';
import { AuthModal } from './components/AuthModal';
import { AgeCategoryModal } from './components/AgeCategoryModal';
import { Footer } from './components/Footer';
import { useAppStore } from './lib/store';
import { AgeCategory } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [leaderboardAgeFilter, setLeaderboardAgeFilter] = useState<AgeCategory | 'all'>('all');
  const { typingMode, setTypingMode, isInMultiplayer } = useAppStore();

  // If user enters race mode via store, sync tab to 'race'
  useEffect(() => {
    if (typingMode === 'race' || isInMultiplayer) {
      setCurrentTab('race');
    }
  }, [typingMode, isInMultiplayer]);

  const isHomeView = currentTab === 'home' || currentTab === 'features' || currentTab === 'how-to' || currentTab === 'help';

  return (
    <div className="min-h-screen bg-[#050608] text-zinc-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-emerald-400 selection:text-black">
      {/* Subtle ambient background glow matching the screenshot */}
      <div className="fixed top-0 right-1/4 w-[600px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[180px] pointer-events-none" />

      {/* Top Navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-8 flex flex-col items-center justify-start z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="w-full"
          >
            {isHomeView && (
              <MongolTypeHome
                onStartTyping={() => setCurrentTab('typing')}
                onStartRace={() => setCurrentTab('race')}
                onViewLeaderboard={(ageCat) => {
                  if (ageCat) setLeaderboardAgeFilter(ageCat);
                  setCurrentTab('leaderboard');
                }}
                activeSection={currentTab !== 'home' ? currentTab : undefined}
              />
            )}
            {currentTab === 'typing' && <TypingEngine />}
            {currentTab === 'race' && <MultiplayerRace />}
            {currentTab === 'leaderboard' && (
              <LeaderboardView key={String(leaderboardAgeFilter)} initialAgeFilter={leaderboardAgeFilter} />
            )}
            {currentTab === 'missions' && <MissionsView />}
            {currentTab === 'achievements' && <AchievementsView />}
            {currentTab === 'profile' && <ProfileView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AgeCategoryModal
        onNavigateToTyping={() => setCurrentTab('typing')}
        onNavigateToLeaderboard={(category) => {
          setLeaderboardAgeFilter(category);
          setCurrentTab('leaderboard');
        }}
      />
      <LevelUpModal />
      <SupabaseModal />
      <AuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}

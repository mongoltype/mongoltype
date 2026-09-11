import { create } from 'zustand';
import {
  UserProfile,
  Difficulty,
  TypingMode,
  AgeCategory,
  TypingMetrics,
  DailyMission,
  Achievement,
  LeaderboardEntry,
  MatchHistoryRecord,
  MultiplayerRoom,
  RacerProgress
} from '../types';
import { getTitleForLevel, getXpRequiredForLevel, generateTypingPrompt } from './mongolian-text';
import { sound } from './audio';
import { cloudSync, supabase } from './supabase';

interface AppState {
  // User Profile
  user: UserProfile;
  setUser: (user: Partial<UserProfile>) => void;
  setCosmeticGlow: (glow: UserProfile['cosmeticGlow']) => void;

  // Age Category (Бага анги, Дунд анги, Ахлах анги - Эссэ, Насанд хүрэгчид)
  activeAgeCategory: AgeCategory;
  setActiveAgeCategory: (cat: AgeCategory) => void;

  // Active Typing Session
  difficulty: Difficulty;
  typingMode: TypingMode;
  targetWordCount: number;
  promptText: string;
  metrics: TypingMetrics;
  isTypingActive: boolean;
  isSessionFinished: boolean;

  // Sound settings
  soundEnabled: boolean;
  soundVolume: number;
  toggleSound: () => void;
  setSoundVolume: (vol: number) => void;

  // Online status
  onlineUsersCount: number;

  // Missions & Achievements
  dailyMissions: DailyMission[];
  achievements: Achievement[];
  claimMission: (id: string) => void;

  // Leaderboard & Match History
  leaderboard: LeaderboardEntry[];
  matchHistory: MatchHistoryRecord[];

  // Realtime Multiplayer
  activeRoom: MultiplayerRoom | null;
  isInMultiplayer: boolean;
  isHost: boolean;
  createMultiplayerRoom: (difficulty?: Difficulty) => string;
  joinMultiplayerRoom: (code: string) => boolean;
  leaveMultiplayerRoom: () => void;
  updateMyRaceProgress: (progress: number, wpm: number, accuracy: number) => void;
  startRoomCountdown: () => void;

  // Modals
  showAgeCategoryModal: boolean;
  setShowAgeCategoryModal: (show: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showSupabaseModal: boolean;
  setShowSupabaseModal: (show: boolean) => void;
  levelUpData: { show: boolean; newLevel: number; newTitle: string; xpGained: number } | null;
  dismissLevelUpModal: () => void;

  // Actions
  setDifficulty: (diff: Difficulty) => void;
  setTypingMode: (mode: TypingMode) => void;
  setTargetWordCount: (count: number) => void;
  resetPrompt: () => void;
  setMetrics: (metrics: Partial<TypingMetrics>) => void;
  startSession: () => void;
  finishSession: (metrics: TypingMetrics) => void;
  addXp: (amount: number) => void;
}

const INITIAL_USER: UserProfile = {
  id: 'user_' + Math.random().toString(36).substring(2, 9),
  username: 'Баатар_Бичээч',
  displayName: 'Баатар Бичээч',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  level: 1,
  xp: 45,
  xpToNextLevel: 100,
  title: 'Шинэхэн',
  cosmeticGlow: 'emerald',
  ageCategory: 'high',
  bestWpm: 78,
  avgWpm: 64,
  avgAccuracy: 97.4,
  totalRaces: 14,
  racesWon: 8,
  wordsTyped: 1240,
  currentStreak: 5,
  bestStreak: 12,
  createdAt: new Date().toISOString(),
};

const INITIAL_MISSIONS: DailyMission[] = [
  {
    id: 'm1',
    title: 'Type 500 Words',
    titleMn: '500 үг алдаагүй шивэх',
    description: 'Монгол кирилл гар дээр 500 үг амжилттай бичиж дуусгах',
    target: 500,
    current: 320,
    rewardXp: 150,
    isCompleted: false,
    isClaimed: false,
    iconName: 'Keyboard',
  },
  {
    id: 'm2',
    title: 'Win 3 Races',
    titleMn: '3 уралдаанд тэргүүлэх',
    description: 'Олон тоглогчийн шууд уралдаанд 3 удаа 1-р байранд шалгарах',
    target: 3,
    current: 2,
    rewardXp: 250,
    isCompleted: false,
    isClaimed: false,
    iconName: 'Trophy',
  },
  {
    id: 'm3',
    title: 'Reach 95% Accuracy',
    titleMn: '95%-иас дээш нарийвчлал',
    description: 'Аливаа сорилыг 95%+ нарийвчлалтайгаар гүйцэтгэх',
    target: 1,
    current: 1,
    rewardXp: 120,
    isCompleted: true,
    isClaimed: false,
    iconName: 'Target',
  },
  {
    id: 'm4',
    title: 'Maintain 10 Word Streak',
    titleMn: '10 алдаагүй цуврал үг',
    description: 'Нэг ч алдаа гаргалгүйгээр 10 үг дараалан шивэх',
    target: 10,
    current: 10,
    rewardXp: 100,
    isCompleted: true,
    isClaimed: false,
    iconName: 'Flame',
  },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: 'First Victory',
    titleMn: 'Анхны Ялалт',
    description: 'Олон тоглогчийн уралдаанд анх удаа ялалт байгуулах',
    category: 'races',
    icon: 'Crown',
    progress: 1,
    maxProgress: 1,
    isUnlocked: true,
    unlockedAt: '2026-09-08',
    rewardXp: 100,
  },
  {
    id: 'a2',
    title: '1,000 Words Milestone',
    titleMn: '1,000 Үгийн Барианд',
    description: 'Нийт 1,000 үг монгол кириллээр шивэх',
    category: 'words',
    icon: 'BookOpen',
    progress: 1000,
    maxProgress: 1000,
    isUnlocked: true,
    unlockedAt: '2026-09-07',
    rewardXp: 200,
  },
  {
    id: 'a3',
    title: 'Speed Demon: 100 WPM',
    titleMn: '100 WPM Хурдны Тэнгэр',
    description: 'Монгол кириллээр 100-аас дээш WPM хурданд хүрэх',
    category: 'speed',
    icon: 'Zap',
    progress: 78,
    maxProgress: 100,
    isUnlocked: false,
    rewardXp: 500,
  },
  {
    id: 'a4',
    title: 'Flawless Mind',
    titleMn: 'Төгс Нарийвчлал 100%',
    description: 'Нэг ч үсэг алдалгүйгээр 50-аас дээш үгтэй бичвэрийг гүйцэтгэх',
    category: 'accuracy',
    icon: 'ShieldCheck',
    progress: 98,
    maxProgress: 100,
    isUnlocked: false,
    rewardXp: 300,
  },
  {
    id: 'a5',
    title: 'Steppe Falcon Streak',
    titleMn: 'Талын Шонхор: 10 Дараалсан Ялалт',
    description: 'Уралдаанд дараалан 10 удаа тэргүүлэх',
    category: 'special',
    icon: 'Flame',
    progress: 5,
    maxProgress: 10,
    isUnlocked: false,
    rewardXp: 600,
  },
  {
    id: 'a6',
    title: 'Cyrillic Virtuoso',
    titleMn: 'Кирилл Үсгийн Мастер',
    description: 'Ө, Ү, Ё агуулсан хүнд түвшний 200 үг алдаагүй шивэх',
    category: 'special',
    icon: 'Sparkles',
    progress: 140,
    maxProgress: 200,
    isUnlocked: false,
    rewardXp: 400,
  },
];

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  // Kids (Бага анги 6-10)
  {
    rank: 1,
    id: 'lb_k1',
    username: 'Мишээл_Туулай',
    avatarUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=150&q=80',
    title: 'Бяцхан бичээч',
    level: 14,
    wpm: 38,
    accuracy: 98.6,
    streak: 8,
    racesWon: 12,
    glowColor: 'emerald',
    ageCategory: 'kids',
  },
  {
    rank: 2,
    id: 'lb_k2',
    username: 'Анар_Одхон',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    title: 'Бяцхан бичээч',
    level: 11,
    wpm: 34,
    accuracy: 97.5,
    streak: 6,
    racesWon: 8,
    glowColor: 'gold',
    ageCategory: 'kids',
  },
  {
    rank: 3,
    id: 'lb_k3',
    username: 'Тэмүүлэн_Бамбар',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    title: 'Бяцхан бичээч',
    level: 8,
    wpm: 28,
    accuracy: 96.0,
    streak: 4,
    racesWon: 5,
    glowColor: 'blue',
    ageCategory: 'kids',
  },
  {
    rank: 4,
    id: 'lb_k4',
    username: 'Номин_Эрвээхэй',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    title: 'Бяцхан бичээч',
    level: 6,
    wpm: 23,
    accuracy: 95.8,
    streak: 3,
    racesWon: 3,
    glowColor: 'purple',
    ageCategory: 'kids',
  },

  // Middle School (Дунд анги 11-15)
  {
    rank: 1,
    id: 'lb_m1',
    username: 'Хангай_Шонхор',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    title: 'Өсвөрийн тамирчин',
    level: 32,
    wpm: 72,
    accuracy: 98.4,
    streak: 15,
    racesWon: 45,
    glowColor: 'blue',
    ageCategory: 'middle',
  },
  {
    rank: 2,
    id: 'lb_m2',
    username: 'Сарнай_Cosmos',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    title: 'Өсвөрийн тамирчин',
    level: 26,
    wpm: 64,
    accuracy: 97.9,
    streak: 11,
    racesWon: 31,
    glowColor: 'purple',
    ageCategory: 'middle',
  },
  {
    rank: 3,
    id: 'lb_m3',
    username: 'Төгөлдөр_Math',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    title: 'Өсвөрийн тамирчин',
    level: 22,
    wpm: 58,
    accuracy: 96.7,
    streak: 8,
    racesWon: 20,
    glowColor: 'emerald',
    ageCategory: 'middle',
  },

  // High School (Ахлах анги 16-18) - Essays
  {
    rank: 1,
    id: 'lb_1',
    username: 'Тэмүүжин_Swift',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    title: 'Домогт Бичээч',
    level: 72,
    wpm: 124,
    accuracy: 99.2,
    streak: 34,
    racesWon: 142,
    glowColor: 'gold',
    ageCategory: 'high',
  },
  {
    rank: 2,
    id: 'lb_2',
    username: 'Хулан_Apex',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    title: 'Keyboard Master',
    level: 56,
    wpm: 118,
    accuracy: 98.8,
    streak: 22,
    racesWon: 98,
    glowColor: 'emerald',
    ageCategory: 'high',
  },
  {
    rank: 3,
    id: 'lb_4',
    username: 'Энхмаа_Cyber',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    title: 'Төмөр хуруу',
    level: 38,
    wpm: 104,
    accuracy: 98.4,
    streak: 14,
    racesWon: 62,
    glowColor: 'purple',
    ageCategory: 'high',
  },
  {
    rank: 4,
    id: 'lb_5',
    username: 'Баатар_Бичээч',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    title: 'Шинэхэн',
    level: 1,
    wpm: 78,
    accuracy: 97.4,
    streak: 5,
    racesWon: 8,
    glowColor: 'emerald',
    ageCategory: 'high',
  },

  // Adults & Pros (Насанд хүрэгчид 19+)
  {
    rank: 1,
    id: 'lb_3',
    username: 'Сүхбат_Thunder',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    title: 'Keyboard Master',
    level: 51,
    wpm: 112,
    accuracy: 97.9,
    streak: 18,
    racesWon: 84,
    glowColor: 'blue',
    ageCategory: 'adult',
  },
  {
    rank: 2,
    id: 'lb_a2',
    username: 'Ганзориг_Dev',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    title: 'Мэргэжлийн Бичээч',
    level: 48,
    wpm: 108,
    accuracy: 98.5,
    streak: 16,
    racesWon: 76,
    glowColor: 'gold',
    ageCategory: 'adult',
  },
  {
    rank: 3,
    id: 'lb_a3',
    username: 'Оюунаа_Legal',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    title: 'Төмөр хуруу',
    level: 36,
    wpm: 96,
    accuracy: 97.8,
    streak: 12,
    racesWon: 48,
    glowColor: 'emerald',
    ageCategory: 'adult',
  },
  {
    rank: 4,
    id: 'lb_6',
    username: 'Болд_Ghost',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    title: 'Хурдан гар',
    level: 19,
    wpm: 74,
    accuracy: 96.1,
    streak: 9,
    racesWon: 27,
    glowColor: 'crimson',
    ageCategory: 'adult',
  }
];

const INITIAL_MATCHES: MatchHistoryRecord[] = [
  {
    id: 'm_hist_1',
    date: 'Өнөөдөр 10:14',
    mode: 'race',
    wpm: 78,
    accuracy: 98.2,
    charsTyped: 340,
    placement: 1,
    totalPlayers: 4,
    xpEarned: 160,
    difficulty: 'medium',
    ageCategory: 'high',
  },
  {
    id: 'm_hist_2',
    date: 'Өнөөдөр 09:45',
    mode: 'words',
    wpm: 72,
    accuracy: 96.8,
    charsTyped: 180,
    xpEarned: 75,
    difficulty: 'easy',
    ageCategory: 'high',
  },
  {
    id: 'm_hist_3',
    date: 'Өчигдөр 21:30',
    mode: 'race',
    wpm: 68,
    accuracy: 95.5,
    charsTyped: 410,
    placement: 2,
    totalPlayers: 4,
    xpEarned: 110,
    difficulty: 'hard',
    ageCategory: 'high',
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  user: INITIAL_USER,
  setUser: (updated) => set((state) => ({ user: { ...state.user, ...updated } })),
  setCosmeticGlow: (glow) => set((state) => ({ user: { ...state.user, cosmeticGlow: glow } })),

  activeAgeCategory: 'high',
  setActiveAgeCategory: (cat) => {
    set((state) => ({
      activeAgeCategory: cat,
      user: { ...state.user, ageCategory: cat }
    }));
    get().resetPrompt();
  },

  difficulty: 'medium',
  typingMode: 'words',
  targetWordCount: 25,
  promptText: generateTypingPrompt('medium', 25, 'high'),
  metrics: {
    wpm: 0,
    rawWpm: 0,
    cpm: 0,
    accuracy: 100,
    correctChars: 0,
    incorrectChars: 0,
    extraChars: 0,
    missedChars: 0,
    elapsedSeconds: 0,
    combo: 0,
    maxCombo: 0,
  },
  isTypingActive: false,
  isSessionFinished: false,

  soundEnabled: true,
  soundVolume: 0.6,
  toggleSound: () => {
    const nextVal = !get().soundEnabled;
    sound.setMuted(!nextVal);
    set({ soundEnabled: nextVal });
  },
  setSoundVolume: (vol) => {
    sound.setVolume(vol);
    set({ soundVolume: vol });
  },

  onlineUsersCount: 148,

  dailyMissions: INITIAL_MISSIONS,
  achievements: INITIAL_ACHIEVEMENTS,
  claimMission: (id: string) => {
    const mission = get().dailyMissions.find(m => m.id === id);
    if (mission && mission.isCompleted && !mission.isClaimed) {
      get().addXp(mission.rewardXp);
      set((state) => ({
        dailyMissions: state.dailyMissions.map(m =>
          m.id === id ? { ...m, isClaimed: true } : m
        ),
      }));
    }
  },

  leaderboard: INITIAL_LEADERBOARD,
  matchHistory: INITIAL_MATCHES,

  activeRoom: null,
  isInMultiplayer: false,
  isHost: false,

  createMultiplayerRoom: (difficulty = 'medium') => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const currentUser = get().user;
    const prompt = generateTypingPrompt(difficulty, 30, get().activeAgeCategory);

    const hostRacer: RacerProgress = {
      id: 'racer_' + currentUser.id,
      userId: currentUser.id,
      username: currentUser.username,
      avatarUrl: currentUser.avatarUrl,
      carIcon: '🏎️',
      glowColor: currentUser.cosmeticGlow,
      progress: 0,
      wpm: 0,
      accuracy: 100,
      isFinished: false,
    };

    // Add 2 competitive Mongolian bot racers to guarantee immediate thrilling multiplayer races
    const bot1: RacerProgress = {
      id: 'bot_1',
      userId: 'bot_altai',
      username: 'Алтай_Сум',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      carIcon: '🐎',
      glowColor: 'blue',
      progress: 0,
      wpm: 75,
      accuracy: 97,
      isFinished: false,
      isBot: true,
    };

    const bot2: RacerProgress = {
      id: 'bot_2',
      userId: 'bot_khangai',
      username: 'Хангай_Шонхор',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      carIcon: '⚡',
      glowColor: 'purple',
      progress: 0,
      wpm: 68,
      accuracy: 96,
      isFinished: false,
      isBot: true,
    };

    const room: MultiplayerRoom = {
      id: 'room_' + roomCode,
      code: roomCode,
      name: `Монгол Өрөө #${roomCode}`,
      status: 'waiting',
      text: prompt,
      difficulty,
      hostId: currentUser.id,
      players: [hostRacer, bot1, bot2],
      countdown: 3,
      createdAt: Date.now(),
    };

    set({
      activeRoom: room,
      isInMultiplayer: true,
      isHost: true,
      promptText: prompt,
      difficulty,
      typingMode: 'race',
    });

    cloudSync.broadcast(`room:${roomCode}`, { action: 'room_created', room });
    return roomCode;
  },

  joinMultiplayerRoom: (code: string) => {
    const upper = code.trim().toUpperCase();
    const currentUser = get().user;
    const prompt = generateTypingPrompt('medium', 30);

    const myRacer: RacerProgress = {
      id: 'racer_' + currentUser.id,
      userId: currentUser.id,
      username: currentUser.username,
      avatarUrl: currentUser.avatarUrl,
      carIcon: '🏎️',
      glowColor: currentUser.cosmeticGlow,
      progress: 0,
      wpm: 0,
      accuracy: 100,
      isFinished: false,
    };

    const botHost: RacerProgress = {
      id: 'bot_host',
      userId: 'host_temuulen',
      username: 'Тэмүүлэн_Pro',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      carIcon: '🦅',
      glowColor: 'gold',
      progress: 0,
      wpm: 82,
      accuracy: 98,
      isFinished: false,
      isBot: true,
    };

    const room: MultiplayerRoom = {
      id: 'room_' + upper,
      code: upper,
      name: `Монгол Өрөө #${upper}`,
      status: 'waiting',
      text: prompt,
      difficulty: 'medium',
      hostId: 'host_temuulen',
      players: [botHost, myRacer],
      countdown: 3,
      createdAt: Date.now(),
    };

    set({
      activeRoom: room,
      isInMultiplayer: true,
      isHost: false,
      promptText: prompt,
      difficulty: 'medium',
      typingMode: 'race',
    });

    return true;
  },

  leaveMultiplayerRoom: () => {
    set({
      activeRoom: null,
      isInMultiplayer: false,
      isHost: false,
      typingMode: 'words',
    });
    get().resetPrompt();
  },

  updateMyRaceProgress: (progress: number, wpm: number, accuracy: number) => {
    const room = get().activeRoom;
    if (!room) return;

    const currentUserId = get().user.id;
    const updatedPlayers = room.players.map((player) => {
      if (player.userId === currentUserId) {
        const isFinished = progress >= 100;
        return {
          ...player,
          progress: Math.min(100, Math.max(0, progress)),
          wpm,
          accuracy,
          isFinished,
          finishTime: isFinished && !player.finishTime ? Date.now() : player.finishTime,
        };
      }
      return player;
    });

    const isAllDone = updatedPlayers.every((p) => p.isFinished);
    const updatedRoom: MultiplayerRoom = {
      ...room,
      players: updatedPlayers,
      status: isAllDone ? 'finished' : room.status,
    };

    set({ activeRoom: updatedRoom });
    cloudSync.broadcast(`room:${room.code}`, { action: 'progress_update', room: updatedRoom });
  },

  startRoomCountdown: () => {
    const room = get().activeRoom;
    if (!room) return;

    sound.playCountdown(false);
    set({ activeRoom: { ...room, status: 'countdown', countdown: 3 } });

    const interval = setInterval(() => {
      const currentRoom = get().activeRoom;
      if (!currentRoom) {
        clearInterval(interval);
        return;
      }

      if (currentRoom.countdown > 1) {
        const next = currentRoom.countdown - 1;
        sound.playCountdown(false);
        set({ activeRoom: { ...currentRoom, countdown: next } });
      } else {
        clearInterval(interval);
        sound.playCountdown(true);
        set({
          activeRoom: { ...currentRoom, status: 'racing', countdown: 0 },
          isTypingActive: true,
        });

        // Simulate competitive bot movement during multiplayer race
        const botInterval = setInterval(() => {
          const r = get().activeRoom;
          if (!r || r.status !== 'racing') {
            clearInterval(botInterval);
            return;
          }

          const playersWithBotUpdate = r.players.map(p => {
            if (!p.isBot || p.isFinished) return p;
            const step = (p.wpm / 60) * 1.6; // realistic word typing step
            const nextProg = Math.min(100, p.progress + step);
            return {
              ...p,
              progress: nextProg,
              isFinished: nextProg >= 100,
              finishTime: nextProg >= 100 ? Date.now() : undefined,
            };
          });

          const allDone = playersWithBotUpdate.every(p => p.isFinished);
          set({
            activeRoom: {
              ...r,
              players: playersWithBotUpdate,
              status: allDone ? 'finished' : 'racing',
            },
          });

          if (allDone) {
            clearInterval(botInterval);
          }
        }, 800);
      }
    }, 1000);
  },

  showAgeCategoryModal: false,
  setShowAgeCategoryModal: (show) => set({ showAgeCategoryModal: show }),

  showAuthModal: false,
  setShowAuthModal: (show) => set({ showAuthModal: show }),

  showSupabaseModal: false,
  setShowSupabaseModal: (show) => set({ showSupabaseModal: show }),

  levelUpData: null,
  dismissLevelUpModal: () => set({ levelUpData: null }),

  setDifficulty: (diff) => {
    set({ difficulty: diff });
    get().resetPrompt();
  },

  setTypingMode: (mode) => {
    set({ typingMode: mode });
    get().resetPrompt();
  },

  setTargetWordCount: (count) => {
    set({ targetWordCount: count });
    get().resetPrompt();
  },

  resetPrompt: () => {
    const diff = get().difficulty;
    const count = get().targetWordCount;
    const ageCategory = get().activeAgeCategory;
    const newText = generateTypingPrompt(diff, count, ageCategory);
    set({
      promptText: newText,
      isTypingActive: false,
      isSessionFinished: false,
      metrics: {
        wpm: 0,
        rawWpm: 0,
        cpm: 0,
        accuracy: 100,
        correctChars: 0,
        incorrectChars: 0,
        extraChars: 0,
        missedChars: 0,
        elapsedSeconds: 0,
        combo: 0,
        maxCombo: 0,
      },
    });
  },

  setMetrics: (updated) => {
    set((state) => ({ metrics: { ...state.metrics, ...updated } }));
  },

  startSession: () => {
    set({ isTypingActive: true, isSessionFinished: false });
  },

  finishSession: (finalMetrics) => {
    set({ isTypingActive: false, isSessionFinished: true, metrics: finalMetrics });

    // Calculate XP: base on WPM, accuracy %, combo, and mode
    const baseWpmXp = Math.round(finalMetrics.wpm * 1.5);
    const accuracyBonus = Math.round((finalMetrics.accuracy / 100) * 50);
    const comboBonus = Math.round(finalMetrics.maxCombo * 2);
    const totalXp = Math.max(20, baseWpmXp + accuracyBonus + comboBonus);

    get().addXp(totalXp);

    const currentAgeCat = get().activeAgeCategory;

    // Save match history record
    const record: MatchHistoryRecord = {
      id: 'm_' + Date.now(),
      date: 'Саяхан',
      mode: get().typingMode,
      wpm: finalMetrics.wpm,
      accuracy: finalMetrics.accuracy,
      charsTyped: finalMetrics.correctChars,
      xpEarned: totalXp,
      difficulty: get().difficulty,
      ageCategory: currentAgeCat,
    };

    set((state) => ({
      matchHistory: [record, ...state.matchHistory.slice(0, 19)],
      user: {
        ...state.user,
        wordsTyped: state.user.wordsTyped + Math.round(finalMetrics.correctChars / 5),
        bestWpm: Math.max(state.user.bestWpm, finalMetrics.wpm),
        avgWpm: Math.round((state.user.avgWpm * state.user.totalRaces + finalMetrics.wpm) / (state.user.totalRaces + 1)),
        totalRaces: state.user.totalRaces + 1,
        currentStreak: finalMetrics.accuracy >= 95 ? state.user.currentStreak + 1 : 0,
        bestStreak: Math.max(state.user.bestStreak, finalMetrics.accuracy >= 95 ? state.user.currentStreak + 1 : state.user.bestStreak),
      },
    }));
  },

  addXp: (amount: number) => {
    const user = get().user;
    let newXp = user.xp + amount;
    let currentLevel = user.level;
    let requiredXp = getXpRequiredForLevel(currentLevel);
    let leveledUp = false;

    while (newXp >= requiredXp) {
      newXp -= requiredXp;
      currentLevel += 1;
      requiredXp = getXpRequiredForLevel(currentLevel);
      leveledUp = true;
    }

    const newTitle = getTitleForLevel(currentLevel);

    set((state) => ({
      user: {
        ...state.user,
        level: currentLevel,
        xp: newXp,
        xpToNextLevel: requiredXp,
        title: newTitle,
      },
    }));

    if (leveledUp) {
      sound.playLevelUp();
      set({
        levelUpData: {
          show: true,
          newLevel: currentLevel,
          newTitle,
          xpGained: amount,
        },
      });
    }
  },
}));

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type TypingMode = 'time' | 'words' | 'quote' | 'race';

export type AgeCategory = 'kids' | 'middle' | 'high' | 'adult';

export interface AgeCategoryInfo {
  id: AgeCategory;
  nameMn: string;
  ageRange: string;
  subtitle: string;
  description: string;
  badgeEmoji: string;
  recommendedWpm: string;
  samplePreview: string;
  features: string[];
  theme: {
    badgeBg: string;
    badgeText: string;
    border: string;
    glow: string;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  title: string;
  cosmeticGlow: 'emerald' | 'blue' | 'purple' | 'gold' | 'crimson';
  ageCategory: AgeCategory;
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  totalRaces: number;
  racesWon: number;
  wordsTyped: number;
  currentStreak: number;
  bestStreak: number;
  createdAt: string;
}

export interface RacerProgress {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  carIcon: string;
  glowColor: string;
  progress: number; // 0 to 100%
  wpm: number;
  accuracy: number;
  isFinished: boolean;
  finishTime?: number;
  rank?: number;
  isBot?: boolean;
}

export interface MultiplayerRoom {
  id: string;
  code: string;
  name: string;
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  text: string;
  difficulty: Difficulty;
  hostId: string;
  players: RacerProgress[];
  countdown: number;
  createdAt: number;
}

export interface TypingMetrics {
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  elapsedSeconds: number;
  combo: number;
  maxCombo: number;
}

export interface DailyMission {
  id: string;
  title: string;
  titleMn: string;
  description: string;
  target: number;
  current: number;
  rewardXp: number;
  rewardBadge?: string;
  isCompleted: boolean;
  isClaimed: boolean;
  iconName: string;
}

export interface Achievement {
  id: string;
  title: string;
  titleMn: string;
  description: string;
  category: 'speed' | 'accuracy' | 'races' | 'words' | 'special';
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  rewardXp: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatarUrl: string;
  title: string;
  level: number;
  wpm: number;
  accuracy: number;
  streak: number;
  racesWon: number;
  glowColor: string;
  ageCategory: AgeCategory;
}

export interface MatchHistoryRecord {
  id: string;
  date: string;
  mode: TypingMode;
  wpm: number;
  accuracy: number;
  charsTyped: number;
  placement?: number;
  totalPlayers?: number;
  xpEarned: number;
  difficulty: Difficulty;
  ageCategory?: AgeCategory;
}

export interface KeyLayoutInfo {
  key: string;
  label: string;
  shiftLabel?: string;
  code: string;
  finger: 'pinky-l' | 'ring-l' | 'mid-l' | 'index-l' | 'thumb' | 'index-r' | 'mid-r' | 'ring-r' | 'pinky-r';
}

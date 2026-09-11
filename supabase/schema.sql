-- =========================================================================
-- MongolType — Production Supabase & PostgreSQL Database Schema
-- Mongolian Cyrillic Real-time Competitive Typing Platform
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(32) UNIQUE NOT NULL,
    display_name VARCHAR(64) NOT NULL,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    level INTEGER DEFAULT 1 NOT NULL,
    xp INTEGER DEFAULT 0 NOT NULL,
    title VARCHAR(64) DEFAULT 'Шинэхэн' NOT NULL,
    cosmetic_glow VARCHAR(32) DEFAULT 'emerald' NOT NULL,
    best_wpm NUMERIC(5, 2) DEFAULT 0 NOT NULL,
    avg_wpm NUMERIC(5, 2) DEFAULT 0 NOT NULL,
    avg_accuracy NUMERIC(5, 2) DEFAULT 100.00 NOT NULL,
    total_races INTEGER DEFAULT 0 NOT NULL,
    races_won INTEGER DEFAULT 0 NOT NULL,
    words_typed INTEGER DEFAULT 0 NOT NULL,
    current_streak INTEGER DEFAULT 0 NOT NULL,
    best_streak INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. RACES (ROOMS) TABLE
CREATE TABLE IF NOT EXISTS public.races (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    difficulty VARCHAR(16) DEFAULT 'medium' NOT NULL,
    status VARCHAR(20) DEFAULT 'waiting' NOT NULL, -- waiting, countdown, racing, finished
    text_content TEXT NOT NULL,
    max_players INTEGER DEFAULT 6 NOT NULL,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. RACE_PLAYERS TABLE
CREATE TABLE IF NOT EXISTS public.race_players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    race_id UUID REFERENCES public.races(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    progress NUMERIC(5, 2) DEFAULT 0.00 NOT NULL, -- 0 to 100%
    wpm NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    accuracy NUMERIC(5, 2) DEFAULT 100.00 NOT NULL,
    rank INTEGER,
    is_finished BOOLEAN DEFAULT FALSE NOT NULL,
    finish_time_ms INTEGER,
    car_icon VARCHAR(16) DEFAULT '🏎️',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(race_id, user_id)
);

-- 4. TYPING_STATS TABLE (Detailed metrics per test)
CREATE TABLE IF NOT EXISTS public.typing_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    wpm NUMERIC(5, 2) NOT NULL,
    raw_wpm NUMERIC(5, 2) NOT NULL,
    accuracy NUMERIC(5, 2) NOT NULL,
    correct_chars INTEGER NOT NULL,
    incorrect_chars INTEGER NOT NULL,
    elapsed_seconds NUMERIC(6, 2) NOT NULL,
    combo_max INTEGER DEFAULT 0,
    difficulty VARCHAR(16) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(64) NOT NULL,
    title_mn VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(32) NOT NULL,
    icon VARCHAR(32) NOT NULL,
    max_progress INTEGER DEFAULT 1 NOT NULL,
    reward_xp INTEGER DEFAULT 100 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. USER_ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_id VARCHAR(64) REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
    progress INTEGER DEFAULT 0 NOT NULL,
    is_unlocked BOOLEAN DEFAULT FALSE NOT NULL,
    unlocked_at TIMESTAMPTZ,
    UNIQUE(user_id, achievement_id)
);

-- 7. DAILY_MISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.daily_missions (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(64) NOT NULL,
    title_mn VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    target INTEGER NOT NULL,
    reward_xp INTEGER NOT NULL,
    reward_badge VARCHAR(64),
    icon_name VARCHAR(32) NOT NULL,
    active_date DATE DEFAULT CURRENT_DATE NOT NULL
);

-- 8. USER_DAILY_MISSIONS
CREATE TABLE IF NOT EXISTS public.user_daily_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    mission_id VARCHAR(64) REFERENCES public.daily_missions(id) ON DELETE CASCADE NOT NULL,
    current_progress INTEGER DEFAULT 0 NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    is_claimed BOOLEAN DEFAULT FALSE NOT NULL,
    claimed_at TIMESTAMPTZ,
    UNIQUE(user_id, mission_id)
);

-- 9. MATCH_HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.match_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    mode VARCHAR(16) NOT NULL,
    wpm NUMERIC(5, 2) NOT NULL,
    accuracy NUMERIC(5, 2) NOT NULL,
    chars_typed INTEGER NOT NULL,
    placement INTEGER,
    total_players INTEGER,
    xp_earned INTEGER NOT NULL,
    difficulty VARCHAR(16) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. LEADERBOARD VIEW
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
    p.id,
    p.username,
    p.avatar_url,
    p.title,
    p.level,
    p.best_wpm AS wpm,
    p.avg_accuracy AS accuracy,
    p.current_streak AS streak,
    p.races_won,
    p.cosmetic_glow,
    RANK() OVER (ORDER BY p.best_wpm DESC, p.avg_accuracy DESC) as rank
FROM public.profiles p
WHERE p.total_races > 0;

-- =========================================================================
-- INDEXES FOR HIGH-THROUGHPUT & EDGE CONCURRENCY
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_wpm ON public.profiles(best_wpm DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON public.profiles(level DESC);
CREATE INDEX IF NOT EXISTS idx_races_code ON public.races(code);
CREATE INDEX IF NOT EXISTS idx_race_players_race_id ON public.race_players(race_id);
CREATE INDEX IF NOT EXISTS idx_race_players_user_id ON public.race_players(user_id);
CREATE INDEX IF NOT EXISTS idx_match_history_user_date ON public.match_history(user_id, created_at DESC);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.race_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_history ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, owner update
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Races: Public read, authenticated create/update
CREATE POLICY "Races viewable by everyone" 
ON public.races FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create races" 
ON public.races FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Host can update race" 
ON public.races FOR UPDATE USING (auth.uid() = host_id);

-- Race Players: Anyone can read players in a race
CREATE POLICY "Race players viewable by everyone" 
ON public.race_players FOR SELECT USING (true);

CREATE POLICY "Users can insert themselves into a race" 
ON public.race_players FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own race progress" 
ON public.race_players FOR UPDATE USING (auth.uid() = user_id);

-- Match History: User can view own, insert own
CREATE POLICY "Users can view their own match history" 
ON public.match_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own match history" 
ON public.match_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- REALTIME REPLICATION SETUP
-- =========================================================================
BEGIN;
  -- Drop publication if exists or alter
  ALTER PUBLICATION supabase_realtime ADD TABLE public.races;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.race_players;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
COMMIT;

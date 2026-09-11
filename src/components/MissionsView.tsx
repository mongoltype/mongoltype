import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, Clock, Flame, Target, Trophy, Keyboard, Gift } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { sound } from '../lib/audio';
import confetti from 'canvas-confetti';

export const MissionsView: React.FC = () => {
  const { dailyMissions, claimMission, user } = useAppStore();

  const handleClaim = (missionId: string) => {
    claimMission(missionId);
    sound.playLevelUp();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#38bdf8', '#f59e0b'],
    });
  };

  const getMissionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className="text-amber-400" size={20} />;
      case 'Target':
        return <Target className="text-sky-400" size={20} />;
      case 'Flame':
        return <Flame className="text-rose-400" size={20} />;
      default:
        return <Keyboard className="text-emerald-400" size={20} />;
    }
  };

  const completedCount = dailyMissions.filter((m) => m.isCompleted).length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0d1222] via-[#090b14] to-[#120d20] border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
            <Clock size={14} />
            Өдөр Бүрийн 00:00 цагт шинэчлэгдэнэ
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Өдрийн Даалгаврууд (Daily Missions)
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Өдөр бүрийн зорилгоо биелүүлж нэмэлт туршлага (XP) болон өвөрмөц цол, гоёл цуглуулаарай.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#131728] border border-zinc-700/60 rounded-2xl px-4 py-3">
          <Gift size={24} className="text-amber-400" />
          <div>
            <div className="text-[11px] text-zinc-500 font-medium">Гүйцэтгэл</div>
            <div className="font-mono font-bold text-white text-base">
              {completedCount} / {dailyMissions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Mission Cards List */}
      <div className="flex flex-col gap-3.5">
        {dailyMissions.map((mission) => {
          const progressPercent = Math.min(100, Math.round((mission.current / mission.target) * 100));

          return (
            <div
              key={mission.id}
              className={`p-5 rounded-3xl border transition-all ${
                mission.isCompleted
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : 'bg-[#0c0d16]/90 border-zinc-800/80 hover:border-zinc-700'
              } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-[#141726] border border-zinc-800 shrink-0">
                  {getMissionIcon(mission.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{mission.titleMn}</h3>
                    {mission.isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 size={12} /> Биелсэн
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{mission.description}</p>

                  {/* Progress bar */}
                  <div className="mt-3 flex items-center gap-3 w-full sm:w-80">
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="font-mono text-xs text-zinc-400 whitespace-nowrap">
                      {mission.current} / {mission.target}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reward & Action */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
                  <Sparkles size={14} />
                  +{mission.rewardXp} XP
                </div>

                {mission.isCompleted ? (
                  mission.isClaimed ? (
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-500 text-xs font-semibold cursor-default"
                    >
                      Авсан
                    </button>
                  ) : (
                    <button
                      onClick={() => handleClaim(mission.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all active:scale-95 animate-pulse"
                    >
                      Шагнал авах
                    </button>
                  )
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 rounded-xl bg-zinc-800/60 border border-zinc-800 text-zinc-500 text-xs font-semibold cursor-not-allowed"
                  >
                    Дуусаагүй
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

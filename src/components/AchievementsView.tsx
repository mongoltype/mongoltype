import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Lock, Sparkles, Zap, ShieldCheck, Flame, BookOpen, Crown } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Achievement } from '../types';

export const AchievementsView: React.FC = () => {
  const { achievements } = useAppStore();
  const [selectedCat, setSelectedCat] = useState<'all' | 'speed' | 'accuracy' | 'races' | 'words' | 'special'>('all');

  const filtered = achievements.filter((a) => selectedCat === 'all' || a.category === selectedCat);
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'Crown':
        return <Crown size={24} className="text-amber-400" />;
      case 'Zap':
        return <Zap size={24} className="text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck size={24} className="text-sky-400" />;
      case 'Flame':
        return <Flame size={24} className="text-rose-400" />;
      case 'BookOpen':
        return <BookOpen size={24} className="text-purple-400" />;
      default:
        return <Award size={24} className="text-amber-400" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#120d20] via-[#090b14] to-[#0e1624] border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            Тусгай Шагналууд (Achievements)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Амжилтын Тэмдэгтүүд
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Монгол кирилл хурд бичгийн ур чадварын онцгой шатуудыг давж нэр хүндээ өсгөөрэй.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#131728] border border-zinc-700/60 rounded-2xl px-5 py-3">
          <Award size={24} className="text-amber-400" />
          <div>
            <div className="text-[11px] text-zinc-500 font-medium">Нээгдсэн</div>
            <div className="font-mono font-bold text-white text-base">
              {unlockedCount} / {achievements.length}
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'Бүгд' },
          { id: 'speed', label: 'Хурд' },
          { id: 'accuracy', label: 'Нарийвчлал' },
          { id: 'races', label: 'Уралдаан' },
          { id: 'words', label: 'Үгийн тоо' },
          { id: 'special', label: 'Онцгой' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCat === cat.id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                : 'bg-[#10121d] border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ach) => {
          const progressPercent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-3xl border relative overflow-hidden transition-all ${
                ach.isUnlocked
                  ? 'bg-[#0e111d]/90 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]'
                  : 'bg-[#0a0c14]/80 border-zinc-800/80 opacity-75'
              }`}
            >
              {ach.isUnlocked && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              )}

              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    ach.isUnlocked
                      ? 'bg-purple-500/15 border-purple-500/40 shadow-inner'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                  }`}
                >
                  {ach.isUnlocked ? renderIcon(ach.icon) : <Lock size={20} />}
                </div>

                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  +{ach.rewardXp} XP
                </span>
              </div>

              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {ach.titleMn}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed min-h-[36px]">
                {ach.description}
              </p>

              {/* Progress or Unlock Date */}
              <div className="mt-4 pt-3 border-t border-zinc-800/60">
                {ach.isUnlocked ? (
                  <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Нээгдсэн: {ach.unlockedAt || 'Саяхан'}
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-500 font-mono mb-1">
                      <span>Гүйцэтгэл</span>
                      <span>
                        {ach.progress} / {ach.maxProgress}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500/80 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

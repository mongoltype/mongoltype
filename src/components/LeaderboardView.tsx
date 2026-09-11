import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Flame, Target, Zap, Crown, Search, Layers } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { AgeCategory } from '../types';
import { AGE_CATEGORIES } from '../lib/mongolian-text';

interface LeaderboardViewProps {
  initialAgeFilter?: AgeCategory | 'all';
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ initialAgeFilter }) => {
  const { leaderboard, user, setShowAgeCategoryModal } = useAppStore();
  const [filterCategory, setFilterCategory] = useState<'wpm' | 'accuracy' | 'level' | 'streak'>('wpm');
  const [selectedAgeFilter, setSelectedAgeFilter] = useState<AgeCategory | 'all'>(initialAgeFilter || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter by age category first if selected
  const ageFilteredLeaderboard = selectedAgeFilter === 'all'
    ? leaderboard
    : leaderboard.filter((entry) => entry.ageCategory === selectedAgeFilter);

  // Sort leaderboard according to selected metric
  const sortedLeaderboard = [...ageFilteredLeaderboard].sort((a, b) => {
    if (filterCategory === 'wpm') return b.wpm - a.wpm;
    if (filterCategory === 'accuracy') return b.accuracy - a.accuracy;
    if (filterCategory === 'level') return b.level - a.level;
    return b.streak - a.streak;
  });

  const filteredEntries = sortedLeaderboard.filter((entry) =>
    entry.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = filteredEntries.slice(0, 3);

  const getAgeBadge = (cat?: AgeCategory) => {
    switch (cat) {
      case 'kids':
        return { label: '🎈 Бага анги', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'middle':
        return { label: '🚀 Дунд анги', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
      case 'high':
        return { label: '📜 Ахлах / Эссэ', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'adult':
        return { label: '💼 Насанд хүрэгчид', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      default:
        return { label: 'Нийтлэг', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Бодит Цагийн Чансаа • Насны Ангиллаар
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Шилдэг Монгол Бичээчид
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Бага, дунд, ахлах сургууль, насанд хүрэгчдийн ангилал тус бүрийн шилдэг өрсөлдөгчид.
          </p>
        </div>

        {/* Action to switch Age Category */}
        <button
          onClick={() => setShowAgeCategoryModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all shadow-sm"
        >
          <Layers size={15} />
          <span>+ Насны ангилал солих / харах</span>
        </button>
      </div>

      {/* Age Category Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setSelectedAgeFilter('all')}
          className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            selectedAgeFilter === 'all'
              ? 'bg-zinc-100 text-zinc-900 shadow-md'
              : 'bg-[#121422] text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <span>🏆 Бүх ангилал</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20">
            {leaderboard.length}
          </span>
        </button>

        {AGE_CATEGORIES.map((cat) => {
          const isSelected = selectedAgeFilter === cat.id;
          const count = leaderboard.filter((l) => l.ageCategory === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedAgeFilter(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-[#121422] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <span>{cat.badgeEmoji}</span>
              <span>{cat.nameMn}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                {cat.ageRange} ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Metric Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Нэрээр хайх..."
            className="w-full pl-9 pr-3 py-2 bg-[#0d0f1a]/90 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-all"
          />
        </div>

        {/* Metric Pills */}
        <div className="flex items-center gap-1 bg-[#121422] p-1 rounded-2xl border border-zinc-800 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setFilterCategory('wpm')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filterCategory === 'wpm'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap size={13} />
            Хурд (WPM)
          </button>
          <button
            onClick={() => setFilterCategory('accuracy')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filterCategory === 'accuracy'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Target size={13} />
            Нарийвчлал
          </button>
          <button
            onClick={() => setFilterCategory('level')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filterCategory === 'level'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Crown size={13} />
            Түвшин
          </button>
          <button
            onClick={() => setFilterCategory('streak')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filterCategory === 'streak'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Flame size={13} />
            Цуврал
          </button>
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      {topThree.length >= 3 && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* #2 Silver */}
          <div className="order-2 md:order-1 bg-gradient-to-b from-[#141829] to-[#0c0e18] border border-zinc-600/40 rounded-3xl p-5 flex flex-col items-center text-center relative overflow-hidden shadow-xl">
            <div className="w-8 h-8 rounded-full bg-zinc-600/30 border border-zinc-500 text-zinc-300 flex items-center justify-center font-bold text-xs mb-3">
              #2
            </div>
            <div className="relative">
              <img
                src={topThree[1].avatarUrl}
                alt={topThree[1].username}
                className="w-16 h-16 rounded-full object-cover border-2 border-zinc-500 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-zinc-700 rounded-full text-zinc-300">
                <Medal size={14} />
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-3">{topThree[1].username}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-zinc-400">{topThree[1].title}</span>
              {topThree[1].ageCategory && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getAgeBadge(topThree[1].ageCategory).color}`}>
                  {getAgeBadge(topThree[1].ageCategory).label}
                </span>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 w-full flex justify-around font-mono text-xs">
              <div>
                <div className="text-zinc-500 text-[10px]">WPM</div>
                <div className="font-bold text-emerald-400">{topThree[1].wpm}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px]">Нарийвчлал</div>
                <div className="font-bold text-sky-400">{topThree[1].accuracy}%</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px]">Түвшин</div>
                <div className="font-bold text-purple-400">Lv.{topThree[1].level}</div>
              </div>
            </div>
          </div>

          {/* #1 Gold */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-[#251f11] via-[#1a1610] to-[#0c0e18] border-2 border-amber-500/60 rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden shadow-2xl scale-105 z-10">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center font-extrabold text-sm mb-3">
              👑 #1
            </div>
            <div className="relative">
              <img
                src={topThree[0].avatarUrl}
                alt={topThree[0].username}
                className="w-20 h-20 rounded-full object-cover border-2 border-amber-400 ring-4 ring-amber-400/20 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 p-1.5 bg-amber-500 text-black rounded-full shadow">
                <Trophy size={14} />
              </span>
            </div>
            <h3 className="text-lg font-black text-amber-200 mt-3">{topThree[0].username}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold">
                {topThree[0].title}
              </span>
              {topThree[0].ageCategory && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getAgeBadge(topThree[0].ageCategory).color}`}>
                  {getAgeBadge(topThree[0].ageCategory).label}
                </span>
              )}
            </div>
            <div className="mt-5 pt-3 border-t border-amber-500/20 w-full flex justify-around font-mono text-sm">
              <div>
                <div className="text-zinc-500 text-[10px]">WPM</div>
                <div className="font-black text-emerald-400 text-base">{topThree[0].wpm}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px]">Нарийвчлал</div>
                <div className="font-black text-sky-400 text-base">{topThree[0].accuracy}%</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px]">Түвшин</div>
                <div className="font-black text-purple-400 text-base">Lv.{topThree[0].level}</div>
              </div>
            </div>
          </div>

          {/* #3 Bronze */}
          <div className="order-3 bg-gradient-to-b from-[#191512] to-[#0c0e18] border border-amber-700/40 rounded-3xl p-5 flex flex-col items-center text-center relative overflow-hidden shadow-xl">
            <div className="w-8 h-8 rounded-full bg-amber-700/30 border border-amber-700 text-amber-400 flex items-center justify-center font-bold text-xs mb-3">
              #3
            </div>
            <div className="relative">
              <img
                src={topThree[2].avatarUrl}
                alt={topThree[2].username}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-700 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-amber-800 rounded-full text-amber-200">
                <Medal size={14} />
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-3">{topThree[2].username}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-zinc-400">{topThree[2].title}</span>
              {topThree[2].ageCategory && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getAgeBadge(topThree[2].ageCategory).color}`}>
                  {getAgeBadge(topThree[2].ageCategory).label}
                </span>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 w-full flex justify-around font-mono text-xs">
              <div>
                <div className="text-zinc-500 text-[10px]">WPM</div>
                <div className="font-bold text-emerald-400">{topThree[2].wpm}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px]">Нарийвчлал</div>
                <div className="font-bold text-sky-400">{topThree[2].accuracy}%</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px]">Түвшин</div>
                <div className="font-bold text-purple-400">Lv.{topThree[2].level}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL LEADERBOARD TABLE */}
      <div className="bg-[#0c0d16]/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#121422] text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4 w-16">Байр</th>
                <th className="py-3.5 px-4">Тамирчин</th>
                <th className="py-3.5 px-4">Ангилал</th>
                <th className="py-3.5 px-4">Цол</th>
                <th className="py-3.5 px-4 font-mono text-right">Хурд (WPM)</th>
                <th className="py-3.5 px-4 font-mono text-right">Нарийвчлал</th>
                <th className="py-3.5 px-4 font-mono text-right">Цуврал</th>
                <th className="py-3.5 px-4 font-mono text-right">Ялалт</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {filteredEntries.map((entry, index) => {
                const isMe = entry.username === user.username;
                const ageBadge = getAgeBadge(entry.ageCategory);

                return (
                  <tr
                    key={entry.id}
                    className={`hover:bg-zinc-800/40 transition-colors ${
                      isMe ? 'bg-emerald-500/10 border-l-2 border-emerald-400' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-400">
                      {index === 0 ? (
                        <span className="text-amber-400">🥇 1</span>
                      ) : index === 1 ? (
                        <span className="text-zinc-300">🥈 2</span>
                      ) : index === 2 ? (
                        <span className="text-amber-600">🥉 3</span>
                      ) : (
                        `#${index + 1}`
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.avatarUrl}
                          alt={entry.username}
                          className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                        />
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            {entry.username}
                            {isMe && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                                Та
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500 font-mono">
                            Level {entry.level}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${ageBadge.color}`}>
                        {ageBadge.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-zinc-300 px-2 py-0.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60">
                        {entry.title}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-right text-base">
                      {entry.wpm}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-sky-400 text-right">
                      {entry.accuracy}%
                    </td>
                    <td className="py-3.5 px-4 font-mono text-amber-400 text-right">
                      {entry.streak} 🔥
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300 text-right">
                      {entry.racesWon}
                    </td>
                  </tr>
                );
              })}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500 text-sm">
                    Энэ ангилалд тамирчин олдсонгүй. Та эхний бичээч нь болоорой!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

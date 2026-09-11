import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Trophy, Sparkles, ArrowRight, BookOpen, Compass, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { AGE_CATEGORIES } from '../lib/mongolian-text';
import { AgeCategory } from '../types';

interface AgeCategoryModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigateToLeaderboard?: (category: AgeCategory) => void;
  onNavigateToTyping?: () => void;
}

export const AgeCategoryModal: React.FC<AgeCategoryModalProps> = ({
  isOpen,
  onClose,
  onNavigateToLeaderboard,
  onNavigateToTyping,
}) => {
  const {
    activeAgeCategory,
    setActiveAgeCategory,
    leaderboard,
    showAgeCategoryModal,
    setShowAgeCategoryModal,
  } = useAppStore();

  const isModalOpen = isOpen !== undefined ? isOpen : showAgeCategoryModal;
  const handleClose = onClose || (() => setShowAgeCategoryModal(false));

  if (!isModalOpen) return null;

  const handleSelect = (category: AgeCategory) => {
    setActiveAgeCategory(category);
  };

  const handleStartTyping = (category: AgeCategory) => {
    setActiveAgeCategory(category);
    handleClose();
    if (onNavigateToTyping) {
      onNavigateToTyping();
    }
  };

  const handleViewLeaderboard = (category: AgeCategory) => {
    setActiveAgeCategory(category);
    handleClose();
    if (onNavigateToLeaderboard) {
      onNavigateToLeaderboard(category);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0c0e18] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 custom-scrollbar"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Насны Ангиллын Төв • Түвшин ба Чансаа
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <span>Насны ангиллаа сонгоно уу</span>
                <span className="text-xs font-normal py-1 px-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-sans">
                  4 Төрөл
                </span>
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 max-w-2xl">
                Бага ангид зориулсан <b>зөөлөн уур амьсгалтай</b> хөнгөн бичлэгээс эхлээд ахлах ангийн <b>уран зохиолын эссэ</b> хүртэл нас бүрд тохирсон өгүүлбэрээр дасгалжиж, өөрийн насны чансаанд өрсөлдөнө.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Хаах"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-6">
            {AGE_CATEGORIES.map((cat) => {
              const isSelected = activeAgeCategory === cat.id;
              // Get top 1 leader in this category
              const topRacer = leaderboard.find((l) => l.ageCategory === cat.id);

              return (
                <div
                  key={cat.id}
                  onClick={() => handleSelect(cat.id)}
                  className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all relative border flex flex-col justify-between ${
                    isSelected
                      ? `bg-[#131628] ${cat.theme.border} ${cat.theme.glow} ring-2 ring-emerald-500/50`
                      : 'bg-[#0e101d] border-zinc-800/80 hover:border-zinc-700 hover:bg-[#111322]'
                  }`}
                >
                  {/* Active Indicator Tag */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400 text-black text-xs font-bold font-mono shadow-[0_0_12px_rgba(74,222,128,0.5)]">
                      <Check size={13} strokeWidth={3} />
                      Идэвхтэй
                    </div>
                  )}

                  <div>
                    {/* Badge & Age */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{cat.badgeEmoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-white">{cat.nameMn}</h3>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${cat.theme.badgeBg} ${cat.theme.badgeText}`}>
                            {cat.ageRange}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs">{cat.subtitle}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">
                      {cat.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-1.5 mb-4">
                      {cat.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Leader Preview */}
                    {topRacer && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-zinc-800/80 text-xs mb-4">
                        <div className="flex items-center gap-2">
                          <Trophy size={13} className="text-amber-400" />
                          <span className="text-zinc-400">Ангиллын #1:</span>
                          <span className="font-bold text-white">{topRacer.username}</span>
                        </div>
                        <div className="font-mono text-emerald-400 font-bold">
                          {topRacer.wpm} WPM
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/60 mt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartTyping(cat.id);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-400 text-black font-bold text-xs hover:bg-emerald-300 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Энэ ангиллаар бичих</span>
                      <ArrowRight size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewLeaderboard(cat.id);
                      }}
                      className="py-2 px-3 rounded-xl bg-zinc-800 text-zinc-200 font-semibold text-xs hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-1.5"
                      title="Ангиллын чансаа үзэх"
                    >
                      <Trophy size={13} className="text-amber-400" />
                      <span>Чансаа</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-800/80 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-emerald-400" />
              <span>Таны бичсэн үр дүн сонгосон насны ангиллын дагуу чансааны самбарт бүртгэгдэнэ.</span>
            </div>
            <button
              onClick={handleClose}
              className="text-zinc-400 hover:text-zinc-200 transition-colors underline text-xs cursor-pointer"
            >
              Цонхыг хаах
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Award, ArrowRight, X } from 'lucide-react';
import { useAppStore } from '../lib/store';

export const LevelUpModal: React.FC = () => {
  const { levelUpData, dismissLevelUpModal } = useAppStore();

  useEffect(() => {
    if (levelUpData?.show) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#10b981', '#38bdf8', '#a855f7', '#f59e0b'],
      });
    }
  }, [levelUpData?.show]);

  if (!levelUpData?.show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          className="relative max-w-md w-full bg-gradient-to-b from-[#14172a] via-[#0d0f1b] to-[#0a0c16] border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden"
        >
          {/* Background Ambient Lights */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={dismissLevelUpModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-white"
          >
            <X size={16} />
          </button>

          {/* Animated Trophy Icon */}
          <div className="relative inline-flex mb-4">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
              <Trophy size={40} />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="absolute -inset-2 border border-dashed border-amber-400/40 rounded-3xl pointer-events-none"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            Түвшин Ахилаа!
          </div>

          <h2 className="text-3xl font-black text-white">
            Level {levelUpData.newLevel}
          </h2>

          <div className="mt-3 p-4 rounded-2xl bg-[#1a1e36] border border-amber-500/30">
            <div className="text-xs text-zinc-400 font-medium">Шинэ Цол Хүртлээ:</div>
            <div className="text-xl font-extrabold text-amber-300 mt-1 font-mono">
              « {levelUpData.newTitle} »
            </div>
          </div>

          <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
            Таны монгол кирилл хурд бичгийн ур чадвар шинэ түвшинд хүрч шинэ гоёл, онцгой цол нээгдлээ.
          </p>

          <button
            onClick={dismissLevelUpModal}
            className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            Үргэлжлүүлэх
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

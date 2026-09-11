import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Zap,
  Target,
  Flame,
  Clock,
  Volume2,
  VolumeX,
  Keyboard,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { sound } from '../lib/audio';
import { normalizeMongolian } from '../lib/mongolian-text';
import { KeyboardVisualizer } from './KeyboardVisualizer';
import { Difficulty, TypingMode } from '../types';
import { AGE_CATEGORIES } from '../lib/mongolian-text';

export const TypingEngine: React.FC = () => {
  const {
    promptText,
    difficulty,
    typingMode,
    targetWordCount,
    activeAgeCategory,
    setActiveAgeCategory,
    setShowAgeCategoryModal,
    setDifficulty,
    setTypingMode,
    setTargetWordCount,
    resetPrompt,
    finishSession,
    soundEnabled,
    toggleSound,
    isTypingActive,
    startSession,
    metrics,
    setMetrics,
    updateMyRaceProgress,
    isInMultiplayer,
  } = useAppStore();

  const [inputVal, setInputVal] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [showVisualKeyboard, setShowVisualKeyboard] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  // Focus input automatically
  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, [promptText]);

  // Reset local state when prompt changes
  useEffect(() => {
    setInputVal('');
    setHasError(false);
    setStartTime(null);
    setElapsed(0);
    setCombo(0);
    setMaxCombo(0);
    setIsFinished(false);
  }, [promptText]);

  // Timer loop when active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (startTime && !isFinished) {
      interval = setInterval(() => {
        const secs = (Date.now() - startTime) / 1000;
        setElapsed(secs);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, isFinished]);

  // Normalized strings for reliable Unicode Cyrillic handling
  const normalizedPrompt = normalizeMongolian(promptText);
  const normalizedInput = normalizeMongolian(inputVal);

  const currentIndex = normalizedInput.length;
  const currentChar = normalizedPrompt[currentIndex] || '';

  // Handle typing change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = normalizeMongolian(e.target.value);

    // If session not started, start now
    if (!startTime && nextVal.length > 0) {
      setStartTime(Date.now());
      startSession();
    }

    // Check if current input matches prompt up to that index
    const isMatching = normalizedPrompt.startsWith(nextVal);

    if (nextVal.length > normalizedInput.length) {
      // User typed a character
      const lastTypedChar = nextVal[nextVal.length - 1];
      const expectedChar = normalizedPrompt[nextVal.length - 1];

      if (lastTypedChar === expectedChar) {
        // Correct character
        sound.playKeyStroke(true);
        setHasError(false);

        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > maxCombo) setMaxCombo(newCombo);

        if (newCombo % 10 === 0) {
          sound.playStreakChime(Math.floor(newCombo / 10));
        }
      } else {
        // Wrong character
        sound.playKeyStroke(false);
        setHasError(true);
        setCombo(0);
      }
    } else {
      // User deleted / backspaced
      setHasError(false);
    }

    setInputVal(nextVal);

    // Compute live metrics
    const correctCount = nextVal
      .split('')
      .filter((ch, i) => ch === normalizedPrompt[i]).length;
    const incorrectCount = nextVal.length - correctCount;
    const timeInMins = Math.max((Date.now() - (startTime || Date.now())) / 60000, 0.01);
    const liveWpm = Math.round((correctCount / 5) / timeInMins) || 0;
    const liveRawWpm = Math.round((nextVal.length / 5) / timeInMins) || 0;
    const liveCpm = Math.round(correctCount / timeInMins) || 0;
    const liveAcc = nextVal.length > 0 ? Math.round((correctCount / nextVal.length) * 100) : 100;

    setMetrics({
      wpm: liveWpm,
      rawWpm: liveRawWpm,
      cpm: liveCpm,
      accuracy: liveAcc,
      correctChars: correctCount,
      incorrectChars: incorrectCount,
      combo,
      maxCombo,
    });

    // If multiplayer, sync progress
    if (isInMultiplayer) {
      const progressPercent = Math.min(100, Math.round((correctCount / normalizedPrompt.length) * 100));
      updateMyRaceProgress(progressPercent, liveWpm, liveAcc);
    }

    // Check completion: handles exact match, space at end, trimmed match, or reaching prompt length
    const isExactMatch = nextVal === normalizedPrompt;
    const isTrimmedMatch = nextVal.trim() === normalizedPrompt.trim() && nextVal.trim().length > 0;
    const isPrefixDone = nextVal.length >= normalizedPrompt.length && nextVal.startsWith(normalizedPrompt);
    const isLengthReached = nextVal.length >= normalizedPrompt.length;
    const isDone = (isExactMatch || isTrimmedMatch || isPrefixDone || isLengthReached) && !isFinished;

    if (isDone) {
      const now = Date.now();
      const finalSecs = Math.max(0.2, (now - (startTime || now)) / 1000);
      setElapsed(finalSecs);
      setIsFinished(true);
      sound.playVictory();
      finishSession({
        wpm: liveWpm,
        rawWpm: liveRawWpm,
        cpm: liveCpm,
        accuracy: liveAcc,
        correctChars: correctCount,
        incorrectChars: incorrectCount,
        extraChars: 0,
        missedChars: 0,
        elapsedSeconds: finalSecs,
        combo,
        maxCombo,
      });
      return;
    }
  };

  // Keyboard shortcut for quick restart (Tab + Enter or Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      resetPrompt();
    }
  };

  const currentWpm = metrics.wpm || (elapsed > 0.5 ? Math.round((normalizedInput.length / 5) / (elapsed / 60)) : 0);
  const currentAcc = metrics.accuracy || 100;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5" onClick={focusInput}>
      {/* Age Category Selector Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-[#0b0d18] border border-zinc-800/90 rounded-2xl p-2 sm:p-2.5 backdrop-blur-md">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
          <span className="text-[11px] font-bold text-zinc-400 pl-2 pr-1 hidden md:inline">
            Насны ангилал:
          </span>
          {AGE_CATEGORIES.map((cat) => {
            const isSelected = activeAgeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveAgeCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-400 text-black shadow-md shadow-emerald-500/20 ring-1 ring-emerald-300'
                    : 'bg-[#131626] text-zinc-400 hover:text-white hover:bg-[#191c30] border border-zinc-800/80'
                }`}
              >
                <span>{cat.badgeEmoji}</span>
                <span>{cat.nameMn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-black/20 text-black font-semibold' : 'bg-black/40 text-zinc-500'}`}>
                  {cat.ageRange}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAgeCategoryModal(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-700/60 transition-colors ml-auto"
          title="Насны ангиллын дэлгэрэнгүй цонх нээх"
        >
          <span className="text-emerald-400 font-bold">+</span>
          <span>Ангиллын тайлбар & чансаа</span>
        </button>
      </div>

      {/* Top Configuration & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d0f1a]/80 border border-zinc-800/80 rounded-2xl p-2.5 sm:p-3 backdrop-blur-md">
        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 bg-[#151824] rounded-xl p-1 border border-zinc-800/80">
          <span className="text-[11px] text-zinc-500 font-medium px-2 hidden sm:inline">Түвшин:</span>
          {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((diff) => {
            const labels: Record<Difficulty, string> = {
              easy: 'Хөнгөн',
              medium: 'Дунд',
              hard: 'Хүнд',
              expert: 'Мастер',
            };
            const isSelected = difficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {labels[diff]}
              </button>
            );
          })}
        </div>

        {/* Word Length Selector */}
        <div className="flex items-center gap-1 bg-[#151824] rounded-xl p-1 border border-zinc-800/80">
          <span className="text-[11px] text-zinc-500 font-medium px-2 hidden sm:inline">Үгийн тоо:</span>
          {[15, 25, 50, 100].map((count) => (
            <button
              key={count}
              onClick={() => setTargetWordCount(count)}
              className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-lg transition-all ${
                targetWordCount === count
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {count}
            </button>
          ))}
        </div>

        {/* Controls: Sound & Keyboard Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Дууг хаах' : 'Дууг нээх'}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={() => setShowVisualKeyboard(!showVisualKeyboard)}
            title="Гарны байрлалыг харах"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border transition-all ${
              showVisualKeyboard
                ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Keyboard size={15} />
            <span className="hidden sm:inline">Гарны зураг</span>
          </button>

          <button
            onClick={resetPrompt}
            title="Шинэ бичвэр авах (Esc)"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-xl border border-zinc-700/60 transition-all active:scale-95"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Шинэчлэх</span>
          </button>
        </div>
      </div>

      {/* Live Performance HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0c0d15]/80 border border-zinc-800/80 rounded-2xl p-3 flex items-center justify-between backdrop-blur-md">
          <div>
            <div className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
              <Zap size={13} className="text-emerald-400" />
              ХУРД (WPM)
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 mt-0.5">
              {currentWpm}
            </div>
          </div>
          <div className="text-right text-[11px] text-zinc-500 font-mono">
            {metrics.cpm} CPM
          </div>
        </div>

        <div className="bg-[#0c0d15]/80 border border-zinc-800/80 rounded-2xl p-3 flex items-center justify-between backdrop-blur-md">
          <div>
            <div className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
              <Target size={13} className="text-sky-400" />
              НАРИЙВЧЛАЛ
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-sky-400 mt-0.5">
              {currentAcc}%
            </div>
          </div>
          <div className="text-right text-[11px] text-zinc-500 font-mono">
            {metrics.incorrectChars > 0 ? (
              <span className="text-rose-400">-{metrics.incorrectChars}</span>
            ) : (
              '100%'
            )}
          </div>
        </div>

        <div className="bg-[#0c0d15]/80 border border-zinc-800/80 rounded-2xl p-3 flex items-center justify-between backdrop-blur-md">
          <div>
            <div className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
              <Flame size={13} className="text-amber-400" />
              ЦУВРАЛ (COMBO)
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-400 mt-0.5 flex items-center gap-1">
              {combo}
              {combo >= 20 && (
                <span className="text-xs px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded text-amber-300 font-sans uppercase">
                  3x Fire!
                </span>
              )}
            </div>
          </div>
          <div className="text-right text-[11px] text-zinc-500 font-mono">
            Дээд: {maxCombo}
          </div>
        </div>

        <div className="bg-[#0c0d15]/80 border border-zinc-800/80 rounded-2xl p-3 flex items-center justify-between backdrop-blur-md">
          <div>
            <div className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
              <Clock size={13} className="text-purple-400" />
              ХУГАЦАА
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-purple-400 mt-0.5">
              {elapsed.toFixed(1)}s
            </div>
          </div>
          <div className="text-right text-[11px] text-zinc-500 font-mono">
            {normalizedInput.length} / {normalizedPrompt.length}
          </div>
        </div>
      </div>

      {/* Main Interactive Typing Canvas */}
      <div
        ref={containerRef}
        className={`relative w-full min-h-[220px] bg-[#0c0d16]/95 border ${
          hasError
            ? 'border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.25)]'
            : 'border-zinc-800/90 shadow-[0_0_30px_rgba(0,0,0,0.5)]'
        } rounded-3xl p-6 sm:p-8 cursor-text backdrop-blur-xl transition-all duration-150 select-none`}
      >
        {/* Hidden input element capturing keyboard keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="opacity-0 absolute inset-0 w-full h-full cursor-default z-0 pointer-events-none"
        />

        {/* Typing Characters Display with Unicode-safe rendering */}
        <div className="text-xl sm:text-2xl md:text-3xl font-mono leading-relaxed tracking-wider break-words">
          {normalizedPrompt.split('').map((char, index) => {
            const isTyped = index < normalizedInput.length;
            const isCurrent = index === normalizedInput.length;
            const isCorrect = isTyped && normalizedInput[index] === char;
            const isIncorrect = isTyped && normalizedInput[index] !== char;

            let charClass = 'text-zinc-600 transition-colors';
            if (isCorrect) {
              charClass = 'text-zinc-100 font-medium';
            } else if (isIncorrect) {
              charClass = 'text-rose-400 bg-rose-500/20 underline decoration-rose-500 rounded';
            } else if (isCurrent) {
              charClass = 'text-emerald-400 font-bold';
            }

            return (
              <span key={index} className="relative inline-block">
                {/* Active Caret with subtle glow */}
                {isCurrent && (
                  <motion.span
                    ref={caretRef}
                    layoutId="caret"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="absolute -left-0.5 top-1 bottom-1 w-[2.5px] bg-emerald-400 rounded shadow-[0_0_10px_#10b981]"
                  />
                )}
                <span className={charClass}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              </span>
            );
          })}
        </div>

        {/* Subtle bottom indicator */}
        <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Монгол кирилл хэл дээр бичнэ үү (ө, ү, ё үсгүүд дэмжигдсэн)</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px]">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Esc</kbd>
            <span>шинэчлэх</span>
          </div>
        </div>
      </div>

      {/* On-screen Keyboard Visualizer */}
      <AnimatePresence>
        {showVisualKeyboard && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
          >
            <KeyboardVisualizer activeChar={currentChar} isError={hasError} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Modal when session finishes */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <div className="bg-[#0e101a] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(16,185,129,0.2)] text-center relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Award size={32} />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Амжилттай Бичиж Дууслаа!
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Монгол кирилл бичгийн сорил амжилттай боллоо.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 my-6">
                <div className="bg-[#141726] border border-zinc-800 rounded-2xl p-3.5">
                  <div className="text-xs text-zinc-500 font-medium">Хурд (WPM)</div>
                  <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                    {metrics.wpm}
                  </div>
                </div>

                <div className="bg-[#141726] border border-zinc-800 rounded-2xl p-3.5">
                  <div className="text-xs text-zinc-500 font-medium">Нарийвчлал</div>
                  <div className="text-3xl font-extrabold text-sky-400 font-mono mt-1">
                    {metrics.accuracy}%
                  </div>
                </div>

                <div className="bg-[#141726] border border-zinc-800 rounded-2xl p-3.5">
                  <div className="text-xs text-zinc-500 font-medium">Зарцуулсан хугацаа</div>
                  <div className="text-2xl font-bold text-purple-400 font-mono mt-1">
                    {elapsed.toFixed(1)} сек
                  </div>
                </div>

                <div className="bg-[#141726] border border-zinc-800 rounded-2xl p-3.5">
                  <div className="text-xs text-zinc-500 font-medium">Авсан Туршлага (XP)</div>
                  <div className="text-2xl font-bold text-amber-400 font-mono mt-1 flex items-center justify-center gap-1">
                    <Sparkles size={18} />
                    +{Math.round(metrics.wpm * 1.5 + (metrics.accuracy / 100) * 50)} XP
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setIsFinished(false);
                    resetPrompt();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all active:scale-98"
                >
                  <RotateCcw size={16} />
                  Дахин Эхлэх (Esc)
                </button>
                <button
                  onClick={() => {
                    setIsFinished(false);
                    setTypingMode('race');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#1a1d2e] hover:bg-[#23273e] text-zinc-200 border border-zinc-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowRight size={16} />
                  Шууд Уралдах
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

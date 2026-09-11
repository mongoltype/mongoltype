import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Flag,
  Users,
  Trophy,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Clock,
  Award,
  Crown,
  Share2,
  Copy,
  Check,
  Flame,
  Gamepad2,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Difficulty, RacerProgress } from '../types';
import { sound } from '../lib/audio';
import { normalizeMongolian } from '../lib/mongolian-text';

export const MultiplayerRace: React.FC = () => {
  const {
    user,
    activeRoom,
    isInMultiplayer,
    isHost,
    createMultiplayerRoom,
    joinMultiplayerRoom,
    leaveMultiplayerRoom,
    startRoomCountdown,
    updateMyRaceProgress,
    finishSession,
  } = useAppStore();

  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [copiedCode, setCopiedCode] = useState(false);
  const [typedInput, setTypedInput] = useState('');
  const [hasError, setHasError] = useState(false);
  const [raceStartTime, setRaceStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [myFinishTime, setMyFinishTime] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset inputs when activeRoom changes or status transitions
  useEffect(() => {
    if (activeRoom?.status === 'waiting' || activeRoom?.status === 'countdown') {
      setTypedInput('');
      setMyFinishTime(null);
      setElapsed(0);
      setRaceStartTime(null);
    }
  }, [activeRoom?.status, activeRoom?.id]);

  // Trigger confetti when race finishes and user is #1
  useEffect(() => {
    if (activeRoom && activeRoom.status === 'finished') {
      const sorted = [...activeRoom.players].sort((a, b) => (b.progress || 0) - (a.progress || 0));
      if (sorted[0]?.userId === user.id) {
        sound.playVictory();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#00f59b', '#38bdf8', '#a855f7'],
        });
      }
    }
  }, [activeRoom?.status]);

  // Race timer: stops immediately for this user once myFinishTime is set
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeRoom && activeRoom.status === 'racing' && myFinishTime === null) {
      if (!raceStartTime) setRaceStartTime(Date.now());
      interval = setInterval(() => {
        setElapsed((Date.now() - (raceStartTime || Date.now())) / 1000);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeRoom?.status, raceStartTime, myFinishTime]);

  // Auto focus typing input when race begins
  useEffect(() => {
    if (activeRoom && activeRoom.status === 'racing') {
      inputRef.current?.focus();
    }
  }, [activeRoom?.status]);

  // Copy room code to clipboard
  const handleCopyCode = () => {
    if (!activeRoom) return;
    navigator.clipboard.writeText(activeRoom.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCreateRoom = () => {
    createMultiplayerRoom(selectedDifficulty);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    joinMultiplayerRoom(joinCodeInput.trim());
    setJoinCodeInput('');
  };

  const handleRaceTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeRoom || activeRoom.status !== 'racing') return;

    const val = normalizeMongolian(e.target.value);
    const targetText = normalizeMongolian(activeRoom.text);

    const isMatch = targetText.startsWith(val);
    if (val.length > typedInput.length) {
      const lastChar = val[val.length - 1];
      const expectedChar = targetText[val.length - 1];
      if (lastChar === expectedChar) {
        sound.playKeyStroke(true);
        setHasError(false);
      } else {
        sound.playKeyStroke(false);
        setHasError(true);
      }
    }

    setTypedInput(val);

    const correctChars = val.split('').filter((ch, i) => ch === targetText[i]).length;
    const timeInMins = Math.max(elapsed / 60, 0.01);
    const currentWpm = Math.round((correctChars / 5) / timeInMins) || 0;
    const currentAcc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
    const progress = Math.min(100, Math.round((correctChars / targetText.length) * 100));

    updateMyRaceProgress(progress, currentWpm, currentAcc);

    const isCompleted = progress >= 100 || val.trim() === targetText.trim() || (val.length >= targetText.length && val.startsWith(targetText));

    if (isCompleted && myFinishTime === null) {
      const finishSecs = (Date.now() - (raceStartTime || Date.now())) / 1000;
      setMyFinishTime(finishSecs);
      setElapsed(finishSecs);
      updateMyRaceProgress(100, currentWpm, currentAcc);

      finishSession({
        wpm: currentWpm,
        rawWpm: currentWpm,
        cpm: currentWpm * 5,
        accuracy: currentAcc,
        correctChars,
        incorrectChars: Math.max(0, val.length - correctChars),
        extraChars: 0,
        missedChars: 0,
        elapsedSeconds: finishSecs,
        combo: 20,
        maxCombo: 25,
      });
    }
  };

  // If not currently in a room, show the Multiplayer Room Hub (Create / Join / Quick Match)
  if (!activeRoom || !isInMultiplayer) {
    return (
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0e111f] via-[#090b14] to-[#0d0f1a] border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Шууд Өрсөлдөөн (Live Multiplayer)
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Монгол Кирилл Уралдааны Талбар
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 leading-relaxed">
              Найзуудтайгаа болон онлайн өрсөлдөгчидтэй шууд холбогдож, хэн хамгийн хурдан,
              алдаагүй монгол кириллээр бичихийг realtime сорьж ялагч болоорой.
            </p>
          </div>
        </div>

        {/* Action Grid: Quick Match, Create Room, Join Room */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Quick Race Card */}
          <div className="bg-[#0c0d16]/90 border border-emerald-500/30 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/60 transition-all shadow-[0_0_30px_rgba(16,185,129,0.1)] group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Шуурхай Уралдаан</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Шууд өрөөнд нэгдэн шилдэг өрсөлдөгчидтэй хурдаа сорих. Хүлээх шаардлагагүй.
              </p>
            </div>
            <button
              onClick={() => createMultiplayerRoom('medium')}
              className="mt-6 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-98"
            >
              <Play size={16} />
              Шууд Уралдах
            </button>
          </div>

          {/* Create Custom Room Card */}
          <div className="bg-[#0c0d16]/90 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Өрөө Үүсгэх</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Түвшингөө тохируулан өрөөний 6 оронтой код авч найзуудаа урин уралдаарай.
              </p>

              {/* Difficulty selector */}
              <div className="grid grid-cols-4 gap-1.5 mt-4">
                {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`py-1.5 text-[11px] font-semibold rounded-lg capitalize border transition-all ${
                      selectedDifficulty === d
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {d === 'easy' ? 'Хөнгөн' : d === 'medium' ? 'Дунд' : d === 'hard' ? 'Хүнд' : 'Мастер'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreateRoom}
              className="mt-6 w-full py-3 rounded-xl bg-[#1a1d2e] hover:bg-[#252940] text-sky-400 border border-sky-500/30 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Crown size={16} />
              Өрөө Үүсгэх
            </button>
          </div>

          {/* Join Room by Code Card */}
          <div className="bg-[#0c0d16]/90 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                <Gamepad2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Кодоор Нэгдэх</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Найзынхаа өгсөн 6 оронтой өрөөний кодыг оруулж шууд холбогдоорой.
              </p>

              <form onSubmit={handleJoinRoom} className="mt-4">
                <input
                  type="text"
                  maxLength={8}
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="Өрөөний код (Жишээ: 8K2M9P)"
                  className="w-full px-4 py-2.5 bg-[#141724] border border-zinc-700 rounded-xl text-white font-mono text-sm uppercase placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </form>
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={!joinCodeInput.trim()}
              className="mt-6 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all active:scale-98"
            >
              <Users size={16} />
              Нэгдэх
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE ROOM RACING VIEW
  const normalizedTarget = normalizeMongolian(activeRoom.text);
  const myPlayer = activeRoom.players.find((p) => p.userId === user.id);
  const isFinished = myPlayer?.isFinished || false;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Room Header Banner */}
      <div className="bg-[#0c0d16]/90 border border-zinc-800 rounded-3xl p-4 sm:p-6 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Flag size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{activeRoom.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {activeRoom.difficulty}
              </span>
            </div>
            <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
              <span>Өрөөний код:</span>
              <button
                onClick={handleCopyCode}
                className="font-mono text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                {activeRoom.code}
                {copiedCode ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>

        {/* Room Controls */}
        <div className="flex items-center gap-2">
          {activeRoom.status === 'waiting' && isHost && (
            <button
              onClick={startRoomCountdown}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95"
            >
              <Play size={16} />
              Уралдааныг Эхлүүлэх
            </button>
          )}

          {activeRoom.status === 'waiting' && !isHost && (
            <div className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium flex items-center gap-2">
              <Clock size={14} className="animate-spin text-sky-400" />
              Эзнийг хүлээж байна...
            </div>
          )}

          <button
            onClick={leaveMultiplayerRoom}
            className="px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-semibold transition-all"
          >
            Өрөөнөөс Гарах
          </button>
        </div>
      </div>

      {/* Countdown Overlay if status is countdown */}
      <AnimatePresence>
        {activeRoom.status === 'countdown' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="w-full bg-[#0a0c16]/90 border border-emerald-500/40 rounded-3xl p-8 text-center flex flex-col items-center justify-center backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.2)]"
          >
            <div className="text-zinc-400 text-sm font-semibold uppercase tracking-widest mb-2">
              Бэлдээрэй...
            </div>
            <motion.div
              key={activeRoom.countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-7xl sm:text-8xl font-black font-mono text-emerald-400 drop-shadow-[0_0_30px_#10b981]"
            >
              {activeRoom.countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REALTIME RACE TRACKS */}
      <div className="bg-[#0b0d17]/95 border border-zinc-800/90 rounded-3xl p-5 sm:p-7 flex flex-col gap-4 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-zinc-200">Шууд Замын Хяналт</span>
          </div>
          <div className="font-mono text-zinc-400">
            {activeRoom.status === 'racing' ? `${elapsed.toFixed(1)}s` : activeRoom.status.toUpperCase()}
          </div>
        </div>

        {/* Tracks per player */}
        <div className="flex flex-col gap-4">
          {activeRoom.players.map((player, index) => {
            const isMe = player.userId === user.id;
            return (
              <div
                key={player.id}
                className={`relative p-3.5 rounded-2xl border transition-all ${
                  isMe
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-[#121422]/60 border-zinc-800/80'
                }`}
              >
                {/* Racer info row */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={player.avatarUrl}
                      alt={player.username}
                      className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                    />
                    <span className={`font-semibold ${isMe ? 'text-emerald-400' : 'text-zinc-200'}`}>
                      {player.username} {isMe && '(Та)'}
                    </span>
                    {player.isBot && (
                      <span className="px-1.5 py-0.2 text-[9px] rounded bg-zinc-800 text-zinc-400">
                        BOT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-emerald-400 font-bold">{player.wpm} WPM</span>
                    <span className="text-sky-400">{player.accuracy}%</span>
                    <span className="text-zinc-400 font-bold w-12 text-right">
                      {Math.round(player.progress)}%
                    </span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="relative w-full h-7 bg-[#07080f] rounded-xl border border-zinc-800/90 overflow-hidden flex items-center px-1">
                  {/* Progress fill bar */}
                  <motion.div
                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-emerald-500/20 via-emerald-500/40 to-emerald-500/60 rounded-xl"
                    style={{ width: `${player.progress}%` }}
                    transition={{ type: 'spring', damping: 20 }}
                  />

                  {/* Racer Vehicle Indicator */}
                  <motion.div
                    className="absolute flex items-center gap-1 z-10 select-none text-lg"
                    style={{ left: `calc(${Math.min(96, player.progress)}%)` }}
                    transition={{ type: 'spring', damping: 25 }}
                  >
                    <span className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                      {player.carIcon}
                    </span>
                  </motion.div>

                  {/* Finish Line */}
                  <div className="absolute right-2 top-1 bottom-1 w-2 border-r-2 border-dashed border-zinc-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TYPING INPUT FOR THE RACE */}
      {activeRoom.status === 'racing' && !isFinished && (
        <div className="bg-[#0b0d17]/95 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 backdrop-blur-xl">
          <input
            ref={inputRef}
            type="text"
            value={typedInput}
            onChange={handleRaceTyping}
            autoFocus
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            className="opacity-0 absolute inset-0 pointer-events-none"
          />

          <div
            onClick={() => inputRef.current?.focus()}
            className="text-xl sm:text-2xl font-mono leading-relaxed tracking-wider break-words cursor-text min-h-[140px]"
          >
            {normalizedTarget.split('').map((char, index) => {
              const isTyped = index < typedInput.length;
              const isCurrent = index === typedInput.length;
              const isCorrect = isTyped && typedInput[index] === char;
              const isIncorrect = isTyped && typedInput[index] !== char;

              let charClass = 'text-zinc-600';
              if (isCorrect) charClass = 'text-zinc-100 font-medium';
              if (isIncorrect) charClass = 'text-rose-400 bg-rose-500/20 rounded';
              if (isCurrent) charClass = 'text-emerald-400 font-bold';

              return (
                <span key={index} className="relative inline-block">
                  {isCurrent && (
                    <motion.span
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="absolute -left-0.5 top-1 bottom-1 w-[2.5px] bg-emerald-400 rounded shadow-[0_0_10px_#10b981]"
                    />
                  )}
                  <span className={charClass}>{char === ' ' ? '\u00A0' : char}</span>
                </span>
              );
            })}
          </div>

          <div className="text-xs text-zinc-500 pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span>Энд товшиж бичиж эхлээрэй. Алдаагүй бичих нь хурд нэмнэ.</span>
            <span className="font-mono text-emerald-400">
              {typedInput.length} / {normalizedTarget.length} үсэг
            </span>
          </div>
        </div>
      )}

      {/* RACE FINISHED PODIUM */}
      {activeRoom.status === 'finished' && (
        <div className="bg-[#0b0d17]/95 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center shadow-[0_0_50px_rgba(16,185,129,0.15)]">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Trophy size={32} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Уралдаан Дууслаа!
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Бүх тамирчид барианд орж амжилтаа үзүүллээ.
          </p>

          {/* Ranking Board */}
          <div className="w-full max-w-lg flex flex-col gap-2 my-6">
            {[...activeRoom.players]
              .sort((a, b) => b.wpm - a.wpm)
              .map((p, rank) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                    rank === 0
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : rank === 1
                      ? 'bg-zinc-700/20 border-zinc-600 text-zinc-200'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-lg w-6">#{rank + 1}</span>
                    <img
                      src={p.avatarUrl}
                      alt={p.username}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="font-semibold text-sm">{p.username}</span>
                  </div>
                  <div className="font-mono font-bold text-sm">
                    {p.wpm} WPM <span className="text-xs font-normal text-zinc-500">({p.accuracy}%)</span>
                  </div>
                </div>
              ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                createMultiplayerRoom(activeRoom.difficulty);
              }}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
            >
              <RotateCcw size={16} />
              Дахин Уралдах
            </button>
            <button
              onClick={leaveMultiplayerRoom}
              className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-sm"
            >
              Буцах
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Keyboard,
  Monitor,
  ShieldCheck,
  Play,
  ArrowRight,
  Copy,
  Send,
  Check,
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
  Smartphone,
  CheckCircle2,
  HelpCircle,
  Flame,
  Layers,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { AGE_CATEGORIES } from '../lib/mongolian-text';
import { AgeCategory } from '../types';

interface MongolTypeHomeProps {
  onStartTyping: () => void;
  onStartRace: () => void;
  onViewLeaderboard?: (ageCategory?: AgeCategory) => void;
  activeSection?: string;
}

// Full Cyrillic keyboard layout matching standard Mongolian physical layout
const MONGOLIAN_KEYBOARD_ROWS = [
  ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['ф', 'ц', 'у', 'ж', 'э', 'н', 'г', 'ш', 'ү', 'з', 'к', 'ъ'],
  ['й', 'ы', 'б', 'ө', 'а', 'х', 'р', 'о', 'л', 'д', 'п', 'я'],
  ['⇧', 'ч', 'с', 'м', 'и', 'т', 'ь', 'в', 'ю', 'э', '↵'],
];

export const MongolTypeHome: React.FC<MongolTypeHomeProps> = ({
  onStartTyping,
  onStartRace,
  onViewLeaderboard,
  activeSection,
}) => {
  const { user, onlineUsersCount, activeAgeCategory, setActiveAgeCategory, setShowAgeCategoryModal, leaderboard } = useAppStore();

  useEffect(() => {
    if (activeSection) {
      const el = document.getElementById(activeSection);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeSection]);

  // Interactive Live Demo in the bottom card
  const demoTargetText = 'Монголоор бичих хялбархан боллоо.';
  const [demoInput, setDemoInput] = useState('');
  const [demoStartTime, setDemoStartTime] = useState<number | null>(null);
  const [demoWpm, setDemoWpm] = useState<number>(0);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Keyboard mock animation: simulate typing "Монголоор бичих амархан..."
  const mockSampleText = 'Монголоор бичих амархан...';
  const [mockTypedText, setMockTypedText] = useState('');
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    const interval = setInterval(() => {
      if (!isDeleting) {
        if (index < mockSampleText.length) {
          const char = mockSampleText[index];
          setMockTypedText(mockSampleText.slice(0, index + 1));
          setActiveKey(char.toLowerCase());
          index++;
        } else {
          setActiveKey(null);
          setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      } else {
        if (index > 0) {
          index--;
          setMockTypedText(mockSampleText.slice(0, index));
          setActiveKey(null);
        } else {
          isDeleting = false;
        }
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  // Handle Demo Input
  const handleDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!demoStartTime && val.length > 0) {
      setDemoStartTime(Date.now());
    }

    setDemoInput(val);

    if (demoStartTime && val.length > 0) {
      const elapsedMinutes = (Date.now() - demoStartTime) / 60000;
      if (elapsedMinutes > 0) {
        const words = val.length / 5;
        setDemoWpm(Math.round(words / elapsedMinutes));
      }
    }

    if (val.trim() === demoTargetText.trim() || val.length >= demoTargetText.length) {
      setDemoCompleted(true);
    }
  };

  const handleResetDemo = () => {
    setDemoInput('');
    setDemoStartTime(null);
    setDemoWpm(0);
    setDemoCompleted(false);
  };

  const handleCopyMockText = () => {
    navigator.clipboard.writeText(mockTypedText || mockSampleText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* ===================== HERO SECTION ===================== */}
      <section className="w-full py-8 sm:py-16 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Column: Typography & CTAs */}
        <div className="flex-1 text-left max-w-2xl">
          {/* Main Display Headline: Mongol (white) + Type (neon green) */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-none">
            Mongol<span className="text-emerald-400">Type</span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-300 text-base sm:text-lg md:text-xl font-normal max-w-xl mb-8 sm:mb-10 leading-relaxed">
            Монгол кирилл үсгээрээ хурдан, хялбар бичих боломжтой онлайн хэрэгсэл.
          </p>

          {/* CTA Buttons (Exact match to image.png) */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onStartTyping}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#4ade80] hover:bg-[#34d399] text-black font-extrabold text-sm sm:text-base shadow-[0_0_25px_rgba(74,222,128,0.4)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Одоо эхлэх</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>

            <button
              onClick={onStartRace}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white font-semibold text-sm sm:text-base border border-zinc-700/80 transition-all hover:border-zinc-500 cursor-pointer"
            >
              <Play size={16} className="fill-white" />
              <span>Үзэх</span>
            </button>
          </div>
        </div>

        {/* Right Column: Sleek 3D Angled Tablet & Keyboard Mockup */}
        <div className="flex-1 w-full max-w-lg lg:max-w-xl">
          <div className="relative group">
            {/* Ambient neon backdrop glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none" />

            {/* Angled Mockup Chassis */}
            <div className="relative bg-[#0d0f17] border border-zinc-800/90 rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              {/* Tablet Screen Top Area */}
              <div className="bg-[#121522] border border-zinc-800 rounded-2xl p-4 sm:p-5 mb-5 shadow-inner">
                {/* Header with MN badge and actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="px-2.5 py-1 rounded-md bg-[#1a1e30] border border-zinc-700/60 text-zinc-300 font-mono text-xs font-bold">
                    MN
                  </div>

                  <div className="flex items-center gap-2 text-zinc-400">
                    <button
                      onClick={handleCopyMockText}
                      title="Текст хуулах"
                      className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      {copiedSuccess ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                    <button
                      onClick={onStartTyping}
                      title="Шууд эхлүүлэх"
                      className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-emerald-400 transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>

                {/* Simulated Display Typing Area */}
                <div className="min-h-[56px] flex items-center">
                  <span className="text-white text-lg sm:text-xl font-medium tracking-wide font-sans">
                    {mockTypedText}
                  </span>
                  <span className="w-0.5 h-6 bg-emerald-400 ml-1 animate-pulse" />
                </div>
              </div>

              {/* Physical Keyboard Deck */}
              <div className="bg-[#090b12] border border-zinc-800/80 rounded-2xl p-3 sm:p-4">
                <div className="flex flex-col gap-1.5">
                  {MONGOLIAN_KEYBOARD_ROWS.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex justify-center gap-1 sm:gap-1.5">
                      {row.map((key, keyIdx) => {
                        const isHit = activeKey === key.toLowerCase();
                        const isSpecial = key === '⇧' || key === '↵';
                        return (
                          <div
                            key={keyIdx}
                            className={`h-8 sm:h-9 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 select-none ${
                              isSpecial
                                ? 'px-2.5 sm:px-3 bg-zinc-800 text-zinc-400'
                                : 'w-7 sm:w-8 bg-[#151827] text-zinc-300 border border-zinc-800'
                            } ${
                              isHit
                                ? 'bg-emerald-500 text-black font-bold shadow-[0_0_12px_rgba(74,222,128,0.8)] scale-95 border-emerald-400'
                                : ''
                            }`}
                          >
                            {key}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Spacebar Row */}
                  <div className="flex justify-center gap-1.5 mt-0.5">
                    <div className="h-8 sm:h-9 px-3 bg-zinc-800 text-[10px] text-zinc-400 flex items-center justify-center rounded-lg">
                      ctrl
                    </div>
                    <div className="h-8 sm:h-9 px-3 bg-zinc-800 text-[10px] text-zinc-400 flex items-center justify-center rounded-lg">
                      alt
                    </div>
                    <div
                      className={`h-8 sm:h-9 flex-1 max-w-[240px] rounded-lg border border-zinc-800 flex items-center justify-center text-xs text-zinc-500 font-mono transition-all ${
                        activeKey === ' '
                          ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(74,222,128,0.8)]'
                          : 'bg-[#151827]'
                      }`}
                    >
                      Зай
                    </div>
                    <div className="h-8 sm:h-9 px-3 bg-zinc-800 text-[10px] text-zinc-400 flex items-center justify-center rounded-lg">
                      alt
                    </div>
                    <div className="h-8 sm:h-9 px-3 bg-zinc-800 text-[10px] text-zinc-400 flex items-center justify-center rounded-lg">
                      ctrl
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 4 FEATURE PILLARS ===================== */}
      <section className="w-full py-10 sm:py-12 border-y border-zinc-800/80 bg-[#07090f]/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {/* Pillar 1: Хурдан бичих */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(74,222,128,0.15)]">
              <Zap size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">Хурдан бичих</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Түргэн бөгөөд алдаагүй бичихэд тусална.
              </p>
            </div>
          </div>

          {/* Pillar 2: Хялбар ашиглах */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(74,222,128,0.15)]">
              <Keyboard size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">Хялбар ашиглах</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Түгээмэл хэрэглэгддэг үсэг, тэмдгүүд бэлэн.
              </p>
            </div>
          </div>

          {/* Pillar 3: Бүх төхөөрөмжид */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(74,222,128,0.15)]">
              <Monitor size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">Бүх төхөөрөмжид</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Компьютер, утас, таблет дээр ашиглах боломжтой.
              </p>
            </div>
          </div>

          {/* Pillar 4: 100% монгол */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(74,222,128,0.15)]">
              <ShieldCheck size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">100% монгол</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Монгол хэл, кирилл үсэгт тулгуурласан.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== НАСНЫ АНГИЛАЛ БА ШУУД ӨРСӨЛДӨӨН SECTION ===================== */}
      <section id="age-categories" className="w-full py-16 sm:py-20 border-b border-zinc-800/80 scroll-mt-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Насны ангилал ба Шууд Чансаа
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Нас насны онцлогт тохирсон бичих орчин
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
              Бага ангийн сурагчдад зориулсан <b>зөөлөн уур амьсгалтай</b> хялбар үгсээс эхлээд ахлах ангийнхны <b>уран зохиолын эссэ</b> хүртэл нас тус бүрдээ өрсөлдөх боломж.
            </p>
          </div>

          <button
            onClick={() => setShowAgeCategoryModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <Layers size={16} />
            <span>+ Насны ангиллын цонх нээх</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AGE_CATEGORIES.map((cat) => {
            const isSelected = activeAgeCategory === cat.id;
            const topUser = leaderboard.find((l) => l.ageCategory === cat.id);

            return (
              <div
                key={cat.id}
                className={`rounded-3xl p-6 border transition-all flex flex-col justify-between relative bg-gradient-to-b ${
                  isSelected
                    ? 'from-[#141829] to-[#0c0e18] border-emerald-400/60 shadow-[0_0_25px_rgba(74,222,128,0.15)] ring-1 ring-emerald-400/50'
                    : 'from-[#0e101d] to-[#080911] border-zinc-800/90 hover:border-zinc-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-black font-mono shadow-sm">
                    Сонгогдсон
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-3xl">{cat.badgeEmoji}</span>
                    <div>
                      <h3 className="text-lg font-black text-white">{cat.nameMn}</h3>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${cat.theme.badgeBg} ${cat.theme.badgeText}`}>
                        {cat.ageRange}
                      </span>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-black/40 border border-zinc-800/80 mb-4">
                    <div className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider mb-1">
                      Жишээ бичвэр
                    </div>
                    <p className="text-zinc-300 text-xs italic line-clamp-2">
                      "{cat.samplePreview}"
                    </p>
                  </div>

                  {topUser && (
                    <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 mb-4 font-mono">
                      <span>Ангиллын #1: <b className="text-white font-sans">{topUser.username}</b></span>
                      <span className="text-emerald-400 font-bold">{topUser.wpm} WPM</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-zinc-800/60">
                  <button
                    onClick={() => {
                      setActiveAgeCategory(cat.id);
                      onStartTyping();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>Энэ ангиллаар бичих</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={() => {
                      setActiveAgeCategory(cat.id);
                      if (onViewLeaderboard) {
                        onViewLeaderboard(cat.id);
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trophy size={13} className="text-amber-400" />
                    <span>Ангиллын чансаа үзэх</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================== "ТАНИЙ БИЧИХ ТУРШЛАГЫГ САЙЖРУУЛНА" SECTION ===================== */}
      <section className="w-full py-16 sm:py-24">
        <div className="bg-[#0b0d16] border border-zinc-800/80 rounded-3xl p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 shadow-2xl relative overflow-hidden">
          {/* Subtle green ambient light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Side: Interactive Live Demo Typing Card */}
          <div className="flex-1 w-full">
            <div className="bg-[#121422] border border-zinc-800 rounded-2xl p-6 shadow-inner flex flex-col gap-4">
              {/* Card top badge & actions */}
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 rounded-md bg-[#1a1e30] border border-zinc-700/60 text-zinc-300 font-mono text-xs font-bold">
                  MN
                </div>
                {demoWpm > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    <Zap size={13} />
                    <span>{demoWpm} WPM</span>
                  </div>
                )}
              </div>

              {/* Sample Target Phrase */}
              <div className="p-4 rounded-xl bg-[#090b14] border border-zinc-800/70">
                <p className="text-base sm:text-lg text-white font-medium">
                  {demoTargetText}
                </p>
              </div>

              {/* Interactive Input */}
              <div className="relative">
                <input
                  type="text"
                  value={demoInput}
                  onChange={handleDemoChange}
                  placeholder="Дээрх өгүүлбэрийг энд бичиж туршина уу..."
                  className="w-full px-4 py-3 rounded-xl bg-[#171a2b] border border-zinc-700 text-white text-sm sm:text-base placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 font-medium"
                />
                {demoInput && (
                  <button
                    onClick={handleResetDemo}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
                  >
                    <RotateCcw size={15} />
                  </button>
                )}
              </div>

              {/* Card Footer Status */}
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Бэлэн — Монгол кирилл</span>
                </div>
                {demoCompleted && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} /> Амжилттай бичлээ!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Headline & Copy */}
          <div className="flex-1 text-left">
            <p className="text-zinc-400 text-sm font-medium mb-2">
              Илүү сайн бичихийн тулд
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              Таны бичих туршлагыг{' '}
              <span className="text-emerald-400">сайжруулна</span>
            </h2>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-8">
              MongolType нь зөвхөн нэг хэрэгсэл биш — таны монгол хэлтэй харилцах шинэ арга юм.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onStartTyping}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(74,222,128,0.3)] transition-all hover:scale-105"
              >
                <span>Бичих дасгал эхлүүлэх</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onStartRace}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold border border-zinc-700 transition-all"
              >
                <Users size={16} className="text-emerald-400" />
                <span>Олон тоглогчтой уралдах</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ОНЦЛОГ (FEATURES) SECTION ===================== */}
      <section id="features" className="w-full py-16 border-t border-zinc-800/80 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2 font-mono">
            Онцлог боломжууд
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Монгол хэлний шилдэг дадлагажуулагч
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            Хамгийн сүүлийн үеийн уралдааны систем, өндөр нарийвчлалтай алгоритм болон интерактив сорилтууд.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0e101b] border border-zinc-800/80 hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Zap size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Бодит цагийн хурд (WPM & CPM)</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Үг/минут болон тэмдэгт/минутыг үсэг бүр дээр нарийн тооцож, 100% бодит статистик үүсгэнэ.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0e101b] border border-zinc-800/80 hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Users size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Олон тоглогчийн уралдаан</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Найзуудтайгаа хувийн өрөө үүсгэх эсвэл олон нийтийн шууд уралдаанд оролцож чансаагаа ахиулна.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0e101b] border border-zinc-800/80 hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Trophy size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Үндэсний чансааны самбар</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Шилдэг Монгол бичээчдийн эгнээнд багтаж, цол хэргэм, гэрэлтсэн хүрээ, тусгай аватар нээнэ.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== ХЭРХЭН АШИГЛАХ (HOW TO USE) SECTION ===================== */}
      <section id="how-to" className="w-full py-16 border-t border-zinc-800/80 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2 font-mono">
            Зааварчилгаа
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Хэрхэн зөв, хурдан бичиж сурах вэ?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            Зөвхөн 3 алхамаар таны 10 хурууны бичих ур чадвар мэдэгдэхүйц нэмэгдэнэ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-[#0b0d17] border border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-emerald-400 text-black font-black text-lg flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(74,222,128,0.4)]">
              1
            </div>
            <h3 className="text-base font-bold text-white mb-2">Суурь байрлал эзэмших</h3>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Зүүн гарын 4 хурууг <b>Ф, Ы, Б, Ө</b>, баруун гарын 4 хурууг <b>Р, О, Л, Д</b> товчлуур дээр тогтвортой байрлуулна.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-[#0b0d17] border border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-emerald-400 text-black font-black text-lg flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(74,222,128,0.4)]">
              2
            </div>
            <h3 className="text-base font-bold text-white mb-2">Өдөр бүр 10 минут дасгал хийх</h3>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Таймер 15 сек, 30 сек горимуудыг сонгон алдаа гаргахгүйгээр цэвэр хэмнэлтэй бичихэд анхаарна.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-[#0b0d17] border border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-emerald-400 text-black font-black text-lg flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(74,222,128,0.4)]">
              3
            </div>
            <h3 className="text-base font-bold text-white mb-2">Уралдаанд өрсөлдөх</h3>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Бусад тоглогчидтой шууд өрсөлдөн дарамтад хурдан бичих рефлексээ төгөлдөржүүлнэ.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== ТУСЛАМЖ (HELP / FAQ) SECTION ===================== */}
      <section id="help" className="w-full py-16 border-t border-zinc-800/80 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2 font-mono">
            Тусламж & FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Түгээмэл асуултууд
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <div className="p-5 rounded-2xl bg-[#0e101b] border border-zinc-800">
            <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
              <HelpCircle size={16} className="text-emerald-400" />
              WPM болон CPM гэж юу вэ?
            </h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              <b>WPM (Words Per Minute)</b> нь минутад бичсэн үгийн тоо (дунджаар 5 тэмдэгтийг 1 үг гэж үздэг). <b>CPM (Characters Per Minute)</b> нь нийт цохисон үсэг, тэмдэгтийн тоо юм.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0e101b] border border-zinc-800">
            <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
              <HelpCircle size={16} className="text-emerald-400" />
              Яаж өөрийн үр дүнг хадгалах вэ?
            </h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Баруун дээд буланд байрлах <b>"Нэвтрэх"</b> товчийг дарж Facebook, утасны дугаар эсвэл и-мэйлээрээ нэвтэрснээр таны бүх рекорд автоматаар чансаанд бүртгэгдэнэ.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0e101b] border border-zinc-800">
            <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
              <HelpCircle size={16} className="text-emerald-400" />
              Гар утас эсвэл таблет дээр ашиглаж болох уу?
            </h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Тийм. MongolType нь компьютер, утас, таблет зэрэг бүх төрлийн дэлгэц болон гарын товчлуурт 100% зохицсон.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

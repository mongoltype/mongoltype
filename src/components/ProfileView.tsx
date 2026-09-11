import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Zap,
  Target,
  Trophy,
  Flame,
  Award,
  Calendar,
  Sparkles,
  Palette,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Camera,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Edit2,
  Save,
  Link as LinkIcon,
  LogIn,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { UserProfile } from '../types';

const PRESET_AVATARS = [
  {
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    label: 'Сайхан бүсгүй',
  },
  {
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    label: 'Залуу бичээч',
  },
  {
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    label: 'Кибер инээмсэглэл',
  },
  {
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
    label: 'Хурдан сум',
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    label: 'Талын бүргэд',
  },
  {
    url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=250&q=80',
    label: 'Мастер залуу',
  },
  {
    url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=250&q=80',
    label: '3D Хөвгүүн',
  },
  {
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    label: 'Байгалийн охин',
  },
  {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=250&q=80',
    label: 'Кибер Неон',
  },
  {
    url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=250&q=80',
    label: 'Монгол эр зориг',
  },
  {
    url: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=250&q=80',
    label: 'Алтан гэрэл',
  },
  {
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    label: 'Ухаалаг нүд',
  },
];

export const ProfileView: React.FC = () => {
  const { user, setUser, setCosmeticGlow, matchHistory, setShowAuthModal } = useAppStore();

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarTab, setAvatarTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [previewAvatar, setPreviewAvatar] = useState(user.avatarUrl);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState(user.displayName);
  const [usernameInput, setUsernameInput] = useState(user.username);
  const [saveToast, setSaveToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const glowOptions: Array<{ id: UserProfile['cosmeticGlow']; label: string; ringColor: string; shadow: string }> = [
    { id: 'emerald', label: 'Ногоон Хаш (Emerald)', ringColor: 'ring-emerald-400', shadow: 'shadow-[0_0_25px_rgba(16,185,129,0.5)]' },
    { id: 'blue', label: 'Цахилгаан Хөх (Cyber Blue)', ringColor: 'ring-sky-400', shadow: 'shadow-[0_0_25px_rgba(56,189,248,0.5)]' },
    { id: 'purple', label: 'Ягаан Туяа (Royal Purple)', ringColor: 'ring-purple-400', shadow: 'shadow-[0_0_25px_rgba(168,85,247,0.5)]' },
    { id: 'gold', label: 'Алтан Тал (Steppe Gold)', ringColor: 'ring-amber-400', shadow: 'shadow-[0_0_25px_rgba(245,158,11,0.5)]' },
    { id: 'crimson', label: 'Галт Улаан (Crimson Blaze)', ringColor: 'ring-rose-500', shadow: 'shadow-[0_0_25px_rgba(244,63,94,0.5)]' },
  ];

  const currentGlow = glowOptions.find((g) => g.id === user.cosmeticGlow) || glowOptions[0];
  const xpPercent = Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100));

  // Chart data derived from match history
  const speedHistory = [...matchHistory].reverse();

  // Handle local file upload (converts to base64 Data URL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Зөвхөн зурган файл (PNG, JPG, WEBP) оруулна уу.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Зургийн хэмжээ 5MB-аас бага байх ёстой.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPreviewAvatar(event.target.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Зураг уншихад алдаа гарлаа. Дахин оролдоно уу.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = () => {
    if (previewAvatar) {
      setUser({ avatarUrl: previewAvatar });
      setShowAvatarModal(false);
      triggerToast();
    }
  };

  const handleSaveProfileInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayNameInput.trim()) {
      setUser({
        displayName: displayNameInput.trim(),
        username: usernameInput.trim() || user.username,
      });
      setIsEditingName(false);
      triggerToast();
    }
  };

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            <Check size={16} />
            <span>Профайл амжилттай шинэчлэгдлээ!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Identity Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0d101d] via-[#090b14] to-[#120d20] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar with Camera Overlay & Change Button */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group cursor-pointer" onClick={() => { setPreviewAvatar(user.avatarUrl); setShowAvatarModal(true); }}>
              <img
                src={user.avatarUrl}
                alt={user.username}
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ${currentGlow.ringColor} ${currentGlow.shadow} transition-all duration-300 group-hover:brightness-75`}
              />

              {/* Hover overlay with camera icon */}
              <div className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity gap-1">
                <Camera size={24} className="text-emerald-400" />
                <span className="text-[11px] font-bold">Зураг солих</span>
              </div>

              <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-xl bg-[#090b14] border border-zinc-700 text-white font-mono font-black text-xs shadow-lg">
                Lv.{user.level}
              </div>
            </div>

            <button
              onClick={() => { setPreviewAvatar(user.avatarUrl); setShowAvatarModal(true); }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700/60 transition-all"
            >
              <Camera size={13} className="text-emerald-400" />
              <span>Зураг солих</span>
            </button>
          </div>

          {/* User Details with Inline Edit Mode */}
          <div className="flex-1 text-center sm:text-left w-full">
            {isEditingName ? (
              <form onSubmit={handleSaveProfileInfo} className="flex flex-col gap-2 max-w-sm">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">Харагдах нэр:</label>
                  <input
                    type="text"
                    required
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#141724] border border-zinc-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">Хэрэглэгчийн нэр (@username):</label>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#141724] border border-zinc-700 text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="submit"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
                  >
                    <Save size={13} />
                    <span>Хадгалах</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingName(false);
                      setDisplayNameInput(user.displayName);
                      setUsernameInput(user.username);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-xs"
                  >
                    Болих
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{user.displayName}</h1>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold uppercase tracking-wide">
                    {user.title}
                  </span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    title="Нэр өөрчлөх"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-1">
                  <p className="text-xs sm:text-sm text-zinc-400 font-mono">@{user.username}</p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-all"
                  >
                    <LogIn size={12} />
                    <span>Нэвтрэх / Бүртгэл солих</span>
                  </button>
                </div>
              </div>
            )}

            {/* Level XP Progress Bar */}
            <div className="mt-5 max-w-md">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-zinc-400 font-medium">Дараагийн түвшин хүртэл</span>
                <span className="text-emerald-400 font-bold">
                  {user.xp} / {user.xpToNextLevel} XP ({xpPercent}%)
                </span>
              </div>
              <div className="w-full h-3 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 via-sky-400 to-purple-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  style={{ width: `${xpPercent}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          </div>

          {/* Cosmetic Glow Customizer */}
          <div className="bg-[#121424]/80 border border-zinc-800 rounded-2xl p-3.5 flex flex-col gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
              <Palette size={14} className="text-purple-400" />
              <span>Хүрээний гэрэл (Glow)</span>
            </div>
            <div className="flex items-center gap-2">
              {glowOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setCosmeticGlow(opt.id)}
                  title={opt.label}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    user.cosmeticGlow === opt.id ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                  } ${
                    opt.id === 'emerald'
                      ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]'
                      : opt.id === 'blue'
                      ? 'bg-sky-400 shadow-[0_0_10px_#38bdf8]'
                      : opt.id === 'purple'
                      ? 'bg-purple-400 shadow-[0_0_10px_#a855f7]'
                      : opt.id === 'gold'
                      ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]'
                      : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AVATAR SELECTOR MODAL */}
      <AnimatePresence>
        {showAvatarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full bg-[#0d0f1a] border border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col gap-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Camera size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Профайл Зураг Солих</h3>
                </div>
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="p-1.5 rounded-xl bg-zinc-800/80 text-zinc-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Avatar Live Preview */}
              <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-[#121422] border border-zinc-800/80">
                <div className="relative">
                  <img
                    src={previewAvatar}
                    alt="Preview"
                    className={`w-20 h-20 rounded-2xl object-cover ring-4 ${currentGlow.ringColor} ${currentGlow.shadow}`}
                  />
                  <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-emerald-500 text-black text-[10px] font-bold">
                    Харагдах байдал
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">{user.displayName}</div>
                  <div className="text-xs text-zinc-400 font-mono">@{user.username}</div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-medium">Хүрээ: {currentGlow.label}</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-[#141726] p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setAvatarTab('upload')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    avatarTab === 'upload'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Upload size={14} />
                  <span>Зураг оруулах</span>
                </button>
                <button
                  onClick={() => setAvatarTab('presets')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    avatarTab === 'presets'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <ImageIcon size={14} />
                  <span>Бэлэн Аватарууд</span>
                </button>
                <button
                  onClick={() => setAvatarTab('url')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    avatarTab === 'url'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <LinkIcon size={14} />
                  <span>Зургийн Линк</span>
                </button>
              </div>

              {/* Tab 1: File Upload */}
              {avatarTab === 'upload' && (
                <div className="flex flex-col gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-700 hover:border-emerald-500/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#111320]/60 hover:bg-[#15192c]"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                      <Upload size={22} />
                    </div>
                    <p className="text-xs font-bold text-white">Компьютер / Утаснаас зураг сонгох</p>
                    <p className="text-[11px] text-zinc-500 mt-1">PNG, JPG, WEBP формат (Дээд хэмжээ 5MB)</p>
                  </div>
                  {uploadError && (
                    <div className="text-xs text-rose-400 font-medium text-center">{uploadError}</div>
                  )}
                </div>
              )}

              {/* Tab 2: Preset Avatars */}
              {avatarTab === 'presets' && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {PRESET_AVATARS.map((preset, idx) => {
                    const isSelected = previewAvatar === preset.url;
                    return (
                      <button
                        key={idx}
                        onClick={() => setPreviewAvatar(preset.url)}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all group ${
                          isSelected
                            ? 'border-emerald-400 ring-2 ring-emerald-500/40 scale-105'
                            : 'border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                            <Check size={16} className="bg-black/70 rounded-full p-0.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tab 3: Image URL Input */}
              {avatarTab === 'url' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-400">Зургийн URL холбоос:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#141724] border border-zinc-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrlInput.trim()) {
                          setPreviewAvatar(customUrlInput.trim());
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
                    >
                      Шалгах
                    </button>
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    Интернэт дэх ямар ч зургийн шууд холбоосыг хуулж оруулан хэрэглэх боломжтой.
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors"
                >
                  Болих
                </button>
                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-1.5"
                >
                  <Check size={15} />
                  <span>Зураг Хадгалах</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#0c0d16]/90 border border-zinc-800 rounded-2xl p-4 flex flex-col">
          <span className="text-[11px] text-zinc-500 font-medium">Дээд WPM</span>
          <span className="text-2xl font-mono font-black text-emerald-400 mt-1">{user.bestWpm}</span>
        </div>
        <div className="bg-[#0c0d16]/90 border border-zinc-800 rounded-2xl p-4 flex flex-col">
          <span className="text-[11px] text-zinc-500 font-medium">Дундаж WPM</span>
          <span className="text-2xl font-mono font-black text-sky-400 mt-1">{user.avgWpm}</span>
        </div>
        <div className="bg-[#0c0d16]/90 border border-zinc-800 rounded-2xl p-4 flex flex-col">
          <span className="text-[11px] text-zinc-500 font-medium">Нарийвчлал</span>
          <span className="text-2xl font-mono font-black text-purple-400 mt-1">{user.avgAccuracy}%</span>
        </div>
        <div className="bg-[#0c0d16]/90 border border-zinc-800 rounded-2xl p-4 flex flex-col">
          <span className="text-[11px] text-zinc-500 font-medium">Нийт Уралдаан</span>
          <span className="text-2xl font-mono font-black text-white mt-1">{user.totalRaces}</span>
        </div>
        <div className="bg-[#0c0d16]/90 border border-zinc-800 rounded-2xl p-4 flex flex-col">
          <span className="text-[11px] text-zinc-500 font-medium">Ялалт</span>
          <span className="text-2xl font-mono font-black text-amber-400 mt-1">{user.racesWon}</span>
        </div>
        <div className="bg-[#0c0d16]/90 border border-zinc-800 rounded-2xl p-4 flex flex-col">
          <span className="text-[11px] text-zinc-500 font-medium">Шивсэн Үгс</span>
          <span className="text-2xl font-mono font-black text-rose-400 mt-1">{user.wordsTyped}</span>
        </div>
      </div>

      {/* TYPING SPEED HISTORY ANALYTICS */}
      <div className="bg-[#0c0d16]/90 border border-zinc-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-emerald-400" />
            <h3 className="text-base font-bold text-white">Хурдны График (WPM History)</h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">Сүүлийн бичлэгүүд</span>
        </div>

        {/* Visual Speed Bars */}
        <div className="h-44 w-full flex items-end gap-2 sm:gap-4 pt-6 px-2 border-b border-zinc-800">
          {speedHistory.map((item, idx) => {
            const heightPercent = Math.min(100, Math.max(15, (item.wpm / 120) * 100));
            return (
              <div key={item.id} className="flex-1 flex flex-col items-center gap-1.5 group">
                <span className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.wpm} wpm
                </span>
                <div
                  className="w-full bg-gradient-to-t from-emerald-500/30 to-emerald-400 rounded-t-lg transition-all group-hover:to-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[10px] font-mono text-zinc-500 mt-1">#{idx + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT MATCHES LOG */}
      <div className="bg-[#0c0d16]/90 border border-zinc-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-sky-400" />
            <h3 className="text-base font-bold text-white">Сүүлийн Тоглолтууд</h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">{matchHistory.length} тоглолт бүртгэгдсэн</span>
        </div>

        <div className="flex flex-col gap-2">
          {matchHistory.map((match) => (
            <div
              key={match.id}
              className="p-3.5 rounded-2xl bg-[#121422] border border-zinc-800/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-zinc-500">{match.date}</span>
                <span className="px-2 py-0.5 rounded uppercase font-bold text-[10px] bg-zinc-800 text-zinc-300">
                  {match.mode}
                </span>
                <span className="text-zinc-400 capitalize hidden sm:inline">
                  {match.difficulty === 'easy' ? 'Хөнгөн' : match.difficulty === 'medium' ? 'Дунд' : 'Хүнд'}
                </span>
              </div>

              <div className="flex items-center gap-4 font-mono">
                <span className="text-emerald-400 font-bold">{match.wpm} WPM</span>
                <span className="text-sky-400">{match.accuracy}% нарийвчлал</span>
                {match.placement && (
                  <span className="text-amber-400 font-bold">#{match.placement} байр</span>
                )}
                <span className="text-purple-400 font-bold">+{match.xpEarned} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

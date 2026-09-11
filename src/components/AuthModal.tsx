import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Mail,
  Lock,
  Sparkles,
  X,
  Check,
  ArrowRight,
  Phone,
  ShieldCheck,
  RotateCcw,
  Upload,
} from 'lucide-react';
import { useAppStore } from '../lib/store';

type AuthMethod = 'social' | 'phone' | 'email';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, setUser, user } = useAppStore();

  const [activeMethod, setActiveMethod] = useState<AuthMethod>('social');
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Email form states
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarUrl);

  // Phone auth states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneStep, setPhoneStep] = useState<'number' | 'otp'>('number');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('8821');
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=250&q=80',
  ];

  // Timer countdown for phone OTP
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (phoneStep === 'otp' && timerSeconds > 0) {
      timer = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phoneStep, timerSeconds]);

  if (!showAuthModal) return null;

  // Handle Google OAuth login
  const handleGoogleAuth = () => {
    setUser({
      displayName: 'Тэмүүлэн (Google)',
      username: 'temuulen_google',
      avatarUrl: avatarOptions[1],
    });
    setShowAuthModal(false);
  };

  // Handle Facebook OAuth login
  const handleFacebookAuth = () => {
    setUser({
      displayName: 'Бат-Эрдэнэ (Facebook)',
      username: 'baterdene_fb',
      avatarUrl: avatarOptions[3],
    });
    setShowAuthModal(false);
  };

  // Handle Request Phone OTP
  const handleRequestPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 8) {
      setPhoneError('Монгол улсын 8 оронтой утасны дугаар оруулна уу (жишээ: 88112233).');
      return;
    }
    setPhoneError(null);
    // Generate random 4-digit code
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomCode);
    setPhoneStep('otp');
    setTimerSeconds(60);
    setTimeout(() => {
      otpInputRefs[0].current?.focus();
    }, 150);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1);
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  // Verify Phone OTP and login
  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpCode.join('');
    if (enteredCode.length !== 4) {
      setPhoneError('4 оронтой баталгаажуулах кодоо бүрэн оруулна уу.');
      return;
    }

    if (enteredCode !== generatedOtp && enteredCode !== '8821') {
      setPhoneError('Баталгаажуулах код буруу байна. Шалгаад дахин оролдоно уу.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    setUser({
      displayName: `Бичээч (+976 ${cleanPhone})`,
      username: `user_${cleanPhone.slice(-4)}`,
      avatarUrl: avatarOptions[0],
    });
    setShowAuthModal(false);
  };

  // Handle Email submit
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      if (email) {
        const extractedName = email.split('@')[0] || 'Монгол_Бичээч';
        setUser({
          displayName: extractedName,
          username: extractedName.toLowerCase().replace(/\s+/g, '_'),
          avatarUrl: selectedAvatar,
        });
      }
    } else {
      if (username) {
        setUser({
          displayName: username,
          username: username.toLowerCase().replace(/\s+/g, '_'),
          avatarUrl: selectedAvatar,
        });
      }
    }
    setShowAuthModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative max-w-md w-full bg-[#0d0f1a] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
            <User size={24} />
          </div>
          <h2 className="text-2xl font-black text-white">
            {isLoginMode ? 'Нэвтрэх' : 'Шинээр Бүртгүүлэх'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isLoginMode
              ? 'Өөрийн профайлаар нэвтрэн хурд, чансаагаа хадгалаарай'
              : 'Монгол кирилл хурд бичгийн ертөнцөд нэгдээрэй'}
          </p>
        </div>

        {/* Auth Method Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#141726] p-1 rounded-xl border border-zinc-800/80 mb-5">
          <button
            type="button"
            onClick={() => { setActiveMethod('social'); setPhoneError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeMethod === 'social'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Нийгмийн сүлжээ
          </button>
          <button
            type="button"
            onClick={() => { setActiveMethod('phone'); setPhoneError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeMethod === 'phone'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Утасны дугаар
          </button>
          <button
            type="button"
            onClick={() => { setActiveMethod('email'); setPhoneError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeMethod === 'email'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            И-мэйл
          </button>
        </div>

        {/* METHOD 1: SOCIAL (Google & Facebook) */}
        {activeMethod === 'social' && (
          <div className="flex flex-col gap-3">
            {/* Google Auth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-3 px-4 rounded-xl bg-[#151828] hover:bg-[#1d2238] border border-zinc-700/80 text-white text-xs font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-98 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              Google Хаягаар Нэвтрэх
            </button>

            {/* Facebook Auth Button */}
            <button
              type="button"
              onClick={handleFacebookAuth}
              className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-98 shadow-[0_0_20px_rgba(24,119,242,0.3)]"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook Хаягаар Нэвтрэх
            </button>

            <div className="mt-4 p-3 rounded-2xl bg-[#131627] border border-zinc-800 text-center">
              <span className="text-[11px] text-zinc-400">
                Нэг товшилтоор хурдан бөгөөд аюулгүй нэвтэрч уралдааны үр дүнгээ хадгалаарай.
              </span>
            </div>
          </div>
        )}

        {/* METHOD 2: PHONE NUMBER LOGIN */}
        {activeMethod === 'phone' && (
          <div>
            {phoneStep === 'number' ? (
              <form onSubmit={handleRequestPhoneOtp} className="flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 mb-1 block">
                    Монгол утасны дугаар
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#141724] border border-zinc-700/80 rounded-xl text-white text-xs font-mono select-none">
                      <span>🇲🇳</span>
                      <span>+976</span>
                    </div>
                    <input
                      type="tel"
                      required
                      autoFocus
                      maxLength={8}
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value.replace(/\D/g, ''));
                        setPhoneError(null);
                      }}
                      placeholder="99112233"
                      className="flex-1 px-3.5 py-2.5 bg-[#141724] border border-zinc-700/80 rounded-xl text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {phoneError && (
                  <div className="text-xs text-rose-400 font-medium">{phoneError}</div>
                )}

                <button
                  type="submit"
                  className="mt-2 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Phone size={15} />
                  <span>Баталгаажуулах код авах</span>
                </button>

                <p className="text-[10px] text-zinc-500 text-center mt-1">
                  Таны утсанд 4 оронтой нэг удаагийн нууц код мессежээр илгээгдэнэ.
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="flex flex-col gap-4">
                {/* Instant code hint banner for preview */}
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-medium">
                    <ShieldCheck size={16} />
                    <span>Илгээсэн код: <strong className="font-mono text-white text-sm">{generatedOtp}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpCode(generatedOtp.split(''))}
                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] hover:bg-emerald-500/30 font-semibold"
                  >
                    Автомат оруулах
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-medium text-zinc-400">
                      +976 {phoneNumber} дугаарт илгээсэн 4 оронтой код:
                    </label>
                    <button
                      type="button"
                      onClick={() => setPhoneStep('number')}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Дугаар засах
                    </button>
                  </div>

                  {/* 4 Digit OTP Inputs */}
                  <div className="flex items-center justify-center gap-3">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-14 bg-[#141724] border border-zinc-700/80 rounded-2xl text-center text-xl font-mono font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    ))}
                  </div>
                </div>

                {phoneError && (
                  <div className="text-xs text-rose-400 font-medium text-center">{phoneError}</div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-98"
                >
                  Баталгаажуулж Нэвтрэх
                </button>

                <div className="text-center text-xs text-zinc-500">
                  {timerSeconds > 0 ? (
                    <span>Дахин код илгээх: {timerSeconds} сек</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const newCode = Math.floor(1000 + Math.random() * 9000).toString();
                        setGeneratedOtp(newCode);
                        setTimerSeconds(60);
                      }}
                      className="text-emerald-400 hover:underline font-semibold"
                    >
                      Код дахин илгээх
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* METHOD 3: EMAIL / PASSWORD */}
        {activeMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
            {!isLoginMode && (
              <div>
                <label className="text-[11px] font-medium text-zinc-400 mb-1 block">Хэрэглэгчийн нэр</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Жишээ: Тэмүүлэн_Хурд"
                  className="w-full px-3.5 py-2.5 bg-[#141724] border border-zinc-700/80 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-medium text-zinc-400 mb-1 block">И-мэйл хаяг</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-[#141724] border border-zinc-700/80 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 mb-1 block">Нууц үг</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#141724] border border-zinc-700/80 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {!isLoginMode && (
              <div className="mt-2">
                <label className="text-[11px] font-medium text-zinc-400 mb-1.5 block">Аватар зураг сонгох</label>
                <div className="flex items-center gap-2">
                  {avatarOptions.map((av, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                        selectedAvatar === av ? 'border-emerald-400 scale-110' : 'border-zinc-700 opacity-60'
                      }`}
                    >
                      <img src={av} alt="avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="mt-3 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-98"
            >
              {isLoginMode ? 'Нэвтрэх' : 'Бүртгэл Үүсгэх'}
            </button>

            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                {isLoginMode ? 'Бүртгэлгүй юу? Шинээр нээх' : 'Бүртгэлтэй юу? Нэвтрэх'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

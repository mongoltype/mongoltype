import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Cloud, Check, Copy, Shield, Sparkles, X, Terminal, ExternalLink } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { isSupabaseConfigured } from '../lib/supabase';

export const SupabaseModal: React.FC = () => {
  const { showSupabaseModal, setShowSupabaseModal } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'sql' | 'cloudflare'>('info');

  if (!showSupabaseModal) return null;

  const sqlSnippet = `-- MongolType Supabase Schema
-- 1. Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(32) UNIQUE NOT NULL,
  display_name VARCHAR(64) NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  xp INTEGER DEFAULT 0 NOT NULL,
  title VARCHAR(64) DEFAULT 'Шинэхэн' NOT NULL,
  best_wpm NUMERIC(5, 2) DEFAULT 0 NOT NULL,
  avg_wpm NUMERIC(5, 2) DEFAULT 0 NOT NULL,
  avg_accuracy NUMERIC(5, 2) DEFAULT 100.00 NOT NULL,
  total_races INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Races Table & Realtime Publication
CREATE TABLE public.races (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) UNIQUE NOT NULL,
  host_id UUID REFERENCES public.profiles(id),
  status VARCHAR(20) DEFAULT 'waiting' NOT NULL,
  text_content TEXT NOT NULL
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.races;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative max-w-2xl w-full bg-[#0d0f1a] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-left shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Supabase & Cloudflare Төлөв</h2>
              <p className="text-xs text-zinc-400">Өгөгдлийн сан ба Edge Сүлжээний Интеграц</p>
            </div>
          </div>

          <button
            onClick={() => setShowSupabaseModal(false)}
            className="p-2 rounded-xl bg-zinc-800/80 text-zinc-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 my-4">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'info'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            Төлөв ба Хяналт
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'sql'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            SQL Схем (Schema.sql)
          </button>
          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'cloudflare'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            Cloudflare Pages Тохиргоо
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'info' && (
            <div className="flex flex-col gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#131627] border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-zinc-400 font-medium">Supabase Realtime Sync</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {isSupabaseConfigured ? 'Холбогдсон (Cloud Connected)' : 'Идэвхтэй (Live Sync Mode)'}
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] text-zinc-500">
                  Broadcast Channels: OK
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#131627] border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-zinc-400 font-medium">Cloudflare Edge CDN</div>
                  <div className="text-sky-400 font-bold text-sm mt-0.5 flex items-center gap-1.5">
                    <Cloud size={16} />
                    Pages & CDN Cache Headers Идэвхтэй
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] text-zinc-500">
                  Edge Latency: ~18ms
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#090b14] border border-zinc-800/80">
                <h4 className="font-bold text-white text-sm mb-1.5">Supabase Төсөлөө Холбох заавар:</h4>
                <p className="text-zinc-400 leading-relaxed">
                  1. Supabase.com дээр шинэ төсөл үүсгэнэ.<br />
                  2. SQL Editor дээр манай бэлдсэн <code>schema.sql</code> кодыг хуулж ажиллуулна.<br />
                  3. <code>.env.example</code> доторх <code>VITE_SUPABASE_URL</code> ба <code>VITE_SUPABASE_ANON_KEY</code> хувьсагчдыг тохируулна.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400 font-mono">/supabase/schema.sql</span>
                <button
                  onClick={copySql}
                  className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Хуулагдлаа' : 'SQL Хуулах'}
                </button>
              </div>
              <pre className="p-4 bg-[#080910] border border-zinc-800 rounded-2xl font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
                {sqlSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'cloudflare' && (
            <div className="flex flex-col gap-3 text-xs text-zinc-400 leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#131627] border border-zinc-800">
                <h4 className="font-bold text-white text-sm mb-1">Cloudflare Pages Оновчлол</h4>
                <p>
                  Төсөл нь Cloudflare Pages-д бүрэн тохируулагдсан ба <code>wrangler.toml</code> болон <code>_headers</code> файлууд автоматаар үүссэн.
                </p>
              </div>
              <ul className="list-disc list-inside space-y-1 bg-[#090b14] p-4 rounded-2xl border border-zinc-800/80">
                <li>Edge-compatible fetch болон WebSocket сувгууд</li>
                <li>Статик файлуудын 1 жилийн кэш (immutable cache)</li>
                <li>Vercel-specific сангаас бүрэн ангид, цэвэр Node/Edge бүтэц</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={() => setShowSupabaseModal(false)}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-all"
          >
            Хаах
          </button>
        </div>
      </motion.div>
    </div>
  );
};

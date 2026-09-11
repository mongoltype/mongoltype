import React from 'react';
import { MongolTypeLogo } from './Navbar';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-[#050608] mt-auto py-8 text-zinc-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Branding & Info */}
        <div className="flex items-center gap-2.5">
          <MongolTypeLogo className="w-5 h-4 text-emerald-400" />
          <span className="font-extrabold text-white">
            Mongol<span className="text-emerald-400">Type</span>
          </span>
          <span>•</span>
          <span>Монгол бичгийн ирээдүйг цахимд авчирья</span>
        </div>

        {/* Center: Shortcuts */}
        <div className="hidden md:flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">Esc</kbd>
            <span>Бичвэр солих</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">Tab + Enter</kbd>
            <span>Дахин эхлэх</span>
          </div>
        </div>

        {/* Right: Edge status */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-zinc-400">100% Монгол Кирилл</span>
        </div>
      </div>
    </footer>
  );
};

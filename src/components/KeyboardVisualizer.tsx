import React from 'react';
import { MONGOLIAN_KEYBOARD_LAYOUT } from '../lib/mongolian-text';

interface KeyboardVisualizerProps {
  activeChar: string;
  isError?: boolean;
}

export const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({ activeChar, isError }) => {
  // Normalize the active character to lowercase for mapping
  const targetChar = activeChar ? activeChar.toLowerCase() : '';

  return (
    <div className="w-full bg-[#0c0d14]/90 border border-zinc-800/80 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-2xl overflow-x-auto select-none">
      <div className="flex items-center justify-between mb-3 px-1 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-zinc-300">Монгол Кирилл Гарны Байрлал</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-500 hidden sm:inline">Идэвхтэй үсэг:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-sm">
            {activeChar === ' ' ? 'ЗАЙ (Space)' : (activeChar || '—')}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 min-w-[620px]">
        {MONGOLIAN_KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((keyInfo) => {
              const isMatch =
                keyInfo.label.toLowerCase() === targetChar ||
                (keyInfo.shiftLabel && keyInfo.shiftLabel.toLowerCase() === targetChar);

              return (
                <div
                  key={keyInfo.code}
                  className={`relative flex flex-col items-center justify-center rounded-lg font-mono transition-all duration-150 ${
                    isMatch
                      ? isError
                        ? 'bg-rose-500/30 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)] scale-105 ring-2 ring-rose-400'
                        : 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.5)] scale-105 ring-2 ring-emerald-400 z-10'
                      : 'bg-[#141724]/70 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                  } border w-9 sm:w-11 h-10 sm:h-12`}
                >
                  {keyInfo.shiftLabel && keyInfo.shiftLabel !== keyInfo.label && (
                    <span className="text-[9px] text-zinc-500 absolute top-1 left-1.5">
                      {keyInfo.shiftLabel}
                    </span>
                  )}
                  <span className={`text-xs sm:text-sm font-semibold ${isMatch ? 'text-white' : ''}`}>
                    {keyInfo.label}
                  </span>
                </div>
              );
            })}
          </div>
        ))}

        {/* Spacebar row */}
        <div className="flex justify-center gap-1.5 mt-0.5">
          <div className="w-16 h-10 sm:h-11 rounded-lg bg-[#141724]/70 border border-zinc-800/80 flex items-center justify-center text-[10px] text-zinc-500 font-mono">
            Ctrl
          </div>
          <div className="w-16 h-10 sm:h-11 rounded-lg bg-[#141724]/70 border border-zinc-800/80 flex items-center justify-center text-[10px] text-zinc-500 font-mono">
            Alt
          </div>
          <div
            className={`w-64 sm:w-80 h-10 sm:h-11 rounded-lg border font-mono text-xs flex items-center justify-center transition-all ${
              targetChar === ' '
                ? isError
                  ? 'bg-rose-500/30 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)] ring-2 ring-rose-400'
                  : 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.5)] ring-2 ring-emerald-400'
                : 'bg-[#141724]/70 border-zinc-800/80 text-zinc-500'
            }`}
          >
            ХООСОН ЗАЙ (Space)
          </div>
          <div className="w-16 h-10 sm:h-11 rounded-lg bg-[#141724]/70 border border-zinc-800/80 flex items-center justify-center text-[10px] text-zinc-500 font-mono">
            AltGr
          </div>
          <div className="w-16 h-10 sm:h-11 rounded-lg bg-[#141724]/70 border border-zinc-800/80 flex items-center justify-center text-[10px] text-zinc-500 font-mono">
            Ctrl
          </div>
        </div>
      </div>
    </div>
  );
};

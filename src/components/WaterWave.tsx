import React from 'react';
import { Droplets, Sparkles, Check } from 'lucide-react';

interface WaterWaveProps {
  currentMl: number;
  targetMl: number;
  onQuickAdd: (ml: number) => void;
}

export const WaterWave: React.FC<WaterWaveProps> = ({ currentMl, targetMl, onQuickAdd }) => {
  const percentage = Math.min(Math.round((currentMl / targetMl) * 100), 100);
  const isTargetAchieved = currentMl >= targetMl;
  const remainingMl = Math.max(0, targetMl - currentMl);

  // SVG wave fill level (0% is y=180, 100% is y=10)
  const waveY = 190 - (percentage / 100) * 170;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-6 shadow-sm flex flex-col items-center text-center">
      {/* Target status unboxed metadata */}
      <div className="flex items-center gap-2 text-xs text-sky-800/80 font-medium mb-3">
        <span>Target Harian: {targetMl.toLocaleString('id-ID')} ml</span>
        <span aria-hidden="true">·</span>
        {isTargetAchieved ? (
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Target Tercapai!
          </span>
        ) : (
          <span>Kurang {remainingMl.toLocaleString('id-ID')} ml lagi</span>
        )}
      </div>

      {/* Circular Animated Water Flask/Vessel */}
      <div className="relative w-56 h-56 rounded-full p-2 bg-gradient-to-b from-sky-100 to-sky-200 shadow-inner flex items-center justify-center my-2">
        {/* Inner reservoir */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center">
          {/* Animated SVG Fluid Waves */}
          <div
            className="absolute inset-x-0 bottom-0 transition-all duration-700 ease-out"
            style={{ height: `${percentage}%`, minHeight: percentage > 0 ? '8%' : '0%' }}
          >
            {/* Wave 1 */}
            <svg
              className="absolute -top-6 left-0 w-[200%] h-7 text-sky-400 opacity-60 animate-wave-slow pointer-events-none"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,40 L1200,120 L0,120 Z"
                fill="currentColor"
              />
            </svg>

            {/* Wave 2 */}
            <svg
              className="absolute -top-4 left-[-50%] w-[200%] h-6 text-sky-500 opacity-80 animate-wave-fast pointer-events-none"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C200,60 400,-20 600,50 C800,120 1000,-10 1200,50 L1200,120 L0,120 Z"
                fill="currentColor"
              />
            </svg>

            {/* Main Fluid Body */}
            <div className="w-full h-full bg-gradient-to-t from-sky-600 to-sky-400" />
          </div>

          {/* Central Stats Overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
            <span
              className={`text-4xl font-extrabold tracking-tight tabular-nums transition-colors duration-300 ${
                percentage > 55 ? 'text-white drop-shadow-sm' : 'text-slate-800'
              }`}
            >
              {percentage}%
            </span>

            <span
              className={`text-sm font-semibold tracking-wide tabular-nums mt-0.5 transition-colors duration-300 ${
                percentage > 55 ? 'text-sky-100' : 'text-slate-600'
              }`}
            >
              {currentMl.toLocaleString('id-ID')} / {targetMl.toLocaleString('id-ID')} ml
            </span>

            {isTargetAchieved && (
              <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-amber-300 drop-shadow">
                <Sparkles className="w-3 h-3" /> Hebat!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Motivational message */}
      <p className="text-xs text-slate-500 mt-3 max-w-xs leading-relaxed">
        {percentage === 0 && 'Mulai harimu dengan segelas air segar untuk mengaktifkan metabolisme.'}
        {percentage > 0 && percentage < 50 && 'Perjalanan hidrasi yang bagus! Terus minum secara teratur.'}
        {percentage >= 50 && percentage < 100 && 'Sudah lebih dari separuh jalan! Tinggal sedikit lagi menuju target harian.'}
        {percentage >= 100 && 'Luar biasa! Target hidrasi harianmu sudah terpenuhi. Tetap jaga keseimbangan tubuh!'}
      </p>

      {/* Quick single-tap button to add 1 standard glass */}
      <button
        onClick={() => onQuickAdd(250)}
        className="mt-4 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-sm font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
      >
        <Droplets className="w-4 h-4" />
        <span>+ Gelas Cepat (250 ml)</span>
      </button>
    </div>
  );
};

import React from 'react';
import { Droplet, X, Clock, Check } from 'lucide-react';
import { ReminderMessage } from '../utils/notifications';

interface ReminderPopupProps {
  message: ReminderMessage;
  onDrinkNow: () => void;
  onSnooze: () => void;
  onDismiss: () => void;
}

export const ReminderPopup: React.FC<ReminderPopupProps> = ({
  message,
  onDrinkNow,
  onSnooze,
  onDismiss,
}) => {
  return (
    <div className="fixed inset-x-4 top-5 md:inset-auto md:top-6 md:right-6 z-50 max-w-md w-full animate-in slide-in-from-top-4 duration-300">
      <div className="bg-white rounded-3xl p-5 shadow-2xl border border-sky-200 ring-1 ring-sky-100 flex flex-col gap-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/30 shrink-0 animate-bounce">
              <Droplet className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-sky-600 block">
                Pengingat Minum Air
              </span>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {message.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message body */}
        <p className="text-xs text-slate-600 leading-relaxed bg-sky-50/50 p-2.5 rounded-xl border border-sky-100/60">
          {message.body}
        </p>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onDrinkNow}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Sudah Minum (+250 ml)</span>
          </button>

          <button
            onClick={onSnooze}
            className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-medium transition-all cursor-pointer shrink-0"
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Tunda 10 Mnt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

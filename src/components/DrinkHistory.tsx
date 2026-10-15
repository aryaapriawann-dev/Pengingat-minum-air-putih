import React from 'react';
import { Trash2, Flame, Calendar, Droplet } from 'lucide-react';
import { DrinkLog, DayHistory } from '../types';

interface DrinkHistoryProps {
  logs: DrinkLog[];
  weeklyHistory: DayHistory[];
  streak: number;
  targetMl: number;
  onDeleteLog: (id: string) => void;
  onClearToday: () => void;
}

export const DrinkHistory: React.FC<DrinkHistoryProps> = ({
  logs,
  weeklyHistory,
  streak,
  targetMl,
  onDeleteLog,
  onClearToday,
}) => {
  const totalToday = logs.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Weekly Progress Chart */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">Statistik 7 Hari Terakhir</h2>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Streak {streak} Hari</span>
            </div>
          )}
        </div>

        {/* Bar chart */}
        <div className="grid grid-cols-7 gap-2 pt-2 items-end h-36">
          {weeklyHistory.map((day, idx) => {
            const heightPercent = Math.min(Math.round((day.totalAmount / targetMl) * 100), 100);
            const isToday = idx === weeklyHistory.length - 1;

            return (
              <div key={day.date} className="flex flex-col items-center h-full justify-end group">
                {/* Tooltip on hover */}
                <span className="text-[10px] font-mono tabular-nums text-slate-400 group-hover:text-sky-600 transition-colors mb-1 opacity-0 group-hover:opacity-100">
                  {day.totalAmount}
                </span>

                {/* Bar */}
                <div className="w-full max-w-[28px] bg-slate-100 rounded-t-lg h-24 relative overflow-hidden flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      day.completed
                        ? 'bg-emerald-500'
                        : isToday
                        ? 'bg-sky-500'
                        : 'bg-sky-300'
                    }`}
                  />
                </div>

                {/* Day label */}
                <span
                  className={`text-xs mt-2 font-medium ${
                    isToday ? 'text-sky-700 font-bold' : 'text-slate-500'
                  }`}
                >
                  {isToday ? 'Hari Ini' : day.dayName}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 mt-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block"></span> Target Tercapai
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-sky-500 inline-block"></span> Hari Ini
            </span>
          </div>
          <span>Target: {targetMl} ml</span>
        </div>
      </div>

      {/* Today's Log Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Riwayat Minum Hari Ini</h2>
            <p className="text-xs text-slate-500">
              Total {logs.length} kali minum · {totalToday.toLocaleString('id-ID')} ml
            </p>
          </div>
          {logs.length > 0 && (
            <button
              onClick={onClearToday}
              className="text-xs text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              Reset Hari Ini
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-200 rounded-2xl">
            <Droplet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Belum ada catatan minum hari ini.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Klik salah satu takaran di atas saat Anda minum air.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-sky-50/40 border border-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-sky-600 flex items-center justify-center font-bold text-xs shadow-2xs">
                    💧
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{log.label}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">Pukul {log.timeStr}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold font-mono tabular-nums text-sky-700">
                    +{log.amount} ml
                  </span>
                  <button
                    onClick={() => onDeleteLog(log.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Hapus catatan ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

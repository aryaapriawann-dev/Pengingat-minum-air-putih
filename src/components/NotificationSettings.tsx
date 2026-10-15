import React, { useState } from 'react';
import { Bell, BellRing, BellOff, Volume2, VolumeX, Clock, ShieldCheck, AlertCircle, Play } from 'lucide-react';
import { UserSettings } from '../types';
import { NotificationService } from '../utils/notifications';

interface NotificationSettingsProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  secondsUntilNext: number;
  isWithinActiveHours: boolean;
  onTestNotification: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onUpdateSettings,
  secondsUntilNext,
  isWithinActiveHours,
  onTestNotification,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(NotificationService.getPermission());
  const [customIntervalInput, setCustomIntervalInput] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  const requestBrowserPermission = async () => {
    const perm = await NotificationService.requestPermission();
    setPermission(perm);
  };

  const formatCountdown = (totalSecs: number): string => {
    if (totalSecs <= 0) return 'Siap berbunyi...';
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins} menit ${secs < 10 ? '0' : ''}${secs} detik`;
  };

  const presetIntervals = [30, 45, 60, 90, 120];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            {settings.autoNotification ? <BellRing className="w-5 h-5" /> : <BellOff className="w-5 h-5 text-slate-400" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Pengingat Otomatis</h2>
            <p className="text-xs text-slate-500">Notifikasi berkala agar Anda tidak lupa minum air</p>
          </div>
        </div>

        {/* Master Toggle */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoNotification}
            onChange={(e) => onUpdateSettings({ autoNotification: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
        </label>
      </div>

      {/* Permission Status Box */}
      <div className="mt-4">
        {permission === 'granted' ? (
          <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Izin notifikasi browser aktif. Notifikasi desktop & mobile akan muncul otomatis.</span>
          </div>
        ) : permission === 'denied' ? (
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-100 flex items-center gap-2.5 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Notifikasi sistem diblokir browser. Notifikasi audio & banner layar tetap berfungsi.</span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-sky-900">
              <Bell className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Aktifkan izin notifikasi browser untuk pengingat di latar belakang.</span>
            </div>
            <button
              onClick={requestBrowserPermission}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Izinkan
            </button>
          </div>
        )}
      </div>

      {/* Countdown Timer Card */}
      {settings.autoNotification && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              Status Pengingat:
            </span>
            <span className="text-slate-500 font-mono">
              {isWithinActiveHours ? (
                <span className="text-emerald-700 font-semibold">Aktif Berjalan</span>
              ) : (
                <span className="text-amber-700 font-semibold">Waktu Istirahat (DND)</span>
              )}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs text-slate-500">Jadwal berikutnya:</span>
            <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
              {isWithinActiveHours ? formatCountdown(secondsUntilNext) : 'Mulai lagi besok'}
            </span>
          </div>

          {/* Quick Test Button */}
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-xs text-slate-400">Ingin coba cek bunyinya?</span>
            <button
              onClick={onTestNotification}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Tes Notifikasi Sekarang</span>
            </button>
          </div>
        </div>
      )}

      {/* Interval Selector */}
      <div className="mt-5">
        <label className="text-xs font-semibold text-slate-700 block mb-2">
          Frekuensi Pengingat Minum
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {presetIntervals.map((mins) => {
            const isSelected = settings.intervalMinutes === mins && !showCustomInput;
            return (
              <button
                key={mins}
                onClick={() => {
                  setShowCustomInput(false);
                  onUpdateSettings({ intervalMinutes: mins });
                }}
                className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50'
                }`}
              >
                {mins >= 60 ? `${mins / 60} Jam` : `${mins} Mnt`}
              </button>
            );
          })}
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              showCustomInput || !presetIntervals.includes(settings.intervalMinutes)
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50'
            }`}
          >
            Kustom
          </button>
        </div>

        {/* Custom interval field */}
        {showCustomInput && (
          <div className="mt-2.5 flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-600">Setiap</span>
            <input
              type="number"
              min="5"
              max="360"
              placeholder={String(settings.intervalMinutes)}
              value={customIntervalInput}
              onChange={(e) => setCustomIntervalInput(e.target.value)}
              className="w-20 px-2 py-1 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-center"
            />
            <span className="text-xs text-slate-600">menit</span>
            <button
              onClick={() => {
                const val = parseInt(customIntervalInput, 10);
                if (val && val >= 5 && val <= 360) {
                  onUpdateSettings({ intervalMinutes: val });
                }
              }}
              className="ml-auto px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Simpan
            </button>
          </div>
        )}
      </div>

      {/* Active Hours & Sound Setting */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Jam Aktif Pengingat
          </label>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={settings.activeStart}
              onChange={(e) => onUpdateSettings({ activeStart: e.target.value })}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <span className="text-xs text-slate-400">s/d</span>
            <input
              type="time"
              value={settings.activeEnd}
              onChange={(e) => onUpdateSettings({ activeEnd: e.target.value })}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Tidak mengganggu istirahat di malam hari
          </p>
        </div>

        {/* Audio Toggle */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Efek Suara Notifikasi
          </label>
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              settings.soundEnabled
                ? 'bg-sky-50/70 border-sky-200 text-sky-900'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-sky-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <span>{settings.soundEnabled ? 'Suara Bel Aktif' : 'Mode Senyap'}</span>
            </div>
            <span className="text-[11px] font-semibold text-sky-700">
              {settings.soundEnabled ? 'Nyala' : 'Mati'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

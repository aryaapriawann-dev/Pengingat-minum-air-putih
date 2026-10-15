import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Droplets,
  Settings,
  Bell,
  Sparkles,
  Info,
  RotateCcw,
} from 'lucide-react';
import { DrinkLog, UserSettings } from './types';
import {
  loadSettings,
  saveSettings,
  loadDrinkLogs,
  saveDrinkLogs,
  getTodayKey,
  formatTime,
  getWeeklyHistory,
  calculateStreak,
} from './utils/storage';
import { soundManager } from './utils/audio';
import { NotificationService, ReminderMessage } from './utils/notifications';
import { WaterWave } from './components/WaterWave';
import { QuickAddPanel } from './components/QuickAddPanel';
import { NotificationSettings } from './components/NotificationSettings';
import { DrinkHistory } from './components/DrinkHistory';
import { HydrationTips } from './components/HydrationTips';
import { TargetCalculatorModal } from './components/TargetCalculatorModal';
import { ReminderPopup } from './components/ReminderPopup';

export default function App() {
  // State initialization
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [logs, setLogs] = useState<DrinkLog[]>(() => loadDrinkLogs());
  const [showTargetModal, setShowTargetModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'tracker' | 'notifikasi' | 'riwayat' | 'panduan'>('tracker');

  // Countdown in seconds to next reminder
  const [secondsUntilNext, setSecondsUntilNext] = useState<number>(() => (loadSettings().intervalMinutes || 60) * 60);
  const [popupMessage, setPopupMessage] = useState<ReminderMessage | null>(null);
  const [celebrationAchieved, setCelebrationAchieved] = useState<boolean>(false);

  // References to keep timer in sync
  const intervalRef = useRef<number | null>(null);
  const settingsRef = useRef<UserSettings>(settings);
  settingsRef.current = settings;

  // Total current ml today
  const currentMl = logs.reduce((sum, item) => sum + item.amount, 0);
  const weeklyHistory = getWeeklyHistory(settings.dailyTarget);
  const streak = calculateStreak(settings.dailyTarget);

  // Check if current time is within active hours
  const checkWithinActiveHours = useCallback((): boolean => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = settings.activeStart.split(':').map(Number);
    const [endH, endM] = settings.activeEnd.split(':').map(Number);

    const startTotal = (startH || 7) * 60 + (startM || 0);
    const endTotal = (endH || 22) * 60 + (endM || 0);

    if (startTotal <= endTotal) {
      return currentMins >= startTotal && currentMins <= endTotal;
    } else {
      // overnight span
      return currentMins >= startTotal || currentMins <= endTotal;
    }
  }, [settings.activeStart, settings.activeEnd]);

  // Trigger hydration reminder
  const triggerReminder = useCallback(() => {
    const msg = NotificationService.getRandomMessage();

    if (settingsRef.current.soundEnabled) {
      soundManager.playReminderChime();
    }

    // Try system notification
    NotificationService.sendSystemNotification(msg);

    // Always show in-app banner for guaranteed delivery
    setPopupMessage(msg);

    // Reset countdown
    setSecondsUntilNext(settingsRef.current.intervalMinutes * 60);
  }, []);

  // Timer loop for automatic reminders
  useEffect(() => {
    if (!settings.autoNotification) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setSecondsUntilNext((prev) => {
        if (prev <= 1) {
          if (checkWithinActiveHours()) {
            triggerReminder();
          }
          return settingsRef.current.intervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [settings.autoNotification, settings.intervalMinutes, checkWithinActiveHours, triggerReminder]);

  // Update settings handler
  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);

    if (newSettings.intervalMinutes && newSettings.intervalMinutes !== settings.intervalMinutes) {
      setSecondsUntilNext(newSettings.intervalMinutes * 60);
    }
  };

  // Add drink handler
  const handleAddDrink = (amount: number, container: DrinkLog['container'], label: string) => {
    if (settings.soundEnabled) {
      soundManager.playWaterDrop();
    }

    const now = new Date();
    const newLog: DrinkLog = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now.toISOString(),
      timeStr: formatTime(now),
      amount,
      container,
      label,
    };

    const newLogs = [newLog, ...logs];
    setLogs(newLogs);
    saveDrinkLogs(newLogs, getTodayKey());

    // Check if daily target was reached with this drink
    const prevMl = currentMl;
    const nextMl = prevMl + amount;
    if (prevMl < settings.dailyTarget && nextMl >= settings.dailyTarget) {
      setCelebrationAchieved(true);
      if (settings.soundEnabled) {
        soundManager.playSuccessChime();
      }
      setTimeout(() => setCelebrationAchieved(false), 8000);
    }

    // If popup was open, close it
    if (popupMessage) {
      setPopupMessage(null);
    }
  };

  // Delete drink log
  const handleDeleteLog = (id: string) => {
    const newLogs = logs.filter((item) => item.id !== id);
    setLogs(newLogs);
    saveDrinkLogs(newLogs, getTodayKey());
  };

  // Clear all today's logs
  const handleClearToday = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh catatan minum hari ini?')) {
      setLogs([]);
      saveDrinkLogs([], getTodayKey());
    }
  };

  // Snooze reminder by 10 minutes
  const handleSnooze = () => {
    setPopupMessage(null);
    setSecondsUntilNext(10 * 60); // 10 minutes
  };

  // Test notification manually
  const handleTestNotification = () => {
    triggerReminder();
  };

  const isWithinHours = checkWithinActiveHours();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Reminder In-App Popup Banner */}
      {popupMessage && (
        <ReminderPopup
          message={popupMessage}
          onDrinkNow={() => handleAddDrink(250, 'gelas', 'Gelas Standar')}
          onSnooze={handleSnooze}
          onDismiss={() => setPopupMessage(null)}
        />
      )}

      {/* Celebration Banner when daily target reached */}
      {celebrationAchieved && (
        <div className="fixed inset-x-4 top-4 z-40 max-w-md mx-auto bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between animate-in slide-in-from-top-6 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Selamat! Target Terpenuhi! 🎉</h4>
              <p className="text-xs text-emerald-100">
                Kamu telah mencapai target {settings.dailyTarget.toLocaleString('id-ID')} ml hari ini.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCelebrationAchieved(false)}
            className="text-xs text-white/80 hover:text-white px-2 py-1 rounded-md bg-white/10"
          >
            Tutup
          </button>
        </div>
      )}

      {/* TOP BAR CONTRACT:
          Zone 1: Brand title, one line
          Zone 2: 4-5 concise single-line nav links
          Zone 3: 1 primary action */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand */}
          <a
            href="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/30">
              <Droplets className="w-5 h-5 fill-current" />
            </div>
            <span>HidroSantai</span>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'tracker' ? 'text-sky-600 font-semibold' : ''
              }`}
            >
              Pelacak Harian
            </button>
            <button
              onClick={() => setActiveTab('notifikasi')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'notifikasi' ? 'text-sky-600 font-semibold' : ''
              }`}
            >
              Pengingat Otomatis
            </button>
            <button
              onClick={() => setActiveTab('riwayat')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'riwayat' ? 'text-sky-600 font-semibold' : ''
              }`}
            >
              Riwayat & Statistik
            </button>
            <button
              onClick={() => setActiveTab('panduan')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'panduan' ? 'text-sky-600 font-semibold' : ''
              }`}
            >
              Panduan Hidrasi
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowTargetModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Target ({settings.dailyTarget} ml)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Mobile View Tab Switcher (Visible on mobile only) */}
        <div className="md:hidden flex items-center gap-1 p-1 bg-slate-200/70 rounded-2xl">
          {[
            { id: 'tracker', label: 'Pelacak' },
            { id: 'notifikasi', label: 'Pengingat' },
            { id: 'riwayat', label: 'Riwayat' },
            { id: 'panduan', label: 'Panduan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Switcher based on tab / desktop split layout */}
        {/* On desktop: Tracker & Quick Add on Left (col-span-5), Notification Settings & History on Right (col-span-7)! */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Main Water Tracker & Quick Presets) */}
          <div
            className={`space-y-6 ${
              activeTab === 'tracker'
                ? 'block lg:col-span-5'
                : 'hidden lg:block lg:col-span-5'
            }`}
          >
            {/* Fluid Visualizer */}
            <WaterWave
              currentMl={currentMl}
              targetMl={settings.dailyTarget}
              onQuickAdd={(ml) => handleAddDrink(ml, 'gelas', 'Gelas Standar')}
            />

            {/* Quick Presets */}
            <QuickAddPanel onAddDrink={handleAddDrink} />

            {/* Daily summary unboxed metadata banner */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  {logs.length > 0
                    ? `Terakhir minum pukul ${logs[0].timeStr} (+${logs[0].amount} ml)`
                    : 'Belum ada asupan tercatat hari ini.'}
                </span>
              </div>
              {logs.length > 0 && (
                <button
                  onClick={() => handleDeleteLog(logs[0].id)}
                  className="text-xs text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Undo</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column (Notifications, History, or Tips) */}
          <div
            className={`space-y-6 ${
              activeTab !== 'tracker'
                ? 'block lg:col-span-7'
                : 'hidden lg:block lg:col-span-7'
            }`}
          >
            {/* Show Notification Settings on notifikasi tab or on default tracker desktop view */}
            {(activeTab === 'notifikasi' || activeTab === 'tracker') && (
              <NotificationSettings
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                secondsUntilNext={secondsUntilNext}
                isWithinActiveHours={isWithinHours}
                onTestNotification={handleTestNotification}
              />
            )}

            {/* Show History and Chart on riwayat tab or on default tracker desktop view */}
            {(activeTab === 'riwayat' || activeTab === 'tracker') && (
              <DrinkHistory
                logs={logs}
                weeklyHistory={weeklyHistory}
                streak={streak}
                targetMl={settings.dailyTarget}
                onDeleteLog={handleDeleteLog}
                onClearToday={handleClearToday}
              />
            )}

            {/* Show Hydration Tips on panduan tab */}
            {activeTab === 'panduan' && (
              <HydrationTips />
            )}
          </div>
        </div>
      </main>

      {/* Target Calculator Modal */}
      {showTargetModal && (
        <TargetCalculatorModal
          settings={settings}
          onSave={(newTarget, weight, activity) => {
            handleUpdateSettings({
              dailyTarget: newTarget,
              weight,
              activityLevel: activity,
            });
          }}
          onClose={() => setShowTargetModal(false)}
        />
      )}

      {/* Clean Unboxed Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">HidroSantai</span>
            <span aria-hidden="true">·</span>
            <span>Pengingat Minum Air Putih Otomatis</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleTestNotification}
              className="text-sky-600 hover:text-sky-700 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Tes Notifikasi</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Data tersimpan otomatis di perangkat</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

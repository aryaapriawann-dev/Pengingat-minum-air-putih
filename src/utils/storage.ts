import { DrinkLog, DayHistory, UserSettings } from '../types';

const SETTINGS_KEY = 'hidrosantai_settings';
const LOGS_PREFIX = 'hidrosantai_logs_';

export const DEFAULT_SETTINGS: UserSettings = {
  dailyTarget: 2000,
  weight: 60,
  activityLevel: 'sedang',
  autoNotification: true,
  intervalMinutes: 60,
  activeStart: '07:00',
  activeEnd: '22:00',
  soundEnabled: true,
  vibrationEnabled: true,
};

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadDrinkLogs(dateKey: string = getTodayKey()): DrinkLog[] {
  try {
    const raw = localStorage.getItem(LOGS_PREFIX + dateKey);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load logs:', e);
  }
  return [];
}

export function saveDrinkLogs(logs: DrinkLog[], dateKey: string = getTodayKey()): void {
  try {
    localStorage.setItem(LOGS_PREFIX + dateKey, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs:', e);
  }
}

export function calculateRecommendedTarget(weightKg: number, activity: 'ringan' | 'sedang' | 'berat'): number {
  // Medical formula: ~35ml per kg of body weight
  let base = weightKg * 35;
  if (activity === 'ringan') base += 250;
  if (activity === 'sedang') base += 500;
  if (activity === 'berat') base += 850;

  // Round to nearest 50ml
  return Math.round(base / 50) * 50;
}

const INDO_DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function getWeeklyHistory(targetAmount: number): DayHistory[] {
  const result: DayHistory[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    const dayName = INDO_DAYS[d.getDay()];
    const logs = loadDrinkLogs(dateKey);
    const totalAmount = logs.reduce((sum, item) => sum + item.amount, 0);

    result.push({
      date: dateKey,
      dayName,
      totalAmount,
      targetAmount,
      completed: totalAmount >= targetAmount,
    });
  }

  return result;
}

export function calculateStreak(targetAmount: number): number {
  let streak = 0;
  const today = new Date();

  // check back up to 30 days
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    const logs = loadDrinkLogs(dateKey);
    const total = logs.reduce((sum, item) => sum + item.amount, 0);

    if (i === 0) {
      // today: if reached, count 1
      if (total >= targetAmount) {
        streak++;
      }
    } else {
      if (total >= targetAmount) {
        streak++;
      } else {
        break; // streak broken
      }
    }
  }

  return streak;
}

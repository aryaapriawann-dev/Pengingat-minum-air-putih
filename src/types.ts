export interface DrinkLog {
  id: string;
  timestamp: string; // ISO string
  timeStr: string; // HH:mm
  amount: number; // in ml
  container: 'cangkir' | 'gelas' | 'botol' | 'tumbler' | 'custom';
  label: string;
}

export interface DayHistory {
  date: string; // YYYY-MM-DD
  dayName: string; // Sen, Sel, Rab, dll.
  totalAmount: number;
  targetAmount: number;
  completed: boolean;
}

export interface UserSettings {
  dailyTarget: number; // in ml (e.g. 2000)
  weight: number; // in kg
  activityLevel: 'ringan' | 'sedang' | 'berat';
  autoNotification: boolean;
  intervalMinutes: number; // 30, 45, 60, 90, 120
  activeStart: string; // "07:00"
  activeEnd: string; // "22:00"
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

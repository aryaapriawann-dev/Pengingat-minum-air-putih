export interface ReminderMessage {
  title: string;
  body: string;
}

const REMINDER_MESSAGES: ReminderMessage[] = [
  {
    title: 'Waktunya Minum Air Putih! 💧',
    body: 'Tubuhmu membutuhkan hidrasi sekarang. Segelas air segar siap mengembalikan energimu!',
  },
  {
    title: 'Istirahat Sejenak & Teguk Air 🥤',
    body: 'Minum air membantu sirkulasi darah dan mencegah kelelahan saat beraktivitas.',
  },
  {
    title: 'Cegah Dehidrasi, Minum Sekarang! 🌿',
    body: 'Jaga fokus pikiran dan kesehatan ginjal dengan minum 1 gelas air putih.',
  },
  {
    title: 'Waktunya Hidrasi Tubuh ✨',
    body: 'Sudah saatnya minum lagi! Kulit sehat dan metabolisme lancar berawal dari cukup air.',
  },
  {
    title: 'Segarkan Diri dengan Air Putih 🧊',
    body: 'Teguk air putih untuk menjaga suhu tubuh seimbang dan konsentrasi tetap tajam.',
  },
];

export class NotificationService {
  static isSupported(): boolean {
    return 'Notification' in window;
  }

  static getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  static async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      return 'denied';
    }
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
      return 'denied';
    }
  }

  static getRandomMessage(): ReminderMessage {
    const idx = Math.floor(Math.random() * REMINDER_MESSAGES.length);
    return REMINDER_MESSAGES[idx];
  }

  static sendSystemNotification(message?: ReminderMessage): boolean {
    const msg = message || this.getRandomMessage();

    // Trigger vibration on mobile devices if supported
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch {
        // ignore
      }
    }

    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        const notif = new Notification(msg.title, {
          body: msg.body,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230284c7"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
          badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230284c7"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
          tag: 'water-reminder',
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };

        return true;
      } catch (e) {
        console.warn('Browser prevented system notification:', e);
        return false;
      }
    }

    return false;
  }
}

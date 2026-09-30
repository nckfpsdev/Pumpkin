/**
 * pumpkin - Notification Adapter
 * Delegates notifications to the unified PlatformAdapter.
 */

import { platformAdapter, NotificationOptions } from './PlatformAdapter';

export { type NotificationOptions };

export class NotificationAdapter {
  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    try {
      const res = await Notification.requestPermission();
      return res === 'granted';
    } catch {
      return false;
    }
  }

  public notify(options: NotificationOptions) {
    platformAdapter.notify(options);
  }
}

export const notificationAdapter = new NotificationAdapter();

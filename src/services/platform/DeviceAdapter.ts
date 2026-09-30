import { platform } from './index';

export class DeviceAdapter {
  private isLowPowerMode = false;

  constructor() {
    this.detectPowerStatus();
  }

  private async detectPowerStatus() {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      try {
        const battery = await (navigator as unknown as { getBattery: () => Promise<{ level: number; charging: boolean; addEventListener: (t: string, fn: () => void) => void }> }).getBattery();
        this.isLowPowerMode = battery.level < 0.2 && !battery.charging;

        battery.addEventListener('levelchange', () => {
          this.isLowPowerMode = battery.level < 0.2 && !battery.charging;
        });
        battery.addEventListener('chargingchange', () => {
          this.isLowPowerMode = battery.level < 0.2 && !battery.charging;
        });
      } catch {}
    }
  }

  public shouldReduceMotion(): boolean {
    if (typeof window === 'undefined') return false;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    return media.matches || (platform.isAndroid && this.isLowPowerMode);
  }

  public getRecommendedFps(): number {
    if (this.isLowPowerMode) return 30;
    return platform.isAndroid ? 30 : 60;
  }
}

export const deviceAdapter = new DeviceAdapter();

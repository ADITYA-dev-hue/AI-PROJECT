import type { VitalSeverity, VitalReading, NetworkQuality, NetworkStatus } from '../types';

export const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
export const randBetween = (min: number, max: number) => min + Math.random() * (max - min);
export const randInt = (min: number, max: number) => Math.floor(randBetween(min, max + 1));

export function getVitalSeverity(key: keyof VitalReading, val: number): VitalSeverity {
  const ranges: Record<string, { warn: [number, number]; crit: [number, number] }> = {
    heartRate:       { warn: [100, 120], crit: [120, 999] },
    spo2:            { warn: [90,   95], crit: [0,    90] },
    systolicBP:      { warn: [130, 160], crit: [160, 999] },
    diastolicBP:     { warn: [85,  100], crit: [100, 999] },
    temperature:     { warn: [37.5, 38.5], crit: [38.5, 99] },
    respirationRate: { warn: [20,   25], crit: [25,  999] },
  };
  const r = ranges[key];
  if (!r) return 'normal';
  if (key === 'spo2') {
    if (val < 90) return 'critical';
    if (val < 95) return 'warning';
    return 'normal';
  }
  if (val >= r.crit[0] && val <= r.crit[1]) return 'critical';
  if (val >= r.warn[0] && val <= r.warn[1]) return 'warning';
  return 'normal';
}

export function getNetworkQuality(latency: number): NetworkQuality {
  if (latency < 20) return 'excellent';
  if (latency < 35) return 'good';
  if (latency < 50) return 'moderate';
  return 'poor';
}

export function getNetworkColor(quality: NetworkQuality): string {
  const map: Record<NetworkQuality, string> = {
    excellent: '#00e676', good: '#00d4ff', moderate: '#ffcc00', poor: '#ff3b3b',
  };
  return map[quality];
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-IN', { hour12: false });
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function simulateVitals(prev: VitalReading): VitalReading {
  return {
    heartRate:       clamp(prev.heartRate       + randBetween(-3, 3),   50, 140),
    spo2:            clamp(prev.spo2            + randBetween(-1, 1),   88, 100),
    systolicBP:      clamp(prev.systolicBP      + randBetween(-2, 2),   85, 185),
    diastolicBP:     clamp(prev.diastolicBP     + randBetween(-1, 1.5), 55, 115),
    temperature:     clamp(prev.temperature     + randBetween(-0.08, 0.12), 36, 40),
    respirationRate: clamp(prev.respirationRate + randBetween(-0.5, 0.5), 10, 30),
    timestamp: Date.now(),
  };
}

export function simulateNetwork(prev: NetworkStatus): NetworkStatus {
  const latency = clamp(prev.latency + randBetween(-8, 8), 8, 65);
  const quality = getNetworkQuality(latency);
  const history = [...prev.history.slice(-39), latency];
  return { ...prev, latency, quality, history };
}

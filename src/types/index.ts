export interface Ambulance {
  id: string; name: string; status: 'active' | 'standby' | 'returning';
  location: { lat: number; lng: number; x: number; y: number };
  speed: number; heading: number;
}
export type RouteId = 'A' | 'B' | 'C';
export interface Route {
  id: RouteId; name: string; label: string; distance: number; eta: number;
  trafficScore: number; color: string; points: { x: number; y: number }[];
  aiBest: boolean;
}
export type SignalState = 'GREEN' | 'YELLOW' | 'RED';
export type SignalStatus = 'CLEAR' | 'SWITCHING' | 'BLOCKED';
export interface TrafficSignal {
  id: string; name: string; state: SignalState; status: SignalStatus;
  location: { x: number; y: number };
}
export type VitalSeverity = 'normal' | 'warning' | 'critical';
export interface VitalReading {
  heartRate: number; spo2: number; systolicBP: number; diastolicBP: number;
  temperature: number; respirationRate: number; timestamp: number;
}
export interface VitalHistory {
  heartRate: number[]; spo2: number[]; systolicBP: number[];
  diastolicBP: number[]; temperature: number[]; respirationRate: number[];
}
export type AlertType = 'info' | 'success' | 'warning' | 'critical';
export interface Alert { id: string; type: AlertType; message: string; timestamp: number; }
export type NetworkQuality = 'excellent' | 'good' | 'moderate' | 'poor';
export interface NetworkStatus {
  latency: number; downloadMbps: number; uploadMbps: number;
  quality: NetworkQuality; signalStrength: number; history: number[];
}
export interface AnalyticsDataPoint { time: string; value: number; }
export interface AnalyticsData {
  responseTimes: AnalyticsDataPoint[]; latencyTrend: AnalyticsDataPoint[];
  routeEfficiency: AnalyticsDataPoint[]; vitalIndex: AnalyticsDataPoint[];
}
export interface User { name: string; role: string; initials: string; }

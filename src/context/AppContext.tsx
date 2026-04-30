import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type {
  AppState, Alert, AlertType, RouteId, TrafficSignal,
  VitalReading, NetworkStatus, AnalyticsDataPoint
} from '../types';
import { generateId, simulateVitals, simulateNetwork, clamp, randBetween, randInt, getNetworkQuality } from '../utils/helpers';

// ─── Initial State ────────────────────────────────────────────────────────────
const initVitals: VitalReading = {
  heartRate: 78, spo2: 97, systolicBP: 120, diastolicBP: 80,
  temperature: 37.1, respirationRate: 16, timestamp: Date.now(),
};

const emptyHistory = { heartRate: [], spo2: [], systolicBP: [], diastolicBP: [], temperature: [], respirationRate: [] };

const initialState: AppState = {
  isAuthenticated: false,
  theme: 'dark',
  emergencyMode: false,
  voiceAlerts: true,
  selectedRoute: 'A',
  ambulances: [
    { id: 'AMB-001', name: 'Unit Alpha', status: 'active', location: { lat: 28.6139, lng: 77.2090, x: 0.15, y: 0.7 }, speed: 72, heading: 45 },
    { id: 'AMB-002', name: 'Unit Beta',  status: 'standby', location: { lat: 28.6200, lng: 77.2150, x: 0.6, y: 0.8 }, speed: 0, heading: 0 },
    { id: 'AMB-003', name: 'Unit Gamma', status: 'active', location: { lat: 28.6080, lng: 77.2010, x: 0.8, y: 0.6 }, speed: 58, heading: 320 },
  ],
  routes: [
    { id: 'A', name: 'Route A', label: 'Shortest', distance: 3.2, eta: 4, trafficScore: 95, color: '#00ff88', aiBest: true,
      points: [{x:.15,y:.7},{x:.3,y:.65},{x:.3,y:.3},{x:.7,y:.3},{x:.7,y:.12}] },
    { id: 'B', name: 'Route B', label: 'Low Traffic', distance: 4.1, eta: 6, trafficScore: 80, color: '#00d4ff', aiBest: false,
      points: [{x:.15,y:.7},{x:.5,y:.65},{x:.5,y:.3},{x:.7,y:.3},{x:.7,y:.12}] },
    { id: 'C', name: 'Route C', label: 'Backup', distance: 5.8, eta: 9, trafficScore: 60, color: '#ffd700', aiBest: false,
      points: [{x:.15,y:.7},{x:.5,y:.48},{x:.7,y:.48},{x:.7,y:.12}] },
  ],
  signals: [
    { id: 'JA', name: 'Junction A', state: 'GREEN', status: 'CLEAR', location: { x: .3, y: .65 } },
    { id: 'JB', name: 'Junction B', state: 'GREEN', status: 'CLEAR', location: { x: .3, y: .3  } },
    { id: 'JC', name: 'Junction C', state: 'YELLOW', status: 'SWITCHING', location: { x: .5, y: .3 } },
    { id: 'JD', name: 'Junction D', state: 'RED', status: 'BLOCKED', location: { x: .7, y: .3 } },
  ],
  vitals: initVitals,
  vitalHistory: emptyHistory,
  alerts: [],
  network: { latency: 12, downloadMbps: 842, uploadMbps: 156, quality: 'excellent', signalStrength: 95, history: Array(20).fill(12) },
  analyticsData: { responseTimes: [], latencyTrend: [], routeEfficiency: [], vitalIndex: [] },
};

// ─── Actions ──────────────────────────────────────────────────────────────────
type Action =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_EMERGENCY' }
  | { type: 'TOGGLE_VOICE' }
  | { type: 'SET_ROUTE'; payload: RouteId }
  | { type: 'ADD_ALERT'; payload: { alertType: AlertType; message: string } }
  | { type: 'UPDATE_VITALS'; payload: VitalReading }
  | { type: 'UPDATE_NETWORK'; payload: NetworkStatus }
  | { type: 'UPDATE_SIGNALS'; payload: TrafficSignal[] }
  | { type: 'UPDATE_AMB_POS'; payload: { id: string; x: number; y: number; speed: number } }
  | { type: 'PUSH_ANALYTICS'; payload: { key: keyof AppState['analyticsData']; point: AnalyticsDataPoint } };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN':    return { ...state, isAuthenticated: true };
    case 'LOGOUT':   return { ...state, isAuthenticated: false };
    case 'TOGGLE_THEME': return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'TOGGLE_EMERGENCY': {
      const em = !state.emergencyMode;
      const signals = em
        ? state.signals.map(s => ({ ...s, state: 'GREEN' as const, status: 'CLEAR' as const }))
        : state.signals;
      return { ...state, emergencyMode: em, signals };
    }
    case 'TOGGLE_VOICE': return { ...state, voiceAlerts: !state.voiceAlerts };
    case 'SET_ROUTE': return { ...state, selectedRoute: action.payload };
    case 'ADD_ALERT': {
      const alert: Alert = { id: generateId(), type: action.payload.alertType, message: action.payload.message, timestamp: Date.now() };
      return { ...state, alerts: [alert, ...state.alerts].slice(0, 30) };
    }
    case 'UPDATE_VITALS': {
      const v = action.payload;
      const h = state.vitalHistory;
      const push = (arr: number[], val: number) => [...arr.slice(-24), Math.round(val * 10) / 10];
      return {
        ...state, vitals: v,
        vitalHistory: {
          heartRate:       push(h.heartRate,       v.heartRate),
          spo2:            push(h.spo2,            v.spo2),
          systolicBP:      push(h.systolicBP,      v.systolicBP),
          diastolicBP:     push(h.diastolicBP,     v.diastolicBP),
          temperature:     push(h.temperature,     v.temperature),
          respirationRate: push(h.respirationRate, v.respirationRate),
        },
      };
    }
    case 'UPDATE_NETWORK': return { ...state, network: action.payload };
    case 'UPDATE_SIGNALS': return { ...state, signals: action.payload };
    case 'UPDATE_AMB_POS': return {
      ...state,
      ambulances: state.ambulances.map(a => a.id === action.payload.id
        ? { ...a, location: { ...a.location, x: action.payload.x, y: action.payload.y }, speed: action.payload.speed }
        : a),
    };
    case 'PUSH_ANALYTICS': {
      const key = action.payload.key;
      const arr = [...state.analyticsData[key].slice(-19), action.payload.point];
      return { ...state, analyticsData: { ...state.analyticsData, [key]: arr } };
    }
    default: return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface AppContextValue {
  state: AppState;
  login: () => void;
  logout: () => void;
  toggleTheme: () => void;
  toggleEmergency: () => void;
  toggleVoice: () => void;
  setRoute: (r: RouteId) => void;
  addAlert: (type: AlertType, message: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Simulation
  React.useEffect(() => {
    if (!state.isAuthenticated) return;

    // Vitals every 2s
    const vitalsInterval = setInterval(() => {
      const next = simulateVitals(state.vitals);
      dispatch({ type: 'UPDATE_VITALS', payload: next });
      const timeLabel = new Date().toLocaleTimeString('en-IN', { hour12: false, minute: '2-digit', second: '2-digit' });
      dispatch({ type: 'PUSH_ANALYTICS', payload: { key: 'vitalIndex', point: { time: timeLabel, value: Math.round((next.spo2 + next.heartRate / 2)) } } });
      // auto alerts
      if (next.spo2 < 92) dispatch({ type: 'ADD_ALERT', payload: { alertType: 'critical', message: `⚠ SPO2 CRITICAL: ${next.spo2.toFixed(0)}% — oxygen dropping` } });
      else if (next.heartRate > 110) dispatch({ type: 'ADD_ALERT', payload: { alertType: 'warning', message: `Heart rate elevated: ${next.heartRate.toFixed(0)} BPM — monitoring` } });
    }, 2000);

    // Network every 1s
    const netInterval = setInterval(() => {
      const next = simulateNetwork(state.network);
      dispatch({ type: 'UPDATE_NETWORK', payload: next });
      const timeLabel = new Date().toLocaleTimeString('en-IN', { hour12: false, minute: '2-digit', second: '2-digit' });
      dispatch({ type: 'PUSH_ANALYTICS', payload: { key: 'latencyTrend', point: { time: timeLabel, value: Math.round(next.latency) } } });
    }, 1000);

    // Analytics every 3s
    const analyticsInterval = setInterval(() => {
      const timeLabel = new Date().toLocaleTimeString('en-IN', { hour12: false, minute: '2-digit', second: '2-digit' });
      dispatch({ type: 'PUSH_ANALYTICS', payload: { key: 'responseTimes', point: { time: timeLabel, value: Math.round(randBetween(180, 340)) } } });
      dispatch({ type: 'PUSH_ANALYTICS', payload: { key: 'routeEfficiency', point: { time: timeLabel, value: Math.round(randBetween(72, 98)) } } });
    }, 3000);

    // Ambulance movement every 1s
    let ambPos = { x: 0.15, y: 0.70, dx: 0.008, dy: -0.004 };
    const ambInterval = setInterval(() => {
      ambPos.x = clamp(ambPos.x + ambPos.dx + randBetween(-0.002, 0.002), 0.05, 0.35);
      ambPos.y = clamp(ambPos.y + ambPos.dy + randBetween(-0.002, 0.002), 0.45, 0.78);
      if (ambPos.x >= 0.34 || ambPos.x <= 0.06) ambPos.dx *= -1;
      if (ambPos.y >= 0.77 || ambPos.y <= 0.46) ambPos.dy *= -1;
      dispatch({ type: 'UPDATE_AMB_POS', payload: { id: 'AMB-001', x: ambPos.x, y: ambPos.y, speed: randInt(60, 82) } });
    }, 1000);

    // Signal cycling every 6s
    const signalInterval = setInterval(() => {
      const ids = ['JA', 'JB', 'JC', 'JD'];
      const switchId = ids[randInt(0, ids.length - 1)];
      dispatch({
        type: 'UPDATE_SIGNALS', payload: state.signals.map(s =>
          s.id === switchId ? { ...s, state: 'YELLOW', status: 'SWITCHING' } : s)
      });
      setTimeout(() => {
        dispatch({
          type: 'UPDATE_SIGNALS', payload: state.signals.map(s =>
            s.id === switchId ? { ...s, state: 'GREEN', status: 'CLEAR' } : s)
        });
        dispatch({ type: 'ADD_ALERT', payload: { alertType: 'success', message: `Signal ${switchId.replace('J', 'Junction ')} → GREEN — corridor clear` } });
      }, 1800);
    }, 6000);

    // Dynamic alerts every 8s
    const ALERTS = [
      { t: 'info' as AlertType, m: '5G handoff complete — tower switch seamless' },
      { t: 'success' as AlertType, m: 'Route recalculated — ETA optimized by AI' },
      { t: 'info' as AlertType, m: 'Hospital AIIMS Delhi — ER team on standby' },
      { t: 'success' as AlertType, m: 'Guardian SMS delivered to Rahul Singh' },
      { t: 'warning' as AlertType, m: 'Traffic detected on Route B — maintaining A' },
      { t: 'info' as AlertType, m: 'GPS lock: 8 satellites — sub-meter accuracy' },
      { t: 'success' as AlertType, m: 'All signals cleared — corridor fully open' },
      { t: 'info' as AlertType, m: 'Dr. Priya Sharma — ready in trauma bay 2' },
    ];
    const alertInterval = setInterval(() => {
      const a = ALERTS[randInt(0, ALERTS.length - 1)];
      dispatch({ type: 'ADD_ALERT', payload: { alertType: a.t, message: a.m } });
    }, 8000);

    return () => {
      clearInterval(vitalsInterval); clearInterval(netInterval);
      clearInterval(analyticsInterval); clearInterval(ambInterval);
      clearInterval(signalInterval); clearInterval(alertInterval);
    };
  }, [state.isAuthenticated]);

  // Initial alerts on login
  const initAlerts = useCallback(() => {
    const messages = [
      { type: 'info' as AlertType,    message: '5G link active — 842 Mbps · 12ms latency' },
      { type: 'success' as AlertType, message: 'Route A optimized by AI — ETA 4 min' },
      { type: 'success' as AlertType, message: 'Signal Junction A → GREEN cleared' },
      { type: 'success' as AlertType, message: 'Signal Junction B → GREEN cleared' },
      { type: 'info' as AlertType,    message: 'Hospital AIIMS Delhi notified — bed reserved' },
      { type: 'success' as AlertType, message: 'Guardian SMS sent to Rahul Singh' },
    ];
    messages.forEach((m, i) => setTimeout(() =>
      dispatch({ type: 'ADD_ALERT', payload: { alertType: m.type, message: m.message } }), i * 400));
  }, []);

  const login = useCallback(() => {
    dispatch({ type: 'LOGIN' });
    setTimeout(initAlerts, 500);
  }, [initAlerts]);

  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);
  const toggleTheme = useCallback(() => dispatch({ type: 'TOGGLE_THEME' }), []);
  const toggleEmergency = useCallback(() => {
    dispatch({ type: 'TOGGLE_EMERGENCY' });
    dispatch({ type: 'ADD_ALERT', payload: { alertType: 'critical', message: '🚨 EMERGENCY MODE — all junctions overridden GREEN' } });
  }, []);
  const toggleVoice = useCallback(() => dispatch({ type: 'TOGGLE_VOICE' }), []);
  const setRoute = useCallback((r: RouteId) => {
    dispatch({ type: 'SET_ROUTE', payload: r });
    dispatch({ type: 'ADD_ALERT', payload: { alertType: 'info', message: `Route ${r} selected — ETA recalculated` } });
  }, []);
  const addAlert = useCallback((alertType: AlertType, message: string) =>
    dispatch({ type: 'ADD_ALERT', payload: { alertType, message } }), []);

  return (
    <AppContext.Provider value={{ state, login, logout, toggleTheme, toggleEmergency, toggleVoice, setRoute, addAlert }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

# 🚑 5G Smart Ambulance AI Control Room (SAECS)

A real-time emergency response dashboard with live ambulance tracking, patient vitals monitoring, automatic traffic signal clearance, and hospital notifications.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## 📦 Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Tech Stack
- **React 18** + **TypeScript** + **Vite**
- **React Router v6** for navigation
- **Zustand** via Context API for state management
- **Recharts** for analytics charts
- **Canvas API** for real-time city map
- **CSS Modules** for scoped styling

## 📁 Project Structure

```
src/
├── App.tsx                    # Root with Router
├── main.tsx                   # Entry point
├── index.css                  # Global styles + CSS variables
├── types/
│   └── index.ts               # All TypeScript interfaces
├── context/
│   └── AppContext.tsx          # Global state + simulation engine
├── utils/
│   └── helpers.ts             # Pure utility functions
├── pages/
│   ├── LoginPage.tsx          # Animated login screen
│   └── DashboardPage.tsx      # Main 3-column dashboard
└── components/
    ├── Header.tsx             # Sticky header with live clock
    ├── MapPanel.tsx           # Canvas city map with routes
    ├── TrafficSignals.tsx     # 4-junction signal display
    ├── VitalsPanel.tsx        # Patient vitals + mini sparklines
    ├── AlertsPanel.tsx        # Live scrolling alerts
    ├── NetworkPanel.tsx       # 5G network + latency graph
    ├── ChartsPanel.tsx        # Recharts analytics
    ├── AmbulanceTracker.tsx   # Multi-unit tracker
    ├── HospitalPanel.tsx      # Hospital + guardian info
    └── StatsBar.tsx           # Bottom KPI bar + actions
```

## ⚡ Features
- **Real-time simulation** — vitals, latency, ambulance GPS update every 1-2s
- **AI route selection** — automatic best-route highlighting
- **Traffic override** — signals auto-switch GREEN ahead of ambulance
- **Emergency mode** — one-click full corridor clearance
- **Dark/light theme** — persisted via CSS variables
- **Multi-ambulance** — 3 units tracked simultaneously
- **Voice toggle** — sound alert control
- **Export PDF** — report generation hook
- **Responsive** — works on mobile, tablet, laptop, projector
- **Canvas map** — animated real-time city map with all routes

## 🔌 Backend API (integrate with Flask/FastAPI)

Replace simulation in `AppContext.tsx` with real API calls:

```typescript
// GET /api/ambulance/location
const location = await fetch('/api/ambulance/location').then(r => r.json())

// GET /api/vitals
const vitals = await fetch('/api/vitals').then(r => r.json())

// POST /api/clear-route
await fetch('/api/clear-route', { method: 'POST', body: JSON.stringify({ routeId: 'A' }) })

// WebSocket for real-time
const ws = new WebSocket('ws://localhost:8000/ws')
ws.onmessage = (e) => dispatch(JSON.parse(e.data))
```

## 🎨 Theme Customization
All colors in `src/index.css` `:root` block — change `--c1`, `--c2`, `--c3` for accent colors.

## 🏆 Built for Hackathons & Demos
- Loads fast, no external API keys needed
- Full simulation engine runs in-browser
- Impressive real-time animations
- Professional UI suitable for live demos and investor presentations

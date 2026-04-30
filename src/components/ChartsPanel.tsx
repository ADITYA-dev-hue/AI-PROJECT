import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts'
import { useApp } from '../context/AppContext'
import styles from './ChartsPanel.module.css'

const TIP_STYLE = {
  background: 'rgba(8,15,26,0.95)', border: '1px solid #1a3050',
  borderRadius: 6, fontSize: 11, color: '#c8d8e8', fontFamily: 'Share Tech Mono,monospace',
}

function MiniChart({ data, color, dataKey }: { data: any[]; color: string; dataKey: string }) {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,48,80,0.5)" />
        <XAxis dataKey="time" hide />
        <YAxis tick={{ fontSize: 9, fill: '#4a6070' }} />
        <Tooltip contentStyle={TIP_STYLE} itemStyle={{ color }} />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5}
          fill={`url(#grad-${color.replace('#', '')})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default function ChartsPanel() {
  const { state } = useApp()
  const { analyticsData } = state

  const charts = [
    { title: 'RESPONSE TIME SAVED (sec)', data: analyticsData.responseTimes, key: 'value', color: '#ff6b35' },
    { title: 'AVG NETWORK LATENCY (ms)', data: analyticsData.latencyTrend,   key: 'value', color: '#00d4ff' },
    { title: 'ROUTE EFFICIENCY (%)',      data: analyticsData.routeEfficiency, key: 'value', color: '#ffd700' },
    { title: 'PATIENT VITALS INDEX',      data: analyticsData.vitalIndex,      key: 'value', color: '#00ff88' },
  ]

  return (
    <div className="panel">
      <div className="panel-title">Analytics Dashboard</div>
      <div className={styles.grid}>
        {charts.map(c => (
          <div key={c.title} className={styles.chartBox}>
            <div className={styles.chartTitle}>{c.title}</div>
            {c.data.length > 1
              ? <MiniChart data={c.data} color={c.color} dataKey={c.key} />
              : <div className={styles.waiting}>Collecting data...</div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

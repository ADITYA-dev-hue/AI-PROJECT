import { useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { getVitalSeverity } from '../utils/helpers'
import styles from './VitalsPanel.module.css'

interface VitalConfig {
  key: 'heartRate' | 'spo2' | 'systolicBP' | 'temperature' | 'respirationRate'
  label: string
  unit: string
  icon: string
  histKey: 'heartRate' | 'spo2' | 'systolicBP' | 'temperature' | 'respirationRate'
}

const VITALS: VitalConfig[] = [
  { key: 'heartRate',       label: 'HEART RATE',        unit: 'BPM',  icon: '♥', histKey: 'heartRate'       },
  { key: 'spo2',            label: 'SPO2',               unit: '%',    icon: '○', histKey: 'spo2'            },
  { key: 'systolicBP',      label: 'BLOOD PRESSURE',     unit: 'mmHg', icon: '⬆', histKey: 'systolicBP'      },
  { key: 'temperature',     label: 'TEMPERATURE',        unit: '°C',   icon: '◉', histKey: 'temperature'     },
  { key: 'respirationRate', label: 'RESPIRATION RATE',   unit: '/min', icon: '◎', histKey: 'respirationRate' },
]

const SEV_COLORS = { normal: '#00e676', warning: '#ffcc00', critical: '#ff3b3b' }

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c || data.length < 2) return
    c.width = c.offsetWidth || 120; c.height = 32
    const ctx = c.getContext('2d')!
    ctx.clearRect(0, 0, c.width, c.height)
    const mn = Math.min(...data), mx = Math.max(...data)
    const range = mx - mn || 1
    ctx.strokeStyle = color; ctx.lineWidth = 1.5
    ctx.shadowColor = color; ctx.shadowBlur = 4
    ctx.beginPath()
    data.forEach((v, i) => {
      const x = (i / (data.length - 1)) * c.width
      const y = c.height - ((v - mn) / range) * (c.height - 4) - 2
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()
  }, [data, color])
  return <canvas ref={ref} style={{ width: '100%', height: 32 }} />
}

export default function VitalsPanel() {
  const { state } = useApp()
  const { vitals, vitalHistory } = state

  return (
    <div className="panel">
      <div className="panel-title">Patient Vitals — Live Monitoring
        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--cgreen)' }}>● REAL-TIME</span>
      </div>
      <div className={styles.grid}>
        {VITALS.map(cfg => {
          const val = vitals[cfg.key]
          const sev = getVitalSeverity(cfg.key, val)
          const color = SEV_COLORS[sev]
          const displayVal = cfg.key === 'systolicBP'
            ? `${Math.round(vitals.systolicBP)}/${Math.round(vitals.diastolicBP)}`
            : cfg.key === 'temperature' ? val.toFixed(1) : Math.round(val)
          const history = vitalHistory[cfg.histKey]
          return (
            <div key={cfg.key} className={styles.card} style={{ '--vc': color } as React.CSSProperties}>
              <div className={styles.cardTop} style={{ borderTopColor: color }} />
              <div className={styles.row}>
                <div>
                  <div className={styles.label}>{cfg.label}</div>
                  <div className={styles.value} style={{ color }}>
                    {displayVal}
                    <span className={styles.unit}>{cfg.unit}</span>
                  </div>
                  <div className={styles.status} style={{ color }}>
                    {sev === 'normal' ? '● NORMAL' : sev === 'warning' ? '⚠ WARNING' : '🔴 CRITICAL'}
                  </div>
                </div>
                <div className={styles.icon} style={{ color }}>{cfg.icon}</div>
              </div>
              <MiniChart data={history} color={color} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

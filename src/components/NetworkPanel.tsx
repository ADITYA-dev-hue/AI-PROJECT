import { useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { getNetworkColor } from '../utils/helpers'
import styles from './NetworkPanel.module.css'

function LatencyGraph({ history }: { history: number[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c || history.length < 2) return
    c.width = c.offsetWidth || 260; c.height = 60
    const ctx = c.getContext('2d')!, W = c.width, H = c.height
    ctx.clearRect(0, 0, W, H)
    // Grid lines
    ctx.strokeStyle = 'rgba(26,48,80,0.5)'; ctx.lineWidth = 0.5
    ;[20, 40, 60].forEach(v => {
      const y = H - (v / 80) * H
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      ctx.fillStyle = 'rgba(138,170,187,0.5)'; ctx.font = '8px Share Tech Mono,monospace'
      ctx.fillText(String(v), 2, y - 1)
    })
    // Line
    ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 1.5
    ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = 4
    ctx.beginPath()
    history.forEach((v, i) => {
      const x = (i / (history.length - 1)) * W
      const y = H - (v / 80) * H
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()
  }, [history])
  return <canvas ref={ref} style={{ width: '100%', height: 60 }} />
}

export default function NetworkPanel() {
  const { state } = useApp()
  const { network } = state
  const color = getNetworkColor(network.quality)
  const qualLabel = network.quality.charAt(0).toUpperCase() + network.quality.slice(1)
  const barWidth = { excellent: 95, good: 75, moderate: 50, poor: 25 }[network.quality]

  return (
    <div className="panel">
      <div className="panel-title">5G Network Status</div>
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.val} style={{ color }}>{Math.round(network.latency)}</div>
          <div className={styles.lbl}>LATENCY ms</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.val} style={{ color: 'var(--c1)' }}>{network.downloadMbps}</div>
          <div className={styles.lbl}>MBPS ↓</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.val} style={{ color: 'var(--c2)' }}>{network.uploadMbps}</div>
          <div className={styles.lbl}>MBPS ↑</div>
        </div>
      </div>
      <div className={styles.qualRow}>
        <span className={styles.qualLbl}>SIGNAL QUALITY</span>
        <span style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{qualLabel.toUpperCase()}</span>
      </div>
      <div className={styles.barWrap}>
        <div className={styles.bar} style={{ width: `${barWidth}%`, background: color }} />
      </div>
      <LatencyGraph history={network.history} />
    </div>
  )
}

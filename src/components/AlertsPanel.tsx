import { useApp } from '../context/AppContext'
import type { AlertType } from '../types'
import styles from './AlertsPanel.module.css'

const TYPE_CONFIG: Record<AlertType, { color: string; icon: string }> = {
  info:     { color: 'var(--c1)',      icon: 'ℹ' },
  success:  { color: 'var(--cgreen)',  icon: '✓' },
  warning:  { color: 'var(--cyellow)', icon: '⚠' },
  critical: { color: 'var(--cred)',    icon: '🔴' },
}

export default function AlertsPanel() {
  const { state } = useApp()

  return (
    <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="panel-title">System Alerts
        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--cgreen)' }}>{state.alerts.length} EVENTS</span>
      </div>
      <div className={styles.scroll}>
        {state.alerts.map(alert => {
          const cfg = TYPE_CONFIG[alert.type]
          const time = new Date(alert.timestamp).toLocaleTimeString('en-IN', { hour12: false })
          return (
            <div key={alert.id} className={`${styles.item} slide-in`} style={{ borderLeftColor: cfg.color }}>
              <div className={styles.top}>
                <span style={{ color: cfg.color, fontSize: 11 }}>{cfg.icon}</span>
                <span className={styles.time}>{time}</span>
                <span className={styles.badge} style={{ borderColor: cfg.color, color: cfg.color }}>
                  {alert.type.toUpperCase()}
                </span>
              </div>
              <div className={styles.msg} style={{ color: cfg.color }}>{alert.message}</div>
            </div>
          )
        })}
        {state.alerts.length === 0 && (
          <div style={{ color: 'var(--text3)', fontSize: 12, textAlign: 'center', paddingTop: 20 }}>
            Awaiting events...
          </div>
        )}
      </div>
    </div>
  )
}

import { useApp } from '../context/AppContext'
import type { SignalState } from '../types'
import styles from './TrafficSignals.module.css'

export default function TrafficSignals() {
  const { state } = useApp()
  const stateColor: Record<SignalState, string> = { GREEN: 'var(--cgreen)', YELLOW: 'var(--cyellow)', RED: 'var(--cred)' }

  return (
    <div className="panel">
      <div className="panel-title">Traffic Signal Override</div>
      <div className={styles.grid}>
        {state.signals.map(sig => (
          <div key={sig.id} className={styles.card}>
            <div className={styles.name}>{sig.name}</div>
            <div className={styles.lights}>
              <div className={`${styles.light} ${styles.red}  ${sig.state === 'RED'    ? styles.on : ''}`} />
              <div className={`${styles.light} ${styles.yel}  ${sig.state === 'YELLOW' ? styles.on : ''}`} />
              <div className={`${styles.light} ${styles.grn}  ${sig.state === 'GREEN'  ? styles.on : ''}`} />
            </div>
            <div className={styles.status} style={{ color: stateColor[sig.state] }}>
              {sig.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

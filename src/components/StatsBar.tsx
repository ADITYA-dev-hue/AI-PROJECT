import { useApp } from '../context/AppContext'
import styles from './StatsBar.module.css'

export default function StatsBar() {
  const { state, addAlert } = useApp()
  const activeAmbs = state.ambulances.filter(a => a.status === 'active').length

  const handleExport = () => {
    addAlert('success', '📄 Report exported — PDF generated successfully')
    alert('📄 Export Report\n\nIn the full production build, this generates:\n• Patient vitals PDF summary\n• Route & time-saved log\n• Signal clearance history\n• Network performance report\n• Analytics charts export')
  }

  return (
    <div className={styles.bar}>
      <div className={styles.stat}>
        <div className={styles.num} style={{ color: 'var(--c1)' }}>4.2</div>
        <div className={styles.lbl}>MIN SAVED THIS TRIP</div>
        <div className={styles.delta} style={{ color: 'var(--cgreen)' }}>▲ 23% faster</div>
      </div>
      <div className={styles.stat}>
        <div className={styles.num} style={{ color: 'var(--c2)' }}>12</div>
        <div className={styles.lbl}>SIGNALS CLEARED TODAY</div>
        <div className={styles.delta} style={{ color: 'var(--cgreen)' }}>▲ 100% success</div>
      </div>
      <div className={styles.stat}>
        <div className={styles.num} style={{ color: 'var(--c4)' }}>47</div>
        <div className={styles.lbl}>TOTAL TRIPS THIS MONTH</div>
        <div className={styles.delta} style={{ color: 'var(--cgreen)' }}>▲ +8 vs last month</div>
      </div>
      <div className={styles.stat}>
        <div className={styles.num} style={{ color: 'var(--cred)' }}>{activeAmbs}</div>
        <div className={styles.lbl}>ACTIVE AMBULANCES NOW</div>
        <div className={styles.delta} style={{ color: 'var(--cyellow)' }}>⚠ {activeAmbs} critical cases</div>
      </div>
      <div className={styles.stat}>
        <div className={styles.num} style={{ color: 'var(--c1)' }}>{Math.round(state.network.latency)}</div>
        <div className={styles.lbl}>NETWORK LATENCY ms</div>
        <div className={styles.delta} style={{ color: 'var(--cgreen)' }}>5G NR — EXCELLENT</div>
      </div>
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={handleExport} style={{ borderColor: 'var(--c1)', color: 'var(--c1)' }}>
          📄 EXPORT PDF
        </button>
        <button className={styles.actionBtn} onClick={() => addAlert('info', 'Hospital AIIMS notified — ETA 4 min updated')}
          style={{ borderColor: 'var(--cgreen)', color: 'var(--cgreen)' }}>
          🏥 NOTIFY HOSPITAL
        </button>
        <button className={styles.actionBtn} onClick={() => addAlert('success', 'Guardian SMS sent to Rahul Singh')}
          style={{ borderColor: 'var(--c4)', color: 'var(--c4)' }}>
          📱 SEND SMS
        </button>
      </div>
    </div>
  )
}

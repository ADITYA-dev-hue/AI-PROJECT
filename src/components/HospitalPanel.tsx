import styles from './HospitalPanel.module.css'

export default function HospitalPanel() {
  return (
    <div className="panel">
      <div className="panel-title">Hospital & Response</div>
      <div className={styles.items}>
        <div className={styles.item}>
          <span className={styles.dot} style={{ background: 'var(--cgreen)' }} />
          <div>
            <div className={styles.label}>🏥 AIIMS Delhi</div>
            <div className={styles.sub}>Notified · Bed reserved · ETA 4 min</div>
          </div>
        </div>
        <div className={styles.item}>
          <span className={styles.dot} style={{ background: 'var(--cgreen)' }} />
          <div>
            <div className={styles.label}>📱 Guardian SMS</div>
            <div className={styles.sub}>Sent to Rahul Singh — +91-98765-43210</div>
          </div>
        </div>
        <div className={styles.item}>
          <span className={styles.dot} style={{ background: 'var(--cyellow)' }} />
          <div>
            <div className={styles.label}>🩺 Dr. Priya Sharma</div>
            <div className={styles.sub}>On standby · Trauma Bay 2 ready</div>
          </div>
        </div>
        <div className={styles.item}>
          <span className={styles.dot} style={{ background: 'var(--c1)' }} />
          <div>
            <div className={styles.label}>🩸 Blood Bank</div>
            <div className={styles.sub}>O+ units reserved · 4 units ready</div>
          </div>
        </div>
      </div>
    </div>
  )
}

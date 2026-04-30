import { useApp } from '../context/AppContext'
import styles from './AmbulanceTracker.module.css'

const STATUS_COLORS = { active: '#00e676', standby: '#ffcc00', returning: '#00d4ff' }

export default function AmbulanceTracker() {
  const { state } = useApp()
  return (
    <div className="panel">
      <div className="panel-title">Active Units
        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--text2)' }}>
          {state.ambulances.filter(a => a.status === 'active').length} ACTIVE
        </span>
      </div>
      <div className={styles.list}>
        {state.ambulances.map(amb => {
          const color = STATUS_COLORS[amb.status]
          return (
            <div key={amb.id} className={styles.item}>
              <div className={styles.icon} style={{ borderColor: color }}>🚑</div>
              <div className={styles.info}>
                <div className={styles.id}>{amb.id} — {amb.name}</div>
                <div className={styles.loc}>
                  Lat: {(amb.location.lat + amb.location.x / 100).toFixed(4)} ·
                  Lng: {(amb.location.lng + amb.location.y / 100).toFixed(4)} ·
                  {' '}{Math.round(amb.speed)} km/h
                </div>
              </div>
              <div className={styles.badge} style={{ borderColor: color, color }}>
                {amb.status.toUpperCase()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

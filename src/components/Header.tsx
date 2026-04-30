import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Header.module.css'

export default function Header() {
  const { state, toggleTheme, toggleEmergency, toggleVoice } = useApp()
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setTime(n.toLocaleTimeString('en-IN', { hour12: false }))
      setDate(n.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const latColor = state.network.latency < 20 ? '#00e676'
    : state.network.latency < 35 ? '#00d4ff'
    : state.network.latency < 50 ? '#ffcc00' : '#ff3b3b'

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>🚑 5G SMART AMBULANCE</div>
        <div className={styles.badge}>AI CONTROL ROOM</div>
        <div className={styles.version}>v2.4.1</div>
      </div>

      <div className={styles.center}>
        <div className={styles.clock}>{time}</div>
        <div className={styles.netStatus}>
          <span className={styles.pulseDot} />
          5G NETWORK ACTIVE
        </div>
        <div className={styles.dateStr}>{date}</div>
      </div>

      <div className={styles.right}>
        <div className={styles.latency}>
          Latency: <span style={{ color: latColor, fontFamily: 'var(--mono)' }}>
            {Math.round(state.network.latency)}ms
          </span>
        </div>
        <button
          className={`${styles.emgBtn} ${state.emergencyMode ? styles.emgActive : ''}`}
          onClick={toggleEmergency}
        >
          🚨 {state.emergencyMode ? 'EMERGENCY ACTIVE' : 'EMERGENCY'}
        </button>
        <button className={styles.iconBtn} onClick={toggleVoice} title="Toggle voice alerts">
          {state.voiceAlerts ? '🔊' : '🔇'}
        </button>
        <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle theme">
          {state.theme === 'dark' ? '🌙' : '☀️'}
        </button>
        <div className={styles.avatar} title="Operator Singh">OS</div>
      </div>
    </header>
  )
}

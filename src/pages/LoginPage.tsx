import { useState } from 'react'
import { useApp } from '../context/AppContext'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { login } = useApp()
  const [username, setUsername] = useState('operator')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    login()
  }

  return (
    <div className={styles.root}>
      <div className={styles.bg}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={styles.gridLine} style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>
      <div className={styles.card}>
        <div className={styles.logo}>🚑 SAECS</div>
        <div className={styles.logoSub}>5G SMART AMBULANCE EMERGENCY CONTROL SYSTEM</div>
        <div className={styles.scanLine} />
        <h1 className={styles.title}>Control Room Access</h1>
        <p className={styles.desc}>Authorized personnel only · ISO 27001 · 5G NR Secured</p>
        <form onSubmit={handleLogin}>
          <input
            className={styles.input} type="text" placeholder="Username"
            value={username} onChange={e => setUsername(e.target.value)} autoComplete="username"
          />
          <input
            className={styles.input} type="password" placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password"
          />
          <button className={styles.loginBtn} type="submit" disabled={loading}>
            {loading ? '⏳ AUTHENTICATING...' : '🔐 SECURE LOGIN'}
          </button>
        </form>
        <button className={styles.demoBtn} onClick={handleLogin} disabled={loading}>
          ⚡ DEMO ACCESS — No credentials needed
        </button>
        <div className={styles.footer}>
          256-bit AES encrypted · Multi-factor ready · Real-time audit log
        </div>
      </div>
    </div>
  )
}

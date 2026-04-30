import { useRef, useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import type { RouteId } from '../types'
import styles from './MapPanel.module.css'

export default function MapPanel() {
  const { state, setRoute } = useApp()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const draw = () => {
      const W = canvas.width, H = canvas.height
      if (!W || !H) { animRef.current = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, W, H)

      // Background
      ctx.fillStyle = '#060e18'
      ctx.fillRect(0, 0, W, H)

      // Grid
      ctx.strokeStyle = 'rgba(26,48,80,0.5)'
      ctx.lineWidth = 0.5
      for (let x = 0; x < W; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = 0; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

      // Roads
      ctx.strokeStyle = 'rgba(20,40,65,1)'; ctx.lineWidth = 7
      const roads = [[0,H*.3,W,H*.3],[0,H*.65,W,H*.65],[W*.3,0,W*.3,H],[W*.7,0,W*.7,H]]
      roads.forEach(([x1,y1,x2,y2]) => { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke() })
      ctx.lineWidth = 4
      const sec = [[0,H*.48,W,H*.48],[W*.5,0,W*.5,H]]
      sec.forEach(([x1,y1,x2,y2]) => { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke() })

      // City blocks
      ctx.fillStyle = 'rgba(8,16,28,0.9)'
      ;[
        [.05,.05,.2,.2],[.35,.05,.1,.2],[.5,.05,.15,.2],[.72,.05,.22,.2],
        [.05,.35,.2,.1],[.35,.35,.1,.1],[.5,.35,.15,.1],[.72,.35,.22,.1],
        [.05,.55,.2,.07],[.35,.55,.1,.07],[.5,.55,.15,.07],[.72,.55,.22,.07],
        [.05,.72,.2,.22],[.35,.72,.1,.22],[.5,.72,.15,.22],[.72,.72,.22,.22],
      ].forEach(([rx,ry,rw,rh]) => ctx.fillRect(rx*W,ry*H,rw*W,rh*H))

      // Draw routes
      const drawRoute = (points: {x:number;y:number}[], color: string, dashed: number[], width: number, glow: boolean) => {
        ctx.save()
        ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dashed)
        if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 10 }
        ctx.beginPath()
        points.forEach((p, i) => {
          const px = p.x * W, py = p.y * H
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
        })
        ctx.stroke(); ctx.restore()
      }

      // All routes, selected glows
      state.routes.forEach(r => {
        const isSelected = state.selectedRoute === r.id
        drawRoute(r.points, r.color, r.id === 'B' ? [6,4] : r.id === 'C' ? [3,6] : [], isSelected ? 3.5 : 1.5, isSelected)
      })

      // Junctions
      state.signals.forEach(sig => {
        const sx = sig.location.x * W, sy = sig.location.y * H
        const col = sig.state === 'GREEN' ? '#00e676' : sig.state === 'YELLOW' ? '#ffcc00' : '#ff3b3b'
        ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 10
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
        ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(sx - 10, sy - 22, 20, 14)
        ctx.fillStyle = '#ccc'; ctx.font = '8px Exo 2,sans-serif'; ctx.textAlign = 'center'
        ctx.fillText(sig.name.replace('Junction ', ''), sx, sy - 11)
      })

      // Hospital
      const hx = .70 * W, hy = .12 * H
      ctx.save(); ctx.shadowColor = '#ff3b3b'; ctx.shadowBlur = 14
      ctx.fillStyle = '#ff3b3b'; ctx.beginPath(); ctx.arc(hx, hy, 9, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
      ctx.fillStyle = '#fff'; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center'
      ctx.fillText('+', hx, hy + 4)
      ctx.fillStyle = 'rgba(255,80,80,0.9)'; ctx.font = '8px Exo 2,sans-serif'
      ctx.fillText('HOSPITAL', hx, hy + 20)

      // Patient marker
      const px2 = .13 * W, py2 = .72 * H
      ctx.save(); ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 10
      ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(px2, py2, 7, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
      ctx.fillStyle = '#000'; ctx.font = '9px Arial'; ctx.textAlign = 'center'
      ctx.fillText('P', px2, py2 + 3)
      ctx.fillStyle = 'rgba(255,215,0,0.85)'; ctx.font = '8px Exo 2,sans-serif'
      ctx.fillText('PATIENT', px2, py2 + 20)

      // Ambulance with pulse ring
      const amb = state.ambulances[0]
      const ax = amb.location.x * W, ay = amb.location.y * H
      const t = Date.now() / 1000
      const pulse = Math.abs(Math.sin(t * 3))
      ctx.save()
      ctx.strokeStyle = '#ff6b35'; ctx.lineWidth = 2
      ctx.globalAlpha = 0.4 * (1 - pulse)
      ctx.beginPath(); ctx.arc(ax, ay, 12 + pulse * 16, 0, Math.PI * 2); ctx.stroke()
      ctx.globalAlpha = 1
      ctx.shadowColor = '#ff6b35'; ctx.shadowBlur = 16 + pulse * 8
      ctx.fillStyle = '#ff6b35'; ctx.beginPath(); ctx.arc(ax, ay, 9, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
      ctx.fillStyle = '#fff'; ctx.font = 'bold 9px Arial'; ctx.textAlign = 'center'
      ctx.fillText('A', ax, ay + 3)
      ctx.fillStyle = 'rgba(255,107,53,0.9)'; ctx.font = '8px Exo 2,sans-serif'
      ctx.fillText('AMB-001', ax, ay + 22)

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize) }
  }, [state.routes, state.signals, state.ambulances, state.selectedRoute])

  const routeColors: Record<RouteId, string> = { A: '#00ff88', B: '#00d4ff', C: '#ffd700' }

  return (
    <div className="panel">
      <div className="panel-title">Smart City Map
        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--cgreen)' }}>● GPS LIVE</span>
      </div>
      <div className={styles.mapWrap}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s' }} />
      </div>
      <div className={styles.zoomRow}>
        <button className={styles.zoomBtn} onClick={() => setZoom(z => Math.min(2, +(z + 0.15).toFixed(2))}>+ Zoom In</button>
        <button className={styles.zoomBtn} onClick={() => setZoom(z => Math.max(0.5, +(z - 0.15).toFixed(2))}>− Zoom Out</button>
        <button className={styles.zoomBtn} onClick={() => setZoom(1)}>⊞ Best View</button>
      </div>
      <div className={styles.routes}>
        {state.routes.map(r => (
          <div
            key={r.id}
            className={`${styles.routeItem} ${state.selectedRoute === r.id ? styles.routeActive : ''}`}
            onClick={() => setRoute(r.id)}
            style={{ '--rc': routeColors[r.id] } as React.CSSProperties}
          >
            <div className={styles.routeDot} style={{ background: r.color }} />
            <div className={styles.routeInfo}>
              <div className={styles.routeName} style={{ color: r.color }}>
                {r.name} — {r.label}
              </div>
              <div className={styles.routeDetail}>{r.distance}km · ETA {r.eta} min</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: r.color, fontSize: 13, fontWeight: 600, fontFamily: 'var(--mono)' }}>{r.eta} min</div>
              {r.aiBest && <div className={styles.aiBadge}>AI BEST</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

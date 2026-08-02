import { useEffect, useRef } from 'react'
import { useApp } from '../contexts/AppContext'

const PALETTES = {
  dark: {
    bg1: '#01010a',
    bg2: '#050a22',
    line: '62, 214, 255',
    dot: ['255,255,255', '62,214,255', '150,190,255'],
  },
  light: {
    bg1: '#f4f3ff',
    bg2: '#dce3ff',
    line: '59, 91, 219',
    dot: ['74,104,255', '255,255,255', '0,180,255'],
  },
}

export default function ParticleNetwork() {
  const canvasRef = useRef(null)
  const { theme } = useApp()
  const themeRef = useRef(theme)
  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let particles = []
    let W = 0
    let H = 0
    let DPR = 1
    const mouse = { x: 0, y: 0, active: false }

    const pal = () => PALETTES[themeRef.current] || PALETTES.dark

    const makeParticle = () => {
      const colors = pal().dot
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 0.6 + Math.random() * 1.3,
        c: colors[Math.floor(Math.random() * colors.length)],
        tw: Math.random() * Math.PI * 2,
      }
    }

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * DPR
      canvas.height = H * DPR
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      const count = Math.max(70, Math.min(220, Math.floor((W * H) / 11000)))
      particles = Array.from({ length: count }, makeParticle)
    }

    const draw = () => {
      const p = pal()
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, p.bg1)
      grad.addColorStop(1, p.bg2)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      const linkDist = 130
      const linkDist2 = linkDist * linkDist

      ctx.lineWidth = 1
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < linkDist2) {
            const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.45
            ctx.strokeStyle = `rgba(${p.line},${alpha})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      if (mouse.active) {
        const md = 160
        const md2 = md * md
        ctx.lineWidth = 1
        for (const a of particles) {
          const dx = a.x - mouse.x
          const dy = a.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < md2) {
            const alpha = (1 - Math.sqrt(d2) / md) * 0.55
            ctx.strokeStyle = `rgba(${p.line},${alpha})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }
      }

      for (const a of particles) {
        a.tw += 0.04
        a.x += a.vx
        a.y += a.vy
        if (a.x < -20) a.x = W + 20
        else if (a.x > W + 20) a.x = -20
        if (a.y < -20) a.y = H + 20
        else if (a.y > H + 20) a.y = -20

        const twinkle = 0.5 + 0.5 * Math.sin(a.tw)
        const glowR = (a.r + twinkle * 0.6) * 4
        const g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, glowR)
        g.addColorStop(0, `rgba(${a.c},${0.45 + twinkle * 0.5})`)
        g.addColorStop(1, `rgba(${a.c},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(a.x, a.y, glowR, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }
    const onLeave = () => {
      mouse.active = false
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="network-bg" aria-hidden="true" />
}

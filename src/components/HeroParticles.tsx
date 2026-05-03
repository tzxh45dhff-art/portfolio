import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  targetAlpha: number
  hue: number
  pulse: number
  pulseSpeed: number
}

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    // Track mouse on the whole window
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    window.addEventListener('mousemove', onMove)

    // Initialize particles
    const rect = canvas.getBoundingClientRect()
    const count = Math.floor((rect.width * rect.height) / 4000)
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.15 + 0.03,
        targetAlpha: Math.random() * 0.15 + 0.03,
        hue: 72 + Math.random() * 20, // olive to neon green range
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.015,
      })
    }
    particlesRef.current = particles

    const draw = () => {
      const r = canvas.getBoundingClientRect()
      const w = r.width
      const h = r.height
      ctx.clearRect(0, 0, w, h)

      const mouse = mouseRef.current
      const mouseRadius = 180

      for (const p of particles) {
        // Pulse
        p.pulse += p.pulseSpeed
        const pulseFactor = 0.5 + 0.5 * Math.sin(p.pulse)

        // Mouse interaction
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < mouseRadius) {
          const force = (1 - dist / mouseRadius) * 0.8
          // Repel slightly
          p.vx -= (dx / dist) * force * 0.15
          p.vy -= (dy / dist) * force * 0.15
          // Glow up near mouse
          p.targetAlpha = 0.4 + force * 0.5
        } else {
          p.targetAlpha = 0.03 + pulseFactor * 0.12
        }

        // Smooth alpha transition
        p.alpha += (p.targetAlpha - p.alpha) * 0.05

        // Move
        p.x += p.vx
        p.y += p.vy

        // Friction
        p.vx *= 0.995
        p.vy *= 0.995

        // Wrap around
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        // Draw particle
        const glowSize = p.size * (1 + pulseFactor * 0.6)
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 85%, 56%, ${p.alpha})`
        ctx.fill()

        // Draw glow halo for brighter particles
        if (p.alpha > 0.15) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, glowSize * 3, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${p.hue}, 90%, 55%, ${p.alpha * 0.15})`
          ctx.fill()
        }

        // Draw connections near mouse
        if (dist < mouseRadius * 1.2) {
          for (const q of particles) {
            const ddx = p.x - q.x
            const ddy = p.y - q.y
            const dd = Math.sqrt(ddx * ddx + ddy * ddy)
            if (dd < 80 && dd > 0) {
              const lineAlpha = (1 - dd / 80) * p.alpha * 0.5
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(q.x, q.y)
              ctx.strokeStyle = `hsla(${p.hue}, 80%, 55%, ${lineAlpha})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div className="hero-particles">
      <canvas ref={canvasRef} />
    </div>
  )
}

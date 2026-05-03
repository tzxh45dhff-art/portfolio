import { useEffect, useRef } from 'react'

interface Stroke {
  points: { x: number; y: number }[]
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: number
}

export default function BrushCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0
    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * DPR
      canvas.height = H * DPR
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Perlin
    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
    const lerp = (a: number, b: number, t: number) => a + t * (b - a)
    const perm = new Uint8Array(512)
    for (let i = 0; i < 256; i++) perm[i] = i
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[perm[i], perm[j]] = [perm[j], perm[i]]
    }
    for (let i = 0; i < 256; i++) perm[256 + i] = perm[i]
    const grad = (h: number, x: number, y: number) => {
      const u = (h & 3) < 2 ? x : y
      const v = (h & 3) < 2 ? y : x
      return ((h & 1) ? -u : u) + ((h & 2) ? -v : v)
    }
    const noise2 = (x: number, y: number) => {
      const X = Math.floor(x) & 255, Y = Math.floor(y) & 255
      const xf = x - Math.floor(x), yf = y - Math.floor(y)
      const u = fade(xf), v = fade(yf)
      const aa = perm[perm[X] + Y], ab = perm[perm[X] + Y + 1]
      const ba = perm[perm[X + 1] + Y], bb = perm[perm[X + 1] + Y + 1]
      return lerp(
        lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
        lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
        v
      )
    }

    const strokes: Stroke[] = []
    let mouseX = -9999, mouseY = -9999
    let lastEmit = 0
    let active = false

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      active = true
      const now = performance.now()
      if (now - lastEmit < 22) return
      lastEmit = now
      const a = Math.random() * Math.PI * 2
      const r = 2 + Math.random() * 10
      strokes.push({
        points: [{ x: mouseX + Math.cos(a) * r, y: mouseY + Math.sin(a) * r }],
        vx: Math.cos(a) * (0.4 + Math.random() * 0.6),
        vy: Math.sin(a) * (0.4 + Math.random() * 0.6),
        life: 0,
        maxLife: 70 + Math.random() * 50,
        size: 0.8 + Math.random() * 1.4,
        hue: 75 + Math.random() * 25,
      })
      if (strokes.length > 80) strokes.splice(0, strokes.length - 80)
    }
    window.addEventListener('mousemove', onMove)

    let raf = 0, t = 0
    const draw = () => {
      // Always start from fully transparent canvas — no blanket fill
      ctx.clearRect(0, 0, W, H)

      // Subtle ambient wavy lines (very faint — mostly invisible on cream, faint on dark)
      ctx.globalCompositeOperation = 'source-over'
      const COUNT = 4
      for (let i = 0; i < COUNT; i++) {
        const yBase = ((i + 1) / (COUNT + 1)) * H
        ctx.beginPath()
        const STEPS = 70
        for (let s = 0; s <= STEPS; s++) {
          const xPct = s / STEPS
          const x = xPct * W
          const n = noise2(xPct * 1.4 + i * 13.7, t * 0.00012 + i * 7.3)
          const y = yBase + n * 50
          if (s === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = 'rgba(120, 160, 70, 0.06)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Strokes — advance + draw whole path each frame
      for (let i = strokes.length - 1; i >= 0; i--) {
        const s = strokes[i]
        s.life++
        if (s.life >= s.maxLife) {
          strokes.splice(i, 1)
          continue
        }
        const last = s.points[s.points.length - 1]
        const nx = noise2(last.x * 0.004, last.y * 0.004 + t * 0.0004)
        const ny = noise2(last.x * 0.004 + 99, last.y * 0.004 + t * 0.0004 + 33)
        s.vx = s.vx * 0.96 + nx * 0.18
        s.vy = s.vy * 0.96 + ny * 0.18
        const next = { x: last.x + s.vx, y: last.y + s.vy }
        s.points.push(next)
        if (s.points.length > 30) s.points.shift()

        const lifeT = s.life / s.maxLife
        const alpha = (1 - lifeT) * 0.55
        ctx.beginPath()
        s.points.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        })
        ctx.strokeStyle = `rgba(150, 200, 70, ${alpha})`
        ctx.lineWidth = s.size * (1 - lifeT * 0.5)
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
      }

      // Tiny soft halo at cursor — very subtle
      if (active && mouseX > -1000) {
        const grad2 = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 90)
        grad2.addColorStop(0, 'rgba(180, 220, 100, 0.05)')
        grad2.addColorStop(1, 'rgba(180, 220, 100, 0)')
        ctx.fillStyle = grad2
        ctx.fillRect(mouseX - 100, mouseY - 100, 200, 200)
      }

      t += 16
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="brush-canvas" aria-hidden />
}

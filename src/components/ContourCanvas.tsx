import { useEffect, useRef } from 'react'

interface Props {
  count?: number
  speed?: number
  lime?: boolean
}

export default function ContourCanvas({ count = 7, speed = 1, lime = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0, H = 0
    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
    const lerp = (a: number, b: number, t: number) => a + t * (b - a)

    const perm = new Uint8Array(512)
    for (let i = 0; i < 256; i++) perm[i] = i
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[perm[i], perm[j]] = [perm[j], perm[i]]
    }
    for (let i = 0; i < 256; i++) perm[256 + i] = perm[i]

    const grad = (hash: number, x: number, y: number) => {
      const h = hash & 3
      const u = h < 2 ? x : y
      const v = h < 2 ? y : x
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
        lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u), v
      )
    }

    interface Line { phase: number; speed: number; yBase: number; amp: number; freq: number; offset: number }
    const lines: Line[] = []
    for (let i = 0; i < count; i++) {
      lines.push({
        phase: Math.random() * Math.PI * 2,
        speed: 0.0003 + Math.random() * 0.0003,
        yBase: (i / (count - 1)) * 1.3 - 0.15,
        amp: 0.06 + Math.random() * 0.09,
        freq: 0.6 + Math.random() * 1.2,
        offset: Math.random() * 1000,
      })
    }

    let t = 0, last = 0, raf = 0
    const baseAlpha = lime ? 0.45 : 0.32
    const strokeColor = lime
      ? `rgba(140,200,10,${baseAlpha})`
      : `rgba(120,200,20,${baseAlpha})`

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      lines.forEach(line => {
        const phase = line.phase + t * line.speed * speed * 1000
        const STEPS = 140
        ctx.beginPath()
        for (let s = 0; s <= STEPS; s++) {
          const xPct = s / STEPS
          const x = xPct * W
          const nx = xPct * line.freq + line.offset
          const ny = phase * 0.3
          const n1 = noise2(nx, ny)
          const n2 = noise2(nx * 2.1 + 33, ny * 1.7 + 11) * 0.4
          const n3 = noise2(nx * 4.3 + 77, ny * 3.1 + 44) * 0.15
          const n = (n1 + n2 + n3) / (1 + 0.4 + 0.15)
          const y = (line.yBase + n * line.amp) * H
          if (s === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = 1.2
        ctx.stroke()
      })
    }

    const animate = (ts: number) => {
      const dt = ts - last
      last = ts
      t += dt
      draw()
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [count, speed, lime])

  return <canvas ref={canvasRef} className="contour-canvas" />
}

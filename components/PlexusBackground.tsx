'use client'

import { useRef, useEffect, useCallback } from 'react'

// ── colour palette ─────────────────────────────────────────────────────────────
const PALETTE = [
  { r: 139, g: 92,  b: 246 },   // #8B5CF6 electric violet
  { r: 6,   g: 182, b: 212 },   // #06B6D4 cyan
  { r: 168, g: 85,  b: 247 },   // #A855F7 purple
  { r: 99,  g: 102, b: 241 },   // #6366F1 indigo
  { r: 226, g: 232, b: 240 },   // near-white
  { r: 34,  g: 211, b: 238 },   // #22D3EE sky-cyan
]

function pickColor(idx: number) { return PALETTE[idx % PALETTE.length] }

interface Point { x: number; y: number }

function cubicBezier(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t
  return {
    x: mt**3 * p0.x + 3*mt**2*t * p1.x + 3*mt*t**2 * p2.x + t**3 * p3.x,
    y: mt**3 * p0.y + 3*mt**2*t * p1.y + 3*mt*t**2 * p2.y + t**3 * p3.y,
  }
}

function bezierLength(p0: Point, p1: Point, p2: Point, p3: Point, samples = 40): number {
  let len = 0
  let prev = p0
  for (let i = 1; i <= samples; i++) {
    const cur = cubicBezier(p0, p1, p2, p3, i / samples)
    const dx = cur.x - prev.x, dy = cur.y - prev.y
    len += Math.sqrt(dx*dx + dy*dy)
    prev = cur
  }
  return len
}

interface Stream {
  p0: Point; p1: Point; p2: Point; p3: Point
  color: { r: number; g: number; b: number }
  opacity: number; width: number; speed: number
  segLen: number; offset: number; totalLen: number; dotted: boolean
}

function buildStreams(W: number, H: number, focal: Point): Stream[] {
  const streams: Stream[] = []
  const STREAM_COUNT = 18

  for (let i = 0; i < STREAM_COUNT; i++) {
    let startX: number, startY: number, cp1x: number, cp1y: number

    const f = i / STREAM_COUNT

    if (f < 0.4) {
      startX = -20 + Math.random() * 60
      startY = Math.random() * H * 0.7
      cp1x = W * 0.05
      cp1y = startY * 0.4
    } else if (f < 0.8) {
      startX = W + 20 - Math.random() * 60
      startY = Math.random() * H * 0.7
      cp1x = W * 0.95
      cp1y = startY * 0.4
    } else {
      startX = Math.random() * W
      startY = -20
      cp1x = startX + (Math.random() - 0.5) * W * 0.4
      cp1y = -20
    }

    const lean = (Math.random() - 0.5) * W * 0.25
    const cp2x = focal.x + lean
    const cp2y = focal.y - H * (0.05 + Math.random() * 0.15)

    const p0 = { x: startX, y: startY }
    const p1 = { x: cp1x, y: cp1y }
    const p2 = { x: cp2x, y: cp2y }
    const p3 = { x: focal.x + (Math.random()-0.5)*80, y: focal.y + (Math.random()-0.5)*60 }

    const color = pickColor(i)
    const opacity = 0.03 + Math.random() * 0.05
    const width = 0.3 + Math.random() * 0.6
    const speed = 0.002 + Math.random() * 0.004
    const segLen = 0.10 + Math.random() * 0.20
    const offset = Math.random()
    const dotted = Math.random() < 0.35
    const totalLen = bezierLength(p0, p1, p2, p3)

    streams.push({ p0, p1, p2, p3, color, opacity, width, speed, segLen, offset, totalLen, dotted })
  }

  return streams
}

export default function PlexusBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafId      = useRef<number>(0)
  const mouse      = useRef({ x: 0.5, y: 0.25 })
  const focal      = useRef<Point>({ x: 0, y: 0 })
  const springs    = useRef<Point>({ x: 0, y: 0 })
  const streams    = useRef<Stream[]>([])
  const frameRef   = useRef(0)

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const W = canvas.width, H = canvas.height
    focal.current   = { x: W * 0.5, y: H * 0.42 }
    springs.current = { ...focal.current }
    streams.current = buildStreams(W, H, focal.current)
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    const W = window.innerWidth, H = window.innerHeight
    mouse.current = { x: e.clientX / W, y: e.clientY / H }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)

    function drawStream(s: Stream, t: number) {
      const { p0, p1, p2, p3, color, opacity, width, speed, segLen, offset, dotted } = s
      const head = ((t * speed + offset) % 1)
      const tail = head - segLen
      const STEPS = 60

      ctx.beginPath()
      let started = false
      let dotPhase = 0

      for (let i = 0; i <= STEPS; i++) {
        const u = i / STEPS
        let visible = false
        if (tail >= 0) {
          visible = (u >= tail && u <= head)
        } else {
          visible = (u >= (tail + 1) || u <= head)
        }
        if (!visible) { started = false; continue }

        let localT = (u - tail + 1) % 1 / segLen
        localT = Math.max(0, Math.min(1, localT))
        const alpha = localT < 0.15 ? localT / 0.15 : localT > 0.85 ? (1 - localT) / 0.15 : 1

        dotPhase++
        if (dotted && (dotPhase % 6 < 2)) { started = false; continue }

        const pt = cubicBezier(p0, p1, p2, p3, u)

        if (!started) {
          ctx.beginPath()
          ctx.moveTo(pt.x, pt.y)
          started = true
        } else {
          ctx.lineTo(pt.x, pt.y)
        }

        if (i < STEPS) {
          const nextU = (i + 1) / STEPS
          let nextLocal = (nextU - tail + 1) % 1 / segLen
          nextLocal = Math.max(0, Math.min(1, nextLocal))
          const nextAlpha = nextLocal < 0.15 ? nextLocal / 0.15 : nextLocal > 0.85 ? (1 - nextLocal) / 0.15 : 1
          if (Math.abs(nextAlpha - alpha) > 0.15) {
            ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${(opacity * alpha).toFixed(3)})`
            ctx.lineWidth = width * (0.5 + alpha * 0.5)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(pt.x, pt.y)
          }
        } else {
          ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${(opacity * alpha).toFixed(3)})`
          ctx.lineWidth = width
          ctx.stroke()
        }
      }
    }

    function tick() {
      const W = canvas.width, H = canvas.height
      frameRef.current++
      const t = frameRef.current

      const targetX = mouse.current.x * W
      const targetY = mouse.current.y * H * 0.7 + H * 0.05
      springs.current.x += (targetX - springs.current.x) * 0.03
      springs.current.y += (targetY - springs.current.y) * 0.03

      ctx.clearRect(0, 0, W, H)

      const grd = ctx.createRadialGradient(
        springs.current.x, springs.current.y, 0,
        springs.current.x, springs.current.y, H * 0.55
      )
      grd.addColorStop(0,   'rgba(139, 92, 246, 0.025)')
      grd.addColorStop(0.3, 'rgba(6, 182, 212, 0.01)')
      grd.addColorStop(1,   'rgba(0, 0, 0, 0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, W, H)

      const focalDx = Math.abs(springs.current.x - focal.current.x)
      const focalDy = Math.abs(springs.current.y - focal.current.y)
      if (focalDx > 2 || focalDy > 2) {
        focal.current = { ...springs.current }
        for (const s of streams.current) {
          const lean = (Math.random()-0.5)*80
          s.p3.x += (focal.current.x + lean - s.p3.x) * 0.06
          s.p3.y += (focal.current.y + (Math.random()-0.5)*60 - s.p3.y) * 0.06
          s.p2.x += (focal.current.x + (Math.random()-0.5)*W*0.25 - s.p2.x) * 0.03
        }
      }

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (const s of streams.current) {
        drawStream(s, t)
      }

      const pulseR = 2 + Math.sin(t * 0.04) * 1
      const dotGrd = ctx.createRadialGradient(
        focal.current.x, focal.current.y, 0,
        focal.current.x, focal.current.y, pulseR * 5
      )
      dotGrd.addColorStop(0,   'rgba(139, 92, 246, 0.2)')
      dotGrd.addColorStop(0.4, 'rgba(6, 182, 212, 0.08)')
      dotGrd.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(focal.current.x, focal.current.y, pulseR * 5, 0, Math.PI * 2)
      ctx.fillStyle = dotGrd
      ctx.fill()

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [resize, onMouseMove])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}

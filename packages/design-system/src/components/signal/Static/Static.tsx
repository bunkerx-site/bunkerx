import { useEffect, useRef } from 'react'
import './Static.css'

export type StaticProps = {
  /** 0–1. How much of the noise is opaque. */
  intensity?: number
  /** Frames per second. Real analogue snow is fast; 24 is enough to read as live. */
  fps?: number
  /**
   * Size of one grain, in CSS pixels. The canvas is painted at 1/grain and
   * scaled back up, so this trades fill rate against how fine the snow looks.
   * 1 is a true per-pixel grain and costs the most; 4 is coarse and cheap.
   */
  grain?: number
  className?: string
}

/**
 * Analogue snow, painted on a canvas.
 *
 * The canvas is painted below its display size and scaled back up, which is
 * what sets the size of a grain. Honours `prefers-reduced-motion` by painting
 * a single frozen frame.
 */
export function Static({ intensity = 0.28, fps = 24, grain = 2, className }: StaticProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let last = 0

    const paint = () => {
      const { width, height } = canvas
      const image = ctx.createImageData(width, height)
      const { data } = image
      for (let i = 0; i < data.length; i += 4) {
        const value = (Math.random() * 255) | 0
        data[i] = value
        data[i + 1] = value
        data[i + 2] = value
        data[i + 3] = Math.random() < intensity ? 255 : 0
      }
      ctx.putImageData(image, 0, 0)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const step = Math.max(1, grain)
      canvas.width = Math.max(1, Math.floor(rect.width / step))
      canvas.height = Math.max(1, Math.floor(rect.height / step))
      paint()
    }

    const loop = (now: number) => {
      if (now - last >= 1000 / fps) {
        paint()
        last = now
      }
      frame = requestAnimationFrame(loop)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()
    if (!reduced) frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [intensity, fps, grain])

  return (
    <canvas
      ref={canvasRef}
      className={['bx-static', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    />
  )
}

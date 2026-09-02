import { useEffect, useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import { Static } from '../Static/Static'
import { between, createRandom } from './random'
import './Background.css'

type TearKind = 'band' | 'seam' | 'chroma'

type Tear = {
  kind: TearKind
  /** Bar thickness, in pixels. */
  height: number
  /** One full top-to-bottom sweep, in seconds. */
  sweep: number
  /** One full flick cycle, in seconds. Unrelated to the sweep. */
  flicker: number
  /** Negative, so the bars are already mid-sweep on first paint. */
  delay: number
  /** Ceiling brightness; the flicker keyframes scale down from it. */
  opacity: number
  blur: number
}

export type BackgroundProps = {
  /** How many tearing bars sweep the picture. */
  tears?: number
  /** How many drifting particles fill the field. */
  particles?: number
  /** Paints the nebula wash. Turn it off over an already-busy surface. */
  nebula?: boolean
  /** Paints the tube's bright raster lines behind the content. */
  raster?: boolean
  /**
   * Analogue snow across the whole page, off by default. Snow reads as an
   * event — a signal being acquired — so it belongs to one section rather than
   * to every screen the visitor scrolls through. Turn it on for a surface that
   * is meant to look untuned throughout.
   */
  noise?: boolean
  /** 0–1. How opaque the snow layer is. Kept very low by default. */
  noiseIntensity?: number
  /**
   * Changing the seed reshuffles every random value. The same seed always
   * produces the same screen, so a layout you like can be pinned.
   */
  seed?: number
  /** Drops the tearing bars and leaves the particles drifting. */
  calm?: boolean
  className?: string
}

/**
 * What is happening on the screen, as opposed to what the screen is made of.
 *
 * `CrtScreen` owns the glass — scanlines and vignette. This owns the picture:
 * the nebula the brand lives on, dust drifting through it, and the vertical
 * hold slipping every few seconds.
 *
 * All of it sits behind the content. Interference that crosses the text reads
 * as an effect applied to the page; interference behind it reads as the screen
 * the page happens to be on.
 */
export function Background({
  tears = 3,
  particles = 460,
  nebula = true,
  raster = true,
  noise = false,
  noiseIntensity = 0.025,
  seed = 174,
  calm = false,
  className,
}: BackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const bars = useMemo<Tear[]>(() => {
    const random = createRandom(seed)
    return Array.from({ length: tears }, () => {
      // Most sweeps should be the soft band; the hard seam and the chroma slice
      // are the punctuation, and they lose their effect if they are frequent.
      const roll = random()
      const kind: TearKind = roll < 0.6 ? 'band' : roll < 0.85 ? 'seam' : 'chroma'

      // The bars are meant to be felt rather than seen. Brightness still
      // varies so they do not read as a repeating pattern, but the whole range
      // sits low — anything that draws the eye is competing with the content
      // it is supposed to sit behind.
      const faint = random() < 0.6

      return {
        kind,
        height:
          kind === 'seam'
            ? between(random, 1, 3)
            : kind === 'chroma'
              ? between(random, 6, 28)
              : between(random, 40, 260),
        sweep: between(random, 4, 26),
        // Every bar flicks; the range is what separates a nervous stutter
        // from a slow, occasional drop-out. Capped low enough that even the
        // slowest one visibly cuts within a single sweep.
        flicker: between(random, 0.25, 3.5),
        delay: -between(random, 0, 26),
        opacity: faint ? between(random, 0.04, 0.11) : between(random, 0.14, 0.26),
        blur: kind === 'band' ? between(random, 0, 3) : 0,
      }
    })
  }, [tears, seed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || particles === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const random = createRandom(seed + 1)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // Two populations reading as two distances: far specks that barely move,
    // and near dust that drifts visibly. Depth comes from the difference.
    const dust = Array.from({ length: particles }, () => {
      const far = random() < 0.65
      return {
        x: random(),
        y: random(),
        radius: far ? between(random, 0.4, 1.1) : between(random, 1.1, 2.4),
        driftY: (far ? between(random, -0.008, -0.002) : between(random, -0.025, -0.008)) / 60,
        driftX: between(random, -0.006, 0.006) / 60,
        alpha: far ? between(random, 0.15, 0.4) : between(random, 0.3, 0.7),
        // Slow brightness wobble, so the field never looks like a static grid.
        twinkleSpeed: between(random, 0.2, 0.9),
        twinklePhase: between(random, 0, Math.PI * 2),
        tint: random() < 0.18 ? 'phosphor' : random() < 0.12 ? 'magenta' : 'signal',
      }
    })

    // Canvas cannot read CSS variables, so the brand values are repeated here.
    // They must be kept in step with tokens.css.
    const TINTS: Record<string, [number, number, number]> = {
      signal: [240, 234, 255],
      phosphor: [0, 237, 103],
      magenta: [201, 116, 224],
    }

    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (elapsed: number) => {
      ctx.clearRect(0, 0, width, height)
      for (const particle of dust) {
        const twinkle = reduced
          ? 1
          : 0.65 + 0.35 * Math.sin(elapsed * particle.twinkleSpeed + particle.twinklePhase)
        const [r, g, b] = TINTS[particle.tint]
        ctx.beginPath()
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.alpha * twinkle})`
        ctx.arc(particle.x * width, particle.y * height, particle.radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let frame = 0
    let start = 0

    const loop = (now: number) => {
      if (!start) start = now
      const elapsed = (now - start) / 1000

      for (const particle of dust) {
        particle.y += particle.driftY
        particle.x += particle.driftX
        // Wrap rather than respawn: the field stays evenly filled instead of
        // thinning out at the edge it drifts away from.
        if (particle.y < -0.02) particle.y = 1.02
        if (particle.y > 1.02) particle.y = -0.02
        if (particle.x < -0.02) particle.x = 1.02
        if (particle.x > 1.02) particle.x = -0.02
      }

      draw(elapsed)
      frame = requestAnimationFrame(loop)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    if (reduced) draw(0)
    else frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [particles, seed])

  return (
    <div className={['bx-bg', className].filter(Boolean).join(' ')} aria-hidden="true">
      {nebula ? <div className="bx-bg__nebula" /> : null}
      {noise ? (
        <div className="bx-bg__noise">
          <Static intensity={noiseIntensity} fps={14} />
        </div>
      ) : null}
      {particles > 0 ? <canvas ref={canvasRef} className="bx-bg__particles" /> : null}
      {raster ? <div className="bx-bg__raster" /> : null}

      {calm ? null : (
        <div className="bx-bg__tears">
          {bars.map((bar, index) => (
            <div
              key={index}
              className="bx-tear"
              style={{
                height: `${bar.height}px`,
                animationDuration: `${bar.sweep}s`,
                animationDelay: `${bar.delay}s`,
              }}
            >
              <div
                className={`bx-tear__slice bx-tear__slice--${bar.kind}`}
                style={
                  {
                    filter: bar.blur ? `blur(${bar.blur}px)` : undefined,
                    animationDuration: `${bar.flicker}s`,
                    animationDelay: `${bar.delay}s`,
                    '--tear-opacity': bar.opacity,
                  } as CSSProperties
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

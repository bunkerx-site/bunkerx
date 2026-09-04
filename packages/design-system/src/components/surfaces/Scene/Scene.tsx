import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { between, createRandom } from '../../signal/Background/random'
import { SCENES, type SceneBeam, type SceneName } from './scenes'
import './Scene.css'

export type { SceneName, SceneBeam }

export type SceneProps = {
  /**
   * Which picture, or a set to draw one from.
   *
   * Given a set, one is chosen once when the component mounts and then held —
   * so it changes per visit, not per render. That distinction is the whole
   * reason this is a `useState` initialiser rather than a plain expression: a
   * pick made during render would silently swap the artwork on every re-render
   * of the page around it.
   *
   * `ABDUCTIONS` is the set the first fold uses.
   */
  name: SceneName | readonly SceneName[]
  /**
   * How tall the picture is, as a CSS length. Width follows from the artwork.
   *
   * Height rather than width, and that is the whole reason this is not a
   * `Sticker`. A scene is a tall picture standing in a section as tall as the
   * screen, so the constraint is vertical: sized by width it is correct on a
   * monitor and taller than the viewport on a short laptop, which is the one
   * case that actually overflows. Use `min(72svh, 44rem)` or similar — `svh`,
   * because `vh` on a phone is the height with the browser chrome hidden.
   *
   * Applied as a custom property rather than as an inline `height`, so a
   * consumer can still change it at a breakpoint. A scene often has to be one
   * size standing beside the copy and another sitting behind it, and an inline
   * height can only be beaten with `!important`.
   */
  height?: string
  /** 0–1. Under 1 sits the picture inside the screen rather than on top of it. */
  opacity?: number
  /**
   * The width the picture renders at, for the browser to pick a file with.
   *
   * Expressed in `vh` for a height-driven scene, since `sizes` describes
   * rendered width and the width here is a fixed fraction of the height.
   */
  sizes?: string
  /**
   * A slow phosphor breathe on the whole picture, for a scene that is a light
   * source.
   *
   * The glow only — nothing moves. Every other animated artwork in the system
   * drifts, and drifting is wrong here: this picture has a fence and a patch of
   * field in it, and ground that slides around stops being ground.
   */
  transmit?: boolean
  /**
   * Turns the painted beam into a working one: motes drawn up inside the cone,
   * a pulse of light travelling up it, and a sparser drift of dust around the
   * outside.
   *
   * The point is direction. A still picture of a beam is a cone of light; the
   * same cone with everything inside it moving one way is something being
   * taken. That is the whole idea of the section, and it costs nothing but a
   * handful of composited dots.
   *
   * Only has an effect on a scene whose manifest entry carries a `beam`.
   */
  beam?: boolean
  /** How many motes ride the beam. Lower it on a scene that sits behind text. */
  motes?: number
  /**
   * Reshuffles the motes. The same seed always lays them out the same way, so
   * a screen you like can be pinned and a snapshot stays reproducible.
   */
  seed?: number
  /**
   * Loads immediately and is handed to the browser as the likely largest paint
   * on the screen. On for a scene in the first fold; off for anything below it.
   */
  eager?: boolean
  className?: string
  style?: CSSProperties
}

type Mote = {
  /** Horizontal start, as a fraction of the picture's height. */
  x: number
  /** Horizontal position at the end of the climb, same units. */
  xEnd: number
  /** Vertical start, measured up from the picture's bottom edge. */
  y: number
  /** How far it climbs before fading, as a fraction of the height. */
  rise: number
  size: number
  duration: number
  delay: number
  opacity: number
  /** Most are phosphor; a few carry the convergence magenta. */
  magenta: boolean
}

/**
 * Lays out one population of motes.
 *
 * Positions are expressed against the picture's *height* rather than its
 * width, because that is the axis the scene is sized on: one custom property
 * then drives both where a mote starts and how far it travels, and the field
 * scales with the artwork instead of drifting out of register with it.
 *
 * Both ends of each path are solved against the cone, which is what the first
 * version got wrong in two ways. It measured the spawn height from the bottom
 * edge of the picture while the cone's base sits a few per cent above it, so
 * every mote was placed in a slightly narrower band than the beam actually
 * offers; and it converged every mote to a fixed fraction of its starting
 * offset regardless of how far it climbed, so a short-lived one cut inward far
 * faster than the light narrows.
 */
function layout(count: number, seed: number, beam: SceneBeam | undefined, ratio: number): Mote[] {
  const random = createRandom(seed)

  // Everything below works in "height above the bottom edge", because that is
  // where a mote is anchored. The cone is specified from the top, so both of
  // its ends are converted once here.
  const baseUp = beam ? 1 - beam.baseY / 100 : 0.05
  const apexUp = beam ? 1 - beam.apex[1] / 100 : 0.7

  /** Half the cone's width at a given height above the bottom edge. */
  const halfWidth = (up: number) => {
    // No cone: the ambient dust outside the beam, which spreads across nearly
    // the whole picture rather than being gathered into a column.
    if (!beam) return 0.48
    const t = Math.min(1, Math.max(0, (up - baseUp) / (apexUp - baseUp)))
    return (beam.baseSpread + (beam.apexSpread - beam.baseSpread) * t) / 100
  }

  return Array.from({ length: count }, () => {
    // Start inside the lower two thirds of the cone, and never below its base:
    // a mote spawned under the base is clipped away until it climbs into view,
    // and one spawned near the apex has nowhere left to go and reads as a dot
    // blinking on and off.
    const y = baseUp + between(random, 0.01, 0.55) * (apexUp - baseUp)

    // A fraction of the way to the emitter, so the field always looks like it
    // is converging on the ring rather than sailing past it.
    const rise = (apexUp - y) * between(random, 0.4, 0.95)

    const spread = halfWidth(y)
    // Where it sits across the beam, as a fraction of the cone's half-width.
    // Holding that fraction constant is what makes the path follow the taper:
    // a mote hugging the edge stays at the edge all the way up.
    const across = between(random, -1, 1)

    return {
      // × ratio converts a fraction of the width into a fraction of the height.
      x: across * spread * ratio,
      xEnd: across * halfWidth(y + rise) * ratio,
      y,
      rise,
      size: between(random, 2, 5.5),
      // A wide range is what stops the field from pulsing in unison. The slow
      // ones read as heavy dust, the quick ones as sparks.
      duration: between(random, 5.5, 14),
      delay: -between(random, 0, 14),
      opacity: between(random, 0.35, 0.9),
      magenta: random() < 0.14,
    }
  })
}

type Spark = {
  /** Horizontal radius of the orbit, as a fraction of the picture's height. */
  rx: number
  /** Vertical radius. Well under `rx`, so the path reads as seen at an angle. */
  ry: number
  size: number
  duration: number
  delay: number
  opacity: number
  /** Half of them go the other way round, so the set never reads as a dial. */
  reverse: boolean
}

/**
 * The sparks circling whatever the beam has hold of.
 *
 * They trace an ellipse much wider than it is tall, which is what makes a flat
 * 2D path read as a circle seen from slightly above — and each one dims through
 * the half of the orbit that passes behind the object, so the ring has a front
 * and a back. Traced as a true circle they would look like a loading spinner
 * bolted onto the picture.
 */
function orbit(count: number, seed: number, ratio: number, spread: number): Spark[] {
  const random = createRandom(seed)

  return Array.from({ length: count }, () => {
    const rx = between(random, spread * 0.45, spread) / 100
    return {
      rx: rx * ratio,
      ry: rx * ratio * between(random, 0.24, 0.42),
      size: between(random, 2, 4.5),
      duration: between(random, 6, 13),
      delay: -between(random, 0, 13),
      opacity: between(random, 0.45, 0.95),
      reverse: random() < 0.5,
    }
  })
}

function moteStyle(mote: Mote): CSSProperties {
  return {
    '--bx-mote-x': `calc(var(--bx-scene-height, 40rem) * ${mote.x.toFixed(4)})`,
    '--bx-mote-x-end': `calc(var(--bx-scene-height, 40rem) * ${mote.xEnd.toFixed(4)})`,
    '--bx-mote-y': `calc(var(--bx-scene-height, 40rem) * ${mote.y.toFixed(4)})`,
    '--bx-mote-rise': `calc(var(--bx-scene-height, 40rem) * ${mote.rise.toFixed(4)})`,
    '--bx-mote-size': `${mote.size.toFixed(2)}px`,
    '--bx-mote-opacity': mote.opacity.toFixed(2),
    animationDuration: `${mote.duration.toFixed(2)}s`,
    animationDelay: `${mote.delay.toFixed(2)}s`,
  } as CSSProperties
}

function sparkStyle(spark: Spark): CSSProperties {
  return {
    '--bx-orbit-rx': `calc(var(--bx-scene-height, 40rem) * ${spark.rx.toFixed(4)})`,
    '--bx-orbit-ry': `calc(var(--bx-scene-height, 40rem) * ${spark.ry.toFixed(4)})`,
    '--bx-mote-size': `${spark.size.toFixed(2)}px`,
    '--bx-mote-opacity': spark.opacity.toFixed(2),
    animationDuration: `${spark.duration.toFixed(2)}s`,
    animationDelay: `${spark.delay.toFixed(2)}s`,
    animationDirection: spark.reverse ? 'reverse' : 'normal',
  } as CSSProperties
}

/**
 * A full illustration standing in a section.
 *
 * Decorative throughout: empty alt text, hidden from assistive technology, not
 * interactive. Whatever the picture is saying, the words beside it say too.
 */
export function Scene({
  name,
  height = 'min(72svh, 44rem)',
  opacity = 1,
  sizes = '49vh',
  transmit = false,
  beam = false,
  motes = 26,
  seed = 174,
  eager = false,
  className,
  style,
}: SceneProps) {
  /*
   * Picked once, on mount, and then held for the life of the component.
   *
   * The initialiser form matters: `Math.random()` evaluated in the render body
   * would re-roll on every re-render, so a state update anywhere up the tree
   * would change the artwork mid-visit. Passing a single name skips the draw
   * entirely.
   */
  const [picked] = useState<SceneName>(() =>
    typeof name === 'string' ? name : name[Math.floor(Math.random() * name.length)],
  )

  const entry = SCENES[picked]
  const { size, widths, beam: geometry } = entry
  const [w, h] = size
  const largest = widths[widths.length - 1]
  const ratio = w / h

  /*
   * `motes` is a budget, not a count. How much of it a picture actually spends
   * is a property of the picture: the artworks already carry painted debris,
   * from 17% of the cone in one to 40% in another, and a full field dropped
   * into the busy ones stops reading as light in the beam and starts reading
   * as noise over it. See `density` in scenes.ts for where the numbers came
   * from.
   */
  const budget = Math.round(motes * (geometry.density ?? 1))

  const riders = useMemo(
    () => (beam ? layout(budget, seed, geometry, ratio) : []),
    [beam, geometry, budget, seed, ratio],
  )

  // A sparser field outside the cone: dust hanging in the air that the beam
  // happens to light, rather than anything being carried. A quarter as many,
  // slower, and spread across the whole picture.
  const ambient = useMemo(
    () => (beam ? layout(Math.round(budget / 3), seed + 977, undefined, ratio) : []),
    [beam, geometry, budget, seed, ratio],
  )

  const sparks = useMemo(
    () =>
      beam && geometry.grip
        ? orbit(Math.round(budget / 3), seed + 5381, ratio, geometry.gripSpread ?? 14)
        : [],
    [beam, geometry, budget, seed, ratio],
  )

  const cone =
    `polygon(${(geometry.apex[0] - geometry.apexSpread).toFixed(1)}% ${geometry.apex[1]}%, ` +
    `${(geometry.apex[0] + geometry.apexSpread).toFixed(1)}% ${geometry.apex[1]}%, ` +
    `${(geometry.apex[0] + geometry.baseSpread).toFixed(1)}% ${geometry.baseY}%, ` +
    `${(geometry.apex[0] - geometry.baseSpread).toFixed(1)}% ${geometry.baseY}%)`

  return (
    <span
      className={['bx-scene', transmit && 'bx-scene--transmit', className]
        .filter(Boolean)
        .join(' ')}
      style={{ '--bx-scene-height': height, opacity, ...style } as CSSProperties}
    >
      <img
        className="bx-scene__art"
        src={`/decor/scenes/${picked}-${largest}.webp`}
        srcSet={widths
          .map((width) => `/decor/scenes/${picked}-${width}.webp ${width}w`)
          .join(', ')}
        sizes={sizes}
        alt=""
        aria-hidden="true"
        width={w}
        height={h}
        loading={eager ? 'eager' : 'lazy'}
        /* The fold's picture is the largest thing on the first screen, so it is
           worth telling the browser that rather than letting it discover it. */
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
      />

      {ambient.length > 0 ? (
        <span className="bx-scene__dust" aria-hidden="true">
          {ambient.map((mote, index) => (
            <span
              key={index}
              className={`bx-mote bx-mote--slow${mote.magenta ? ' bx-mote--magenta' : ''}`}
              style={moteStyle(mote)}
            />
          ))}
        </span>
      ) : null}

      {riders.length > 0 ? (
        /* Clipped to the painted cone, so every effect inside is light rather
           than something floating next to it. */
        <span className="bx-scene__beam" style={{ clipPath: cone }} aria-hidden="true">
          <span className="bx-scene__pull" />

          {riders.map((mote, index) => (
            <span
              key={index}
              className={`bx-mote${mote.magenta ? ' bx-mote--magenta' : ''}`}
              style={moteStyle(mote)}
            />
          ))}

          {geometry.grip ? (
            /* Everything that is about the object rather than about the beam,
               parked over it: the aura the field holds it in, and the sparks
               going round. */
            <span
              className="bx-scene__grip"
              style={
                {
                  left: `${geometry.grip[0]}%`,
                  top: `${geometry.grip[1]}%`,
                  '--bx-aura-size': geometry.auraSize ?? 0.3,
                } as CSSProperties
              }
            >
              <span className="bx-scene__aura" />
              {sparks.map((spark, index) => (
                <span key={index} className="bx-spark" style={sparkStyle(spark)} />
              ))}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  )
}

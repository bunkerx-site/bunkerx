import type { CSSProperties } from 'react'
import { STICKER_SIZES, type StickerName } from './sprites'
import './Sticker.css'

export type { StickerName }

/**
 * The named motions a cut-out can be given.
 *
 * Each one is a thing the object would actually do, which is the whole test
 * for whether it belongs here — a cut-out that merely pulses is a glowing
 * rectangle, one that pans reads as a camera. They are part of the system
 * rather than the page because the vocabulary is the brand's: equipment that
 * is powered on and slightly out of true.
 *
 *   `hover`      holds position and drifts. A saucer keeping station.
 *   `orbit`      drifts on one period while its atmosphere brightens on
 *                another, so the loop never becomes countable. A lit planet.
 *   `handheld`   small irregular wander. Something held up to the eye.
 *   `pan`        stepped rotation with a long hold at each end. A camera that
 *                stops to look, rather than a pendulum.
 *   `identify`   a long dim hold, one hard flash, then it settles. A match
 *                being made — and a decision does not fade in, so it steps.
 *   `watch`      does not blink, it dilates: the halo widens and the whole
 *                thing leans a degree, the way something looking at you
 *                shifts without moving.
 *   `sway`       hangs and swings from `origin`. Tape, or a sheet stuck down
 *                by one corner.
 *
 * `orbit`, `identify` and `watch` animate the halo themselves, so they ignore
 * the `halo` prop. Every motion has a resting pose under
 * `prefers-reduced-motion`.
 */
export type StickerMotion = 'hover' | 'orbit' | 'handheld' | 'pan' | 'identify' | 'watch' | 'sway'

/**
 * A static filter under the cut-out.
 *
 *   `lift`      a physical drop shadow. Something stuck onto the surface.
 *   `phosphor`  a green halo. Equipment that is powered on.
 *   `nebula`    a purple halo. Something the nebula is behind.
 *   `beam`      light spilling downward, for a cut-out that emits some.
 */
export type StickerHalo = 'lift' | 'phosphor' | 'nebula' | 'beam'

export type StickerProps = {
  name: StickerName
  /**
   * Any CSS length. `clamp()` is the point — a sticker shrinks with the screen
   * instead of being hidden on it.
   */
  width?: string
  /** 0–1. Most placements sit well under 1 so the sticker stays behind text. */
  opacity?: number
  /**
   * Degrees. A sticker pressed on by hand is never quite straight.
   *
   * Applied through a custom property rather than as a transform, so a motion
   * can vary around it instead of overwriting it. Set the angle and the
   * animation still swings about that angle.
   */
  rotate?: number
  /**
   * A vertical offset as a percentage of the sticker's own height, for a
   * cut-out that has to straddle an edge. `-50%` centres it on the boundary.
   * Motions add their drift to it rather than replacing it.
   */
  lift?: string
  /** `transform-origin`. What `sway` and `pan` rotate about. */
  origin?: string
  motion?: StickerMotion
  halo?: StickerHalo
  /**
   * Loads immediately instead of on approach. Use it only for a sticker inside
   * the first screen — lazily loading something already in view delays it.
   */
  eager?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * One cut-out from the sticker sheet.
 *
 * Each cut-out is its own file rather than a region of a sprite. The stickers
 * touch on the original sheet, so a rectangular window onto it dragged pieces
 * of the neighbours into the frame; they are exported individually, masked to
 * their own shape, with the artwork's pixels untouched.
 *
 * Being an image rather than a background also means it can be lazy — only the
 * stickers a reader actually scrolls to are ever downloaded — and it scales
 * fluidly, which is what lets the same sticker work on a phone and a monitor.
 *
 * Always decorative: empty alt text, hidden from assistive technology, and not
 * interactive. Some cut-outs have words printed on them; those are accents,
 * and anything a reader actually needs is real markup elsewhere.
 */
export function Sticker({
  name,
  width = '100%',
  opacity = 1,
  rotate = 0,
  lift,
  origin,
  motion,
  halo,
  eager = false,
  className,
  style,
}: StickerProps) {
  const [w, h] = STICKER_SIZES[name]
  const placed = rotate !== 0 || lift !== undefined || motion !== undefined

  const classes = [
    'bx-sticker',
    placed && 'bx-sticker--placed',
    motion && `bx-sticker--${motion}`,
    halo && `bx-sticker--halo-${halo}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <img
      className={classes}
      src={`/decor/stickers/${name}.png`}
      alt=""
      aria-hidden="true"
      width={w}
      height={h}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      style={
        {
          width,
          opacity,
          '--bx-sticker-rotate': `${rotate}deg`,
          '--bx-sticker-lift': lift,
          '--bx-sticker-origin': origin,
          ...style,
        } as CSSProperties
      }
    />
  )
}

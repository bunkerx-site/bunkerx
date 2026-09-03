import type { CSSProperties } from 'react'
import { STICKER_SIZES, type StickerName } from './sprites'
import './Sticker.css'

export type { StickerName }

export type StickerProps = {
  name: StickerName
  /**
   * Any CSS length. `clamp()` is the point — a sticker shrinks with the screen
   * instead of being hidden on it.
   */
  width?: string
  /** 0–1. Most placements sit well under 1 so the sticker stays behind text. */
  opacity?: number
  /** Degrees. A sticker pressed on by hand is never quite straight. */
  rotate?: number
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
  eager = false,
  className,
  style,
}: StickerProps) {
  const [w, h] = STICKER_SIZES[name]

  return (
    <img
      className={['bx-sticker', className].filter(Boolean).join(' ')}
      src={`/decor/stickers/${name}.png`}
      alt=""
      aria-hidden="true"
      width={w}
      height={h}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      style={{
        width,
        opacity,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        ...style,
      }}
    />
  )
}

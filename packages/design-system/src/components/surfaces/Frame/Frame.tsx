import type { CSSProperties, HTMLAttributes } from 'react'
import './Frame.css'

export type FrameProps = HTMLAttributes<HTMLDivElement> & {
  src?: string
  /**
   * Empty by default, and that is usually right: a still next to its own title
   * is decorative, and reading the title twice is worse than not reading it.
   * Pass one only when the picture is the sole thing identifying the item.
   */
  alt?: string
  /** Any CSS `aspect-ratio`. Every frame declares one, so a row never jumps. */
  ratio?: string
  /**
   * `cover` crops to fill, `contain` letterboxes.
   *
   * The choice is not cosmetic. Square cover art cropped to 16/9 gets
   * beheaded, so artwork that does not match the frame is letterboxed and the
   * gap is left to read as "there is no still for this one", which is the
   * truth.
   */
  fit?: 'cover' | 'contain'
  /**
   * Lays the tube's own lines over the picture. On for anything that is
   * literally a screen showing something — a video still, a thumbnail.
   */
  scan?: boolean
  /** Adds the phosphor bloom to the hover ring. For a still you can play. */
  glow?: boolean
}

/**
 * A framed picture: fixed ratio, hairline ring, phosphor ring on hover.
 *
 * The hover is not wired to this element. The ring reads two inherited custom
 * properties, and an ancestor — the link around the card, the row the frame
 * sits in — flips them on its own hover. That is what lets hovering an
 * episode's title light up its still without the frame having to know which
 * component it was dropped into.
 */
export function Frame({
  src,
  alt = '',
  ratio = '16 / 9',
  fit = 'cover',
  scan = false,
  glow = false,
  className,
  style,
  children,
  ...rest
}: FrameProps) {
  const classes = [
    'bx-frame',
    fit !== 'cover' && `bx-frame--${fit}`,
    glow && 'bx-frame--glow',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} style={{ aspectRatio: ratio, ...style } as CSSProperties} {...rest}>
      {src ? <img className="bx-frame__img" src={src} alt={alt} loading="lazy" decoding="async" /> : null}
      {children}
      {scan ? <span className="bx-frame__scan" aria-hidden="true" /> : null}
    </div>
  )
}

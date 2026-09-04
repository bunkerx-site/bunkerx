import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { PlatformIcon, type PlatformName } from '../../primitives/PlatformIcon/PlatformIcon'
import './Tile.css'

export type TileProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  /** Draws the platform's mark before the label. */
  icon?: PlatformName
  /**
   * `md` is a plate you aim at in a grid of equals; `sm` is a chip that sits
   * in a row of them under something more important.
   *
   * Both exist because the same six links appear twice on the site: as the
   * whole point of the "where to listen" section, and as a quieter row under
   * the fold's watch button. Same destinations, same component, different
   * rank — which is a size, not a different design.
   */
  size?: 'md' | 'sm'
  external?: boolean
}

/**
 * A destination as a plate you can hit: a mark, a name, nothing else.
 *
 * For a set of equivalent choices where the only information is the name —
 * which podcast app to open the feed in, which social account to follow. There
 * is no description because there is nothing to say: every option does the
 * same thing.
 *
 * The name is always written out, never left to the icon alone. Two of the
 * platforms have no official mark and fall back to a generic waveform, so an
 * icon-only row would leave them as two identical glyphs — and a person who
 * does not recognise a logo is exactly the person the label is for.
 *
 * The ring is inset rather than a border so the tile keeps its size when it
 * thickens on hover.
 */
export function Tile({
  children,
  icon,
  size = 'md',
  external = true,
  className,
  ...rest
}: TileProps) {
  const classes = ['bx-tile', size !== 'md' && `bx-tile--${size}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <a
      className={classes}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      {...rest}
    >
      {icon ? <PlatformIcon name={icon} size={size === 'sm' ? '1.05em' : '1.2em'} /> : null}
      {children}
    </a>
  )
}

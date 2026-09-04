import type { HTMLAttributes, ReactNode } from 'react'
import './Panel.css'

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  tone?: 'signal' | 'flat'
  /** Adds registration ticks at two opposite corners. */
  marked?: boolean
  /**
   * Centres the contents.
   *
   * The one place on the site that is centred, and it earns it: everything
   * else is left aligned and ragged right because that is what keeps long
   * reading comfortable, and this panel is neither long nor reading. It is a
   * single ask with two ways to answer, and centring marks it as the moment
   * the page stops informing and starts asking.
   */
  ask?: boolean
  /**
   * Lets a decoration break the panel's edges.
   *
   * A cut-out contained by the box it decorates reads as an illustration in a
   * frame; one hanging over the edge reads as stuck on afterwards. That means
   * no clipping here, and the band around it has to allow the overflow too.
   */
  overflow?: boolean
}

export function Panel({
  children,
  tone = 'signal',
  marked = false,
  ask = false,
  overflow = false,
  className,
  ...rest
}: PanelProps) {
  const classes = [
    'bx-panel',
    tone !== 'signal' && `bx-panel--${tone}`,
    marked && 'bx-panel--marked',
    ask && 'bx-panel--ask',
    overflow && 'bx-panel--overflow',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}

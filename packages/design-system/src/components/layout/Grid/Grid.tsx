import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import './Grid.css'

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  /**
   * The narrowest a column may get before the grid drops one. Any CSS length.
   *
   * This is the whole control the component offers, because it is the only
   * decision that matters: `25rem` gives two large video stills per row,
   * `17rem` gives the clips more per row without making them unreadable, and
   * `14rem` is a column of links. Column counts are never set directly —
   * `auto-fit` against a minimum is what makes the grid reflow with the type
   * rather than at a breakpoint.
   */
  min?: string
  /** Loose is for things you look at, tight for things you scan. */
  gap?: 'loose' | 'tight'
  /**
   * Fills the row out with empty tracks instead of stretching the last items.
   * Right for a product grid, wrong for two large stills.
   */
  fill?: boolean
}

/**
 * The one grid in the system: equal columns that reflow against a minimum
 * width.
 */
export function Grid({
  children,
  min = '17rem',
  gap = 'loose',
  fill = false,
  className,
  style,
  ...rest
}: GridProps) {
  const classes = [
    'bx-grid',
    gap !== 'loose' && `bx-grid--${gap}`,
    fill && 'bx-grid--fill',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} style={{ '--bx-grid-min': min, ...style } as CSSProperties} {...rest}>
      {children}
    </div>
  )
}

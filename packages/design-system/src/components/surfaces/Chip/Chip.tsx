import type { HTMLAttributes, ReactNode } from 'react'
import './Chip.css'

export type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  /**
   * One element per field. Each direct child becomes a cell, divided from the
   * next by a hairline tick.
   *
   * Children rather than a list of strings, so the caller keeps the semantics:
   * a date belongs in a `<time dateTime>`, and a component that only accepted
   * strings would have thrown that away.
   */
  children: ReactNode
}

/**
 * A short run of facts on one stamped surface.
 *
 * For the two or three things that are true about an item and have no
 * relationship to each other beyond belonging to it — when an episode went out
 * and how long it runs. They are divided by a tick rather than joined by a
 * middle dot, because they are different kinds of fact and a divider says so
 * where punctuation only runs them together.
 *
 * The first field carries the phosphor: in a set like this one fact is the news
 * and the rest are details you check second.
 */
export function Chip({ children, className, ...rest }: ChipProps) {
  return (
    <span className={['bx-chip', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  )
}

import type { ReactNode } from 'react'
import './Stamp.css'

export type StampProps = {
  children: ReactNode
  /**
   * `open` is still being worked on, `closed` is settled.
   *
   * The green is the system's "powered on, still live" colour, so an open case
   * gets it and a closed one recedes to the muted tint. The word is what
   * carries the state; the colour only reinforces it, which is what keeps this
   * legible to anyone who cannot tell the two apart.
   */
  tone?: 'open' | 'closed'
  className?: string
}

/**
 * The state of a case file: a short label saying where an item stands.
 *
 * The first version of this was a rubber stamp — uppercase serif, rotated a
 * few degrees, meant to look pressed on by hand. It was never used once, and
 * the site grew this instead: a plain line of small type, because it sits in
 * the corner of a row that already has a title and an excerpt competing for
 * attention, and a tilted stamp in that corner read as a sticker rather than
 * as a status.
 */
export function Stamp({ children, tone = 'closed', className }: StampProps) {
  return (
    <span className={['bx-stamp', `bx-stamp--${tone}`, className].filter(Boolean).join(' ')}>
      {children}
    </span>
  )
}

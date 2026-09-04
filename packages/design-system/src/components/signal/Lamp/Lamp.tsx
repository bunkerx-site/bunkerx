import type { ReactNode } from 'react'
import './Lamp.css'

export type LampProps = {
  /** What the lamp is reporting. The lamp alone says nothing. */
  children: ReactNode
  /**
   * `on` blinks once every few seconds, the way a console lamp does. `off` is
   * the same dot held dark, for equipment that is powered down.
   */
  state?: 'on' | 'off'
  className?: string
}

/**
 * A console lamp with a line of status beside it.
 *
 * The lamp does not carry the information — the words do. It blinks on a long
 * cycle with one short drop-out, which is what a lamp on real equipment does
 * and what separates "this is live" from a pulsing dot used as decoration. The
 * dot itself is hidden from assistive technology, so nothing is announced
 * twice and nothing is announced only in colour.
 *
 * Holds still under `prefers-reduced-motion`: the state is in the text, so
 * losing the blink loses nothing.
 */
export function Lamp({ children, state = 'on', className }: LampProps) {
  const classes = ['bx-lamp', state === 'off' && 'bx-lamp--off', className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes}>
      <span className="bx-lamp__dot" aria-hidden="true" />
      {children}
    </span>
  )
}

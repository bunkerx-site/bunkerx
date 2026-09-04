import { useEffect, useRef, useState } from 'react'
import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import './Glitch.css'

export type GlitchProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  /** How far the colour channels drift apart. */
  offset?: 'none' | 'nudge' | 'break'
  /** Let the drift widen on hover and focus instead of staying fixed. */
  reactive?: boolean
  /**
   * Arrives out of register and pulls into alignment: a tube warming up and
   * finding its convergence.
   *
   * `true` runs it on first paint, for something already on screen. `"onView"`
   * waits until the element is actually scrolled to — which is what anything
   * below the fold needs, since an animation that plays while off screen has
   * simply been thrown away.
   *
   * One per screen, on the element worth announcing, and only once — it is an
   * event, not a loop. Honours `prefers-reduced-motion` by starting in
   * register.
   */
  settle?: boolean | 'onView'
  as?: ElementType
}

/**
 * Splits text into its green and magenta channels, the way an ageing tube
 * loses convergence between its electron guns.
 *
 * Spend this on one element per view. Applied everywhere it stops reading as
 * a defect and starts reading as decoration.
 */
export function Glitch({
  children,
  offset = 'nudge',
  reactive = false,
  settle = false,
  as: Tag = 'span',
  className,
  ...rest
}: GlitchProps) {
  /*
   * `onView` arms the animation on first intersection and then stops watching.
   * No observer is created for the other two cases, so the common path costs
   * nothing.
   */
  const node = useRef<HTMLElement>(null)
  const [armed, setArmed] = useState(settle === true)

  useEffect(() => {
    if (settle !== 'onView') return
    const el = node.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setArmed(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setArmed(true)
          observer.disconnect()
        }
      },
      /* A little inside the edge, so it does not fire on the row of pixels
         that happens to be peeking. */
      { rootMargin: '-12% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [settle])

  const classes = [
    'bx-glitch',
    offset !== 'none' && `bx-glitch--${offset}`,
    reactive && 'bx-glitch--reactive',
    armed && 'bx-glitch--settle',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag ref={node} className={classes} {...rest}>
      <span className="bx-glitch__ghost bx-glitch__ghost--green" aria-hidden="true">
        {children}
      </span>
      <span className="bx-glitch__ghost bx-glitch__ghost--magenta" aria-hidden="true">
        {children}
      </span>
      <span className="bx-glitch__text">{children}</span>
    </Tag>
  )
}

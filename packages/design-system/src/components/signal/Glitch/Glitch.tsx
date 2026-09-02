import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import './Glitch.css'

export type GlitchProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  /** How far the colour channels drift apart. */
  offset?: 'none' | 'nudge' | 'break'
  /** Let the drift widen on hover and focus instead of staying fixed. */
  reactive?: boolean
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
  as: Tag = 'span',
  className,
  ...rest
}: GlitchProps) {
  const classes = [
    'bx-glitch',
    offset !== 'none' && `bx-glitch--${offset}`,
    reactive && 'bx-glitch--reactive',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={classes} {...rest}>
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

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

/**
 * The three ranks, and what each one is for.
 *
 * `phosphor` is the powered-on control: one per view, on the thing the screen
 * exists to let you do. `outline` is the alternative beside it, or the way
 * onward. `quiet` has no border and no fill, for a link that merely moves the
 * page — it used to be an unstyled anchor, which made it look like a peer of
 * the filled action rather than a rank below it.
 */
export type ButtonVariant = 'phosphor' | 'outline' | 'quiet'

type Common = {
  children: ReactNode
  variant?: ButtonVariant
  /** `sm` is for an action inside a list row, where full size would shout. */
  size?: 'sm' | 'md'
  className?: string
}

/**
 * Anything with an `href` renders an anchor; anything without renders a button.
 *
 * Almost every action on this site goes somewhere — an episode, a platform, a
 * section — and the first version of this component only rendered `<button>`,
 * which is why the site grew its own parallel set of classes and used those
 * instead. A control that navigates has to be a link: middle-click, open in a
 * new tab and "copy link address" are not behaviours a click handler can fake.
 */
export type ButtonProps =
  | (Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
      href?: undefined
      external?: never
    })
  | (Common &
      Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'> & {
        href: string
        /** Opens in a new tab with the safe rel pair. */
        external?: boolean
      })

export function Button({
  children,
  variant = 'phosphor',
  size = 'md',
  className,
  ...rest
}: ButtonProps) {
  const classes = [
    'bx-button',
    `bx-button--${variant}`,
    size !== 'md' && `bx-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (rest.href !== undefined) {
    const { external, ...anchor } = rest
    return (
      <a
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer noopener' : undefined}
        {...anchor}
      >
        {children}
      </a>
    )
  }

  const { type = 'button', ...button } = rest
  return (
    <button className={classes} type={type} {...button}>
      {children}
    </button>
  )
}

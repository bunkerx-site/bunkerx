import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import './Text.css'

export type TextProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg'
  tone?: 'default' | 'mute' | 'accent'
  /** Switches to the monospace face, for machine-emitted values. */
  mono?: boolean
  /** Drops the 68ch measure cap. */
  full?: boolean
  as?: ElementType
}

export function Text({
  children,
  size = 'md',
  tone = 'default',
  mono = false,
  full = false,
  as: Tag = 'p',
  className,
  ...rest
}: TextProps) {
  const classes = [
    'bx-text',
    `bx-text--${size}`,
    tone !== 'default' && `bx-text--${tone}`,
    mono && 'bx-text--mono',
    full && 'bx-text--full',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  )
}

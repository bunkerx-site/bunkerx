import type { ButtonHTMLAttributes } from 'react'
import './Button.css'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** `phosphor` is the powered-on control; there should be one per view. */
  variant?: 'phosphor' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'phosphor',
  size = 'md',
  className,
  type = 'button',
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

  return <button type={type} className={classes} {...rest} />
}

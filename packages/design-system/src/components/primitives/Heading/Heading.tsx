import type { HTMLAttributes, ReactNode } from 'react'
import './Heading.css'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode
  /** Semantic level. Drives the tag, and the size unless `size` overrides it. */
  level?: HeadingLevel
  /** Visual size, when it needs to differ from the semantic level. */
  size?: HeadingLevel
  tone?: 'default' | 'accent'
}

export function Heading({
  children,
  level = 2,
  size,
  tone = 'default',
  className,
  ...rest
}: HeadingProps) {
  const Tag = `h${level}` as const
  const classes = [
    'bx-heading',
    `bx-heading--${size ?? level}`,
    tone !== 'default' && `bx-heading--${tone}`,
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

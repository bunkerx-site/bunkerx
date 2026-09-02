import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import './Stack.css'

type Gap = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16

export type StackProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  direction?: 'column' | 'row'
  /** Matches the spacing scale in tokens.css. */
  gap?: Gap
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'between'
  as?: ElementType
}

export function Stack({
  children,
  direction = 'column',
  gap = 4,
  align,
  justify,
  as: Tag = 'div',
  className,
  ...rest
}: StackProps) {
  const classes = [
    'bx-stack',
    `bx-stack--${direction}`,
    `bx-stack--gap-${gap}`,
    align && `bx-stack--align-${align}`,
    justify && `bx-stack--justify-${justify}`,
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

import type { HTMLAttributes, ReactNode } from 'react'
import './Panel.css'

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  tone?: 'signal' | 'flat'
  /** Adds registration ticks at two opposite corners. */
  marked?: boolean
}

export function Panel({ children, tone = 'signal', marked = false, className, ...rest }: PanelProps) {
  const classes = [
    'bx-panel',
    tone !== 'signal' && `bx-panel--${tone}`,
    marked && 'bx-panel--marked',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}

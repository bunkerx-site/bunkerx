import type { ReactNode } from 'react'
import './Stamp.css'

export type StampProps = {
  children: ReactNode
  tone?: 'classified' | 'verified' | 'archive'
  /** Removes the hand-pressed rotation, for use inline in running text. */
  straight?: boolean
  className?: string
}

/**
 * A short status pressed onto a surface: CLASSIFICADO, INÉDITO, ARQUIVO.
 *
 * This is the one place uppercase is allowed in the system — a stamp is a
 * stamp. Headings and labels elsewhere stay in sentence case.
 */
export function Stamp({ children, tone = 'archive', straight = false, className }: StampProps) {
  const classes = [
    'bx-stamp',
    `bx-stamp--${tone}`,
    straight && 'bx-stamp--straight',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}

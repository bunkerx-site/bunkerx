import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import './Shell.css'

export type ShellProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  /**
   * The reading column: narrower, for anything meant to be read straight
   * through rather than scanned.
   */
  narrow?: boolean
  as?: ElementType
}

/**
 * The content column. One width for the whole site.
 *
 * The gutter is subtracted from the width rather than added as padding, so the
 * column lands in the same place on a section that bleeds edge to edge as on
 * one that does not — which is what lets a full-bleed band and the text inside
 * it share an alignment.
 */
export function Shell({ children, narrow = false, as: Tag = 'div', className, ...rest }: ShellProps) {
  const classes = ['bx-shell', narrow && 'bx-shell--narrow', className].filter(Boolean).join(' ')

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  )
}

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import './Link.css'

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  tone?: 'default' | 'quiet'
  /**
   * Marks the link as leaving the site: opens in a new tab, carries the safe
   * rel pair, and appends a visual cue with a spoken equivalent.
   */
  external?: boolean
}

export function Link({ children, tone = 'default', external = false, className, ...rest }: LinkProps) {
  const classes = ['bx-link', tone !== 'default' && `bx-link--${tone}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <a
      className={classes}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      {...rest}
    >
      {children}
      {external ? (
        <>
          <svg className="bx-link__external" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M4 2h6v6M10 2 2 10" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <span className="bx-visually-hidden"> (abre em nova aba)</span>
        </>
      ) : null}
    </a>
  )
}

import { useEffect, useState } from 'react'
import { useHideOnScroll } from '../hooks/useHideOnScroll'
import { MEMBERSHIP, NAV, SITE } from '../content/site'

export function SiteHeader() {
  const { hidden, atTop } = useHideOnScroll()
  const [open, setOpen] = useState(false)

  // The sheet covers the page, so the page behind it must not scroll, and a
  // hidden bar must never leave an open menu attached to it off-screen.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (hidden) setOpen(false)
  }, [hidden])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const classes = [
    'masthead',
    hidden && !open && 'masthead--hidden',
    !atTop && 'masthead--stuck',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <header className={classes}>
        <div className="shell masthead__inner">
          <a className="masthead__name" href="#topo">
            {SITE.name}
          </a>

          <span className="masthead__slot">
            <span className="masthead__lamp" aria-hidden="true" />
            {SITE.schedule}
          </span>

          <nav className="masthead__nav" aria-label="Principal">
            {NAV.map((item) => (
              <a key={item.href} className="masthead__link" href={item.href}>
                {item.label}
              </a>
            ))}
            <a
              className="masthead__join"
              href={MEMBERSHIP.orelo}
              target="_blank"
              rel="noreferrer noopener"
            >
              Apoiar
            </a>
          </nav>

          <button
            className="masthead__toggle"
            type="button"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? 'Fechar' : 'Menu'}
          </button>
        </div>
      </header>

      {open ? (
        <nav className="menu" id="menu" aria-label="Principal">
          {NAV.map((item) => (
            <a
              key={item.href}
              className="menu__link"
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            className="menu__link menu__join"
            href={MEMBERSHIP.orelo}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => setOpen(false)}
          >
            Apoiar
          </a>
        </nav>
      ) : null}
    </>
  )
}

import { useEffect, useState } from 'react'
import { Lamp, Plate } from '@bunkerx/design-system'
import { useHideOnScroll } from '../hooks/useHideOnScroll'
import { useOverSection } from '../hooks/useOverSection'
import { hash, MEMBERSHIP, NAV, SECTION, SITE } from '../content/site'

/*
 * The one nav target that must not hide the bar.
 *
 * Everywhere else the bar has to clear out so the section starts at the very
 * top of the screen. The top of the page is the one place the bar always
 * belongs — and clicking this while already up there fires no scroll at all,
 * so nothing would ever run the rule that brings it back.
 */
const TOP = hash(SECTION.top)

export function SiteHeader() {
  const { hidden, atTop, hideForJump } = useHideOnScroll()
  /* The cuts band is a phosphor plate and so is this bar. Over it, the bar
     takes the other brand colour — see `.masthead--over`. */
  const overPlate = useOverSection(SECTION.cuts, '.masthead')
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

  /* `raised` is `Plate`'s own edge-once-scrolled, so the site only owns the
     bar's position and its hide-on-scroll. */
  const classes = [
    'masthead',
    hidden && !open && 'masthead--hidden',
    overPlate && !open && 'masthead--over',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <Plate as="header" raised={!atTop} className={classes}>
        <div className="shell masthead__inner">
          <a className="masthead__name" href={hash(SECTION.top)}>
            {SITE.name}
          </a>

          <Lamp className="masthead__slot">{SITE.schedule}</Lamp>

          <nav className="masthead__nav" aria-label="Principal">
            {NAV.map((item) => (
              <a
                key={item.href}
                className="masthead__link"
                href={item.href}
                /* Anchor targets reserve no space above themselves, so the bar
                   has to leave for the section to actually start at the top.
                   See `hideForJump`. */
                onClick={item.href === TOP ? undefined : hideForJump}
              >
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
      </Plate>

      {open ? (
        <Plate as="nav" className="menu" id="menu" aria-label="Principal">
          {NAV.map((item) => (
            <a
              key={item.href}
              className="menu__link"
              href={item.href}
              onClick={() => {
                setOpen(false)
                if (item.href !== TOP) hideForJump()
              }}
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
        </Plate>
      ) : null}
    </>
  )
}

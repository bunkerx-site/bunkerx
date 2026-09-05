import { useEffect, useState } from 'react'
import { Lamp, Plate } from '@bunkerx/design-system'
import { useCurrentSection } from '../hooks/useCurrentSection'
import { useHideOnScroll } from '../hooks/useHideOnScroll'
import { useOverSection } from '../hooks/useOverSection'
import { hash, NAV, SECTION, SITE } from '../content/site'

/*
 * The one nav target that must not hide the bar.
 *
 * Everywhere else the bar has to clear out so the section starts at the very
 * top of the screen. The top of the page is the one place the bar always
 * belongs — and clicking this while already up there fires no scroll at all,
 * so nothing would ever run the rule that brings it back.
 */
const TOP = hash(SECTION.top)

/*
 * Every section the bar can be told it is in.
 *
 * The nav's own targets, plus the membership panel, which has no link in the
 * bar. It is on the list so that scrolling into it clears the marker instead
 * of leaving "Onde ouvir" lit through a section it has nothing to do with —
 * the panel is genuinely not one of the six, and the honest answer there is
 * none of them.
 */
const WATCHED = [...NAV.map((item) => item.href.slice(1)), SECTION.membership]

export function SiteHeader() {
  const { hidden, atTop, hideForJump } = useHideOnScroll()
  /* The cuts and the shop are phosphor plates and so is this bar. Over either
     of them it takes the other brand colour — see `.masthead--over`. */
  const overPlate = useOverSection([SECTION.cuts, SECTION.store], '.masthead')
  /* Which section is under the reading line, so the bar can say where you
     are. Marked with `aria-current`, which is the attribute for exactly this
     — the style hangs off it rather than off a class of its own, so the
     marker and what a screen reader announces can never disagree. */
  const current = useCurrentSection(WATCHED)
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
                aria-current={item.href === hash(current ?? '') ? 'true' : undefined}
                /* Anchor targets reserve no space above themselves, so the bar
                   has to leave for the section to actually start at the top.
                   See `hideForJump`. */
                onClick={item.href === TOP ? undefined : hideForJump}
              >
                {item.label}
              </a>
            ))}
            {/* Down the page, not off it. Orelo and YouTube are both real
                membership routes and the bar can only carry one link, so
                sending it straight to Orelo picked for the reader — and sent
                someone who only wanted to know what "apoiar" buys away from
                the page that says so. The panel makes the case and offers
                both. */}
            <a
              className="masthead__join"
              href={hash(SECTION.membership)}
              onClick={hideForJump}
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
              aria-current={item.href === hash(current ?? '') ? 'true' : undefined}
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
            href={hash(SECTION.membership)}
            onClick={() => {
              setOpen(false)
              hideForJump()
            }}
          >
            Apoiar
          </a>
        </Plate>
      ) : null}
    </>
  )
}

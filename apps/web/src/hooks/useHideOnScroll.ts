import { useCallback, useEffect, useRef, useState } from 'react'

export type HideOnScroll = {
  hidden: boolean
  atTop: boolean
  /**
   * Hides the bar now and holds it hidden until the scroll it triggered has
   * settled. For in-page navigation — see below for why that is necessary.
   */
  hideForJump: () => void
}

/**
 * Hides a fixed header while scrolling down and brings it back on scroll up.
 *
 * Reading is downward, so a header that persists during it is in the way; the
 * moment someone scrolls up they are looking for something, and navigation is
 * the most likely thing. The threshold keeps trackpad jitter and iOS bounce
 * from flickering the bar, and the top of the page always shows it.
 *
 * `hideForJump` exists because anchor navigation breaks that rule. Somebody who
 * has just clicked a nav item is finished with the nav, and the section they
 * asked for should start at the top of the screen — so the page reserves no
 * space for the bar at an anchor target, and the bar has to actually get out of
 * the way for that to be true. Direction cannot decide it: a downward jump
 * hides the bar as a side effect, while an upward one brings it straight back
 * over the top of the section that was just asked for.
 */
export function useHideOnScroll(threshold = 8): HideOnScroll {
  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const lastY = useRef(0)
  const frame = useRef(0)
  /* While a jump is in flight, direction is ignored. */
  const jumping = useRef(false)
  const release = useRef<ReturnType<typeof setTimeout>>(undefined)

  const hideForJump = useCallback(() => {
    jumping.current = true
    setHidden(true)
    // `scrollend` releases the hold, with a timer behind it: the event is not
    // everywhere yet, and a jump to a target already in view fires no scroll
    // at all, so nothing would ever release the hold without the fallback.
    clearTimeout(release.current)
    release.current = setTimeout(() => {
      jumping.current = false
    }, 1200)
  }, [])

  useEffect(() => {
    lastY.current = window.scrollY

    const measure = () => {
      const y = Math.max(0, window.scrollY)
      const delta = y - lastY.current

      setAtTop(y < 24)

      // Above the fold the header is always available — including at the end of
      // a jump to the top of the page, which is why this runs even mid-jump.
      // Below it, direction decides, but only once the movement is deliberate
      // and only when a jump is not holding the bar down.
      if (y < 96) setHidden(false)
      else if (!jumping.current && Math.abs(delta) > threshold) setHidden(delta > 0)

      lastY.current = y
      frame.current = 0
    }

    const onScroll = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(measure)
    }

    const onScrollEnd = () => {
      jumping.current = false
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', onScrollEnd)
    measure()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', onScrollEnd)
      if (frame.current) cancelAnimationFrame(frame.current)
      clearTimeout(release.current)
    }
  }, [threshold])

  return { hidden, atTop, hideForJump }
}

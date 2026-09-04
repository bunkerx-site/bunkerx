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

  /* Re-armed on every scroll frame; fires once the scrolling stops. */
  const quiet = useCallback(() => {
    clearTimeout(release.current)
    release.current = setTimeout(() => {
      jumping.current = false
    }, 160)
  }, [])

  const hideForJump = useCallback(() => {
    jumping.current = true
    setHidden(true)
    /*
     * The hold is released by the scroll going quiet, not by a fixed timer.
     *
     * A timer cannot know how far the jump is: 1200 ms covers a hop to the
     * next section and expires halfway down a long one, and `scrollend` alone
     * is worse — it never fires for a target already on screen, and a
     * programmatic smooth scroll can end the sequence early. Either way the
     * guard lifted mid-scroll and the bar came back.
     *
     * `measure` re-arms this on every frame of scrolling, so it fires 160 ms
     * after the last one, whenever that is. The initial call covers the jump
     * that produces no scroll at all.
     */
    quiet()
  }, [quiet])

  useEffect(() => {
    lastY.current = window.scrollY

    const measure = () => {
      const y = Math.max(0, window.scrollY)
      const delta = y - lastY.current

      setAtTop(y < 24)

      // A jump holds whatever `hideForJump` decided, and nothing else gets a
      // say until the scroll settles.
      //
      // This ordering is the whole fix. With `y < 96` checked first, a jump
      // starting from the top of the page passed through a few frames still
      // inside that threshold, which brought the bar straight back — and the
      // guard below then stopped anything from hiding it again, so it simply
      // stayed. The bug was invisible to a test that scrolled instantly,
      // because instant scrolling never produces those intermediate frames.
      //
      // Otherwise: above the fold the header is always available, and below it
      // direction decides, once the movement is deliberate.
      if (jumping.current) {
        /* Held, and the hold is pushed out for as long as the scroll runs. */
        quiet()
      } else if (y < 96) setHidden(false)
      else if (Math.abs(delta) > threshold) setHidden(delta > 0)

      lastY.current = y
      frame.current = 0
    }

    const onScroll = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(measure)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    measure()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame.current) cancelAnimationFrame(frame.current)
      clearTimeout(release.current)
    }
  }, [threshold, quiet])

  return { hidden, atTop, hideForJump }
}

import { useEffect, useRef, useState } from 'react'

/**
 * Hides a fixed header while scrolling down and brings it back on scroll up.
 *
 * Reading is downward, so a header that persists during it is in the way; the
 * moment someone scrolls up they are looking for something, and navigation is
 * the most likely thing. The threshold keeps trackpad jitter and iOS bounce
 * from flickering the bar, and the top of the page always shows it.
 */
export function useHideOnScroll(threshold = 8): { hidden: boolean; atTop: boolean } {
  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const lastY = useRef(0)
  const frame = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY

    const measure = () => {
      const y = Math.max(0, window.scrollY)
      const delta = y - lastY.current

      setAtTop(y < 24)

      // Above the fold the header is always available; below it, direction
      // decides, but only once the movement is deliberate.
      if (y < 96) setHidden(false)
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
    }
  }, [threshold])

  return { hidden, atTop }
}

import { useEffect, useState } from 'react'

/**
 * Whether a section is currently under the fixed bar.
 *
 * The cuts band is a phosphor plate and so is the masthead, and a green bar
 * over a green section is not a bar. So the masthead takes the other brand
 * colour while it is over that band — which means something has to know when
 * it is, and "when" here is a strip of a few dozen pixels at the top of the
 * screen rather than "is the section visible".
 *
 * An observer rather than a scroll handler: this asks one question about one
 * element, and the browser can answer it without running our code on every
 * frame of every scroll. The root is squeezed down to that top strip by
 * pulling its bottom edge up to just under the bar, so `isIntersecting` is
 * true exactly when the section is behind it.
 *
 * The bar's own height is measured rather than written down. It is set in rem
 * against a fluid type scale, so a number here would be right at one text size
 * and wrong at the next.
 */
export function useOverSection(sectionId: string, barSelector: string): boolean {
  const [over, setOver] = useState(false)

  useEffect(() => {
    const section = document.getElementById(sectionId)
    if (!section) return

    let observer: IntersectionObserver | undefined

    const watch = () => {
      observer?.disconnect()
      const bar = document.querySelector(barSelector)
      const height = bar?.getBoundingClientRect().height ?? 0
      /* A hidden bar has no height, and squeezing the root to nothing would
         answer "no" forever. Nothing is over a bar that is not on screen. */
      if (height <= 0) {
        setOver(false)
        return
      }
      observer = new IntersectionObserver(([entry]) => setOver(entry.isIntersecting), {
        rootMargin: `0px 0px -${Math.max(0, window.innerHeight - height)}px 0px`,
      })
      observer.observe(section)
    }

    watch()
    window.addEventListener('resize', watch)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', watch)
    }
  }, [sectionId, barSelector])

  return over
}

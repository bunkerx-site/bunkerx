import { useEffect, useState } from 'react'

/**
 * Whether any of these sections is currently under the fixed bar.
 *
 * The plates are phosphor green and so is the masthead, and a green bar over a
 * green section is not a bar. So the masthead takes the other brand colour
 * while it is over one — which means something has to know when it is, and
 * "when" here is a strip of a few dozen pixels at the top of the screen rather
 * than "is the section visible".
 *
 * A list rather than one id because there are two plates now, the cuts and the
 * shop, and the bar has the same problem over both. Any of them under the bar
 * is enough; they never overlap, so there is nothing to resolve between them.
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
export function useOverSection(sectionIds: readonly string[], barSelector: string): boolean {
  const [over, setOver] = useState(false)

  /* Joined, so the effect re-runs when the list actually changes rather than
     every time the caller renders a new array literal. */
  const key = sectionIds.join()

  useEffect(() => {
    const sections = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    if (sections.length === 0) return

    let observer: IntersectionObserver | undefined
    const live = new Set<string>()

    const watch = () => {
      observer?.disconnect()
      live.clear()
      const bar = document.querySelector(barSelector)
      const height = bar?.getBoundingClientRect().height ?? 0
      /* A hidden bar has no height, and squeezing the root to nothing would
         answer "no" forever. Nothing is over a bar that is not on screen. */
      if (height <= 0) {
        setOver(false)
        return
      }
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) live.add(entry.target.id)
            else live.delete(entry.target.id)
          }
          setOver(live.size > 0)
        },
        { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - height)}px 0px` },
      )
      for (const section of sections) observer.observe(section)
    }

    watch()
    window.addEventListener('resize', watch)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', watch)
    }
  }, [key, barSelector])

  return over
}

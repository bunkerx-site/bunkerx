import { useEffect, useState } from 'react'

/**
 * Where the reading line is: three tenths of the way down the screen.
 *
 * Not the top edge. A section becomes "the one you are reading" some way after
 * its first pixel arrives — at the top edge every section would light up while
 * it was still a sliver under the bar, and the marker would flicker through
 * three of them on one flick of a trackpad. A third down is roughly where the
 * eye sits, and it is far enough from both edges that a short section still
 * gets its turn.
 */
const LINE = 0.3

/**
 * Which of the given sections the reader is currently in.
 *
 * An observer with a one-percent-tall root rather than a scroll handler. The
 * margins squeeze the viewport down to a band across the reading line, so a
 * section intersects exactly when that line is inside it and the browser can
 * answer without running our code on every frame of every scroll.
 *
 * Sections nest — the whole page is inside `#topo` — so more than one can be
 * live at once, and the answer is the last of them in document order: the
 * innermost, most specific thing the line is inside. That is also what makes
 * the top of the page work, where the only section the line is in is the page
 * itself.
 *
 * Returns `undefined` when the line is in none of them, which is a real state
 * and not a failure: the footer is not a section, and neither is the gap after
 * the last one. Nothing highlighted is the honest answer there.
 */
export function useCurrentSection(ids: readonly string[]): string | undefined {
  const [current, setCurrent] = useState<string>()

  /* Joined, so the effect re-runs when the list of sections actually changes
     rather than every time the caller renders a new array literal. */
  const key = ids.join()

  useEffect(() => {
    const sections = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    if (sections.length === 0) return

    const live = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) live.add(entry.target.id)
          else live.delete(entry.target.id)
        }

        const inside = sections.filter((section) => live.has(section.id))
        setCurrent(inside.at(-1)?.id)
      },
      {
        rootMargin: `-${LINE * 100}% 0px -${(1 - LINE) * 100 - 1}% 0px`,
      },
    )

    for (const section of sections) observer.observe(section)
    return () => observer.disconnect()
  }, [key])

  return current
}

/**
 * How the brand writes dates, durations and money.
 *
 * These live in the design system rather than in the app because they are
 * house style, not application logic: the show is Brazilian, everything it
 * publishes is in pt-BR, and a duration written `1h12min` in one place and
 * `1:12:00` in another is the same inconsistency as two different greens.
 *
 * They were duplicated before this file existed — the episode card carried its
 * own copy of the date format and the duration rule, and it had already
 * drifted from the app's.
 */

const DATE = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const DATE_SHORT = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
const MONEY = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatDate = (iso: string) => DATE.format(new Date(iso))
export const formatDateShort = (iso: string) => DATE_SHORT.format(new Date(iso))
export const formatPrice = (value: number) => MONEY.format(value)

/**
 * `1h12min`, or `47min` under the hour.
 *
 * Returns undefined for a missing or zero length, so a caller can leave the
 * slot out entirely rather than printing `0min` — a feed that did not say how
 * long an episode is should not be reported as an episode of no length.
 */
export function formatDuration(seconds?: number): string | undefined {
  if (!seconds) return undefined
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  return hours > 0 ? `${hours}h${String(minutes).padStart(2, '0')}` : `${minutes}min`
}

/**
 * Day and month as a stamped mark: `28.08`.
 *
 * This is the log's anchor in place of an episode number, which cannot be
 * trusted: the feed leaves its most recent entries unnumbered and interleaves
 * two seasons with overlapping numbering. The date is the one identifier every
 * entry actually has.
 */
export function formatStampDate(iso: string): string {
  const date = new Date(iso)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}`
}

/** Cuts a summary at a word boundary, so nothing ever ends mid-word. */
export function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text
  const cut = text.slice(0, limit)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

const DATE = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const DATE_SHORT = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
const MONEY = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatDate = (iso: string) => DATE.format(new Date(iso))
export const formatDateShort = (iso: string) => DATE_SHORT.format(new Date(iso))
export const formatPrice = (value: number) => MONEY.format(value)

export function formatDuration(seconds?: number): string | undefined {
  if (!seconds) return undefined
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  return hours > 0 ? `${hours}h${String(minutes).padStart(2, '0')}` : `${minutes}min`
}

/** Cuts a summary at a word boundary so cards never end mid-word. */
export function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text
  const cut = text.slice(0, limit)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

/**
 * Day and month as a stamped mark: "28.08". Used as the visual anchor on
 * podcast cards, where the episode number cannot be trusted — the feed leaves
 * the 13 most recent entries unnumbered and interleaves two seasons with
 * overlapping numbering.
 */
export function formatStampDate(iso: string): string {
  const date = new Date(iso)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}`
}

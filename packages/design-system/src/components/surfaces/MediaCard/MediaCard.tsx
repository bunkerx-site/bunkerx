import type { ReactNode } from 'react'
import { Frame } from '../Frame/Frame'
import './MediaCard.css'

export type MediaCardProps = {
  href: string
  /** Opens in a new tab with the safe rel pair. */
  external?: boolean
  title: string
  /**
   * `display` for something to watch or read — a title in the serif reads as
   * an item with a name. `body` for a catalogue entry, where the name is a
   * label on a thing rather than a headline.
   */
  face?: 'display' | 'body'
  summary?: string
  /** The line under the title: a date, a price, a duration. */
  note?: ReactNode
  noteTone?: 'mute' | 'accent'
  src: string
  /** Frame ratio: `16 / 9` for a still, `1` for cover art or a product. */
  ratio?: string
  /** Lays scanlines over the picture. On for a video still. */
  scan?: boolean
  glow?: boolean
  /** Alt text for the picture, when the picture is what identifies the item. */
  alt?: string
  className?: string
}

/**
 * A framed picture with a caption under it, the whole thing one link.
 *
 * The card is deliberately thin — a frame, a title, at most two lines of
 * support. Anything longer belongs in a log row, where the summary has room to
 * be read; the point of a card is that you can take it in without reading it.
 *
 * The entire card is the link, so the still, the title and the date are all
 * the same target. A separate link on the title would give a reader two ways
 * to reach one place and make the picture look inert.
 */
export function MediaCard({
  href,
  external = true,
  title,
  face = 'display',
  summary,
  note,
  noteTone = 'mute',
  src,
  ratio = '16 / 9',
  scan = false,
  glow = false,
  alt,
  className,
}: MediaCardProps) {
  return (
    <a
      className={['bx-media', className].filter(Boolean).join(' ')}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
    >
      <Frame src={src} alt={alt} ratio={ratio} scan={scan} glow={glow} />

      <h3 className={`bx-media__title bx-media__title--${face}`}>{title}</h3>
      {summary ? <p className="bx-media__summary">{summary}</p> : null}
      {note ? <span className={`bx-media__note bx-media__note--${noteTone}`}>{note}</span> : null}
    </a>
  )
}

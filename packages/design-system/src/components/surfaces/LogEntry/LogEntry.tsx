import type { ReactNode } from 'react'
import { Frame } from '../Frame/Frame'
import { formatDuration, formatStampDate } from '../../../lib/format'
import './LogEntry.css'

export type LogProps = {
  children: ReactNode
  className?: string
}

/**
 * The container for a run of log entries. Draws the rule above the first one,
 * which each entry's own bottom rule then continues.
 */
export function Log({ children, className }: LogProps) {
  return <div className={['bx-log', className].filter(Boolean).join(' ')}>{children}</div>
}

export type LogEntryProps = {
  title: string
  /** Where the title points. */
  href: string
  /**
   * Where the still points, when it is somewhere else — the episode page for
   * the title, the video for the picture. Defaults to `href`.
   */
  artHref?: string
  summary?: string
  /** ISO 8601, as it arrives from the feed. */
  publishedAt: string
  /** Length in seconds, as it arrives from the feed. */
  durationSeconds?: number
  artwork?: string
  /**
   * Whether the artwork is already the frame's shape.
   *
   * A matched episode brings a 16/9 still, which fills the frame. The rest
   * fall back to square cover art, which is letterboxed instead — cropping a
   * centred decal to a landscape frame beheads it.
   */
  artworkFits?: boolean
  className?: string
}

/**
 * One row of the archive.
 *
 * A weekly show's back catalogue is a log, so it is set as one: full-width
 * rows with the date hanging in the margin. A grid of equal cards was the
 * first attempt and it made this week's episode look the same size as one from
 * three years ago, while squeezing every synopsis down to a line and a half.
 * Rows give the title room and let the summary be read.
 *
 * The still is a link but is taken out of the tab order and hidden from
 * assistive technology: it points at the same place as the title above it, and
 * a second stop on the same destination is noise to anyone not using a mouse.
 */
export function LogEntry({
  title,
  href,
  artHref,
  summary,
  publishedAt,
  durationSeconds,
  artwork,
  artworkFits = true,
  className,
}: LogEntryProps) {
  const duration = formatDuration(durationSeconds)
  const year = new Date(publishedAt).getFullYear()

  return (
    <article className={['bx-log__entry', 'bx-hoverable', className].filter(Boolean).join(' ')}>
      {artwork ? (
        <a
          className="bx-log__art"
          href={artHref ?? href}
          target="_blank"
          rel="noreferrer noopener"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Frame src={artwork} fit={artworkFits ? 'cover' : 'contain'} scan />
        </a>
      ) : null}

      <div className="bx-log__date">
        {formatStampDate(publishedAt)}
        <span className="bx-log__year">{year}</span>
      </div>

      <div className="bx-log__body">
        <h3 className="bx-log__title">
          <a href={href} target="_blank" rel="noreferrer noopener">
            {title}
          </a>
        </h3>
        {summary ? <p className="bx-log__summary">{summary}</p> : null}
      </div>

      {duration ? <div className="bx-log__duration">{duration}</div> : null}
    </article>
  )
}

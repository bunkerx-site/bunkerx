import { useId, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Seam } from '../../layout/Seam/Seam'
import { Chip } from '../Chip/Chip'
import { Frame } from '../Frame/Frame'
import { formatDate, formatDuration } from '../../../lib/format'
import './LogEntry.css'

export type LogProps = {
  children: ReactNode
  className?: string
}

/**
 * The container for a run of log entries. Each entry draws its own seam at its
 * top edge, so the container needs no rule of its own.
 */
export function Log({ children, className }: LogProps) {
  return <div className={['bx-log', className].filter(Boolean).join(' ')}>{children}</div>
}

export type LogEntryProps = {
  title: string
  /** Where the title and the still both point. */
  href: string
  summary?: string
  /** ISO 8601, as it arrives from the feed. */
  publishedAt: string
  /** Length in seconds, as it arrives from the feed. */
  durationSeconds?: number
  artwork?: string
  /**
   * Whether the artwork is already the frame's shape.
   *
   * An episode matched to a video brings a 16/9 still, which fills the frame.
   * The rest fall back to square cover art, which is letterboxed instead —
   * cropping a centred decal to a landscape frame beheads it.
   */
  artworkFits?: boolean
  /**
   * Extra fields for the meta chip, after the date and the length.
   *
   * A slot for the same reason `actions` is one: which facts a row has is the
   * caller's knowledge. An episode has a date and a running time and that is
   * all the feed gives; a clip scraped from its watch page also has a view
   * count, and a season number would be a third. Each `<span>` becomes a
   * field, divided from its neighbour by the chip's own rule.
   */
  meta?: ReactNode
  /**
   * The ways into this item. A slot rather than a set of props, because which
   * ones exist is the caller's knowledge: an episode with no matching upload
   * has nothing to watch, and only the caller knows that.
   */
  actions?: ReactNode
  /**
   * How many lines of summary to show before the reader asks for the rest.
   * Two keeps a row scannable; the whole point of collapsing is that it buys
   * the still its size.
   */
  clamp?: number
  className?: string
}

/**
 * One episode in the archive.
 *
 * An episode is one thing with two carriers — it goes out as a video and as a
 * podcast on the same day — so this is one row with both ways in, rather than
 * the same episode listed once in a video grid and again in an audio log.
 *
 * Still a log and not a grid of cards: rows divided by rules, so the section
 * reads as an archive you scan down. Equal cards were the first attempt and
 * they made this week's episode look the same size as one from three years
 * ago while squeezing every synopsis to a line and a half.
 *
 * The collapsed summary is what makes a still this large affordable. Six rows
 * with a full synopsis each is a wall of text; two lines and a way to ask for
 * more keeps the row scannable and gives the picture room to be worth looking
 * at.
 */
export function LogEntry({
  title,
  href,
  summary,
  publishedAt,
  durationSeconds,
  artwork,
  artworkFits = true,
  meta,
  actions,
  clamp = 2,
  className,
}: LogEntryProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const duration = formatDuration(durationSeconds)

  return (
    <article className={['bx-log__entry', className].filter(Boolean).join(' ')}>
      {/*
        The same burst that marks a change of section, at the scale of a change
        of item. Between two episodes the subject genuinely does change, which
        is what a seam is for — a plain hairline said only "another row".
      */}
      <Seam size="sm" className="bx-log__seam" />

      {artwork ? (
        /* The still is a link but is taken out of the tab order and hidden from
           assistive technology: it points where the title above it points, and
           a second stop on the same destination is noise to anyone not using a
           mouse. `bx-hoverable` is what lights its ring when the row is
           hovered — see Frame.css. */
        <a
          className="bx-log__art bx-hoverable"
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Frame src={artwork} fit={artworkFits ? 'cover' : 'contain'} scan glow />
        </a>
      ) : null}

      <div className="bx-log__body">
        <h3 className="bx-log__title">
          <a href={href} target="_blank" rel="noreferrer noopener">
            {title}
          </a>
        </h3>

        <Chip className="bx-log__meta">
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          {duration ? <span>{duration}</span> : null}
          {meta}
        </Chip>

        {summary ? (
          <div className="bx-log__synopsis">
            <p
              className={`bx-log__summary${open ? '' : ' bx-log__summary--clamped'}`}
              id={id}
              style={
                open ? undefined : ({ '--bx-clamp-lines': clamp } as CSSProperties)
              }
            >
              {summary}
            </p>
            {/*
              A button, not a link: it changes what is on the screen rather than
              going anywhere. `aria-expanded` and `aria-controls` are what make
              that legible to a screen reader, and the label names the state it
              moves to rather than the state it is in.
            */}
            <button
              className="bx-log__more"
              type="button"
              aria-expanded={open}
              aria-controls={id}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? 'Ver menos' : 'Ver mais'}
            </button>
          </div>
        ) : null}

        {actions ? <div className="bx-log__actions">{actions}</div> : null}
      </div>
    </article>
  )
}

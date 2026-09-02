import './EpisodeCard.css'

export type EpisodePlatform = {
  /** Shown verbatim, so keep it to a word: Spotify, YouTube, Apple. */
  label: string
  href: string
}

export type EpisodeCardProps = {
  number?: number
  title: string
  href: string
  summary?: string
  /** ISO 8601 date string, as it arrives from the podcast feed. */
  publishedAt?: string
  /** Episode length in seconds, as it arrives from the feed. */
  durationSeconds?: number
  artworkUrl?: string
  platforms?: EpisodePlatform[]
}

const DATE_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  return hours > 0 ? `${hours}h${String(minutes).padStart(2, '0')}` : `${minutes}min`
}

export function EpisodeCard({
  number,
  title,
  href,
  summary,
  publishedAt,
  durationSeconds,
  artworkUrl,
  platforms = [],
}: EpisodeCardProps) {
  return (
    <article className="bx-episode">
      <div className="bx-episode__art">
        {artworkUrl ? <img src={artworkUrl} alt="" loading="lazy" /> : null}
      </div>

      <div className="bx-episode__body">
        {number !== undefined ? (
          <div className="bx-episode__number">nº {String(number).padStart(3, '0')}</div>
        ) : null}

        <h3 className="bx-episode__title">
          <a href={href}>{title}</a>
        </h3>

        {summary ? <p className="bx-episode__summary">{summary}</p> : null}

        <div className="bx-episode__meta">
          {publishedAt ? (
            <time dateTime={publishedAt}>{DATE_FORMAT.format(new Date(publishedAt))}</time>
          ) : null}
          {durationSeconds ? <span>{formatDuration(durationSeconds)}</span> : null}
          {platforms.length > 0 ? (
            <span className="bx-episode__platforms">
              {platforms.map((platform) => (
                <a
                  key={platform.label}
                  className="bx-episode__platform"
                  href={platform.href}
                  rel="noreferrer"
                >
                  {platform.label}
                </a>
              ))}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

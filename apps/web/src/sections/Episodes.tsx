import { Block } from './Block'
import { formatDuration, formatStampDate, truncate } from '../lib/format'
import type { Episode } from '../lib/types'

/**
 * The archive of a weekly show is a log, so it is set as one.
 *
 * A grid of equal cards would have made this week's episode look the same size
 * as one from 2023, and it forced every synopsis down to a line and a half.
 * Rows give the title room and let the summary be read.
 */
export function Episodes({ episodes }: { episodes: Episode[] }) {
  return (
    <Block
      id="episodios"
      title="Episódios"
      tone="deep"
      lead="O programa completo, toda segunda. Aqui estão os mais recentes; o arquivo inteiro está nas plataformas."
      more={
        <a
          className="fold__action fold__action--ghost"
          href="https://open.spotify.com/show/1YOCI7QdvUloo4VopSr7qm"
          target="_blank"
          rel="noreferrer noopener"
        >
          Ouvir o arquivo completo
        </a>
      }
    >
      <div className="log">
        {episodes.slice(0, 6).map((episode) => {
          const duration = formatDuration(episode.durationSeconds)
          return (
            <article className="entry" key={episode.id}>
              {/* The YouTube thumbnail when the episode was matched to one,
                  otherwise the episode's own cover. Both are per-episode art;
                  the video one is simply made with more care. */}
              <a
                className="entry__art"
                href={episode.videoUrl ?? episode.url}
                target="_blank"
                rel="noreferrer noopener"
                tabIndex={-1}
                aria-hidden="true"
              >
                <img
                  src={episode.thumbnail ?? episode.image}
                  alt=""
                  loading="lazy"
                  className={episode.thumbnail ? 'entry__img' : 'entry__img entry__img--square'}
                />
                <span className="clip__scan" aria-hidden="true" />
              </a>

              <div className="entry__date">
                {formatStampDate(episode.publishedAt)}
                <span className="entry__year">{new Date(episode.publishedAt).getFullYear()}</span>
              </div>

              <div>
                <h3 className="entry__title">
                  <a href={episode.url} target="_blank" rel="noreferrer noopener">
                    {episode.title}
                  </a>
                </h3>
                {episode.summary ? (
                  <p className="entry__summary">{truncate(episode.summary, 240)}</p>
                ) : null}
              </div>

              {duration ? <div className="entry__duration">{duration}</div> : null}
            </article>
          )
        })}
      </div>
    </Block>
  )
}

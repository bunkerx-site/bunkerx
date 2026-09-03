import { Static, Sticker } from '@bunkerx/design-system'
import { SITE } from '../content/site'
import { formatDate, formatDuration, truncate } from '../lib/format'
import type { Episode } from '../lib/types'

/**
 * The first fold does not introduce the site — it acquires the signal.
 *
 * The newest episode fills the screen and locks in on load. That is the single
 * orchestrated moment on the page; nothing else animates on its own. Someone
 * arriving already knows what Bunker X is, so the screen spends itself on the
 * one thing they do not know yet.
 *
 * Because this episode is the whole fold, the log below starts at the second
 * one — repeating it there would make the top of the page say the same thing
 * twice.
 *
 * The snow is confined to this section and dissolves before it ends: the
 * signal is acquired once, at the top. Carried down the whole page it stops
 * being an event and becomes wallpaper.
 */
export function Fold({ episode }: { episode: Episode }) {
  const duration = formatDuration(episode.durationSeconds)

  return (
    <section className="fold">
      <div className="fold__noise" aria-hidden="true">
        <Static intensity={0.05} fps={14} grain={3} />
      </div>

      {/* The abducting saucer sits in the half of the fold the headline does
          not use. The tilt is not passed as a prop here: the hover animation
          owns the transform, so the angle lives in its keyframes instead. */}
      <Sticker
        name="ufo-beam"
        width="clamp(13rem, 40vw, 38rem)"
        opacity={0.85}
        eager
        className="fold__ufo"
      />

      <div className="shell fold__inner">
        {/* The h1 names the show; the episode is an h2 under it. A visitor sees
            the episode first, and a crawler still gets the site's identity. */}
        <h1 className="fold__site">
          <strong>{SITE.name}</strong> — {SITE.tagline.toLowerCase()}. {SITE.schedule}.
        </h1>

        <div className="fold__lock">
          <span className="fold__slug">
            No ar desde{' '}
            <time dateTime={episode.publishedAt}>{formatDate(episode.publishedAt)}</time>
            {duration ? ` · ${duration}` : ''}
          </span>

          <h2 className="fold__title">{episode.title}</h2>

          {episode.summary ? (
            <p className="fold__summary">{truncate(episode.summary, 240)}</p>
          ) : null}

          <div className="fold__actions">
            <a
              className="fold__action fold__action--primary"
              href={episode.videoUrl ?? episode.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              {episode.videoUrl ? 'Assistir agora' : 'Ouvir agora'}
            </a>
            <a className="fold__action fold__action--ghost" href="#episodios">
              Ver os episódios
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

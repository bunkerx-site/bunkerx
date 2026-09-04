import { useEffect, useState } from 'react'
import { Band, Button, Log, LogEntry, PlatformIcon, Tile, truncate } from '@bunkerx/design-system'
import { CHANNELS, hash, PLATFORMS, SECTION } from '../content/site'
import type { Episode } from '../lib/types'

/* The podcast apps only: the video has its own button on every row. */
const LISTEN = PLATFORMS.filter((platform) => platform.icon !== 'youtube')
const BATCH = 8

/**
 * The archive: one section for the whole programme, both carriers.
 *
 * There used to be an "Episódios" log and a "Vídeos" grid, and of the fifteen
 * uploads on the main channel eleven were episodes already in the log. The
 * split asked a reader to decide which listing to look in for the same thing,
 * and the answer was "either" — an episode goes out as a video and as a
 * podcast on the same day. One row now carries both ways in.
 *
 * The buttons are the fold's, one rank down. In the fold there is a single
 * episode and one filled action; here there are six episodes and none of them
 * is *the* action, so nothing is filled — six filled buttons on one screen
 * would flatten the fold's primary along with everything else.
 *
 * The whole archive is here, eight at a time. It is not in the initial bundle:
 * the full feed is 170 KB of JSON for 174 episodes, which is about half the
 * page's JavaScript again, spent on rows most visitors never page to. The
 * section renders the handful it was handed and pulls the rest in as its own
 * chunk after first paint, so the first eight cost nothing extra.
 *
 * It grows on request rather than paging or loading itself. Pages were the
 * first answer and they were wrong for an archive read downward: paging throws
 * away everything the reader has already passed in order to show eight more.
 * Growing on scroll was the second, and it is worse for anyone using a
 * keyboard or a screen reader — whatever follows the list keeps receding as
 * they approach it. A button asks, and the count on it says how much is left,
 * which is the one thing pagination told them that they could not otherwise
 * see.
 *
 * One caveat worth knowing about. Spotify is the only aggregator the feed
 * gives a per-episode address for, so its chip opens this episode; Apple and
 * Amazon have no per-episode link anywhere in the data and open the show,
 * where the listener picks it up from the episode list. Fixing that properly
 * means resolving episode ids in scripts/fetch-feeds.mjs — Apple's lookup API
 * can do it, Amazon has no public one.
 */
export function Episodes({ episodes }: { episodes: Episode[] }) {
  const [all, setAll] = useState(episodes)
  const [shownCount, setShownCount] = useState(BATCH)

  useEffect(() => {
    let live = true
    import('../data/episodes.json')
      .then((module) => {
        const full = (module.default as Episode[]).slice(1)
        // Guard against the archive arriving shorter than what we were handed,
        // which would drop rows already on screen.
        if (live && full.length > episodes.length) setAll(full)
      })
      .catch(() => {
        /* Page one is already rendered from the props; without the archive the
           pager simply never appears. Nothing to recover from. */
      })
    return () => {
      live = false
    }
  }, [episodes.length])

  const shown = all.slice(0, shownCount)
  const remaining = all.length - shown.length


  return (
    <Band
      id={SECTION.episodes}
      title="Episódios"
      tone="deep"
      /* No seam above this one: the fold's own carrier burst sits a couple of
         hundred pixels up, and two bursts that close together read as a
         pattern rather than as punctuation. */
      seam={false}
      tight
      glitch
      sticker="earth"
      /* Larger, and pushed down so it crosses the first row. The globe is the
         section's subject rather than a label on it — a cut-out that stops
         politely at the header's edge reads as an icon, one that overlaps what
         follows reads as something in the room. */
      stickerWidth="clamp(10rem, 28vw, 26rem)"
      stickerLift="42%"
      stickerMotion="orbit"
      lead="O programa completo, toda segunda — no vídeo e no áudio. Aqui estão os mais recentes; o arquivo inteiro está nas plataformas."
      more={
        <div className="episodes__more">
          <Button variant="outline" href={CHANNELS.youtube} external>
            <PlatformIcon name="youtube" size="1.15em" />
            Ver o canal no YouTube
          </Button>
          <Button variant="outline" href={CHANNELS.spotifyShow} external>
            <PlatformIcon name="spotify" size="1.15em" />
            Ouvir o arquivo completo
          </Button>
          {/* Every row offers three apps; this is for the reader who wants the
              whole list and the feed itself. It stays on the page rather than
              leaving it, which is why it is the quiet rank of the three. */}
          <Button variant="quiet" href={hash(SECTION.listen)}>
            Ver todas as plataformas
          </Button>
        </div>
      }
    >
      <Log>
        {shown.map((episode) => (
          <LogEntry
            key={episode.id}
            title={episode.title}
            /* The title points at whichever carrier this episode actually has,
               preferring the video: it is the richer of the two, and the one
               someone arriving from the thumbnail is expecting. */
            href={episode.videoUrl ?? episode.url}
            summary={episode.summary ? truncate(episode.summary, 900) : undefined}
            publishedAt={episode.publishedAt}
            durationSeconds={episode.durationSeconds}
            artwork={episode.thumbnail ?? episode.image}
            artworkFits={Boolean(episode.thumbnail)}
            actions={
              <>
                {episode.videoUrl ? (
                  <Button variant="outline" size="sm" href={episode.videoUrl} external>
                    <PlatformIcon name="youtube" size="1.1em" />
                    Assistir
                  </Button>
                ) : null}

                {/* The podcast apps, as chips — the same set and the same
                    component as the fold, so the two rows of actions on this
                    page read as one vocabulary. YouTube is left out: it is the
                    Assistir button beside them. */}
                {LISTEN.map((platform) => (
                  <Tile
                    key={platform.label}
                    size="sm"
                    icon={platform.icon}
                    /* Spotify is the one with a real per-episode address. */
                    href={platform.icon === 'spotify' ? episode.url : platform.href}
                  >
                    {platform.label}
                  </Tile>
                ))}
              </>
            }
          />
        ))}
      </Log>

      {/*
        The button centred, and the tally under it rather than inside it.
        Pressing "Carregar mais" and reading "8 de 174" are two different jobs:
        one is a control, the other is a readout, and a number tucked inside a
        label reads as part of what the button will do.
      */}
      <div className="episodes__grow">
        {remaining > 0 ? (
          <Button variant="outline" onClick={() => setShownCount((count) => count + BATCH)}>
            Carregar mais
          </Button>
        ) : null}

        <p className="episodes__tally" aria-live="polite">
          {shown.length} <span>de</span> {all.length} episódios
        </p>
      </div>
    </Band>
  )
}

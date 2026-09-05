import { useEffect, useState } from 'react'
import { Band, Button, Log, LogEntry, PlatformIcon, Tile } from '@bunkerx/design-system'
import { Pager } from '../components/Pager'
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
      className="archive"
      title="Episódios"
      tone="deep"
      /* No seam above this one: the fold's own carrier burst sits a couple of
         hundred pixels up, and two bursts that close together read as a
         pattern rather than as punctuation. */
      seam={false}
      tight
      glitch
      sticker="earth"
      /*
        The globe is the section's subject rather than a label on it, so it is
        larger than the default cut-out and it is allowed to reach past the
        header into the first row.

        Both the size and the reach live in `.archive` rather than here: at
        26rem the globe was taller than the two lines it stands beside by some
        280px, and because a cut-out is a real cell of the header row, all of
        that became empty band between the lead and the first episode. The
        picture floated in the middle of it, level with nothing. Its box is
        held to the header's own height in CSS instead, and the overhang is
        what bleeds — which is the effect the lift was reaching for by pushing
        a full-height box down and leaving the hole behind it.
      */
      stickerWidth="var(--archive-globe)"
      stickerMotion="orbit"
      /* Says what the section is, and stops there. It used to end with "o
         arquivo inteiro está nas plataformas", which is a pointer at a footer
         eight rows below it — the footer says that itself now, where a reader
         who has reached the end of the list can act on it. */
      lead="Um caso por semana, investigado até o fim. Toda segunda às 20h, em vídeo e em áudio."
      more={
        <div className="cta">
          <p className="cta__pitch">
            O arquivo inteiro está no canal e nos apps de podcast. Siga por lá e o episódio novo
            chega sem você procurar.
          </p>

          {/* The two carriers, as a pair. Neither is filled: the fold keeps
              the page's one filled action. */}
          <div className="cta__ways">
            <Button variant="outline" href={CHANNELS.youtube} external>
              <PlatformIcon name="youtube" size="1.15em" />
              Ver o canal no YouTube
            </Button>
            {/* Named for where it goes, not for what is there. "Ouvir o
                arquivo completo" said neither, and the line above the row now
                covers the "completo" part for both carriers at once. */}
            <Button variant="outline" href={CHANNELS.spotifyShow} external>
              <PlatformIcon name="spotify" size="1.15em" />
              Ouvir no Spotify
            </Button>
          </div>

          {/*
            Every row offers three apps; this is for the reader who wants the
            whole list and the feed itself.

            On its own line under the pair, and one size down. It is the only
            one of the three that stays on the page rather than leaving it, so
            it is not a peer of the two carriers — but it is doing the same
            kind of job, and as a bare underlined link beside two pills it read
            as a footnote someone forgot to style.
          */}
          <Button variant="outline" size="sm" href={hash(SECTION.listen)}>
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
            /* Whole, not truncated. The row shows two lines and "Ver mais"
               reveals the rest, so a cut here only meant the disclosure ran
               out mid-sentence — which it did on 130 of the 175 synopses once
               the feed script stopped capping them at 400 characters. */
            summary={episode.summary || undefined}
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

      <Pager
        shown={shown.length}
        total={all.length}
        noun="episódios"
        onMore={remaining > 0 ? () => setShownCount((count) => count + BATCH) : undefined}
      />
    </Band>
  )
}

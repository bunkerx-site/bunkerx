import type { CSSProperties } from 'react'
import { ABDUCTIONS, Button, formatDate, formatDuration, Glitch, Icon, PlatformIcon, Scene, Static, Tile, truncate } from '@bunkerx/design-system'
import { hash, PLATFORMS, SECTION, SITE } from '../content/site'
import type { Episode } from '../lib/types'

/**
 * How much the headline gives up so the fold still fits one screen.
 *
 * The title is the tallest thing on the fold and its length is not ours to
 * choose: "Os OVNIS que cruzaram a LUA" is 27 characters and "O Gigante de
 * Kandahar: Soldados Americanos Enfrentaram um NEPHILIM?" is 67. At one fixed
 * size the second ran to five lines and pushed the watch button and the two
 * links below it clean off the bottom of the screen — every episode changes
 * the headline, so this cannot be a constant.
 *
 * Derived from the length rather than measured. Measuring means painting the
 * title at the wrong size, reading it back and reflowing, which is a visible
 * jump on the one element the page's load sequence is built around.
 *
 * FULL is the longest title that still gets the full size — about two lines at
 * the widths this column actually gets. The floor is where shrinking stops
 * being worth it: below it the headline is competing with the body copy, and
 * the right answer for a title that long is fewer words, not smaller type.
 */
const FULL = 34
const FLOOR = 0.6

const titleFit = (title: string) =>
  Math.max(FLOOR, Math.min(1, FULL / Math.max(title.length, 1))).toFixed(3)

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

      <div className="shell fold__inner">
        <div className="fold__copy">
          {/*
            The station identification.

            This h1 is not the headline of the screen — the episode below it is.
            What it does is say which station you are tuned to and when it
            transmits, which is exactly what a broadcast says about itself
            between programmes: call sign, slogan, schedule.

            The call sign carries the misconvergence, and it is the only place
            on the site that does. The design system calls that "the system's
            emphasis mechanism, standing in for one accent colour" and asks for
            one per screen; the one string that *is* the brand is where it
            belongs. It arrives out of register and pulls into alignment, then
            the programme locks in underneath — one sequence, in the order a
            transmission actually starts.
          */}
          <h1 className="ident">
            <Glitch as="span" offset="nudge" settle className="ident__sign">
              {SITE.name}
            </Glitch>
            {/* Stacked, not run on. Inline, the call sign's display face and
                the body type beside it sat on the same line at different sizes,
                which left the baseline lumpy and wrapped the schedule onto a
                line of its own anyway. Two deliberate lines beat three
                accidental ones. */}
            <span className="ident__says">
              {SITE.tagline}. {SITE.schedule}.
            </span>
          </h1>

          <div className="fold__lock">
            {/* The fit factor rides in as a custom property so the sizing
                stays in the stylesheet — the component supplies the one thing
                CSS cannot know, which is how long this week's title is. */}
            <h2
              className="fold__title"
              style={{ '--fold-title-fit': titleFit(episode.title) } as CSSProperties}
            >
              {episode.title}
            </h2>

            {/*
              Under the title, not above it.

              Above, it was the first thing read on the screen — and when an
              episode went out is not what anyone came for. Below, the title
              lands first and the two facts about it follow: two fields, not a
              sentence. "No ar desde" was framing that the date says already.
            */}
            <span className="stamp-chip">
              <time className="stamp-chip__field" dateTime={episode.publishedAt}>
                {formatDate(episode.publishedAt)}
              </time>
              {duration ? <span className="stamp-chip__field">{duration}</span> : null}
            </span>

            {episode.summary ? (
              <p className="fold__summary">{truncate(episode.summary, 240)}</p>
            ) : null}

            {/*
              Watch goes to the video; the places to listen sit under it, all on
              screen rather than behind a disclosure.

              A dropdown made the reader click once just to find out what the
              options were, for four short names that fit on one line. The chips
              are a rank below the filled button in size and in ring weight,
              which is what keeps five links from reading as five equal
              actions.

              When an episode has no matching upload there is nothing to watch,
              so the watch button is simply absent.
            */}
            <div className="fold__actions">
              {episode.videoUrl ? (
                <Button variant="phosphor" href={episode.videoUrl} external>
                  <PlatformIcon name="youtube" size="1.15em" />
                  Assistir no YouTube
                </Button>
              ) : null}
            </div>

            {/*
              The podcast apps only. YouTube is the filled button above — the
              same word appeared twice within thirty pixels, once pointing at
              this episode's video and once at the channel, which made the
              loudest element on the screen and a quiet chip look like the same
              offer. The split now reads cleanly: watch on YouTube, listen in
              one of these. "Onde ouvir" further down still lists everything.
            */}
            <div className="fold__outlets">
              {PLATFORMS.filter((platform) => platform.icon !== 'youtube').map((platform) => (
                <Tile key={platform.label} size="sm" icon={platform.icon} href={platform.href}>
                  {platform.label}
                </Tile>
              ))}
            </div>

            {/*
              The way onward, under everything else.

              It used to sit beside the watch button, where its only distinction
              was being unstyled — which made it look like a peer of the one
              action the screen exists for. Down here it is the last thing read
              and the only thing offering to leave, with a hairline above it
              doing the saying: the fold's content ends, and the archive is that
              way.
            */}
            <div className="fold__more">
              <Button variant="outline" href={hash(SECTION.episodes)}>
                <Icon name="archive" size="1.15em" />
                Ver todos os episódios
              </Button>
              {/* A peer of the archive link, not of the watch button. Both are
                  ways to leave this screen — one further into the show, one
                  into supporting it — so they share the outlined rank and the
                  filled button keeps the fold's one job to itself.

                  Both go down the page rather than off it, and this one for
                  the same reason the masthead's does: the membership panel is
                  where the two routes are laid out and the case for either one
                  is made. */}
              <Button variant="outline" href={hash(SECTION.membership)}>
                <Icon name="signal" size="1.15em" />
                Apoie o programa
              </Button>
            </div>
          </div>
        </div>

        {/*
          The abduction stands immediately to the right of the copy, centred on
          the same line, as the fold's second column.

          It is a real layout item rather than an absolutely placed decoration,
          and that is the point: the two columns are measured against each
          other, so the picture can never end up on top of the headline no
          matter how long an episode title runs or how short the screen is.

          A scene rather than a sticker — each one has a ground in it, a fence
          and the patch of field whatever is being taken was lifted off — so it
          is level and planted. The picture itself never drifts; what moves is
          the light and what the light is carrying. `beam` puts motes in the
          cone, drawn upward and converging on the emitter, with a pulse of
          light running up behind them, and that direction is what turns a
          painted cone into an abduction in progress.

          The picture is drawn from the whole set on each visit: the cow, the
          alien, the man and his furniture, the astronaut. Only the one that is
          picked is ever downloaded, so the variety costs nothing.
        */}
        <Scene
          name={ABDUCTIONS}
          height="min(72svh, 44rem)"
          opacity={0.92}
          sizes="49vh"
          transmit
          beam
          eager
          className="fold__scene"
        />
      </div>
    </section>
  )
}

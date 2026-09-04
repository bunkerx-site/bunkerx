import { useId, useState } from 'react'
import { Band, Button, Frame, PlatformIcon, Static, formatDate } from '@bunkerx/design-system'
import { Motes } from '../components/Motes'
import { Pager } from '../components/Pager'
import { CHANNELS, SECTION } from '../content/site'
import type { Video } from '../lib/types'

const BATCH = 6

/** `181`, `1,2 mil` — the count as the channel itself writes it. */
const VIEWS = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 })

/**
 * `13:47`, `1:02:11` — the length as a counter reads it, not as prose.
 *
 * The house format is `formatDuration`, and it is right where it is used: a
 * two-hour programme is `1h22`, because nobody cares about its seconds. A clip
 * is the other case. Seven to thirty minutes is short enough that the seconds
 * are part of knowing how long it is, and this number is burnt into the corner
 * of a picture that is pretending to be a screen — a screen shows a counter.
 */
function timecode(seconds?: number): string | undefined {
  if (!seconds) return undefined
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const rest = Math.floor(seconds % 60)
  const pad = (value: number) => String(value).padStart(2, '0')
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(rest)}` : `${minutes}:${pad(rest)}`
}

/**
 * The synopsis, two lines and a way to ask for the rest.
 *
 * Written here rather than borrowed from `LogEntry` because this section is
 * deliberately not that component — see `Cuts`. The clamp is a height and not
 * a line-clamp, for the reason LogEntry's is: a line-clamp puts its ellipsis
 * wherever the line breaks, which is usually the middle of a word.
 */
function Synopsis({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <div className="cut__synopsis">
      <p className={`cut__text${open ? '' : ' cut__text--clamped'}`} id={id}>
        {text}
      </p>
      <button
        className="cut__reveal"
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Ver menos' : 'Ver mais'}
      </button>
    </div>
  )
}

/**
 * One clip: a print taped into the album.
 *
 * The show's other language, and the one this section turned out to want. Its
 * whole subject is evidence somebody kept — a photograph of something that
 * cannot be there, mounted, dated in the margin, and stuck down with tape
 * because it was never going to be published. The sticker set has been
 * carrying that vocabulary from the start: the taped photo pairs, the case
 * folder, the note stuck to a wall.
 *
 * So the still is not a screen here, it is a print: paper stock, a wide margin
 * along the bottom where you write what it is, and one strip of tape holding
 * it down. What was a chip full of metadata is that written margin — the same
 * three facts, in the material that suits them.
 *
 * Each one hangs at a slightly different angle, by position rather than at
 * random, so the wall looks mounted by hand and still renders the same on
 * every load. Picking one up straightens it.
 */
function Cut({ video }: { video: Video }) {
  const counter = timecode(video.durationSeconds)

  return (
    /* `bx-hoverable` lights the frame's ring from out here, so hovering
       anywhere on the clip — the title included — answers on the print. */
    <article className="cut bx-hoverable">
      <div className="cut__print">
        <span className="cut__tape" aria-hidden="true" />

        {/*
          The photograph is a link but is out of the tab order and hidden from
          assistive technology: it points where the title points, and a second
          stop on the same destination is noise to anyone not using a mouse.
        */}
        <a
          className="cut__shot"
          href={video.url}
          target="_blank"
          rel="noreferrer noopener"
          tabIndex={-1}
          aria-hidden="true"
        >
          {/* The tube's own lines, over the print. A mixed metaphor only until
              you remember what these pictures are: frames grabbed off a
              screen, then printed. The site puts scanlines over anything that
              was once on a monitor, and that is all of them. */}
          <Frame src={video.thumbnail} scan />
          {/* The bloom and the foxing on the paper — see `.cut__age`. */}
          <span className="cut__age" aria-hidden="true" />
        </a>

        {/* What is written in the margin: when it was taken, how long it runs,
            and how many people have seen it. */}
        <span className="cut__caption">
          <time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time>
          <span className="cut__marks">
            {counter ? <span className="cut__counter">{counter}</span> : null}
            {video.views === undefined ? null : (
              <span className="cut__views">{VIEWS.format(video.views)} visualizações</span>
            )}
          </span>
        </span>
      </div>

      <h3 className="cut__title">
        <a href={video.url} target="_blank" rel="noreferrer noopener">
          {video.title}
        </a>
      </h3>

      {video.summary ? <Synopsis text={video.summary} /> : null}
    </article>
  )
}

/**
 * The cuts: a lit workbench with the monitors standing on it.
 *
 * This section is the one place on the site where the palette runs inverted,
 * and the plate is the whole idea — so everything standing on it is quiet.
 * That is the lesson of the version before this one, which put purple pills,
 * purple buttons, a purple heading and a rebuilt colour burst on top of an
 * already-loud surface: two statements arguing, and the plate lost.
 *
 * Two materials, and no third colour at rest. The ground is the show's green.
 * Everything that is an *object* — the bezel round each still, the controls —
 * is cut out of the void, and the only thing lit inside that void is the
 * green again. That is not a decoration borrowed from somewhere; it is what
 * the show's own props look like. Every piece of equipment in its artwork is a
 * black case with a green screen in it.
 *
 * Nothing here is the archive's. No log rows, no meta chips, no seams between
 * items — the earlier version was `Episodes` in a green coat, which is exactly
 * why it read as more of the same programme rather than as another channel.
 * The bezels are the structure; a rule drawn between two black rectangles is a
 * rule nobody needed.
 *
 * Two greens cannot stack, so the masthead takes the purple while it is over
 * this band. See `useOverSection` and `.masthead--over` — that, and the hover,
 * are where the purple lives in this section.
 */
export function Cuts({ videos }: { videos: Video[] }) {
  const [shownCount, setShownCount] = useState(BATCH)

  const shown = videos.slice(0, shownCount)
  const remaining = videos.length - shown.length

  return (
    <Band
      id={SECTION.cuts}
      className="cuts"
      title="Cortes"
      /* No seam. The seam is a colour burst read against the dark, and against
         the plate it is a smear — the change of surface is a bigger boundary
         than any rule could draw anyway. */
      seam={false}
      /*
        The plate is the one flat colour on a page that is otherwise a
        starfield, and flat is the one thing this design is not. The grain
        gives it the tooth every other surface gets from the sky behind it.
      */
      layer={
        <>
          <div className="cuts__grain" aria-hidden="true">
            <Static intensity={0.35} fps={8} grain={3} />
          </div>
          {/* Purple drifting up around the station — the one thing in this
              band that is neither the plate nor the paper, which is why it is
              spent on the machine rather than on the reading. See
              `.cuts__station-field` for how the field finds the sticker's box
              out of the band's own tokens. */}
          <Motes className="cuts__station-field" />
        </>
      }
      /*
        The receiving station: the thing this whole section is drawn after.
        Black casing, green screens, and a real cut-out, so it stands on the
        plate rather than sitting in a photo border — the same two materials
        the clips below it are made of, which is the point of putting it here.

        `pan` rather than a drift: it is a dish that sweeps and stops to look,
        and that is the one motion this object would actually make.
      */
      sticker="radar-station"
      stickerSide="left"
      stickerWidth="var(--cuts-station)"
      /* No lift: it stands beside the heading rather than crossing into the
         prints. The globe over the archive is allowed to bleed into its first
         row because the row behind it is a wide dark band; a print is a small
         bright object and anything laid over it reads as damage. */
      stickerMotion="pan"
      lead="Trechos soltos do programa, para quem tem dez minutos. Canal próprio, publicado fora da segunda."
      more={
        <div className="cta">
          <p className="cta__pitch">
            Os cortes aparecem entre um episódio e o próximo. Siga o canal e eles chegam sem você
            procurar.
          </p>
          <Button variant="outline" href={CHANNELS.cuts} external>
            <PlatformIcon name="youtube" size="1.15em" />
            Ver o canal de cortes
          </Button>
        </div>
      }
    >
      <div className="cuts__grid">
        {shown.map((video) => (
          <Cut key={video.id} video={video} />
        ))}
      </div>

      <Pager
        shown={shown.length}
        total={videos.length}
        noun="cortes"
        onMore={remaining > 0 ? () => setShownCount((count) => count + BATCH) : undefined}
      />
    </Band>
  )
}

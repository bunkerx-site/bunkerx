import { useId, useState } from 'react'
import { Avatar, Band, PlatformIcon, Static } from '@bunkerx/design-system'
import { Motes } from '../components/Motes'
import { HOSTS, SECTION } from '../content/site'

type Host = (typeof HOSTS)[number]

/**
 * The bio, three lines and a way to ask for the rest.
 *
 * The same disclosure the archive gives an episode synopsis, and it earns its
 * place here for the same reason it does there — but mostly on a phone, where
 * a bio that runs to seven lines pushes the second agent off the screen
 * entirely. On a monitor it hides a line or two; on a narrow one it is the
 * difference between a section you can see and a wall of text.
 *
 * Clamped by height rather than with `line-clamp`, for the reason `LogEntry`'s
 * is: a line clamp puts its ellipsis wherever the line happens to break, which
 * is usually the middle of a word. The text simply stops, the way a paragraph
 * continuing over a page break does, and the control underneath is what says
 * there is more.
 */
function Dossier({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <div className="agent__dossier">
      <p className={`agent__bio${open ? '' : ' agent__bio--clamped'}`} id={id}>
        {text}
      </p>
      {/* A button, not a link: it changes what is on the screen rather than
          going anywhere, and the label names the state it moves to. */}
      <button
        className="agent__reveal"
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
 * One agent: a monitor with the person on it, and the file written beside it.
 *
 * The portrait is not a headshot in a circle. This section is the only place
 * on the site where you look at somebody rather than at something they made,
 * and the show's own premise is that everything worth knowing arrives as a
 * recording of somebody who was there — so the two of them arrive the same
 * way, on a tube that has not quite locked onto the picture.
 *
 * The set is artwork with a hole in it — a television with the picture area
 * cut out — so the portrait sits behind the casing and the whole thing reads
 * as one object instead of a photo with a border on it.
 *
 * That gives the section its one interactive moment. At rest the tube is
 * exactly what a set holding a weak signal looks like: the picture is there
 * but drained of colour, with snow over it. Looking at the file — hovering it,
 * or tabbing to either of the links — locks the signal: the snow clears, the
 * set lights up, and the person comes back in colour.
 *
 * The set does not stand on anything, either. It hangs — turning a degree and
 * riding a few pixels up and down on a long period, with dust climbing past it
 * — which is the show's own picture of an object that has been taken: the
 * abduction the design system draws in `Scene`, with a television where the
 * cow usually is. The two sets keep different periods so the pair never bobs
 * in step, which would read as a carousel.
 *
 * The colour burst that used to sit along the bottom of the screen is gone.
 * The set arrived with a lit bezel, a lamp, printed labels and a dial, and a
 * strip of test-card bars on top of all that was the second thing in the same
 * small window saying the same thing. The burst still opens the section — see
 * the seam in the gap above the heading — where it has room to be read.
 *
 * `bx-hoverable` is on the article rather than the tube so hovering the bio
 * answers on the picture too: the file is one object, not a photo next to some
 * text.
 */
function Agent({ host }: { host: Host }) {
  return (
    <article className="agent bx-hoverable">
      <div className="agent__tube">
        {/* The dust the set is coming up through. Outside the floating wrapper
            on purpose: the television drifts, the air it is drifting in does
            not. */}
        <Motes className="agent__field" />

        {/* Everything that is actually the television, floating as one object.
            The screen is placed against the casing to a fraction of a percent,
            so the two have to move together or the picture slides out of its
            own window. */}
        <span className="agent__craft">
        {/*
          Everything on the screen, in the window the set leaves open. The
          artwork is a real television with a transparent picture area, so the
          portrait is behind the casing rather than inside a border drawn in
          CSS — the bezel, the dials, the aerials and the lamp are all in the
          drawing.
        */}
        <span className="agent__screen">
          <Avatar
            className="agent__portrait"
            src={host.portrait}
            name={`Retrato de ${host.name}`}
            tone="monitor"
          />

          {/* Snow over the picture: a set holding a weak signal, not a
              photograph with grain on it. */}
          <span className="agent__snow" aria-hidden="true">
            <Static intensity={0.38} fps={12} grain={2} />
          </span>
        </span>

        <img
          className="agent__set"
          src="/decor/tv.png"
          alt=""
          aria-hidden="true"
          width={760}
          height={760}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        </span>
      </div>

      <div>
        <h3 className="agent__name">{host.name}</h3>
        <Dossier text={host.bio} />

        {/* Where to find the agent, with the platform's own mark — the same
            treatment the listen row and the footer give a link out. */}
        <div className="agent__links">
          {host.links.map((link) => (
            <a
              className="agent__link"
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              <PlatformIcon name={link.icon} size="1.05em" />
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}

/**
 * Quem investiga: two files, and the folder they came out of.
 *
 * The section used to be two rows of portrait-and-bio under a small case
 * folder decal, which is the least this page does anywhere — the archive has
 * its globe, the cuts have a lit workbench, and the people making the show got
 * a sticker. The folder is now the artwork it deserves to be: the dossier
 * itself, standing beside the two files at the size of a real object on the
 * desk, bleeding past the column because it is bigger than the page.
 *
 * The dust rising off it is the same field the cuts give their station — the
 * site's one particle population, `bx-mote`, placed against this box instead
 * of that one. Left in the phosphor here rather than re-pointed to the purple:
 * the cuts field had to survive a green plate, and on this ground the green is
 * both the light in the artwork's own rim and the colour every live thing on
 * the page is drawn in.
 *
 * No sticker prop on the band. The folder is not a decal in the header row, it
 * is the second column of the section.
 */
export function Agents() {
  return (
    <Band
      id={SECTION.hosts}
      className="agents-band"
      title="Quem investiga"
      /* The break above this band is rendered between the sections instead —
         see App.tsx. A band cannot draw a boundary it is on one side of. */
      seam={false}
      tone="nebula"
      /* The heading arrives out of register and pulls into alignment, the same
         way the archive's does. The system asks for the misconvergence once per
         view; here it is also the section's own subject — a signal being
         identified — which is what the whole band is built around. */
      glitch
      /* Not a summary of the two bios directly underneath it — "um puxa o fio,
         o outro traz a papelada" is what those two paragraphs already say, in
         those words. This says what the pair is instead. */
      lead="Dois agentes de campo, uma pasta de documentos e nenhuma vergonha de acreditar."
    >
      <div className="agents">
        <div className="agents__files">
          {HOSTS.map((host) => (
            <Agent key={host.name} host={host} />
          ))}
        </div>

        <div className="agents__folder">
          {/* First in the source, so the folder paints over it: a mote inside
              the folder's silhouette is a mote inside a closed dossier, and
              only the ones drifting clear of the edges are ever seen. See
              `.agents__field` for how the field is sized off the artwork's own
              box rather than measured. */}
          <Motes className="agents__field" />
          <img
            className="agents__art"
            src="/decor/classified.png"
            alt=""
            aria-hidden="true"
            width={687}
            height={720}
            loading="lazy"
            decoding="async"
            draggable={false}
          />

          {/*
            The folder being read.

            Two elements because the light has to move while the shape it is
            cut to stays still: the outer one is masked to the artwork's own
            alpha, the inner one is the bar that travels through it. Masking
            the moving element instead would carry the mask along with it and
            the light would walk straight off the folder.
          */}
          <span className="agents__scan" aria-hidden="true">
            <span className="agents__beam" />
          </span>
        </div>
      </div>
    </Band>
  )
}

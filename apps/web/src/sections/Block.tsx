import type { ReactNode } from 'react'
import { Sticker, type StickerName } from '@bunkerx/design-system'

type BlockProps = {
  id: string
  title: string
  lead?: string
  children: ReactNode
  tone?: 'plain' | 'nebula' | 'deep'
  more?: ReactNode
  /** Draws the broadcast seam at the top edge. Off for the first block. */
  seam?: boolean
  /**
   * A cut-out that belongs to what the section is about — the radar over the
   * episode log, the case folder over the hosts. It sits in the header row as
   * a real layout item, so on a narrow screen it moves and shrinks with
   * everything else rather than being hidden.
   */
  sticker?: StickerName
  stickerRotate?: number
  /**
   * Which side the cut-out hangs on. Left puts it before the heading in the
   * source too, so the reading order matches what is on screen.
   */
  stickerSide?: 'left' | 'right'
}

export function Block({
  id,
  title,
  lead,
  children,
  tone = 'plain',
  more,
  seam = true,
  sticker,
  stickerRotate = -6,
  stickerSide = 'right',
}: BlockProps) {
  return (
    <section className={`block block--${tone}`} id={id}>
      {/* The seam between sections, borrowed from the colour burst a broadcast
          puts at the start of every line: a short run of bars, then a rule to
          the edge. Asymmetric on purpose — a centred divider decorates, this
          one reads as the signal starting again. */}
      {seam ? (
        <span className="seam" aria-hidden="true">
          <span className="seam__bars" />
          <span className="seam__rule" />
        </span>
      ) : null}

      <div className="shell">
        <header
          className={[
            'block__head',
            sticker && 'block__head--marked',
            sticker && `block__head--${stickerSide}`,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {sticker && stickerSide === 'left' ? (
            <Sticker
              name={sticker}
              rotate={stickerRotate}
              opacity={0.85}
              className="block__sticker"
              width="clamp(6rem, 18vw, 15rem)"
            />
          ) : null}

          <div>
            <h2 className="block__title">{title}</h2>
            {lead ? <p className="block__lead">{lead}</p> : null}
          </div>

          {sticker && stickerSide === 'right' ? (
            <Sticker
              name={sticker}
              rotate={stickerRotate}
              opacity={0.85}
              className="block__sticker"
              width="clamp(6rem, 18vw, 15rem)"
            />
          ) : null}
        </header>
        {children}
        {more ? <div className="block__more">{more}</div> : null}
      </div>
    </section>
  )
}

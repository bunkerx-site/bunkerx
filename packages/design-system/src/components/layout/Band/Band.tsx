import type { ReactNode } from 'react'
import { Shell } from '../Shell/Shell'
import { Seam } from '../Seam/Seam'
import { Sticker, type StickerMotion, type StickerName } from '../../surfaces/Sticker/Sticker'
import './Band.css'

export type BandTone = 'plain' | 'nebula' | 'deep'

export type BandProps = {
  /** Anchor target. Every band is a destination in the nav. */
  id?: string
  title: string
  /** One line under the heading saying what the section is for. */
  lead?: string
  children: ReactNode
  tone?: BandTone
  /** Sits under the content, for a link out to the full archive or channel. */
  more?: ReactNode
  /** Draws the broadcast seam at the top edge. Off for the first band. */
  seam?: boolean
  /**
   * A cut-out that belongs to what the section is about — the globe over the
   * episode log, the case folder over the hosts. It sits in the header row as
   * a real layout item, so on a narrow screen it moves and shrinks with
   * everything else rather than being hidden at a breakpoint.
   */
  sticker?: StickerName
  stickerRotate?: number
  /** One of the named motions in `Sticker`. */
  stickerMotion?: StickerMotion
  /**
   * Which side the cut-out hangs on. Left puts it before the heading in the
   * source too, so the reading order matches what is on screen.
   */
  stickerSide?: 'left' | 'right'
  /**
   * Lets a cut-out inside the band break its edges. Off by default: a band
   * clips so a decoration cannot bleed into the section above it.
   */
  overflow?: boolean
  className?: string
}

/**
 * One section of the page, as a full-bleed band.
 *
 * The alternating grounds run edge to edge rather than being boxed: a band
 * from one side of the screen to the other reads as the page changing
 * surface, while a boxed one reads as one more card. Both tints are
 * transparent enough that the drifting dust behind them still shows.
 *
 * There is no chrome above the heading announcing a new section — the space
 * between bands does that job, which is why the vertical padding is as large
 * as it is.
 */
export function Band({
  id,
  title,
  lead,
  children,
  tone = 'plain',
  more,
  seam = true,
  sticker,
  stickerRotate = -6,
  stickerMotion,
  stickerSide = 'right',
  overflow = false,
  className,
}: BandProps) {
  const classes = [
    'bx-band',
    tone !== 'plain' && `bx-band--${tone}`,
    overflow && 'bx-band--overflow',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const cutout = sticker ? (
    <Sticker
      name={sticker}
      rotate={stickerRotate}
      motion={stickerMotion}
      opacity={0.85}
      className="bx-band__sticker"
      width="clamp(6rem, 18vw, 15rem)"
    />
  ) : null

  return (
    <section className={classes} id={id}>
      {seam ? <Seam /> : null}

      <Shell>
        <header
          className={[
            'bx-band__head',
            sticker && 'bx-band__head--marked',
            sticker && `bx-band__head--${stickerSide}`,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {stickerSide === 'left' ? cutout : null}

          <div>
            <h2 className="bx-band__title">{title}</h2>
            {lead ? <p className="bx-band__lead">{lead}</p> : null}
          </div>

          {stickerSide === 'right' ? cutout : null}
        </header>

        {children}

        {more ? <div className="bx-band__more">{more}</div> : null}
      </Shell>
    </section>
  )
}

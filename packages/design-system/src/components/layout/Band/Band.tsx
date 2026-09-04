import type { ReactNode } from 'react'
import { Shell } from '../Shell/Shell'
import { Seam } from '../Seam/Seam'
import { Glitch } from '../../signal/Glitch/Glitch'
import {
  Sticker,
  type StickerHalo,
  type StickerMotion,
  type StickerName,
} from '../../surfaces/Sticker/Sticker'
import './Band.css'

export type BandTone = 'plain' | 'nebula' | 'deep'

export type BandProps = {
  /** Anchor target. Every band is a destination in the nav. */
  id?: string
  /**
   * Optional, because not every band introduces itself with a heading: the
   * membership band is a single panel that carries its own, and a section
   * title above it would say the same thing twice.
   */
  title?: string
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
  /** Any CSS length. Bigger than the default for a cut-out meant to bleed. */
  stickerWidth?: string
  /**
   * Pushes the cut-out down past the header, as a percentage of its own
   * height, so it crosses into the content below.
   *
   * A percentage because the cut-outs are sized fluidly: a fixed offset that
   * looks right at 15rem hangs off the page at 6rem. It goes through
   * `Sticker`'s `lift` rather than a transform here, because the motions own
   * the transform and would overwrite it — `lift` is the property their
   * keyframes are written to add to.
   */
  stickerLift?: string
  /** One of the named motions in `Sticker`, and a halo to go with it. */
  stickerMotion?: StickerMotion
  stickerHalo?: StickerHalo
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
  /**
   * Splits the title into its colour channels and lets them converge as the
   * band is scrolled to — the treatment the wordmark gets in the fold.
   *
   * Opt-in, and meant for one band rather than all of them. The system asks
   * for the misconvergence once per view; on every heading it stops reading as
   * a defect and becomes wallpaper.
   */
  glitch?: boolean
  /**
   * Pulls the top padding in. For a band with no seam above it, which needs
   * far less air than one arriving after a full change of surface.
   */
  tight?: boolean
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
  stickerWidth = 'clamp(6rem, 18vw, 15rem)',
  stickerLift,
  stickerMotion,
  stickerHalo,
  stickerSide = 'right',
  overflow = false,
  glitch = false,
  tight = false,
  className,
}: BandProps) {
  const classes = [
    'bx-band',
    tone !== 'plain' && `bx-band--${tone}`,
    overflow && 'bx-band--overflow',
    tight && 'bx-band--tight',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const cutout = sticker ? (
    <Sticker
      name={sticker}
      rotate={stickerRotate}
      lift={stickerLift}
      motion={stickerMotion}
      halo={stickerHalo}
      opacity={0.85}
      className="bx-band__sticker"
      width={stickerWidth}
    />
  ) : null

  return (
    <section className={classes} id={id}>
      {seam ? <Seam /> : null}

      <Shell>
        {title || sticker ? (
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
              {title ? (
                <h2 className="bx-band__title">
                  {glitch ? (
                    <Glitch as="span" offset="nudge" settle="onView">
                      {title}
                    </Glitch>
                  ) : (
                    title
                  )}
                </h2>
              ) : null}
              {lead ? <p className="bx-band__lead">{lead}</p> : null}
            </div>

            {stickerSide === 'right' ? cutout : null}
          </header>
        ) : null}

        {children}

        {more ? <div className="bx-band__more">{more}</div> : null}
      </Shell>
    </section>
  )
}

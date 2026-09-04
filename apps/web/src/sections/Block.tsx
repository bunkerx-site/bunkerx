import type { ReactNode } from 'react'
import {
  Glitch,
  Sticker,
  type StickerHalo,
  type StickerMotion,
  type StickerName,
} from '@bunkerx/design-system'

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
  /** Any CSS length. Bigger than the default for a cut-out meant to bleed. */
  stickerWidth?: string
  /**
   * Pushes the cut-out down past the header, as a percentage of its own
   * height, so it crosses into the content below.
   *
   * A percentage rather than a length because the cut-outs are sized fluidly:
   * a fixed offset that looks right at 15rem hangs off the page at 6rem. It
   * goes through `Sticker`'s `lift` rather than a transform here, because the
   * motions own the transform and would overwrite it — `lift` is the property
   * their keyframes are written to add to.
   */
  stickerLift?: string
  /**
   * One of `Sticker`'s named motions, and a halo to go with it.
   *
   * These used to be written as `#section .block__sticker` rules in the site's
   * stylesheet, which is how they came to override the component's own — and
   * why `stickerLift` did nothing until now: the hand-written keyframes fixed
   * the transform outright instead of varying around the offset the component
   * exposes for it.
   */
  stickerMotion?: StickerMotion
  stickerHalo?: StickerHalo
  /**
   * Which side the cut-out hangs on. Left puts it before the heading in the
   * source too, so the reading order matches what is on screen.
   */
  stickerSide?: 'left' | 'right'
  /**
   * Splits the title into its colour channels and lets them converge as it is
   * scrolled to — the treatment the wordmark gets in the fold.
   *
   * Opt-in, and meant for one section rather than all of them. The design
   * system asks for the misconvergence once per view; on every heading it
   * stops reading as a defect and becomes wallpaper.
   */
  glitch?: boolean
  /**
   * Pulls the top padding in. For the section directly under the fold, which
   * has no seam above it and so needs less air to read as separate.
   */
  tight?: boolean
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
  stickerWidth = 'clamp(6rem, 18vw, 15rem)',
  stickerLift,
  stickerMotion,
  stickerHalo,
  stickerSide = 'right',
  glitch = false,
  tight = false,
}: BlockProps) {
  return (
    <section className={`block block--${tone}${tight ? ' block--tight' : ''}`} id={id}>
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
              width={stickerWidth}
              lift={stickerLift}
              motion={stickerMotion}
              halo={stickerHalo}
            />
          ) : null}

          <div>
            <h2 className="block__title">
              {glitch ? (
                <Glitch as="span" offset="nudge" settle="onView">
                  {title}
                </Glitch>
              ) : (
                title
              )}
            </h2>
            {lead ? <p className="block__lead">{lead}</p> : null}
          </div>

          {sticker && stickerSide === 'right' ? (
            <Sticker
              name={sticker}
              rotate={stickerRotate}
              opacity={0.85}
              className="block__sticker"
              width={stickerWidth}
              lift={stickerLift}
              motion={stickerMotion}
              halo={stickerHalo}
            />
          ) : null}
        </header>
        {children}
        {more ? <div className="block__more">{more}</div> : null}
      </div>
    </section>
  )
}

import { Static, Sticker } from '@bunkerx/design-system'
import { SITE } from '../content/site'

/**
 * The page closes the way it opened.
 *
 * The fold acquires the signal; this loses it. The name comes back at full
 * size over snow, and the only line under it is when the next one airs — the
 * one thing worth leaving someone with at the bottom of the page.
 */
export function SignOff() {
  return (
    <section className="signoff" aria-labelledby="signoff-title">
      <div className="signoff__noise" aria-hidden="true">
        <Static intensity={0.09} fps={16} grain={3} />
      </div>

      <div className="shell signoff__inner">
        <p className="signoff__mark" id="signoff-title">
          {SITE.name}
        </p>
        <p className="signoff__note">Transmissão encerrada. Voltamos {SITE.schedule.toLowerCase()}.</p>

        {/* The moon waning to nothing, which is what the section is saying. */}
        <div className="signoff__moons">
          {(['moon-full', 'moon-gibbous', 'moon-half', 'moon-crescent', 'moon-sliver'] as const).map(
            (phase, index) => (
              <Sticker
                key={phase}
                name={phase}
                width={`clamp(${1.4 - index * 0.15}rem, ${4 - index * 0.4}vw, ${3 - index * 0.3}rem)`}
                opacity={0.75 - index * 0.1}
              />
            ),
          )}
        </div>
      </div>
    </section>
  )
}

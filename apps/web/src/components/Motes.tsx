import type { CSSProperties } from 'react'

/**
 * One population of drifting particles, laid out once and never re-rolled.
 *
 * The numbers are a fixed table rather than `Math.random()`. A field that
 * shuffles on every render is a field that moves when React re-renders for an
 * unrelated reason, and one that shuffles between the server and the client is
 * a hydration mismatch. Twelve is enough to read as a population and few
 * enough that no two share a rhythm.
 *
 * Each row is [x%, y%, rise%, size px, opacity, duration s, delay s]. They are
 * spread across the width, weighted toward the middle where the equipment is,
 * and the long risers are also the slow ones — a particle that crosses the
 * whole field in the time another crosses a third of it reads as two speeds
 * rather than one field.
 */
const FIELD: [number, number, number, number, number, number, number][] = [
  [6, 8, 62, 7, 0.9, 9.5, 0],
  [22, 22, 78, 9, 1, 11, 1.8],
  [40, 4, 54, 5, 0.75, 8, 3.4],
  [57, 30, 88, 10, 1, 12.5, 0.9],
  [73, 14, 60, 7, 0.9, 9, 5.2],
  [90, 26, 72, 6, 0.78, 10.5, 2.6],
  [14, 44, 46, 8, 0.95, 8.5, 6.1],
  [33, 58, 40, 5, 0.72, 7.5, 4.3],
  [50, 48, 66, 7, 0.95, 10, 7.4],
  [68, 62, 44, 8, 0.88, 9.2, 2.1],
  [83, 52, 58, 5, 0.7, 11.5, 6.8],
  [96, 40, 50, 7, 0.84, 8.8, 4.9],
]

/**
 * Particles rising off something.
 *
 * Reuses the design system's `bx-mote` — the same animation the abduction
 * beam's dust runs on — and only re-points its colour, so the movement is the
 * one the site already has rather than a second interpretation of the same
 * idea. `bx-mote` reads its path out of custom properties and this supplies
 * them in percentages of the field's own box, so the population scales with
 * whatever it is drifting around.
 */
export function Motes({ className }: { className?: string }) {
  return (
    <span className={['motes', className].filter(Boolean).join(' ')} aria-hidden="true">
      {FIELD.map(([x, y, rise, size, opacity, duration, delay], index) => (
        <span
          key={index}
          className="bx-mote motes__one"
          style={
            {
              /*
               * Lengths, not percentages.
               *
               * `bx-mote` puts these straight into a `translate3d`, and a
               * percentage there resolves against the element being moved — a
               * four-pixel dot — not against the field. Every mote came out
               * within a quarter of a pixel of the same spot. They are
               * fractions of the field's own size instead, which is what
               * `Scene` does with the beam's height.
               *
               * `x` is measured from the centre because `bx-mote` sits the dot
               * at `left: 50%`.
               */
              '--bx-mote-x': `calc(var(--motes-w) * ${(x / 100 - 0.5).toFixed(4)})`,
              /* Converging as they climb: the dish is at the top of the
                 station, so the field narrows toward it rather than rising in
                 parallel lines, which would read as rain running backwards. */
              '--bx-mote-x-end': `calc(var(--motes-w) * ${(
                (x + (46 - x) * 0.35) / 100 -
                0.5
              ).toFixed(4)})`,
              '--bx-mote-y': `calc(var(--motes-h) * ${(y / 100).toFixed(4)})`,
              '--bx-mote-rise': `calc(var(--motes-h) * ${(rise / 100).toFixed(4)})`,
              '--bx-mote-size': `${size}px`,
              '--bx-mote-opacity': opacity,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  )
}

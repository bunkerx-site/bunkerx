import type { CSSProperties } from 'react'
import './Icon.css'

/**
 * The system's own glyphs, as opposed to `PlatformIcon`'s company marks.
 *
 * Deliberately a short list. An icon earns its place on a button only when the
 * button set already has one — a filled action carrying a mark next to an
 * outlined action carrying none reads as two unrelated components — or when it
 * says something the label cannot. Anything drawn "to help" a label that was
 * already clear is decoration, and this file is not the place for it.
 *
 * All of them are line drawings on the same 24×24 grid as the platform marks,
 * at a stroke weight that holds at 1em beside body type.
 */
export type IconName = 'archive' | 'signal'

const GLYPHS: Record<IconName, { paths: string[]; label: string }> = {
  /*
   * The archive, drawn as the thing it opens: three rows of the episode log,
   * each a short tick for the date and a longer rule for the title. It is the
   * section's own layout at glyph size rather than a generic stack of lines.
   */
  archive: {
    label: 'Arquivo',
    paths: ['M3 6h4M10 6h11', 'M3 12h4M10 12h11', 'M3 18h4M10 18h11'],
  },
  /*
   * A mast with the signal leaving it. Supporting the show is what keeps it on
   * air, which is the argument the button is making — and a heart would have
   * been the same button on any site in any industry.
   */
  signal: {
    label: 'Transmissão',
    paths: ['M12 21v-9', 'M8.5 8.5a5 5 0 0 1 7 0', 'M5.5 5.5a9 9 0 0 1 13 0', 'M12 12a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z'],
  },
}

export type IconProps = {
  name: IconName
  /** Any CSS length. `1em` by default, so it scales with the type beside it. */
  size?: string
  /**
   * Announces the glyph. Off by default: these sit next to their own labels,
   * and a second reading of the same thing is noise.
   */
  labelled?: boolean
  className?: string
  style?: CSSProperties
}

export function Icon({ name, size = '1em', labelled = false, className, style }: IconProps) {
  const glyph = GLYPHS[name]

  return (
    <svg
      className={['bx-icon', className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={labelled ? 'img' : undefined}
      aria-label={labelled ? glyph.label : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      style={style}
    >
      {glyph.paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

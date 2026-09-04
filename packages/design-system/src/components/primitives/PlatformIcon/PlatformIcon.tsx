import type { CSSProperties } from 'react'
import {
  siApplepodcasts,
  siInstagram,
  siRss,
  siSpotify,
  siTiktok,
  siX,
  siYoutube,
} from 'simple-icons'
import './PlatformIcon.css'

/**
 * Every platform the show is on, plus the social accounts.
 *
 * Two of them have no mark in Simple Icons and are not going to get one:
 * Amazon withdrew its brand from the set, and Orelo is a Brazilian
 * podcast platform far too small to be in it. Those two fall through to a
 * waveform drawn in the system's own line style — see `WAVEFORM` below for why
 * that is the right answer rather than drawing their logos ourselves.
 */
export type PlatformName =
  | 'spotify'
  | 'youtube'
  | 'apple-podcasts'
  | 'amazon-music'
  | 'orelo'
  | 'rss'
  | 'instagram'
  | 'tiktok'
  | 'x'

type Mark = { path: string; label: string; hex?: string }

/*
 * Simple Icons ships each mark as a single path on a 24×24 grid, which is why
 * these can be dropped straight into an inline `<svg>`. Imported by name from
 * the package's barrel so the bundle carries only the marks actually used —
 * seven paths, not the three and a half thousand the package holds.
 */
const MARKS: Partial<Record<PlatformName, Mark>> = {
  spotify: { path: siSpotify.path, label: siSpotify.title, hex: siSpotify.hex },
  youtube: { path: siYoutube.path, label: siYoutube.title, hex: siYoutube.hex },
  'apple-podcasts': {
    path: siApplepodcasts.path,
    label: siApplepodcasts.title,
    hex: siApplepodcasts.hex,
  },
  rss: { path: siRss.path, label: siRss.title, hex: siRss.hex },
  instagram: { path: siInstagram.path, label: siInstagram.title, hex: siInstagram.hex },
  tiktok: { path: siTiktok.path, label: siTiktok.title, hex: siTiktok.hex },
  x: { path: siX.path, label: siX.title, hex: siX.hex },
}

/*
 * The stand-in for a platform with no official mark.
 *
 * Deliberately not an approximation of anybody's logo. Drawing a lookalike
 * Amazon Music mark would be both inaccurate and an impersonation of a brand
 * that has asked not to be reproduced, and a wrong logo is worse than no logo.
 * A waveform says "this is somewhere to listen", which is the only thing the
 * icon has to carry — the label beside it does the identifying, and it is
 * always there.
 *
 * Four bars on the same 24×24 grid as the real marks, so it sits at the same
 * optical weight in a row of them.
 */
const WAVEFORM: Mark = {
  label: 'Áudio',
  path:
    'M3 9.5a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1zm5-4.5a1 1 0 0 1 1 1v12a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1zm5 2.5a1 1 0 0 1 1 1v8a1 1 0 0 1-2 0v-8a1 1 0 0 1 1-1zm5-4.5a1 1 0 0 1 1 1v15a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1zm4 6a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1z',
}

export type PlatformIconProps = {
  name: PlatformName
  /**
   * Any CSS length. Defaults to `1em`, so the mark scales with the type it
   * sits beside instead of having to be re-sized at every text size.
   */
  size?: string
  /**
   * `current` inherits the surrounding colour. `brand` uses the platform's own.
   *
   * `current` is the default and is almost always right here. The palette is
   * two colours by design, and a row of six logos in six brand colours turns
   * that into eight — and two of those brands are pure black, which is
   * invisible on this ground. The names are already written beside the marks,
   * so the colour is not carrying any information.
   */
  tone?: 'current' | 'brand'
  /**
   * Announces the platform's name. Off by default: these marks sit next to
   * their own labels, and a screen reader should not read "Spotify Spotify".
   */
  labelled?: boolean
  className?: string
  style?: CSSProperties
}

/** One platform's mark, as inline SVG. */
export function PlatformIcon({
  name,
  size = '1em',
  tone = 'current',
  labelled = false,
  className,
  style,
}: PlatformIconProps) {
  const mark = MARKS[name] ?? WAVEFORM
  // Falls back to `currentColor` even when asked for the brand colour, because
  // the two platforms without a mark have no brand colour to reach for either.
  const fill = tone === 'brand' && mark.hex ? `#${mark.hex}` : 'currentColor'

  return (
    <svg
      className={['bx-platform-icon', className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={fill}
      role={labelled ? 'img' : undefined}
      aria-label={labelled ? mark.label : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      style={style}
    >
      <path d={mark.path} />
    </svg>
  )
}

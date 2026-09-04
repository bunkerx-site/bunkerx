import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import './Plate.css'

export type PlateProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  /** Adds an edge, so the plate reads as a layer above the page under it. */
  raised?: boolean
  as?: ElementType
}

/**
 * The inverted surface: a solid phosphor plate carrying dark type.
 *
 * The one place the palette runs the other way round, and the only surface in
 * the system that is not the dark broadcast. It bookends the page — the bar at
 * the top and the footer at the bottom are the same plate, so the page opens
 * and closes on one surface and everything between them is the transmission.
 * It is also how the show's own decal is built.
 *
 * Deliberately untextured. Lines over a bright plate strike through the glyphs
 * of the dark type sitting on it, and they carry no information to pay for
 * that; scanlines belong on pictures.
 *
 * Its real job is the link colour. `a:hover { color: phosphor-hot }` in the
 * base sheet is an element plus a pseudo-class, so it beats any single class a
 * component puts on a link — on this plate that painted light green on green
 * at 1.24:1, and the site carried two hand-written patches to escape it. The
 * plate redefines `--bx-link` and `--bx-link-hover` on itself instead, so
 * every anchor inside inherits the dark and there is no specificity contest to
 * win. Hover is then carried by an underline, which costs no contrast at all.
 */
export function Plate({
  children,
  raised = false,
  as: Tag = 'div',
  className,
  ...rest
}: PlateProps) {
  const classes = ['bx-plate', raised && 'bx-plate--raised', className].filter(Boolean).join(' ')

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  )
}

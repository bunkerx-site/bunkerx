import './Seam.css'

export type SeamProps = {
  /**
   * `signal` is the burst as it reads on the dark ground. `plate` is the same
   * gesture inverted, for the green plate — see Seam.css for why the colours
   * have to change rather than just the opacity.
   */
  tone?: 'signal' | 'plate'
  /**
   * Sits in the flow instead of pinning itself to the top of a section.
   *
   * The default is absolute, because a seam's usual job is to sit on a band's
   * top edge and it has to indent itself to the content column to do that.
   * Inline is for a seam used as an ordinary divider inside a block that is
   * already inside the column.
   */
  inline?: boolean
  /**
   * `md` marks a change of section. `sm` marks a change of item inside one.
   *
   * The same gesture at two scales, because they are not the same size of
   * event: arriving at a new section is a bigger thing than moving to the next
   * episode in a list. Six full-scale bursts down one section would stop
   * reading as punctuation and become wallpaper.
   */
  size?: 'md' | 'sm'
  className?: string
}

/**
 * The break between sections.
 *
 * Taken from the colour burst a broadcast puts at the head of every line: a
 * short run of test-card bars, then a rule running out to the edge. It is
 * asymmetric and left-anchored, aligned with the content column — a centred
 * divider would only be decoration, this one reads as the signal starting
 * again, and it says where the column begins.
 *
 * `Divider` is the other rule in the system, and the two are not
 * interchangeable: a divider separates two things inside one subject, a seam
 * says the subject changed.
 *
 * Decorative, so it is hidden from assistive technology — the heading
 * underneath is what actually announces the new section.
 */
export function Seam({ tone = 'signal', inline = false, size = 'md', className }: SeamProps) {
  const classes = [
    'bx-seam',
    tone !== 'signal' && `bx-seam--${tone}`,
    size !== 'md' && `bx-seam--${size}`,
    inline && 'bx-seam--inline',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} aria-hidden="true">
      <span className="bx-seam__bars" />
      <span className="bx-seam__rule" />
    </span>
  )
}

import './Avatar.css'

export type AvatarProps = {
  src: string
  /** The person's name. Used as the label and as the image's alt text. */
  name: string
  /**
   * `monitor` is the surveillance treatment: pushed toward the phosphor, with
   * scanlines and a frame. `plain` is desaturated only.
   *
   * Plain is what the hosts section uses. The monitor treatment is a lot of
   * effect to spend on two portraits that already sit under a case-folder
   * cut-out, and next to it the page had three things competing in the same
   * corner.
   */
  tone?: 'monitor' | 'plain'
  /** Renders the name over the bottom of the portrait. */
  showName?: boolean
  /** Restores full colour on hover. */
  live?: boolean
  /**
   * A fixed square in pixels. Left out, the portrait fills its column and
   * stays square by ratio — which is what a portrait in a fluid grid needs.
   */
  size?: number
  className?: string
}

export function Avatar({
  src,
  name,
  tone = 'monitor',
  showName = false,
  live = true,
  size,
  className,
}: AvatarProps) {
  const classes = [
    'bx-avatar',
    `bx-avatar--${tone}`,
    live && 'bx-avatar--live',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} style={size ? { width: size, height: size } : undefined}>
      <img
        className="bx-avatar__image"
        src={src}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
      />
      {tone === 'monitor' ? (
        <>
          <span className="bx-avatar__tint" aria-hidden="true" />
          <span className="bx-avatar__lines" aria-hidden="true" />
        </>
      ) : null}
      {showName ? <span className="bx-avatar__name">{name}</span> : null}
    </div>
  )
}

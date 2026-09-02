import './Avatar.css'

export type AvatarProps = {
  src: string
  /** The person's name. Used as the label and as the image's alt text. */
  name: string
  /** Renders the name over the bottom of the portrait. */
  showName?: boolean
  /** Restores full colour on hover. */
  live?: boolean
  size?: number
  className?: string
}

export function Avatar({
  src,
  name,
  showName = false,
  live = true,
  size = 96,
  className,
}: AvatarProps) {
  const classes = ['bx-avatar', live && 'bx-avatar--live', className].filter(Boolean).join(' ')

  return (
    <div className={classes} style={{ width: size, height: size }}>
      <img className="bx-avatar__image" src={src} alt={name} width={size} height={size} />
      <span className="bx-avatar__tint" aria-hidden="true" />
      <span className="bx-avatar__lines" aria-hidden="true" />
      {showName ? <span className="bx-avatar__name">{name}</span> : null}
    </div>
  )
}

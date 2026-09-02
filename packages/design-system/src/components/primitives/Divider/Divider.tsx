import './Divider.css'

export type DividerProps = {
  variant?: 'dashed' | 'solid'
  tight?: boolean
  className?: string
}

export function Divider({ variant = 'dashed', tight = false, className }: DividerProps) {
  const classes = [
    'bx-divider',
    variant === 'solid' && 'bx-divider--solid',
    tight && 'bx-divider--tight',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <hr className={classes} />
}

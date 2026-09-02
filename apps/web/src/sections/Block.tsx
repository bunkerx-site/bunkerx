import type { ReactNode } from 'react'

type BlockProps = {
  id: string
  title: string
  lead?: string
  children: ReactNode
  /**
   * Alternating grounds give the page a beat. `plain` lets the nebula show
   * through; the tinted ones are full-bleed bands that separate one subject
   * from the next without needing a rule or a label to announce it.
   */
  tone?: 'plain' | 'nebula' | 'deep'
  more?: ReactNode
  /** Draws the broadcast seam at the top edge. Off for the first block. */
  seam?: boolean
}

export function Block({ id, title, lead, children, tone = 'plain', more, seam = true }: BlockProps) {
  return (
    <section className={`block block--${tone}`} id={id}>
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
        <header className="block__head">
          <h2 className="block__title">{title}</h2>
          {lead ? <p className="block__lead">{lead}</p> : null}
        </header>
        {children}
        {more ? <div className="block__more">{more}</div> : null}
      </div>
    </section>
  )
}

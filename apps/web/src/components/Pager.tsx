import { Button } from '@bunkerx/design-system'

export type PagerProps = {
  /** How many rows are on screen. */
  shown: number
  /** How many there are in total. */
  total: number
  /** The word after the count: "episódios", "cortes". */
  noun: string
  /** Absent once there is nothing left to show. */
  onMore?: () => void
  label?: string
}

/**
 * The end of a listing, and the way to extend it.
 *
 * Both archives on this page grow on request rather than paging or scrolling
 * themselves. Paging throws away everything the reader has already passed in
 * order to show the next handful, and growing on scroll is worse for anyone
 * using a keyboard or a screen reader — whatever follows the list keeps
 * receding as they approach it. A button asks, and the tally under it says how
 * much is left, which is the one thing pagination told them that they could
 * not otherwise see.
 *
 * The rule is what says the list *ends* here. On its own in open space the
 * button had nothing to be the end of and read as an action belonging to
 * whatever came next; interrupting a rule that runs the width of the column
 * says both things at once — the list stops, and this is the way through. It
 * is drawn whether or not there is a button in it, so a listing that has been
 * read to the end still has an edge.
 *
 * The control and the readout are separate on purpose. Pressing "Carregar
 * mais" and reading "8 de 174" are two different jobs, and a number tucked
 * inside a button's label reads as part of what pressing it will do.
 */
export function Pager({ shown, total, noun, onMore, label = 'Carregar mais' }: PagerProps) {
  return (
    <div className="pager">
      <div className="pager__rule">
        {onMore ? (
          <Button variant="outline" onClick={onMore}>
            {label}
          </Button>
        ) : null}
      </div>

      <p className="pager__tally" aria-live="polite">
        {shown} <span>de</span> {total} {noun}
      </p>
    </div>
  )
}

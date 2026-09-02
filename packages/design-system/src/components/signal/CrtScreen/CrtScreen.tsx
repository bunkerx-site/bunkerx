import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './CrtScreen.css'

export type CrtScreenProps = {
  children: ReactNode
  className?: string
}

/**
 * The tube's glass: the vignette that darkens the edges. Apply once, at the
 * root.
 *
 * The overlay is rendered through a portal onto `document.body` rather than
 * inside the wrapper. `position: fixed` anchors itself to the nearest ancestor
 * carrying a `transform`, `filter` or `perspective`, so an overlay nested in
 * the tree is one such ancestor away from silently starting to scroll with the
 * page. At the top of the body there is nothing left to anchor to.
 *
 * This layer is deliberately static. Everything that moves — the nebula, the
 * drifting dust, the vertical hold slipping — belongs to `Background`.
 *
 * The layer is `pointer-events: none` and hidden from the accessibility tree,
 * so nothing here interferes with clicking, focus or screen readers.
 */
export function CrtScreen({ children, className }: CrtScreenProps) {
  // The portal target only exists in the browser; render the children on the
  // first pass and attach the glass once mounted.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className={['bx-crt', className].filter(Boolean).join(' ')}>
      {children}
      {mounted
        ? createPortal(
            <div className="bx-crt__glass-root" aria-hidden="true">
              <div className="bx-crt__overlay bx-crt__glass" />
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}

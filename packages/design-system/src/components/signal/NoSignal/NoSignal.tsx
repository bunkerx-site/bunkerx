import type { ReactNode } from 'react'
import { Static } from '../../signal/Static/Static'
import './NoSignal.css'

/**
 * Test-card bars, rebuilt from the brand palette rather than the SMPTE set.
 * The broadcast original is cyan/yellow/blue; these are the colours the show
 * actually owns, so the card reads as Bunker X losing signal, not as generic
 * television.
 */
const BARS = [
  'var(--bx-phosphor-hot)',
  'var(--bx-phosphor)',
  'var(--bx-signal-mute)',
  'var(--bx-magenta)',
  'var(--bx-nebula-soft)',
  'var(--bx-alert)',
  'var(--bx-nebula)',
]

export type NoSignalProps = {
  /** Large line on the plate. Keep it short — it is read as a status. */
  title?: string
  /** One sentence saying what happened and what to do about it. */
  message?: string
  /** Optional recovery action. */
  action?: ReactNode
  className?: string
}

/**
 * The empty and error state for the whole site: a dead channel.
 *
 * An empty screen is an invitation to act, so `message` should say what to do
 * next rather than only apologise for the absence.
 */
export function NoSignal({
  title = 'SEM SINAL',
  message = 'Nada transmitindo neste canal por enquanto.',
  action,
  className,
}: NoSignalProps) {
  return (
    <div className={['bx-nosignal', className].filter(Boolean).join(' ')} role="status">
      <div className="bx-nosignal__bars" aria-hidden="true">
        {BARS.map((colour) => (
          <div key={colour} className="bx-nosignal__bar" style={{ background: colour }} />
        ))}
      </div>
      <div className="bx-nosignal__noise" aria-hidden="true">
        <Static intensity={0.4} />
      </div>
      <div className="bx-nosignal__plate">
        <div className="bx-nosignal__title">{title}</div>
        <p className="bx-nosignal__message">{message}</p>
        {action ? <div className="bx-nosignal__action">{action}</div> : null}
      </div>
    </div>
  )
}

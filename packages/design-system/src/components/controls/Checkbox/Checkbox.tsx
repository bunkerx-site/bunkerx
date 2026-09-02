import type { InputHTMLAttributes } from 'react'
import './Checkbox.css'

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
}

export function Checkbox({ label, className, ...rest }: CheckboxProps) {
  return (
    <label className={['bx-checkbox', className].filter(Boolean).join(' ')}>
      <input type="checkbox" className="bx-checkbox__input" {...rest} />
      <span className="bx-checkbox__box" aria-hidden="true">
        <span className="bx-checkbox__lamp" />
      </span>
      <span>{label}</span>
    </label>
  )
}

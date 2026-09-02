import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import './Field.css'

export type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string
  /**
   * Says what went wrong and how to fix it. When set, the field is marked
   * invalid and the message replaces the hint.
   */
  error?: string
  hint?: string
  /** The character shown before the caret. */
  prompt?: string
}

export function Field({ label, error, hint, prompt = '>', className, id, ...rest }: FieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const message = error ?? hint

  const classes = ['bx-field', error && 'bx-field--invalid', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <label className="bx-field__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="bx-field__control">
        <span className="bx-field__prompt" aria-hidden="true">
          {prompt}
        </span>
        <input
          id={inputId}
          className="bx-field__input"
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          {...rest}
        />
      </div>
      {message ? (
        <p id={messageId} className={`bx-field__hint${error ? ' bx-field__hint--error' : ''}`}>
          {message}
        </p>
      ) : null}
    </div>
  )
}

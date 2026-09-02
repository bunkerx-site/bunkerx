import { useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import './Textarea.css'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, className, id, ...rest }: TextareaProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const messageId = `${fieldId}-message`
  const message = error ?? hint

  const classes = ['bx-field bx-textarea', error && 'bx-textarea--invalid', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <label className="bx-field__label" htmlFor={fieldId}>
        {label}
      </label>
      <textarea
        id={fieldId}
        className="bx-textarea__field"
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...rest}
      />
      {message ? (
        <p id={messageId} className={`bx-field__hint${error ? ' bx-field__hint--error' : ''}`}>
          {message}
        </p>
      ) : null}
    </div>
  )
}

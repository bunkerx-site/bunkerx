import { useId } from 'react'
import type { SelectHTMLAttributes } from 'react'
import './Select.css'

export type SelectOption = { label: string; value: string }

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  label: string
  options: SelectOption[]
  error?: string
  hint?: string
}

export function Select({ label, options, error, hint, className, id, ...rest }: SelectProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const messageId = `${fieldId}-message`
  const message = error ?? hint

  const classes = ['bx-field bx-select', error && 'bx-select--invalid', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <label className="bx-field__label" htmlFor={fieldId}>
        {label}
      </label>
      <div className="bx-select__control">
        <select
          id={fieldId}
          className="bx-select__field"
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg className="bx-select__caret" viewBox="0 0 10 6" fill="none" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </div>
      {message ? (
        <p id={messageId} className={`bx-field__hint${error ? ' bx-field__hint--error' : ''}`}>
          {message}
        </p>
      ) : null}
    </div>
  )
}

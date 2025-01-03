import React from 'react'
import { getCss } from '../../utils'

export interface Props {
  autoFocus?: boolean
  textarea?: boolean
  value?: string
  placeholder?: string
  onChange: (value: string) => void
}

export function TextInput({
  textarea,
  placeholder,
  value,
  autoFocus,
  onChange
}: Props) {
  const css = getCss('TextInput', (ns) => ({ root: ns() }))
  return (
    <div className={css.root}>
      {textarea ? (
        <textarea
          placeholder={placeholder}
          autoFocus={autoFocus}
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value)
          }}
        />
      ) : (
        <input
          placeholder={placeholder}
          value={value || ''}
          autoFocus={autoFocus}
          onChange={(e) => {
            onChange(e.target.value)
          }}
        />
      )}
    </div>
  )
}

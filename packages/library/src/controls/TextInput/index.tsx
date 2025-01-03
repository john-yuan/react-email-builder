import React from 'react'
import { namespace } from '../../utils'

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
  return (
    <div className={namespace('TextInput')()}>
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

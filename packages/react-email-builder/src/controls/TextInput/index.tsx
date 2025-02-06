import React from 'react'
import { getCss } from '../../utils'

export interface Props {
  autoFocus?: boolean
  textarea?: boolean
  value?: string
  placeholder?: string
  style?: React.CSSProperties
  rows?: number
  onChange: (value: string) => void
}

export function TextInput({
  textarea,
  placeholder,
  value,
  autoFocus,
  style,
  rows,
  onChange
}: Props) {
  const css = getCss('TextInput', (ns) => ({ root: ns() }))
  return (
    <div className={css.root} style={style}>
      {textarea ? (
        <textarea
          placeholder={placeholder}
          autoFocus={autoFocus}
          value={value || ''}
          style={{
            height: 12 + (rows || 2) * 22
          }}
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

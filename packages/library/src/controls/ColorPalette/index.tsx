import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { getPresetColors } from './preset'
import { getCss } from '../../utils'

export function ColorPalette({
  color: propColor,
  onChange,
  onSelect
}: {
  color?: string
  onChange: (color: string) => void
  onSelect?: () => void
}) {
  const css = useCss()
  const color = (propColor || '#000000').toUpperCase()

  return (
    <div className={css.root}>
      <div className={css.colors}>
        {getPresetColors().map((val) => (
          <div
            key={val}
            className={clsx(css.color, {
              [css.active]: val === color
            })}
            onClick={() => {
              onChange(val)
              onSelect?.()
            }}
          >
            <div style={{ backgroundColor: val }} />
          </div>
        ))}
      </div>
      <Input color={color} onChange={onChange} />
      <HexColorPicker
        color={color}
        onChange={onChange}
        style={{ width: '100%', height: 150 }}
      />
    </div>
  )
}

function useCss() {
  return getCss('ColorPalette', (ns) => ({
    root: ns(),
    colors: ns('colors'),
    color: ns('color'),
    active: ns('active'),

    form: ns('form'),
    mode: ns('mode'),
    input: ns('input'),
    selected: ns('selected'),
    preview: ns('preview')
  }))
}

function Input({
  color,
  onChange
}: {
  color?: string
  onChange: (color: string) => void
}) {
  const [mode, setMode] = useState<'hex' | 'rgb'>('hex')
  const [focused, setFocused] = useState(false)
  const [input, setInput] = useState('')

  const css = useCss()

  useEffect(() => {
    if (!focused) {
      if (color) {
        setInput(mode === 'hex' ? color.toUpperCase() : hex2rgb(color))
      } else {
        setInput('')
      }
    }
  }, [mode, focused, color])

  return (
    <div className={css.form}>
      <div className={css.mode}>
        <div
          className={mode === 'hex' ? css.selected : ''}
          onClick={() => {
            setMode('hex')
          }}
        >
          HEX
        </div>
        <div
          className={mode === 'rgb' ? css.selected : ''}
          onClick={() => {
            setMode('rgb')
          }}
        >
          RGB
        </div>
      </div>
      <div className={css.input}>
        <input
          placeholder="请输入"
          value={input}
          onFocus={() => {
            setFocused(true)
          }}
          onBlur={() => {
            setFocused(false)
          }}
          onChange={(e) => {
            const value = e.target.value
            const newColor = parseColor(value)
            setInput(value)
            if (newColor) {
              onChange(newColor)
            }
          }}
        />
      </div>
      <div className={css.preview}>
        <div style={{ backgroundColor: color }}></div>
      </div>
    </div>
  )
}

function parseColor(color: string) {
  const val = color
    .trim()
    .replace(/rgba?/i, '')
    .replace(/[^0-9a-fA-F,.\s%]/g, '')

  const arr = val.split(/[\s,]+/)

  let result: string | undefined

  if (arr.length > 1 || val.includes('%')) {
    const hex = (s?: string) => {
      let n = 0
      if (s) {
        if (s.endsWith('%')) {
          n = Math.round(((+s.slice(0, -1) || 0) * 255) / 100)
        } else {
          n = Math.round(+s || 0)
        }
      }
      if (n < 0) {
        n = 0
      }
      if (n > 255) {
        n = 255
      }
      const h = n.toString(16)
      return h.length < 2 ? '0' + h : h
    }

    result = '#' + hex(arr[0]) + hex(arr[1]) + hex(arr[2])
  } else {
    if (val.length === 3) {
      const [r, g, b] = val.split('')
      result = '#' + r + r + g + g + b + b
    } else if (val.length === 6) {
      result = '#' + val
    }
  }

  return result?.toUpperCase()
}

function hex2rgb(color: string) {
  const hex = parseColor(color)

  if (hex) {
    const num = (s: string) => parseInt(s, 16) || 0
    return (
      num(hex.slice(1, 3)) +
      ', ' +
      num(hex.slice(3, 5)) +
      ', ' +
      num(hex.slice(5))
    )
  }

  return '0, 0, 0'
}

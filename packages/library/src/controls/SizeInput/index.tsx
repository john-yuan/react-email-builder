import React from 'react'
import clsx from 'clsx'
import { getCss } from '../../utils'

export interface Props {
  value?: number
  unit: string
  onChange: (value: number | undefined) => void
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  disabled?: boolean
  showControls?: boolean
}

export function SizeInput({
  value,
  unit,
  max,
  min,
  defaultValue,
  step,
  onChange,
  disabled,
  showControls
}: Props) {
  const applyChange = (num: number | undefined) => {
    let val = num

    if (val != null) {
      if (min != null && val < min) {
        val = min
      }

      if (max != null && val > max) {
        val = max
      }
    }

    onChange(val)
  }

  const real = value ?? defaultValue ?? 0

  const increment = () => {
    applyChange(real + (step || 1))
  }

  const decrement = () => {
    applyChange(real - (step || 1))
  }

  const disabledMin = (min != null && real <= min) || disabled
  const disabledMax = (max != null && real >= max) || disabled

  const css = getCss('SizeInput', (ns) => ({
    root: ns(),
    inputBox: ns('input-box'),
    input: ns('input'),
    unit: ns('unit'),
    actions: ns('actions'),
    action: ns('action'),
    sep: ns('sep'),
    disabled: ns('disabled')
  }))

  return (
    <div className={css.root}>
      <div className={clsx(css.inputBox, disabled ? css.disabled : '')}>
        <div className={css.input}>
          <input
            disabled={disabled}
            value={`${value ?? ''}`}
            onChange={(e) => {
              const input = e.target.value
              applyChange(input ? readAsNum(input) : undefined)
            }}
            placeholder={`${defaultValue ?? 0}`}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp' || e.keyCode === 38) {
                e.preventDefault()
                increment()
              } else if (e.key === 'ArrowDown' || e.keyCode === 40) {
                e.preventDefault()
                decrement()
              }
            }}
          />
        </div>
        <div className={css.unit}>{unit}</div>
      </div>
      {showControls ? (
        <div className={css.actions}>
          <div
            className={clsx(css.action, disabledMin ? css.disabled : '')}
            onClick={disabledMin ? undefined : decrement}
          >
            -
          </div>
          <div className={css.sep} />
          <div
            className={clsx(css.action, disabledMax ? css.disabled : '')}
            onClick={disabledMax ? undefined : increment}
          >
            +
          </div>
        </div>
      ) : null}
    </div>
  )
}

function readAsNum(s: string) {
  return parseInt(s.replace(/[^+-.0-9]/g, '')) || 0
}

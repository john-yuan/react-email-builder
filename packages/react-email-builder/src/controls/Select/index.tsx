import React from 'react'
import clsx from 'clsx'
import { Icon } from '../../components/Icon'
import { usePopover } from '../Popover/hooks'
import { getCss } from '../../utils'
import { Popover } from '../Popover'
import type { Placement } from '@floating-ui/dom'

export interface Props {
  value?: string
  onChange: (value?: string) => void
  options: {
    value: string
    label: string
  }[]
  placement?: Placement
  placeholder?: string
  clearable?: boolean
}

export function Select({
  options,
  value,
  placement,
  placeholder,
  clearable,
  onChange
}: Props) {
  const selected = options.find((el) => el.value === value)
  const { open, setOpen, popoverRef, triggerRef } = usePopover({
    offset: 5,
    placement: placement || 'bottom-end'
  })

  const css = getCss('Select', (ns) => ({
    root: ns(),
    clearable: ns('clearable'),
    open: ns('open'),
    text: ns('text'),
    icon: ns('icon'),
    option: ns('option'),
    label: ns('label'),
    check: ns('check'),
    list: ns('list'),
    caret: ns('caret'),
    clear: ns('clear')
  }))

  return (
    <>
      <div
        ref={triggerRef}
        className={clsx(css.root, {
          [css.open]: open,
          [css.clearable]: selected && clearable && !open
        })}
        onClick={() => {
          setOpen(!open)
        }}
      >
        <div className={css.text}>
          {selected ? (
            selected.label ?? value
          ) : (
            <span style={{ opacity: 0.65 }}>{placeholder ?? 'Select'}</span>
          )}
        </div>
        <div className={css.icon}>
          <div className={css.caret}>
            <Icon name={open ? 'caret-up' : 'caret-down'} />
          </div>
          {selected && clearable ? (
            <div
              className={css.clear}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onChange()
              }}
            >
              <Icon name="clear" />
            </div>
          ) : null}
        </div>
      </div>
      <Popover open={open} popoverRef={popoverRef}>
        <div className={css.list}>
          {options.map((option) => (
            <div
              className={css.option}
              key={option.value}
              onClick={() => {
                if (option.value !== value) {
                  onChange(option.value)
                }
                setOpen(false)
              }}
            >
              <div className={css.label}>{option.label}</div>
              <div className={css.check}>
                {option.value === value ? <Icon name="check" /> : null}
              </div>
            </div>
          ))}
        </div>
      </Popover>
    </>
  )
}

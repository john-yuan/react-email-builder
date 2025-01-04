import React from 'react'
import { Icon } from '../../components/Icon'
import { Popover } from '../Popover'
import { ColorPalette } from '../ColorPalette'
import { usePopover } from '../Popover/hooks'
import { getCss } from '../../utils'

export interface Props {
  hideClear?: boolean
  color?: string
  onChange: (color?: string) => void
}

export function ColorPicker({ color, onChange, hideClear }: Props) {
  const css = getCss('ColorPicker', (ns) => ({
    root: ns(),
    color: ns('color'),
    clear: ns('clear')
  }))
  const { open, setOpen, triggerRef, popoverRef } = usePopover({
    placement: 'right',
    offset: 12
  })
  return (
    <>
      <div
        ref={triggerRef}
        className={css.root}
        onClick={() => {
          setOpen(true)
        }}
      >
        <div className={css.color} style={{ backgroundColor: color }}>
          {color ? null : '+'}
        </div>
        {!hideClear && color ? (
          <i
            className={css.clear}
            title="Clear color"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onChange()
              setOpen(false)
            }}
          >
            <Icon name="close" />
          </i>
        ) : null}
      </div>
      <Popover open={open} popoverRef={popoverRef}>
        <ColorPalette color={color} onChange={onChange} />
      </Popover>
    </>
  )
}

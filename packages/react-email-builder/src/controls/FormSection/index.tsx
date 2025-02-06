import React, { useState } from 'react'
import { Icon } from '../../components/Icon'
import { getCss } from '../../utils'

export interface Props {
  name: string
  defaultOpen?: boolean
  children?: React.ReactNode
}

export function FormSection({ name, defaultOpen, children }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const css = getCss('FormSection', (ns) => ({
    root: ns(),
    header: ns('header'),
    section: ns('section'),
    text: ns('text'),
    icon: ns('icon')
  }))
  return (
    <>
      <div
        className={css.header}
        onClick={() => {
          setOpen(!open)
        }}
      >
        <div className={css.text}>{name}</div>
        <div className={css.icon}>
          <Icon name={open ? 'caret-up' : 'caret-down'} />
        </div>
      </div>
      {open ? <div className={css.section}>{children}</div> : null}
    </>
  )
}

import clsx from 'clsx'
import React from 'react'
import { getCss } from '../../utils'

export interface Props {
  label?: string
  children?: React.ReactNode
  vertical?: boolean
}

export function Field({ label, children, vertical }: Props) {
  const css = getCss('Field', (ns) => ({
    root: ns(),
    label: ns('label'),
    input: ns('input'),
    vertical: ns('vertical')
  }))

  return (
    <div className={clsx(css.root, vertical ? css.vertical : '')}>
      {label ? <div className={css.label}>{label}</div> : null}
      <div className={css.input}>{children}</div>
    </div>
  )
}

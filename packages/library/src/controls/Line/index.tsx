import React from 'react'
import { getCss } from '../../utils'

export function Line() {
  const css = getCss('Line', (ns) => ({ root: ns() }))
  return <div className={css.root} />
}

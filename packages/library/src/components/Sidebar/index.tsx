import React, { useMemo } from 'react'
import { namespace } from '../../utils'
import { BlockIcons } from '../BlockIcons'

export function Sidebar() {
  const css = useMemo(() => {
    const ns = namespace('Sidebar')
    return {
      root: ns(),
      header: ns('header'),
      body: ns('body')
    }
  }, [])

  return (
    <div className={css.root}>
      <div className={css.header}></div>
      <div className={css.body}>
        <BlockIcons />
      </div>
    </div>
  )
}

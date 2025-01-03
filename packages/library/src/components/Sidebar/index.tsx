import clsx from 'clsx'
import React, { useMemo } from 'react'
import { namespace } from '../../utils'
import { BlockIcons } from '../BlockIcons'

export function Sidebar({ right }: { right?: boolean }) {
  const css = useMemo(() => {
    const ns = namespace('Sidebar')
    return {
      left: clsx(ns(), ns('left')),
      right: clsx(ns(), ns('right')),
      header: ns('header'),
      body: ns('body')
    }
  }, [])

  return (
    <div className={right ? css.right : css.left}>
      <div className={css.header}></div>
      <div className={css.body}>
        <BlockIcons />
      </div>
    </div>
  )
}

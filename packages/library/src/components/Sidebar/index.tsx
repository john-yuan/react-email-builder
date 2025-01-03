import clsx from 'clsx'
import React, { useEffect, useMemo, useState } from 'react'
import { namespace } from '../../utils'
import { BlockIcons } from '../BlockIcons'
import { useEmailBuilderState, useSetEmailBuilderState } from '../../hooks'
import { BlockEditor } from '../BlockEditor'
import { PageEditor } from '../PageEditor'

export function Sidebar({ right }: { right?: boolean }) {
  const css = useMemo(() => {
    const ns = namespace('Sidebar')
    return {
      left: clsx(ns(), ns('left')),
      right: clsx(ns(), ns('right')),
      header: ns('header'),
      body: ns('body'),
      tabs: ns('tabs'),
      tab: ns('tab'),
      active: ns('tab-active')
    }
  }, [])

  const setState = useSetEmailBuilderState()
  const tab = useEmailBuilderState().tab || 'blocks'
  const tabs: {
    key: typeof tab
    label: string
  }[] = [
    { key: 'blocks', label: 'Blocks' },
    { key: 'settings', label: 'Settings' },
    { key: 'page', label: 'Page' }
  ]

  return (
    <div className={right ? css.right : css.left}>
      <div className={css.header}>
        <ul className={css.tabs}>
          {tabs.map((item) => (
            <div
              key={item.key}
              className={clsx(css.tab, {
                [css.active]: item.key === tab
              })}
              onClick={() => {
                if (item.key !== tab) {
                  setState((prev) => ({
                    ...prev,
                    tab: item.key
                  }))
                }
              }}
            >
              {item.label}
            </div>
          ))}
        </ul>
      </div>
      <div className={css.body}>
        <SidebarContent visible={tab === 'blocks'}>
          <BlockIcons />
        </SidebarContent>
        <SidebarContent visible={tab === 'settings'}>
          <BlockEditor />
        </SidebarContent>
        <SidebarContent visible={tab === 'page'}>
          <PageEditor />
        </SidebarContent>
      </div>
    </div>
  )
}

function SidebarContent({
  visible,
  children
}: {
  visible?: boolean
  children?: React.ReactNode
}) {
  const [created, setCreated] = useState(visible)
  const style = useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overflow: 'auto',
      display: visible ? 'block' : 'none'
    }),
    [visible]
  )

  useEffect(() => {
    if (visible) {
      setCreated(true)
    }
  }, [visible])

  return created || visible ? <div style={style}>{children}</div> : null
}

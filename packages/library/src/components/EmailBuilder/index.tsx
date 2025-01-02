import React, { useMemo } from 'react'
import type { EmailBuilderProps } from '../../types'
import {
  EmailBuilderConfigContext,
  EmailBuilderStateContext,
  SetEmailBuilderStateContext
} from '../../context'
import { namespace, varsClass } from '../../utils'
import { SvgSymbols } from '../SvgSymbols'
import { Sidebar } from '../Sidebar'
import clsx from 'clsx'

export function EmailBuilder({
  config,
  className,
  style,
  state,
  setState,
  sidebarPosition
}: EmailBuilderProps) {
  const css = useMemo(() => {
    const ns = namespace('EmailBuilder')
    return {
      root: clsx(varsClass(), ns()),
      left: clsx(ns('aside'), ns('aside-left')),
      right: clsx(ns('aside'), ns('aside-right')),
      main: ns('main')
    }
  }, [])

  const rightSidebar = sidebarPosition === 'right'

  const aside = (
    <div className={rightSidebar ? css.right : css.left}>
      <Sidebar />
    </div>
  )

  const main = <div className={css.main}></div>

  return (
    <EmailBuilderConfigContext.Provider value={config}>
      <SetEmailBuilderStateContext.Provider value={setState}>
        <EmailBuilderStateContext.Provider value={state}>
          <div className={clsx(className, css.root)} style={style}>
            {rightSidebar ? (
              <>
                {main}
                {aside}
              </>
            ) : (
              <>
                {aside}
                {main}
              </>
            )}
          </div>
          <SvgSymbols />
        </EmailBuilderStateContext.Provider>
      </SetEmailBuilderStateContext.Provider>
    </EmailBuilderConfigContext.Provider>
  )
}

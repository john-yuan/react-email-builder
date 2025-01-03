import clsx from 'clsx'
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
import { MainArea } from '../MainArea'

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
      root: clsx(varsClass(), ns())
    }
  }, [])

  const rightSidebar = sidebarPosition === 'right'
  const sidebar = <Sidebar right={rightSidebar} />
  const main = <MainArea />

  return (
    <EmailBuilderConfigContext.Provider value={config}>
      <SetEmailBuilderStateContext.Provider value={setState}>
        <EmailBuilderStateContext.Provider value={state}>
          <div className={clsx(className, css.root)} style={style}>
            {rightSidebar ? (
              <>
                {main}
                {sidebar}
              </>
            ) : (
              <>
                {sidebar}
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

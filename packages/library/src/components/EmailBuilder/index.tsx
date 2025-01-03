import clsx from 'clsx'
import React, { useMemo } from 'react'
import type { EmailBuilderProps } from '../../types'
import {
  EmailBuilderConfigContext,
  EmailBuilderSelectedBlockInfoContext,
  EmailBuilderStateContext,
  SetEmailBuilderStateContext
} from '../../context'
import { getSelectedBlock, namespace, varsClass } from '../../utils'
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
  const { blocks, selectedId } = state
  const selected = useMemo(
    () => getSelectedBlock(blocks, selectedId),
    [blocks, selectedId]
  )

  return (
    <EmailBuilderConfigContext.Provider value={config}>
      <SetEmailBuilderStateContext.Provider value={setState}>
        <EmailBuilderStateContext.Provider value={state}>
          <EmailBuilderSelectedBlockInfoContext.Provider value={selected}>
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
          </EmailBuilderSelectedBlockInfoContext.Provider>
        </EmailBuilderStateContext.Provider>
      </SetEmailBuilderStateContext.Provider>
    </EmailBuilderConfigContext.Provider>
  )
}

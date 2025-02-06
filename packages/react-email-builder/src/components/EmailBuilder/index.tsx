import clsx from 'clsx'
import React, { useMemo } from 'react'
import type { EmailBuilderProps } from '../../types'
import {
  EmailBuilderConfigContext,
  EmailBuilderDefaultFontStyleContext,
  EmailBuilderSelectedBlockInfoContext,
  EmailBuilderStateContext,
  SetEmailBuilderStateContext
} from '../../context'
import { getCss, getSelectedBlock, varsClass } from '../../utils'
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
  const css = getCss('EmailBuilder', (ns) => ({
    root: clsx(varsClass(), ns())
  }))

  const rightSidebar = sidebarPosition === 'right'
  const sidebar = <Sidebar right={rightSidebar} />
  const main = <MainArea />
  const { blocks, selectedId } = state
  const selected = useMemo(
    () => getSelectedBlock(blocks, selectedId),
    [blocks, selectedId]
  )
  const pageStyle = state.style

  const fontStyle = useMemo(
    () =>
      pageStyle
        ? {
            color: pageStyle.color ?? '#000',
            fontSize: pageStyle.fontSize ?? 14,
            fontFamily: pageStyle.fontFamily ?? 'Arial, helvetica, sans-serif'
          }
        : {},
    [pageStyle]
  )

  return (
    <EmailBuilderConfigContext.Provider value={config}>
      <SetEmailBuilderStateContext.Provider value={setState}>
        <EmailBuilderStateContext.Provider value={state}>
          <EmailBuilderSelectedBlockInfoContext.Provider value={selected}>
            <EmailBuilderDefaultFontStyleContext.Provider value={fontStyle}>
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
            </EmailBuilderDefaultFontStyleContext.Provider>
          </EmailBuilderSelectedBlockInfoContext.Provider>
        </EmailBuilderStateContext.Provider>
      </SetEmailBuilderStateContext.Provider>
    </EmailBuilderConfigContext.Provider>
  )
}

import React, { useCallback } from 'react'
import { getCss } from '../../utils'
import { Blocks } from '../Blocks'
import { useEmailBuilderState, useSetEmailBuilderState } from '../../hooks'

export function MainArea() {
  const css = getCss('MainArea', (ns) => ({
    root: ns(),
    header: ns('header'),
    body: ns('body'),
    email: ns('email-page')
  }))

  const state = useEmailBuilderState()
  const style = state.style || {}
  const setState = useSetEmailBuilderState()
  const clearSelected = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.target === e.currentTarget) {
        setState((prev) =>
          prev.selectedId
            ? {
                ...prev,
                selectedId: undefined
              }
            : prev
        )
      }
    },
    [setState]
  )

  const nil = undefined

  return (
    <div className={css.root}>
      <div className={css.header}></div>
      <div className={css.body} onClick={clearSelected}>
        <div
          className={css.email}
          onClick={clearSelected}
          style={{
            paddingTop: style.padding?.[0] ?? nil,
            paddingBottom: style.padding?.[2] ?? nil,
            backgroundColor: state.draggingType ? '#fff' : style.bgColor
          }}
        >
          <Blocks onClick={clearSelected} />
        </div>
      </div>
    </div>
  )
}

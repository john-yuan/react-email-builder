import React, { useCallback, useMemo } from 'react'
import { namespace } from '../../utils'
import { Blocks } from '../Blocks'
import { useEmailBuilderState, useSetEmailBuilderState } from '../../hooks'

export function MainArea() {
  const css = useMemo(() => {
    const ns = namespace('MainArea')
    return {
      root: ns(),
      header: ns('header'),
      body: ns('body'),
      email: ns('email-page')
    }
  }, [])

  const state = useEmailBuilderState()
  const style = state.pageStyle || {}
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

  return (
    <div className={css.root}>
      <div className={css.header}></div>
      <div className={css.body} onClick={clearSelected}>
        <div
          className={css.email}
          onClick={clearSelected}
          style={{
            paddingTop: style.paddingTop,
            paddingBottom: style.paddingTop,
            backgroundColor: style.bgColor
          }}
        >
          <Blocks onClick={clearSelected} />
        </div>
      </div>
    </div>
  )
}

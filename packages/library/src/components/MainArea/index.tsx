import React, { useMemo } from 'react'
import { namespace } from '../../utils'
import { Blocks } from '../Blocks'
import { useEmailBuilderState } from '../../hooks'

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

  return (
    <div className={css.root}>
      <div className={css.header}></div>
      <div className={css.body}>
        <div
          className={css.email}
          style={{
            paddingTop: style.paddingTop,
            paddingBottom: style.paddingTop,
            backgroundColor: style.bgColor
          }}
        >
          <Blocks />
        </div>
      </div>
    </div>
  )
}

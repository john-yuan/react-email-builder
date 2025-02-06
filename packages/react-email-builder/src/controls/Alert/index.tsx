import React from 'react'
import { getCss } from '../../utils'
import { Icon } from '../../components/Icon'

export interface Props {
  children?: React.ReactNode
  onClose?: () => void
  style?: React.CSSProperties
}

export function Alert({ children, onClose, style }: Props) {
  const css = getCss('Alert', (ns) => ({
    root: ns(),
    body: ns('body'),
    close: ns('close'),
    btn: ns('btn')
  }))

  return (
    <div className={css.root} style={style}>
      <div className={css.body}>{children}</div>
      {onClose ? (
        <div className={css.close}>
          <div className={css.btn} onClick={onClose}>
            <Icon name="close" />
          </div>
        </div>
      ) : null}
    </div>
  )
}

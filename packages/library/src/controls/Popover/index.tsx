import clsx from 'clsx'
import React from 'react'
import { createPortal } from 'react-dom'
import { css } from './hooks'

export interface Props {
  children?: React.ReactNode
  open?: boolean
  popoverRef: (node: HTMLDivElement | null) => void
  className?: string
  style?: React.CSSProperties
  noStyle?: boolean
  arrow?: boolean | React.ReactNode
}

export function Popover({
  className,
  children,
  style,
  open,
  popoverRef,
  noStyle,
  arrow
}: Props) {
  const { root, bg, body } = css()
  return open
    ? createPortal(
        <div
          ref={popoverRef}
          className={clsx(root, className, {
            [bg]: !noStyle
          })}
          style={style}
        >
          {arrow ? (
            <div className={css().arrow}>{arrow === true ? null : arrow}</div>
          ) : null}
          <div className={body}>{children}</div>
        </div>,
        document.body
      )
    : null
}

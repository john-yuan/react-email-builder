import React from 'react'
import clsx from 'clsx'
import { Popover } from '../Popover'
import { getCss } from '../../utils'

export interface Props {
  children?: React.ReactNode
  open?: boolean
  tooltipRef: (node: HTMLDivElement | null) => void
  className?: string
  style?: React.CSSProperties
}

export function Tooltip({
  open,
  tooltipRef,
  children,
  className,
  style
}: Props) {
  const css = getCss('Tooltip', (ns) => ({
    root: ns()
  }))

  return (
    <Popover
      popoverRef={tooltipRef}
      open={open}
      className={clsx(className, css.root)}
      style={style}
      noStyle
      arrow
    >
      {children}
    </Popover>
  )
}

import React from 'react'
import { createPortal } from 'react-dom'
import { getCss, varsClass } from '../../utils'
import clsx from 'clsx'

export interface Props {
  children?: React.ReactNode
  open?: boolean
  popoverRef: (node: HTMLDivElement | null) => void
  className?: string
  style?: React.CSSProperties
}

export function Popover({
  className,
  children,
  style,
  open,
  popoverRef
}: Props) {
  if (open) {
    const css = getCss('Popover', (ns) => ({
      root: clsx(varsClass(), ns())
    }))

    return createPortal(
      <div ref={popoverRef} className={clsx(css.root, className)} style={style}>
        {children}
      </div>,
      document.body
    )
  }

  return null
}

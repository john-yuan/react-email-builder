import React from 'react'
import { getCss } from '../../utils'
import type { SvgSymbolName } from '../SvgSymbols/symbols'

export interface Props {
  name: SvgSymbolName
  spinning?: boolean
  onClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
}

export function Icon({ name, spinning, onClick }: Props) {
  const id = '#reb-icon-' + name
  const css = getCss('Icon', (ns) => ({
    root: ns(),
    spinning: ns('spinning')
  }))
  return (
    <svg className={spinning ? css.spinning : css.root} onClick={onClick}>
      <use xlinkHref={id} />
    </svg>
  )
}

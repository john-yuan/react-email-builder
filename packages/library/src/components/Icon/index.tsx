import React, { useMemo } from 'react'
import { namespace } from '../../utils'
import type { SvgSymbolName } from '../SvgSymbols/symbols'

export interface Props {
  name: SvgSymbolName
  spinning?: boolean
}

export function Icon({ name, spinning }: Props) {
  const css = useMemo(() => {
    const ns = namespace('Icon')
    return {
      root: ns(),
      spinning: ns('spinning')
    }
  }, [])
  const id = '#reb-icon-' + name
  return (
    <svg className={spinning ? css.spinning : css.root}>
      <use xlinkHref={id} />
    </svg>
  )
}

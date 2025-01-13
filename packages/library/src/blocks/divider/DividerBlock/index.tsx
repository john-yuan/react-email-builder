import React from 'react'
import { useBlockStyle } from '../../../hooks'
import type { EmailBuilderBlock } from '../../../types'
import type { DividerBlockAttrs } from '../types'

export interface Props {
  block: EmailBuilderBlock<DividerBlockAttrs>
}

export function DividerBlock({ block }: Props) {
  const style = useBlockStyle(block)
  const attrs = block.attrs
  return (
    <div style={style}>
      <div
        style={{
          margin: 0,
          padding: 0,
          borderTop:
            `${attrs.height ?? 1}px ` +
            `${attrs.type || 'solid'} ` +
            `${attrs.color ?? '#eee'}`
        }}
      />
    </div>
  )
}

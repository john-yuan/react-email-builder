import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { DividerBlockAttrs } from '../types'
import { useBlockStyle } from '../../../hooks'

export interface Props {
  block: EmailBuilderBlock<DividerBlockAttrs>
}

export function DividerBlock({ block }: Props) {
  const style = useBlockStyle(block)
  return (
    <div style={style}>
      {block.type} - {block.id}
    </div>
  )
}

import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { ColumnsBlockAttrs } from '../types'
import { useBlockStyle } from '../../../hooks'

export interface Props {
  block: EmailBuilderBlock<ColumnsBlockAttrs>
}

export function ColumnsBlock({ block }: Props) {
  const style = useBlockStyle(block)
  return (
    <div style={style}>
      {block.type} - {block.id}
    </div>
  )
}

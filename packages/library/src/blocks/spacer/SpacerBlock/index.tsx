import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { SpacerBlockAttrs } from '../types'
import { useBlockStyle } from '../../../hooks'

export interface Props {
  block: EmailBuilderBlock<SpacerBlockAttrs>
}

export function SpacerBlock({ block }: Props) {
  const style = useBlockStyle(block)
  return (
    <div style={style}>
      {block.type} - {block.id}
    </div>
  )
}

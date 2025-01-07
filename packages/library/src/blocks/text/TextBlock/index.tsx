import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { TextBlockAttrs } from '../types'
import { useBlockStyle } from '../../../hooks'

export interface Props {
  block: EmailBuilderBlock<TextBlockAttrs>
}

export function TextBlock({ block }: Props) {
  const style = useBlockStyle(block)

  return (
    <div style={style}>
      {block.type} - {block.id}
    </div>
  )
}

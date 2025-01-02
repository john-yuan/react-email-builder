import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { TextBlockAttrs } from '../types'

export interface Props {
  block: EmailBuilderBlock<TextBlockAttrs>
}

export function TextBlock({ block }: Props) {
  return (
    <div>
      {block.type} - {block.id}
    </div>
  )
}

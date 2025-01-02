import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { SpacerBlockAttrs } from '../types'

export interface Props {
  block: EmailBuilderBlock<SpacerBlockAttrs>
}

export function SpacerBlock({ block }: Props) {
  return (
    <div>
      {block.type} - {block.id}
    </div>
  )
}

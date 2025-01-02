import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { DividerBlockAttrs } from '../types'

export interface Props {
  block: EmailBuilderBlock<DividerBlockAttrs>
}

export function DividerBlock({ block }: Props) {
  return (
    <div>
      {block.type} - {block.id}
    </div>
  )
}

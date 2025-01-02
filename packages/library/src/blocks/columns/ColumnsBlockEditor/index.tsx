import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { ColumnsBlockAttrs } from '../types'

export interface Props {
  block: EmailBuilderBlock<ColumnsBlockAttrs>
}

export function ColumnsBlockEditor({ block }: Props) {
  return (
    <div>
      {block.type} - {block.id}
    </div>
  )
}

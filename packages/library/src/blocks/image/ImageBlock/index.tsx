import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { ImageBlockAttrs } from '../types'

export interface Props {
  block: EmailBuilderBlock<ImageBlockAttrs>
}

export function ImageBlock({ block }: Props) {
  return (
    <div>
      {block.type} - {block.id}
    </div>
  )
}

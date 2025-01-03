import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { ImageBlockAttrs } from '../types'
import { useBlockStyle } from '../../../hooks'

export interface Props {
  block: EmailBuilderBlock<ImageBlockAttrs>
}

export function ImageBlock({ block }: Props) {
  const style = useBlockStyle(block)
  return (
    <div style={style}>
      {block.type} - {block.id}
    </div>
  )
}

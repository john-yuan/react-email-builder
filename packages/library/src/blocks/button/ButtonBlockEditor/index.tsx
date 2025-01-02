import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { ButtonBlockAttrs } from '../types'

export interface Props {
  block: EmailBuilderBlock<ButtonBlockAttrs>
}

export function ButtonBlockEditor({ block }: Props) {
  return (
    <div>
      {block.type} - {block.id}
    </div>
  )
}

import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { ButtonBlockAttrs } from '../types'
import { useBlockStyle } from '../../../hooks'

export interface Props {
  block: EmailBuilderBlock<ButtonBlockAttrs>
}

export function ButtonBlock({ block }: Props) {
  const style = useBlockStyle(block)
  return (
    <div style={style}>
      {block.type} - {block.id}
    </div>
  )
}

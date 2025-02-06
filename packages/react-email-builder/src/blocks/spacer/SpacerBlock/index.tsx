import React from 'react'
import { useBlockStyle } from '../../../hooks'
import type { EmailBuilderBlock } from '../../../types'
import type { SpacerBlockAttrs } from '../types'

export interface Props {
  block: EmailBuilderBlock<SpacerBlockAttrs>
}

export function SpacerBlock({ block }: Props) {
  const style = useBlockStyle(block)
  return (
    <div
      style={{
        ...style,
        height: block.attrs.height
      }}
    />
  )
}

import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { ImageBlockAttrs } from '../types'
import { useBlockStyle } from '../../../hooks'
import { Icon } from '../../../components/Icon'

export interface Props {
  block: EmailBuilderBlock<ImageBlockAttrs>
}

export function ImageBlock({ block }: Props) {
  const style = useBlockStyle(block)
  const attrs = block.attrs
  return (
    <div style={style}>
      <div
        style={{
          textAlign: block.attrs.align || 'center',
          fontSize: 0
        }}
      >
        {attrs.src ? (
          <img
            src={attrs.src}
            style={{
              display: 'inline-block',
              width:
                attrs.full !== 'no' ? '100%' : (block.attrs.width || 0) + 'px',
              maxWidth: '100%'
            }}
          />
        ) : (
          <div
            style={{
              display: 'inline-block',
              width:
                attrs.full !== 'no' ? '100%' : (block.attrs.width || 0) + 'px',
              maxWidth: '100%',
              background: '#f5f5f5',
              textAlign: 'center',
              padding: '64px 0',
              fontSize: 24,
              color: '#888'
            }}
          >
            <Icon name="image" />
          </div>
        )}
      </div>
    </div>
  )
}

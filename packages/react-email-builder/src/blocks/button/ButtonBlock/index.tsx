import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { ButtonBlockAttrs } from '../types'
import { useBlockStyle } from '../../../hooks'

export interface Props {
  block: EmailBuilderBlock<ButtonBlockAttrs>
}

export function ButtonBlock({ block }: Props) {
  const style = useBlockStyle(block)
  const attrs = block.attrs
  const p = attrs.padding || []
  const nil = undefined

  return (
    <div style={{ ...style, textAlign: attrs.align }}>
      <a
        style={{
          display: attrs.block === 'yes' ? 'block' : 'inline-block',
          paddingTop: p[0] ?? nil,
          paddingRight: p[1] ?? nil,
          paddingBottom: p[2] ?? nil,
          paddingLeft: p[3] ?? nil,
          backgroundColor: attrs.bgColor,
          color: attrs.color,
          borderRadius: attrs.borderRadius,
          fontFamily: attrs.fontFamily,
          fontSize: attrs.fontSize,
          lineHeight: attrs.lineHeight == null ? '' : attrs.lineHeight + '%',
          fontWeight: attrs.fontWeight,
          letterSpacing: attrs.letterSpacing,
          cursor: 'pointer',
          wordBreak: 'break-word',
          textDecoration: attrs.textDecoration || 'none'
        }}
        href={attrs.url}
        target={attrs.target}
        onClick={(e) => {
          e.preventDefault()
        }}
      >
        {attrs.text}
      </a>
    </div>
  )
}

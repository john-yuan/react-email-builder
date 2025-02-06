import React from 'react'
import { SVG } from './symbols'

export function SvgSymbols() {
  return (
    <div
      style={{
        position: 'fixed',
        overflow: 'hidden',
        width: 0,
        height: 0,
        bottom: 0,
        left: 0
      }}
      dangerouslySetInnerHTML={{ __html: SVG }}
    />
  )
}

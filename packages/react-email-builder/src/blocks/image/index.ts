import React from 'react'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import type { ImageBlockAttrs } from './types'
import { Icon } from '../../components/Icon'
import { ImageBlock } from './ImageBlock'
import { ImageBlockEditor } from './ImageBlockEditor'
import { createBlockAttrs, renderTag } from '../../utils/mjml'
import { normalizeUrl } from '../../utils'

export function imageBlock(): EmailBuilderBlockConfig<ImageBlockAttrs> {
  return {
    type: 'image',
    name: 'Image',
    icon: React.createElement(Icon, { name: 'image' }),
    createBlock: (base) => {
      const block = base as any as EmailBuilderBlock<ImageBlockAttrs>
      block.attrs = { width: 580, align: 'center' }
      return block
    },
    blockComponent: ImageBlock,
    editorComponent: ImageBlockEditor,
    renderMJML: (block) => {
      const { attrs } = block
      const fillParent = attrs.full !== 'no'
      return renderTag('mj-image', {
        attrs: createBlockAttrs(block, {
          ['fluid-on-mobile']: fillParent ? 'true' : null,
          src: attrs.src ? normalizeUrl(attrs.src) : null,
          align: attrs.align || 'center',
          width: fillParent ? null : (attrs.width || 0) + 'px',
          href: attrs.href ? normalizeUrl(attrs.href) : null,
          alt: attrs.alt || null
        })
      })
    }
  }
}

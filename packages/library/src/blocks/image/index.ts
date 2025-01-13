import React from 'react'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import type { ImageBlockAttrs } from './types'
import { Icon } from '../../components/Icon'
import { ImageBlock } from './ImageBlock'
import { ImageBlockEditor } from './ImageBlockEditor'

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
    editorComponent: ImageBlockEditor
  }
}

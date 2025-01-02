import React from 'react'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import type { TextBlockAttrs } from './types'
import { Icon } from '../../components/Icon'
import { TextBlock } from './TextBlock'
import { TextBlockEditor } from './TextBlockEditor'

export function textBlock(): EmailBuilderBlockConfig<TextBlockAttrs> {
  return {
    type: 'text',
    name: 'Text',
    icon: React.createElement(Icon, { name: 'text' }),
    createBlock: (base) => {
      const block = base as any as EmailBuilderBlock<TextBlockAttrs>
      return block
    },
    blockComponent: TextBlock,
    editorComponent: TextBlockEditor
  }
}

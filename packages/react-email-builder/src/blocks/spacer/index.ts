import React from 'react'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import type { SpacerBlockAttrs } from './types'
import { Icon } from '../../components/Icon'
import { SpacerBlock } from './SpacerBlock'
import { SpacerBlockEditor } from './SpacerBlockEditor'
import { createBlockAttrs, px, renderTag } from '../../utils/mjml'

export function spacerBlock(): EmailBuilderBlockConfig<SpacerBlockAttrs> {
  return {
    type: 'spacer',
    name: 'Spacer',
    icon: React.createElement(Icon, { name: 'spacer' }),
    createBlock: (base) => {
      const block = base as any as EmailBuilderBlock<SpacerBlockAttrs>
      block.attrs = { height: 32 }
      block.style.padding = undefined
      return block
    },
    blockComponent: SpacerBlock,
    editorComponent: SpacerBlockEditor,
    renderMJML: (block) => {
      return renderTag('mj-spacer', {
        attrs: createBlockAttrs(block, {
          height: px(block.attrs.height)
        })
      })
    }
  }
}

import React from 'react'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import type { SpacerBlockAttrs } from './types'
import { Icon } from '../../components/Icon'
import { SpacerBlock } from './SpacerBlock'
import { SpacerBlockEditor } from './SpacerBlockEditor'

export function spacerBlock(): EmailBuilderBlockConfig<SpacerBlockAttrs> {
  return {
    type: 'spacer',
    name: 'Spacer',
    icon: React.createElement(Icon, { name: 'spacer' }),
    createBlock: (base) => {
      const block = base as any as EmailBuilderBlock<SpacerBlockAttrs>
      block.attrs = {}
      return block
    },
    blockComponent: SpacerBlock,
    editorComponent: SpacerBlockEditor
  }
}

import React from 'react'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import type { DividerBlockAttrs } from './types'
import { Icon } from '../../components/Icon'
import { DividerBlock } from './DividerBlock'
import { DividerBlockEditor } from './DividerBlockEditor'

export function dividerBlock(): EmailBuilderBlockConfig<DividerBlockAttrs> {
  return {
    type: 'divider',
    name: 'Divider',
    icon: React.createElement(Icon, { name: 'divider' }),
    createBlock: (base) => {
      const block = base as any as EmailBuilderBlock<DividerBlockAttrs>
      block.attrs = { height: 1, type: 'solid', color: '#EEEEEE' }
      return block
    },
    blockComponent: DividerBlock,
    editorComponent: DividerBlockEditor
  }
}

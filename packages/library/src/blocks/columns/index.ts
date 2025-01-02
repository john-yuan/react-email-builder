import React from 'react'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import type { ColumnsBlockAttrs } from './types'
import { Icon } from '../../components/Icon'
import { ColumnsBlock } from './ColumnsBlock'
import { ColumnsBlockEditor } from './ColumnsBlockEditor'

export function columnsBlock(): EmailBuilderBlockConfig<ColumnsBlockAttrs> {
  return {
    type: 'columns',
    name: 'Columns',
    icon: React.createElement(Icon, { name: 'columns' }),
    createBlock: (base) => {
      const block = base as any as EmailBuilderBlock<ColumnsBlockAttrs>
      block.attrs = { blocks: [] }
      return block
    },
    blockComponent: ColumnsBlock,
    editorComponent: ColumnsBlockEditor
  }
}

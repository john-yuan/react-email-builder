import React from 'react'
import { Icon } from '../../components/Icon'
import { ColumnsBlock } from './ColumnsBlock'
import { ColumnsBlockEditor } from './ColumnsBlockEditor'
import { createColumn } from '../../utils'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import type { ColumnsBlockAttrs } from './types'

export function columnsBlock(): EmailBuilderBlockConfig<ColumnsBlockAttrs> {
  return {
    type: 'columns',
    name: 'Columns',
    icon: React.createElement(Icon, { name: 'columns' }),
    createBlock: (base) => {
      const block = base as any as EmailBuilderBlock<ColumnsBlockAttrs>
      block.attrs = { columns: [createColumn(), createColumn()] }
      block.blockStyle.padding = [20, 0, 20, 0]
      return block
    },
    blockComponent: ColumnsBlock,
    editorComponent: ColumnsBlockEditor
  }
}

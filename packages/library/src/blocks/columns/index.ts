import React from 'react'
import { Icon } from '../../components/Icon'
import { ColumnsBlock } from './ColumnsBlock'
import { ColumnsBlockEditor } from './ColumnsBlockEditor'
import { copyBlock, createColumn, generateId } from '../../utils'
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
      block.style.padding = [20, 0, 20, 0]
      return block
    },
    copyBlock: (block, config) => {
      return {
        ...block,
        id: generateId(),
        attrs: {
          ...block.attrs,
          columns: block.attrs.columns.map((column) => ({
            ...column,
            id: generateId(),
            blocks: column.blocks.map((columnBlock) =>
              copyBlock(columnBlock, config)
            )
          }))
        }
      }
    },
    blockComponent: ColumnsBlock,
    editorComponent: ColumnsBlockEditor
  }
}

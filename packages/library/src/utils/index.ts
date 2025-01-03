import type { ColumnsBlockAttrs } from '../blocks/columns/types'
import type { PlaceholderAttrs } from '../blocks/placeholder/types'
import type {
  EmailBuilderBlock,
  EmailBuilderConfig,
  EmailBuilderSelectedBlockInfo
} from '../types'

let counter = 0
let prefix: string | null = null

export function generateId() {
  if (prefix == null) {
    prefix = Math.random().toFixed(6).slice(-6)
  }

  if (counter >= Number.MAX_SAFE_INTEGER) {
    counter = 0
  }

  counter += 1

  const time = Date.now().toString().slice(-6)

  return prefix + '-' + time + '-' + counter
}

export function createBaseBlock(type: string): EmailBuilderBlock {
  return {
    id: generateId(),
    type,
    attrs: {},
    blockStyle: {
      padding: [10, 20, 10, 20]
    },
    sectionStyle: {}
  }
}

export function createPlaceholder(
  attrs?: PlaceholderAttrs
): EmailBuilderBlock<PlaceholderAttrs> {
  const block = createBaseBlock(
    'placeholder'
  ) as EmailBuilderBlock<PlaceholderAttrs>

  block.attrs = attrs || {}

  return block
}

export function createBlock(
  config: EmailBuilderConfig,
  type: string
): EmailBuilderBlock {
  const block = config.blocks.find((b) => b.type === type)
  const base: EmailBuilderBlock = createBaseBlock(type)

  if (block && block.createBlock) {
    return block.createBlock(base)
  }

  return base
}

export function namespace(module: string) {
  const base = 'REB-' + module

  return (className?: string) => {
    return className ? base + '-' + className : base
  }
}

export function varsClass() {
  return namespace('vars')()
}

export function getSelectedBlock(
  blocks: EmailBuilderBlock[],
  selectedId?: string
): EmailBuilderSelectedBlockInfo {
  if (selectedId) {
    for (let i = 0; i < blocks.length; i += 1) {
      const block = blocks[i]

      if (block.id === selectedId) {
        return {
          block,
          first: i === 0,
          last: i === blocks.length - 1
        }
      }

      if (block.type === 'columns') {
        const { columns } = (block as EmailBuilderBlock<ColumnsBlockAttrs>)
          .attrs
        for (let j = 0; j < columns.length; j += 1) {
          const column = columns[j]
          const columnBlocks = column.blocks

          for (let k = 0; k < columnBlocks.length; k += 1) {
            const columnBlock = columnBlocks[k]

            if (columnBlock.id === selectedId) {
              return {
                columns: block,
                column,
                block: columnBlock,
                first: k === 0,
                last: k === columnBlocks.length - 1
              }
            }
          }
        }
      }
    }
  }

  return {}
}

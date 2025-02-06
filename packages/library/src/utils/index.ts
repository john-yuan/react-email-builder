import type {
  ColumnsBlockAttrs,
  EmailBuilderColumn
} from '../blocks/columns/types'
import type { PlaceholderAttrs } from '../blocks/placeholder/types'
import type {
  EmailBuilderBlock,
  EmailBuilderConfig,
  EmailBuilderSelectedBlockInfo,
  EmailBuilderState,
  SerializedEmailBuilderState
} from '../types'

let counter = -1

export function generateId() {
  if (counter > 999999) {
    counter = -1
  }

  counter += 1

  return Date.now().toString(16) + '-' + counter.toString(16)
}

export function createBaseBlock(type: string): EmailBuilderBlock {
  return {
    id: generateId(),
    type,
    attrs: {},
    style: {
      padding: [10, 20, 10, 20]
    }
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

export function createColumn(): EmailBuilderColumn {
  return {
    id: generateId(),
    attrs: {},
    blocks: [createPlaceholder({ inColumn: true })]
  }
}

export function createBlock(
  config: EmailBuilderConfig,
  type: string
): EmailBuilderBlock {
  const block = config.blocks.find((b) => b.type === type)
  const base: EmailBuilderBlock = createBaseBlock(type)

  if (block && block.createBlock) {
    return block.createBlock(base, config)
  }

  return base
}

export function copyBlock(
  block: EmailBuilderBlock,
  config: EmailBuilderConfig
): EmailBuilderBlock {
  const copy = config.blocks.find((b) => b.type === block.type)?.copyBlock
  return copy ? copy(block, config) : { ...block, id: generateId() }
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

const mCss: Record<string, any> = {}

export function getCss<T extends object = any>(
  module: string,
  factory: (ns: (className?: string) => string) => T
): T {
  let css = mCss[module]

  if (!css) {
    css = factory(namespace(module))
    mCss[module] = css
  }
  return css
}

export function getDefaultFonts() {
  return [
    {
      value: 'Arial, helvetica, sans-serif',
      label: 'Arial'
    },
    {
      value: "'Arial black', helvetica, sans-serif",
      label: 'Arial black'
    },
    {
      value: "'Comic sans ms', cursive",
      label: 'Comic sans ms'
    },
    {
      value: "'Courier new', courier, monospace",
      label: 'Courier new'
    },
    {
      value: 'garamond, "times new roman", serif',
      label: 'Garamond'
    },
    {
      value: 'Georgia, serif',
      label: 'Georgia'
    },
    {
      value: 'Impact, Haettenschweiler',
      label: 'Impact'
    },
    {
      value: "'Lucida sans unicode', 'lucida grande', sans-serif",
      label: 'Lucida sans unicode'
    },
    {
      value:
        "Palatino, 'Palatino Linotype', 'Palatino LT STD', 'Book Antiqua', Georgia, serif",
      label: 'Palatino'
    },
    {
      value: 'Tahoma, geneva, sans-serif',
      label: 'Tahoma'
    },
    {
      value: "'Times new roman', times, serif",
      label: 'Times new roman'
    },
    {
      value: "'Trebuchet ms', helvetica, sans-serif",
      label: 'Trebuchet ms'
    },
    {
      value: 'Verdana, geneva, sans-serif',
      label: 'Verdana'
    }
  ]
}

export function isAbsoluteUrl(url: string) {
  return /^[a-z][a-z0-9\-.+]*:/i.test(url) || url.startsWith('//')
}

export function normalizeUrl(url?: string | null) {
  if (!url) {
    return ''
  }

  if (url.startsWith('//')) {
    return 'https:' + url
  }

  return isAbsoluteUrl(url) ? url : 'https://' + url
}

export function serializeEmailBuilderState(
  config: EmailBuilderConfig,
  state: EmailBuilderState
): SerializedEmailBuilderState {
  const exportBlock = (block: EmailBuilderBlock) => {
    const blockConfig = config.blocks.find((b) => b.type === block.type)
    const exportJSON = blockConfig?.exportJSON
    const serialized: EmailBuilderBlock<any> = {
      ...block,
      attrs: exportJSON ? exportJSON(block.attrs) : block.attrs
    }

    if (serialized.type === 'columns') {
      let attrs = serialized.attrs as ColumnsBlockAttrs
      attrs = {
        ...attrs,
        columns: attrs.columns.map((column) => ({
          ...column,
          blocks: column.blocks.map(exportBlock)
        }))
      }

      serialized.attrs = attrs
    }

    return serialized
  }

  return {
    style: state.style,
    blocks: state.blocks.map(exportBlock)
  }
}

export function deserializeEmailBuilderState(
  config: EmailBuilderConfig,
  state: SerializedEmailBuilderState
): EmailBuilderState {
  const importBlock = (block: EmailBuilderBlock) => {
    const blockConfig = config.blocks.find((b) => b.type === block.type)
    const importJSON = blockConfig?.importJSON
    const deserialized: EmailBuilderBlock = {
      ...block,
      attrs: importJSON ? importJSON(block.attrs) : block.attrs
    }

    deserialized.attrs = deserialized.attrs || {}
    deserialized.style = deserialized.style || {}

    if (deserialized.type === 'columns') {
      let attrs = deserialized.attrs as ColumnsBlockAttrs
      attrs = {
        ...attrs,
        columns: attrs.columns.map((column) => ({
          ...column,
          blocks: column.blocks.map(importBlock)
        }))
      }
      deserialized.attrs = attrs
    }

    return deserialized
  }

  return {
    style: state.style,
    blocks: state.blocks.map(importBlock)
  }
}

export function createEmailBuilderState(
  initialState?: EmailBuilderState | (() => EmailBuilderState | null) | null
): EmailBuilderState {
  let state: EmailBuilderState = {
    style: {
      padding: [32, 0, 32, 0],
      bgColor: '#FFFFFF'
    },
    blocks: [createPlaceholder()]
  }

  if (typeof initialState === 'function') {
    const createdState = initialState()
    state = createdState || state
  } else if (initialState) {
    state = initialState
  }

  if (!state.blocks.length) {
    state = {
      ...state,
      blocks: [createPlaceholder()]
    }
  }

  return state
}

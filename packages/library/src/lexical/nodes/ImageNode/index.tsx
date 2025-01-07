import type {
  DOMConversionMap,
  EditorConfig,
  LexicalEditor,
  NodeKey,
  SerializedLexicalNode,
  Spread
} from 'lexical'

import React, { useCallback } from 'react'
import { $setSelection, DecoratorNode } from 'lexical'
import { Icon } from '../../../components/Icon'

export type SerializedImageNode = Spread<
  {
    src: string
  },
  SerializedLexicalNode
>

export class ImageNode extends DecoratorNode<React.ReactNode> {
  __src: string

  static getType(): string {
    return 'image'
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__key)
  }

  static importJSON(node: SerializedImageNode): ImageNode {
    return new ImageNode(node.src)
  }

  constructor(src: string, key?: NodeKey) {
    super(key)
    this.__src = src
  }

  exportDOM() {
    const img = document.createElement('img')

    img.setAttribute('src', this.__src)
    img.style.maxWidth = '100%'

    return { element: img }
  }

  static importDOM(): DOMConversionMap {
    return {
      img: () => ({
        conversion: (node: Node) => {
          const img = node as HTMLImageElement
          return { node: $createImageNode(img.src) }
        },
        priority: 0
      })
    }
  }

  exportJSON(): SerializedLexicalNode & { src: string } {
    return {
      type: 'image',
      version: 1,
      src: this.__src
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const theme = config.theme
    const className = theme.image
    if (className !== undefined) {
      span.className = className
    }
    span.style.display = 'inline-block'
    span.style.maxWidth = '100%'
    return span
  }

  updateDOM(): false {
    return false
  }

  decorate(editor: LexicalEditor): React.ReactNode {
    return (
      <ImageContent
        src={this.__src}
        onSelect={() => {
          editor.update(() => {
            const selection = this.selectNext()
            if (selection) {
              $setSelection(selection)
            }
          })
        }}
      />
    )
  }
}

function ImageContent({
  src,
  onSelect
}: {
  src: string
  onSelect: () => void
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
      const span = e.currentTarget

      span.style.outline = '1px solid blue'

      const onClickOutside = () => {
        window.removeEventListener('click', onClickOutside, true)
        span.style.outline = ''
      }

      window.addEventListener('click', onClickOutside, true)
    },
    []
  )

  if (!src) {
    return (
      <span style={{ margin: '0 4px', opacity: '0.8', whiteSpace: 'nowrap' }}>
        <Icon name="loading" spinning />
      </span>
    )
  }

  return (
    <img
      src={src}
      style={{ maxWidth: '100%' }}
      onClick={(e) => {
        handleClick(e)
        onSelect()
      }}
    />
  )
}

export function $createImageNode(src: string) {
  return new ImageNode(src)
}

import React from 'react'
import type { SerializedEditorState } from 'lexical'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import type { SerializedTextBlockAttrs, TextBlockAttrs } from './types'
import { Icon } from '../../components/Icon'
import { TextBlock } from './TextBlock'

export function textBlock(): EmailBuilderBlockConfig<
  TextBlockAttrs,
  SerializedTextBlockAttrs
> {
  return {
    type: 'text',
    name: 'Text',
    icon: React.createElement(Icon, { name: 'text' }),
    createBlock: (base) => {
      const block = base as any as EmailBuilderBlock<TextBlockAttrs>
      return block
    },
    blockComponent: TextBlock,
    exportJSON: (attrs) => {
      let editorState: SerializedEditorState | undefined

      if (attrs.editorState) {
        if (typeof attrs.editorState === 'string') {
          try {
            editorState = JSON.parse(attrs.editorState)
          } catch (err) {
            // ignore
          }
        } else {
          editorState = attrs.editorState.toJSON()
        }
      }

      return {
        html: attrs.html,
        editorState
      }
    },
    importJSON: (json) => {
      return {
        html: json.html,
        editorState: JSON.stringify(json.editorState)
      }
    }
  }
}

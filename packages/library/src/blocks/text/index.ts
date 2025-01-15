import React from 'react'
import type { SerializedEditorState } from 'lexical'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import type { SerializedTextBlockAttrs, TextBlockAttrs } from './types'
import { Icon } from '../../components/Icon'
import { TextBlock } from './TextBlock'
import {
  createBlockAttrs,
  renderTag,
  replaceHtmlVariables
} from '../../utils/mjml'

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
    },
    renderMJMLHeadTags: () => {
      return renderTag('mj-style', {
        children: [
          '.REB-Lexical-editor p { margin: 0px; }',
          '.REB-Lexical-editor a { color: #0000EE; text-decoration: none; }',
          '.REB-Lexical-editor a:hover { text-decoration: underline; }',
          '.REB-Lexical-text-underline { text-decoration: underline; }',
          '.REB-Lexical-text-strikethrough { text-decoration: line-through; }',
          '.REB-Lexical-text-underline-strikethrough { text-decoration: underline line-through; }',
          '.REB-Lexical-text-italic { text-decoration: italic; }'
        ]
      })
    },
    renderMJML: (block, options) => {
      return renderTag('mj-text', {
        attrs: createBlockAttrs(block, {
          'css-class': 'REB-Lexical-editor',
          'line-height': '1.45'
        }),
        children: replaceHtmlVariables(
          block.attrs.html,
          options.replaceVariable
        )
      })
    }
  }
}

import { useState } from 'react'
import { LinkNode } from '@lexical/link'
import type {
  InitialConfigType,
  InitialEditorStateType
} from '@lexical/react/LexicalComposer'
import { ImageNode } from '../nodes/ImageNode'
import { VariableNode } from '../nodes/VariableNode'
import { getCss } from '../../utils'

export function useLexicalConfig(initialState?: InitialEditorStateType) {
  return useState<{
    css: {
      editor: string
      placeholder: string
    }
    config: InitialConfigType
  }>(() => {
    const css = getCss('Lexical', (ns) => ({
      editor: ns('editor'),
      placeholder: ns('placeholder')
    }))

    const text = getCss('Lexical-text', (ns) => ({
      underline: ns('underline'),
      strikethrough: ns('strikethrough'),
      underlineStrikethrough: ns('underline-strikethrough'),
      italic: ns('italic')
    }))

    return {
      css,
      config: {
        namespace: 'react-email-builder',
        editorState: initialState,
        theme: { text },
        nodes: [ImageNode, VariableNode, LinkNode],
        onError: (err) => {
          console.error(err)
        }
      }
    }
  })
}

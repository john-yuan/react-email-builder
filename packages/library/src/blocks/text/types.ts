import type { SerializedEditorState } from 'lexical'
import type { TextEditorState } from '../../types'

export type TextBlockAttrs = TextEditorState

export interface SerializedTextBlockAttrs {
  html?: string
  editorState?: SerializedEditorState
}

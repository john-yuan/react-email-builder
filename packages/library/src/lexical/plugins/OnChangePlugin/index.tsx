import { useEffect } from 'react'
import { $generateHtmlFromNodes } from '@lexical/html'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import type { TextEditorState } from '../../../types'

export function OnChangePlugin({
  onChange
}: {
  onChange: (state: TextEditorState) => void
}) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        onChange({
          editorState,
          html: $generateHtmlFromNodes(editor, null)
        })
      })
    })
  }, [editor, onChange])

  return null
}

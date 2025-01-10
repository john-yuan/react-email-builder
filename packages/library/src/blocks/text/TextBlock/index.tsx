import React, { memo, useCallback } from 'react'
import type { EmailBuilderBlock, TextEditorState } from '../../../types'
import type { TextBlockAttrs } from '../types'
import {
  useBlockAttrsEditor,
  useBlockStyle,
  useEmailBuilderConfig,
  useEmailBuilderState
} from '../../../hooks'
import { useLexicalConfig } from '../../../lexical/hooks'
import {
  LexicalComposer,
  type InitialConfigType
} from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { OnChangePlugin } from '../../../lexical/plugins/OnChangePlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { DragDropPasteImagePlugin } from '../../../lexical/plugins/DragDropPasteImagePlugin'
import { ToolbarPlugin } from '../../../lexical/plugins/ToolbarPlugin'
import { getCss } from '../../../utils'

const TextEditor = memo(function TextEditor({
  selected,
  style,
  config,
  editorClassName,
  placeholderClassName,
  onChange
}: {
  selected?: boolean
  style?: React.CSSProperties
  config: InitialConfigType
  editorClassName: string
  placeholderClassName: string
  onChange: (state: TextEditorState) => void
}) {
  const { upload, textEditor } = useEmailBuilderConfig()
  const { placeholder, ...toolbar } = textEditor || {}
  const css = getCss('TextBlock', (ns) => ({
    root: ns(),
    wrapper: ns('wrapper'),
    toolbar: ns('toolbar'),
    body: ns('body')
  }))

  return (
    <div className={css.root}>
      <LexicalComposer initialConfig={config}>
        {selected ? (
          <div className={css.wrapper}>
            <div className={css.toolbar}>
              <ToolbarPlugin upload={upload} {...toolbar} />
            </div>
          </div>
        ) : null}
        <div className={css.body}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable className={editorClassName} style={style} />
            }
            placeholder={
              <div className={placeholderClassName} style={style}>
                {placeholder ?? 'Enter some text...'}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <LinkPlugin attributes={{ target: '_blank', rel: '' }} />
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange} />
        {upload ? <DragDropPasteImagePlugin upload={upload} /> : null}
      </LexicalComposer>
    </div>
  )
})

export interface Props {
  block: EmailBuilderBlock<TextBlockAttrs>
}

export function TextBlock({ block }: Props) {
  const { selectedId } = useEmailBuilderState()
  const [{ css, config }] = useLexicalConfig(block.attrs.editorState)
  const style = useBlockStyle(block)
  const setAttrs = useBlockAttrsEditor(block)
  const onChange = useCallback(
    (state: TextEditorState) => {
      setAttrs({
        html: state.html,
        editorState: state.editorState
      })
    },
    [setAttrs]
  )

  return (
    <TextEditor
      style={style}
      selected={block.id === selectedId}
      editorClassName={css.editor}
      placeholderClassName={css.placeholder}
      config={config}
      onChange={onChange}
    />
  )
}

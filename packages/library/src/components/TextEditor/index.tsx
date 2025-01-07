import clsx from 'clsx'
import React, { memo, useEffect, useMemo } from 'react'
import type {
  FileUploadFunction,
  TextEditorState,
  TextEditorVariable
} from '../../types'
import { getCss, varsClass } from '../../utils'
import { useLexicalConfig } from '../../lexical/hooks'
import { SvgSymbols } from '../SvgSymbols'

import type {
  InitialConfigType} from '@lexical/react/LexicalComposer';
import {
  LexicalComposer
} from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateHtmlFromNodes } from '@lexical/html'
import { ToolbarPlugin } from '../../lexical/plugins/ToolbarPlugin'

const LexicalTextEditor = memo(InnerTextEditor)

export interface Props {
  /**
   * The placeholder text.
   */
  placeholder?: string

  /**
   * The editor style.
   */
  style?: React.CSSProperties

  /**
   * The text editor state.
   */
  state: TextEditorState

  /**
   * A function to update text editor state.
   */
  setState: React.Dispatch<React.SetStateAction<TextEditorState>>

  /**
   * A function upload file.
   */
  upload?: FileUploadFunction

  /**
   * The variable list.
   */
  variables?: TextEditorVariable[]
}

export function TextEditor({
  placeholder,
  style,
  state,
  setState,
  upload,
  variables
}: Props) {
  const [{ css, config }] = useLexicalConfig(state.editorState)

  return (
    <LexicalTextEditor
      config={config}
      style={style}
      placeholder={placeholder}
      onChange={setState}
      upload={upload}
      variables={variables}
      editorClassName={css.editor}
      placeholderClassName={css.placeholder}
    />
  )
}

function InnerTextEditor({
  style,
  config,
  onChange,
  editorClassName,
  placeholder,
  placeholderClassName,
  upload,
  variables
}: {
  style?: React.CSSProperties
  config: InitialConfigType
  onChange: (state: TextEditorState) => void
  editorClassName?: string
  placeholderClassName?: string
  placeholder?: string
  upload?: FileUploadFunction
  variables?: TextEditorVariable[]
}) {
  const css = getCss('TextEditor', (ns) => ({
    root: clsx(varsClass(), ns()),
    toolbar: ns('toolbar'),
    body: ns('body')
  }))

  const { editorStyle, placeholderStyle } = useMemo(
    () => ({
      editorStyle: {
        ...style,
        padding: style?.padding ? style.padding : 16
      },
      placeholderStyle: {
        padding: style?.padding ? style.padding : 16
      }
    }),
    [style]
  )

  return (
    <div className={css.root}>
      <LexicalComposer initialConfig={config}>
        <div className={css.toolbar}>
          <ToolbarPlugin upload={upload} variables={variables} />
        </div>
        <div className={css.body}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={editorClassName}
                style={editorStyle}
              />
            }
            placeholder={
              <div className={placeholderClassName} style={placeholderStyle}>
                {placeholder || 'Enter some text...'}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <LinkPlugin attributes={{ target: '_blank', rel: '' }} />
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange} />
      </LexicalComposer>
      <SvgSymbols />
    </div>
  )
}

function OnChangePlugin({
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
  }, [editor])

  return null
}

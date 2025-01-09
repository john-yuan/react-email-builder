import clsx from 'clsx'
import React, { memo, useEffect, useMemo } from 'react'
import { getCss, varsClass } from '../../utils'
import { useLexicalConfig } from '../../lexical/hooks'
import { SvgSymbols } from '../SvgSymbols'
import { ToolbarPlugin } from '../../lexical/plugins/ToolbarPlugin'
import type { TextEditorState } from '../../types'
import type { Props as ToolbarPluginProps } from '../../lexical/plugins/ToolbarPlugin'

import type { InitialConfigType } from '@lexical/react/LexicalComposer'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateHtmlFromNodes } from '@lexical/html'

const LexicalTextEditor = memo(InnerTextEditor)

export interface Props extends ToolbarPluginProps {
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
}

export function TextEditor({
  placeholder,
  style,
  state,
  setState,
  ...props
}: Props) {
  const [{ css, config }] = useLexicalConfig(state.editorState)

  return (
    <LexicalTextEditor
      config={config}
      style={style}
      placeholder={placeholder}
      onChange={setState}
      editorClassName={css.editor}
      placeholderClassName={css.placeholder}
      {...props}
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
  ...props
}: {
  style?: React.CSSProperties
  config: InitialConfigType
  onChange: (state: TextEditorState) => void
  editorClassName?: string
  placeholderClassName?: string
  placeholder?: string
} & ToolbarPluginProps) {
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
          <ToolbarPlugin {...props} />
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
  }, [editor, onChange])

  return null
}

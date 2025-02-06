import React, { useCallback, useMemo, useState } from 'react'
import type { TextEditorState, TextEditorVariable } from '../../../../react-email-builder/es'
import { TextEditor } from '../../../../react-email-builder/es'

export default function App() {
  const [state, setState] = useState<TextEditorState>({})
  const style = useMemo<React.CSSProperties>(
    () => ({
      minHeight: 100,
      maxHeight: 200,
      overflow: 'auto'
    }),
    []
  )

  const upload = useCallback(async (file: File) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { url: URL.createObjectURL(file) }
  }, [])

  const variables = useMemo<TextEditorVariable[]>(
    () => [
      {
        key: 'receiver.name',
        label: 'Receiver Name',
        placeholder: '{{Receiver Name}}'
      },
      {
        key: 'receiver.email',
        label: 'Receiver Email',
        placeholder: '{{Receiver Email}}'
      }
    ],
    []
  )

  return (
    <div>
      <TextEditor
        state={state}
        setState={setState}
        style={style}
        upload={upload}
        variables={variables}
      />
    </div>
  )
}

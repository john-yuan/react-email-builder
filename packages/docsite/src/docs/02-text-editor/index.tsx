import React, { useMemo, useState } from 'react'
import type { TextEditorState } from 'react-email-builder';
import { TextEditor } from 'react-email-builder'

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
  return (
    <div>
      <TextEditor state={state} setState={setState} style={style} />
    </div>
  )
}

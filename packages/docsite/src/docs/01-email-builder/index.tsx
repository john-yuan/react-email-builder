import { useCallback, useEffect, useMemo, useState } from 'react'
import type { EmailBuilderConfig, EmailBuilderState } from 'react-email-builder'
import {
  buttonBlock,
  columnsBlock,
  createBlock,
  deserializeEmailBuilderState,
  dividerBlock,
  EmailBuilder,
  imageBlock,
  serializeEmailBuilderState,
  spacerBlock,
  textBlock
} from 'react-email-builder'
import 'react-email-builder/styles.css'

const EMAIL_KEY = 'docs:email'

const config: EmailBuilderConfig = {
  upload: async (file: File) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { url: URL.createObjectURL(file) }
  },
  textEditor: {
    variables: [
      {
        value: 'receiver.name',
        label: 'Receiver Name',
        placeholder: '{{Receiver Name}}'
      },
      {
        value: 'receiver.email',
        label: 'Receiver Email',
        placeholder: '{{Receiver Email}}'
      }
    ]
  },
  blocks: [
    columnsBlock(),
    buttonBlock(),
    dividerBlock(),
    textBlock(),
    imageBlock(),
    spacerBlock()
  ]
}

export default function App() {
  const [key, setKey] = useState(0)
  const [state, setState] = useState<EmailBuilderState>({
    pageStyle: {
      padding: [32, 0, 32, 0],
      bgColor: '#ffffff'
    },
    blocks: [createBlock(config, 'button'), createBlock(config, 'text')]
  })

  const editorStyle = useMemo<React.CSSProperties>(
    () => ({
      height: 'calc(100vh - 60px)'
    }),
    []
  )

  const deserialize = useCallback(() => {
    const text = localStorage.getItem(EMAIL_KEY)

    if (text) {
      const json = JSON.parse(text)
      const state = deserializeEmailBuilderState(config, json)
      console.log(state)
      setKey((prev) => prev + 1)
      setState(state)
    }
  }, [])

  useEffect(() => {
    deserialize()
  }, [deserialize])

  return (
    <div style={{ padding: 14, background: '#f1f2f3' }}>
      <div style={{ height: 32 }}>
        <button
          onClick={() => {
            const json = serializeEmailBuilderState(config, state)
            console.log(json)
            localStorage.setItem(EMAIL_KEY, JSON.stringify(json))
          }}
        >
          serialize
        </button>
        <button onClick={deserialize}>deserialize</button>
      </div>
      <div style={{ background: '#fff', maxWidth: '1000px', margin: '0 auto' }}>
        <EmailBuilder
          key={key}
          config={config}
          state={state}
          setState={setState}
          style={editorStyle}
        />
      </div>
    </div>
  )
}

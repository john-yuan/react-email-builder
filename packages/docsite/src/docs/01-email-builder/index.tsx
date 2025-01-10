import { useMemo, useState } from 'react'
import type { EmailBuilderConfig, EmailBuilderState } from 'react-email-builder'
import {
  buttonBlock,
  columnsBlock,
  createBlock,
  dividerBlock,
  EmailBuilder,
  imageBlock,
  spacerBlock,
  textBlock
} from 'react-email-builder'
import 'react-email-builder/styles.css'

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
  const [state, setState] = useState<EmailBuilderState>({
    pageStyle: {
      padding: [32, 0, 32, 0],
      bgColor: '#ffffff'
    },
    blocks: [createBlock(config, 'button'), createBlock(config, 'text')]
  })

  const editorStyle = useMemo<React.CSSProperties>(
    () => ({
      height: 'calc(100vh - 28px)'
    }),
    []
  )

  return (
    <div style={{ padding: 14, background: '#f1f2f3' }}>
      <div style={{ background: '#fff', maxWidth: '1000px', margin: '0 auto' }}>
        <EmailBuilder
          config={config}
          state={state}
          setState={setState}
          style={editorStyle}
        />
      </div>
    </div>
  )
}

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
      paddingTop: 32,
      paddingBottom: 32,
      bgColor: '#ffffff'
    },
    blocks: [
      createBlock(config, 'button'),
      createBlock(config, 'spacer'),
      createBlock(config, 'divider')
    ]
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

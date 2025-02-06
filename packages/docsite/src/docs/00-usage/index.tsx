import { useState } from 'react'
import {
  buttonBlock,
  columnsBlock,
  createEmailBuilderState,
  dividerBlock,
  EmailBuilder,
  imageBlock,
  spacerBlock,
  textBlock
} from 'react-email-builder'
import 'react-email-builder/styles.css'
import type { EmailBuilderConfig } from 'react-email-builder'

const config: EmailBuilderConfig = {
  blocks: [
    columnsBlock(),
    buttonBlock(),
    dividerBlock(),
    textBlock(),
    imageBlock(),
    spacerBlock()
  ],
  upload: async (file: File) => {
    // mock file upload
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { url: URL.createObjectURL(file) }
  }
}

export default function App() {
  const [state, setState] = useState(() => createEmailBuilderState())
  return (
    <EmailBuilder
      config={config}
      style={{ height: 800, width: 1200, margin: '16px auto' }}
      state={state}
      setState={setState}
    />
  )
}

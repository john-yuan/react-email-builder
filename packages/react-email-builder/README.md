# React Email Builder

[![npm version](https://img.shields.io/npm/v/react-email-builder.svg)](https://www.npmjs.com/package/react-email-builder)

A simple React drag and drop email builder.

```sh
npm i react-email-builder
```

## Usage

```tsx
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
```

This package provides a function named `generateMJML` that can be used to generate [MJML](https://mjml.io/) code from the email builder state. Here is an example:

```tsx
// You can use the mjml-browser package to convert the mjml to html
const mjml = generateMJML({ state, config })
```

To serialize email build state, please use `serializeEmailBuilderState`. For example:

```tsx
// You can save JSON.string(serialized) to your database
const serialized = serializeEmailBuilderState(config, state)
```

To deserialize email build state, please use `deserializeEmailBuilderState`. For example:

```tsx
const state = deserializeEmailBuilderState(config, serialized)
```

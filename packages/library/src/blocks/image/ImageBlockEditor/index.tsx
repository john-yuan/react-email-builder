import React, { useState } from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { ImageBlockAttrs } from '../types'
import { Field } from '../../../controls/Field'
import { TextInput } from '../../../controls/TextInput'
import { useBlockAttrsEditor, useEmailBuilderConfig } from '../../../hooks'
import { Select } from '../../../controls/Select'
import { SizeInput } from '../../../controls/SizeInput'
import { FileButton } from '../../../controls/FileButton'
import { Alert } from '../../../controls/Alert'

export interface Props {
  block: EmailBuilderBlock<ImageBlockAttrs>
}

export function ImageBlockEditor({ block }: Props) {
  const { attrs } = block
  const setAttrs = useBlockAttrsEditor(block)
  return (
    <>
      <Field label="Image URL" vertical>
        <TextInput
          textarea
          value={attrs.src}
          onChange={(src) => {
            setAttrs({ src })
          }}
        />
        <ImageButton
          onSuccess={(src) => {
            setAttrs({ src })
          }}
        />
      </Field>

      <Field label="Fill parent width">
        <Select
          value={attrs.full || 'yes'}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]}
          onChange={(full) => {
            setAttrs({ full: full === 'no' ? 'no' : undefined })
          }}
        />
      </Field>
      <Field label="Width">
        <SizeInput
          value={attrs.width}
          unit="px"
          min={0}
          max={600}
          step={10}
          disabled={attrs.full !== 'no'}
          onChange={(width) => {
            setAttrs({ width })
          }}
        />
      </Field>
      <Field label="Alignment">
        <Select
          options={[
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
            { value: 'center', label: 'Center' }
          ]}
          value={attrs.align || 'center'}
          onChange={(align) => {
            setAttrs({ align: align as any })
          }}
        />
      </Field>
      <Field label="Link" vertical>
        <TextInput
          textarea
          value={attrs.href}
          onChange={(href) => {
            setAttrs({ href })
          }}
        />
      </Field>
    </>
  )
}

function ImageButton({ onSuccess }: { onSuccess: (url: string) => void }) {
  const [state, setState] = useState<{
    error?: string
    loading?: boolean
  }>({})
  const { upload } = useEmailBuilderConfig()

  if (!upload) {
    return null
  }

  return (
    <div style={{ marginTop: 10 }}>
      {state.error ? (
        <Alert
          style={{ margin: '10px 0' }}
          onClose={() => {
            setState((prev) => ({ ...prev, error: '' }))
          }}
        >
          {state.error}
        </Alert>
      ) : null}
      <FileButton
        block
        accept="image/*"
        onMouseDown={(e) => {
          e.currentTarget.value = ''
        }}
        loading={state.loading}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            setState({ loading: true })
            upload(file)
              .then((res) => {
                setState({})
                onSuccess(res.url)
              })
              .catch(() => {
                setState({ error: 'Failed upload image.' })
              })
          }
        }}
      >
        Upload
      </FileButton>
    </div>
  )
}

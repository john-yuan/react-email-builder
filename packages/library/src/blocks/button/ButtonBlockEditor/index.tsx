import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { ButtonBlockAttrs } from '../types'
import { Field } from '../../../controls/Field'
import { TextInput } from '../../../controls/TextInput'
import { useBlockAttrsEditor } from '../../../hooks'
import { ColorPicker } from '../../../controls/ColorPicker'

export interface Props {
  block: EmailBuilderBlock<ButtonBlockAttrs>
}

export function ButtonBlockEditor({ block }: Props) {
  const attrs = block.attrs
  const setAttrs = useBlockAttrsEditor(block)
  return (
    <>
      <Field label="Text" vertical>
        <TextInput
          value={attrs.text}
          onChange={(text) => {
            setAttrs({ text })
          }}
        />
      </Field>
      <Field label="URL" vertical>
        <TextInput
          textarea
          value={attrs.url}
          onChange={(url) => {
            setAttrs({ url })
          }}
        />
      </Field>
      <Field label="Text color">
        <ColorPicker
          color={attrs.color}
          hideClear
          onChange={(color) => {
            setAttrs({ color })
          }}
        />
      </Field>
      <Field label="Background color">
        <ColorPicker
          color={attrs.bgColor}
          hideClear
          onChange={(bgColor) => {
            setAttrs({ bgColor })
          }}
        />
      </Field>
    </>
  )
}

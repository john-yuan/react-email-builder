import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { ButtonBlockAttrs } from '../types'
import { Field } from '../../../controls/Field'
import { TextInput } from '../../../controls/TextInput'
import { useBlockAttrsEditor } from '../../../hooks'
import { ColorPicker } from '../../../controls/ColorPicker'
import { SizeInput } from '../../../controls/SizeInput'
import PaddingInput from '../../../controls/PaddingInput'

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
      <Field label="Font size">
        <SizeInput
          unit="px"
          value={attrs.fontSize}
          min={0}
          onChange={(fontSize) => {
            setAttrs({ fontSize })
          }}
        />
      </Field>
      <Field label="Border radius">
        <SizeInput
          unit="px"
          value={attrs.borderRadius}
          min={0}
          onChange={(borderRadius) => {
            setAttrs({ borderRadius })
          }}
        />
      </Field>
      <Field label="Line height">
        <SizeInput
          unit="%"
          value={attrs.lineHeight}
          min={0}
          step={10}
          onChange={(lineHeight) => {
            setAttrs({ lineHeight })
          }}
        />
      </Field>
      <Field label="Letter spacing">
        <SizeInput
          unit="px"
          value={attrs.letterSpacing}
          min={0}
          onChange={(letterSpacing) => {
            setAttrs({ letterSpacing })
          }}
        />
      </Field>
      <PaddingInput
        value={attrs.padding}
        onChange={(padding) => {
          setAttrs({ padding })
        }}
      />
    </>
  )
}

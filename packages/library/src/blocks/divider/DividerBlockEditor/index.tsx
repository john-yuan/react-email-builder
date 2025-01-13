import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { DividerBlockAttrs } from '../types'
import { ColorPicker } from '../../../controls/ColorPicker'
import { Field } from '../../../controls/Field'
import { Select } from '../../../controls/Select'
import { SizeInput } from '../../../controls/SizeInput'
import { useBlockAttrsEditor } from '../../../hooks'

export interface Props {
  block: EmailBuilderBlock<DividerBlockAttrs>
}

export function DividerBlockEditor({ block }: Props) {
  const { attrs } = block
  const setAttrs = useBlockAttrsEditor(block)
  return (
    <>
      <Field label="Height">
        <SizeInput
          value={attrs.height}
          min={1}
          onChange={(height) => {
            setAttrs({ height })
          }}
        />
      </Field>
      <Field label="Type">
        <Select
          options={[
            { value: 'solid', label: 'Solid' },
            { value: 'Dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' }
          ]}
          value={attrs.type}
          onChange={(type) => {
            setAttrs({ type: type as any })
          }}
        />
      </Field>
      <Field label="Color">
        <ColorPicker
          color={attrs.color}
          hideClear
          onChange={(color) => {
            setAttrs({ color })
          }}
        />
      </Field>
    </>
  )
}

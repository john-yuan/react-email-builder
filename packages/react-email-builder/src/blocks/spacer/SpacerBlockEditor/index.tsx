import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { SpacerBlockAttrs } from '../types'
import { Field } from '../../../controls/Field'
import { SizeInput } from '../../../controls/SizeInput'
import { useBlockAttrsEditor } from '../../../hooks'

export interface Props {
  block: EmailBuilderBlock<SpacerBlockAttrs>
}

export function SpacerBlockEditor({ block }: Props) {
  const { attrs } = block
  const setAttrs = useBlockAttrsEditor(block)
  return (
    <>
      <Field label="Height">
        <SizeInput
          value={attrs.height}
          unit="px"
          min={1}
          onChange={(height) => {
            setAttrs({ height })
          }}
        />
      </Field>
    </>
  )
}

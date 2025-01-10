import React from 'react'
import { FormSection } from '../../controls/FormSection'
import { Field } from '../../controls/Field'
import { ColorPicker } from '../../controls/ColorPicker'
import { PaddingInput } from '../../controls/PaddingInput'
import { useEmailBuilderState, useSetEmailBuilderState } from '../../hooks'

export function PageEditor() {
  const state = useEmailBuilderState()
  const setState = useSetEmailBuilderState()
  const style = state.pageStyle || {}
  return (
    <>
      <div style={{ padding: 16 }}>Page</div>
      <FormSection name="Page attributes" defaultOpen>
        <Field label="Background color">
          <ColorPicker
            color={style.bgColor}
            onChange={(bgColor) => {
              setState((prev) => ({
                ...prev,
                pageStyle: {
                  ...style,
                  bgColor
                }
              }))
            }}
          />
        </Field>
        <PaddingInput
          hideHorizontal
          value={style.padding}
          onChange={(padding) => {
            setState((prev) => ({
              ...prev,
              pageStyle: {
                ...style,
                padding
              }
            }))
          }}
        />
      </FormSection>
    </>
  )
}

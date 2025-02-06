import React from 'react'
import { FormSection } from '../../controls/FormSection'
import { Field } from '../../controls/Field'
import { ColorPicker } from '../../controls/ColorPicker'
import { PaddingInput } from '../../controls/PaddingInput'
import {
  useEmailBuilderConfig,
  useEmailBuilderState,
  useSetEmailBuilderState
} from '../../hooks'
import type { EmailBuilderPageStyle } from '../../types'
import { SizeInput } from '../../controls/SizeInput'
import { getDefaultFonts } from '../../utils'
import { Select } from '../../controls/Select'

export function PageEditor() {
  const state = useEmailBuilderState()
  const setState = useSetEmailBuilderState()
  const style = state.style || {}
  const setStyle = (newStyle: Partial<EmailBuilderPageStyle>) => {
    setState((prev) => ({
      ...prev,
      style: {
        ...style,
        ...newStyle
      }
    }))
  }

  const { fonts } = useEmailBuilderConfig()
  const fontList = fonts || getDefaultFonts()

  return (
    <>
      <div style={{ padding: 16 }}>Page</div>
      <FormSection name="Page attributes" defaultOpen>
        <Field label="Text color">
          <ColorPicker
            color={style.color}
            onChange={(color) => {
              setStyle({ color })
            }}
          />
        </Field>
        <Field label="Font size">
          <SizeInput
            value={style.fontSize}
            defaultValue={14}
            unit="px"
            onChange={(fontSize) => {
              setStyle({ fontSize })
            }}
          />
        </Field>
        <Field label="Font family">
          <Select
            options={fontList}
            value={style.fontFamily}
            placeholder="unset"
            clearable
            onChange={(fontFamily) => {
              setStyle({ fontFamily })
            }}
          />
        </Field>
        <Field label="Background color">
          <ColorPicker
            color={style.bgColor}
            onChange={(bgColor) => {
              setStyle({ bgColor })
            }}
          />
        </Field>
        <PaddingInput
          hideHorizontal
          value={style.padding}
          onChange={(padding) => {
            setStyle({ padding })
          }}
        />
      </FormSection>
    </>
  )
}

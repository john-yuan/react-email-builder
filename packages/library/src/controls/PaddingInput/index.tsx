import React from 'react'
import { Field } from '../Field'
import { SizeInput } from '../SizeInput'

export function PaddingInput({
  value,
  onChange
}: {
  value?: number[]
  onChange: (value: number[]) => void
}) {
  const padding = value ? value : []
  const top = padding[0]
  const right = padding[1]
  const bottom = padding[2]
  const left = padding[3]

  return (
    <>
      <Field label="Padding top">
        <SizeInput
          unit="px"
          min={0}
          value={top}
          onChange={(top) => {
            onChange([top, right, bottom, left] as number[])
          }}
        />
      </Field>

      <Field label="Padding bottom">
        <SizeInput
          unit="px"
          min={0}
          value={bottom}
          onChange={(bottom) => {
            onChange([top, right, bottom, left] as number[])
          }}
        />
      </Field>

      <Field label="Padding left">
        <SizeInput
          unit="px"
          min={0}
          value={left}
          onChange={(left) => {
            onChange([top, right, bottom, left] as number[])
          }}
        />
      </Field>

      <Field label="Padding right">
        <SizeInput
          unit="px"
          min={0}
          value={right}
          onChange={(right) => {
            onChange([top, right, bottom, left] as number[])
          }}
        />
      </Field>
    </>
  )
}

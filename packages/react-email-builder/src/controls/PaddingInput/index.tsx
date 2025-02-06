import React from 'react'
import { Field } from '../Field'
import { SizeInput } from '../SizeInput'

export function PaddingInput({
  value,
  hideHorizontal,
  onChange
}: {
  value?: (number | null)[]
  hideHorizontal?: boolean
  onChange: (value: (number | null)[]) => void
}) {
  const padding = value ? value : []
  const nil = undefined
  const top = padding[0] ?? nil
  const right = padding[1] ?? nil
  const bottom = padding[2] ?? nil
  const left = padding[3] ?? nil

  const update = (
    T: number | null | undefined,
    R: number | null | undefined,
    B: number | null | undefined,
    L: number | null | undefined
  ) => {
    onChange([T ?? null, R ?? null, B ?? null, L ?? null])
  }

  return (
    <>
      <Field label="Padding top">
        <SizeInput
          unit="px"
          min={0}
          value={top}
          onChange={(top) => {
            update(top, right, bottom, left)
          }}
        />
      </Field>

      <Field label="Padding bottom">
        <SizeInput
          unit="px"
          min={0}
          value={bottom}
          onChange={(bottom) => {
            update(top, right, bottom, left)
          }}
        />
      </Field>

      {hideHorizontal ? null : (
        <>
          <Field label="Padding left">
            <SizeInput
              unit="px"
              min={0}
              value={left}
              onChange={(left) => {
                update(top, right, bottom, left)
              }}
            />
          </Field>

          <Field label="Padding right">
            <SizeInput
              unit="px"
              min={0}
              value={right}
              onChange={(right) => {
                update(top, right, bottom, left)
              }}
            />
          </Field>
        </>
      )}
    </>
  )
}

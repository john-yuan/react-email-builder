import React from 'react'
import type { EmailBuilderBlock } from '../../../types'
import type { ColumnsBlockAttrs } from '../types'
import { Field } from '../../../controls/Field'
import { SizeInput } from '../../../controls/SizeInput'
import { useBlockAttrsEditor } from '../../../hooks'
import { createColumn } from '../../../utils'

export interface Props {
  block: EmailBuilderBlock<ColumnsBlockAttrs>
}

export function ColumnsBlockEditor({ block }: Props) {
  const columns = block.attrs.columns
  const setAttrs = useBlockAttrsEditor(block)
  return (
    <>
      <Field label="Column count">
        <SizeInput
          value={columns.length}
          min={1}
          max={6}
          onChange={(count) => {
            const len = count || 1

            if (len > 0) {
              const cols = [...columns]
              let backup = block.attrs.backup ? [...block.attrs.backup] : []

              while (cols.length > len) {
                const old = cols.pop()

                if (old) {
                  backup.push(old)
                } else {
                  break
                }
              }

              while (cols.length < len) {
                cols.push(backup.pop() || createColumn())
              }

              if (backup.length > 6) {
                backup = backup.slice(backup.length - 6)
              }

              setAttrs({ columns: cols, backup })
            }
          }}
        />
      </Field>
    </>
  )
}

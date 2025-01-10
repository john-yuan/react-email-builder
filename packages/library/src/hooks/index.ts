import type React from 'react'
import { useCallback, useContext, useMemo } from 'react'
import {
  EmailBuilderConfigContext,
  EmailBuilderSelectedBlockInfoContext,
  EmailBuilderStateContext,
  SetEmailBuilderStateContext
} from '../context'

import type { EmailBuilderBlock } from '../types'
import type { ColumnsBlockAttrs } from '../blocks/columns/types'

export function useEmailBuilderConfig() {
  return useContext(EmailBuilderConfigContext)
}

export function useEmailBuilderState() {
  return useContext(EmailBuilderStateContext)
}

export function useSetEmailBuilderState() {
  return useContext(SetEmailBuilderStateContext)
}

export function useSelectedBlock() {
  return useContext(EmailBuilderSelectedBlockInfoContext)
}

export function useBlockStyle(block: EmailBuilderBlock) {
  const style = block.blockStyle
  return useMemo<React.CSSProperties>(() => {
    const p = style.padding || []
    const u = undefined
    return {
      backgroundColor: style.bgColor,
      paddingTop: p[0] ?? u,
      paddingRight: p[1] ?? u,
      paddingBottom: p[2] ?? u,
      paddingLeft: p[3] ?? u
    }
  }, [style])
}

export function useBlockEditor<Attrs extends object = any>(blockId: string) {
  const setState = useSetEmailBuilderState()

  return useCallback(
    (mutate: (prev: EmailBuilderBlock<Attrs>) => EmailBuilderBlock<Attrs>) => {
      setState((prev) => ({
        ...prev,
        blocks: prev.blocks.map((block) => {
          if (block.id === blockId) {
            return mutate(block as any) as any
          }

          if (block.type === 'columns') {
            let columnsTouched = false

            const cols = block as EmailBuilderBlock<ColumnsBlockAttrs>

            const nextColumns: typeof cols = {
              ...cols,
              attrs: {
                ...cols.attrs,
                columns: cols.attrs.columns.map((column) => {
                  let columnTouched = false

                  const nextColumn: typeof column = {
                    ...column,
                    blocks: column.blocks.map((columnBlock) => {
                      if (columnBlock.id === blockId) {
                        columnTouched = true
                        return mutate(columnBlock)
                      }
                      return columnBlock
                    })
                  }

                  if (columnTouched) {
                    columnsTouched = true
                  }

                  return columnTouched ? nextColumn : column
                })
              }
            }

            return columnsTouched ? nextColumns : block
          }

          return block
        })
      }))
    },
    [setState, blockId]
  )
}

export function useBlockAttrsEditor<Attrs extends object = any>(
  block: EmailBuilderBlock<Attrs>
) {
  const setBlock = useBlockEditor<Attrs>(block.id)
  const setAttrs = useCallback(
    (attrs: Partial<Attrs>) => {
      setBlock((prev) => ({
        ...prev,
        attrs: {
          ...prev.attrs,
          ...attrs
        }
      }))
    },
    [setBlock]
  )
  return setAttrs
}

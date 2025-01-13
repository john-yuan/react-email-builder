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
import { createPlaceholder, generateId } from '../utils'

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
  const { style } = block
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

export function useDeleteBlock() {
  const setState = useSetEmailBuilderState()
  return useCallback(
    (blockId: string) => {
      setState((prev) => {
        const filterBlocks = (blocks: EmailBuilderBlock[]) => {
          const newBlocks: EmailBuilderBlock[] = []

          let touched = false

          blocks.forEach((block) => {
            if (block.id === blockId) {
              touched = true
            } else {
              let newBlock = block

              if (newBlock.type === 'columns') {
                const cols = newBlock as EmailBuilderBlock<ColumnsBlockAttrs>
                let columnsTouched = false

                newBlock = {
                  ...cols,
                  attrs: {
                    ...cols.attrs,
                    columns: cols.attrs.columns.map((column) => {
                      const newColumnBlocks = filterBlocks(column.blocks)
                      if (newColumnBlocks !== column.blocks) {
                        columnsTouched = true
                        return {
                          ...column,
                          blocks: newColumnBlocks as any
                        }
                      }
                      return column
                    })
                  }
                }

                if (columnsTouched) {
                  touched = true
                } else {
                  newBlock = block
                }
              }

              newBlocks.push(newBlock)
            }
          })

          if (touched && !newBlocks.length) {
            newBlocks.push(createPlaceholder())
          }

          return touched ? newBlocks : blocks
        }

        const prevSelected = prev.selectedId === blockId

        return {
          ...prev,
          blocks: filterBlocks(prev.blocks),
          selectedId: prevSelected ? undefined : prev.selectedId,
          dragoverId: prev.dragoverId === blockId ? undefined : prev.dragoverId,
          tab: prevSelected && prev.tab === 'settings' ? 'blocks' : prev.tab
        }
      })
    },
    [setState]
  )
}

export function useMoveBlock() {
  const setState = useSetEmailBuilderState()
  return useCallback(
    (blockId: string, direction: -1 | 1) => {
      setState((prev) => {
        const move = (blocks: EmailBuilderBlock[]) => {
          const newBlocks = [...blocks]
          const index = newBlocks.findIndex((block) => block.id === blockId)

          if (index > -1) {
            const max = newBlocks.length - 1

            let target = index + direction

            if (target < 0) {
              target = 0
            }

            if (target > max) {
              target = max
            }

            const old = newBlocks[target]

            newBlocks[target] = newBlocks[index]
            newBlocks[index] = old

            return newBlocks
          }

          return blocks
        }

        return {
          ...prev,
          blocks: move(prev.blocks).map((block) => {
            if (block.type === 'columns') {
              const cols = block as EmailBuilderBlock<ColumnsBlockAttrs>
              return {
                ...block,
                attrs: {
                  ...cols.attrs,
                  columns: cols.attrs.columns.map((column) => ({
                    ...column,
                    blocks: move(column.blocks)
                  }))
                }
              }
            }
            return block
          })
        }
      })
    },
    [setState]
  )
}

export function useCopyBlock() {
  const setState = useSetEmailBuilderState()

  return useCallback(
    (blockId: string) => {
      setState((prev) => {
        let copiedBlockId = ''

        const copyBlock = (block: EmailBuilderBlock): EmailBuilderBlock => {
          copiedBlockId = generateId()

          if (block.type === 'columns') {
            const cols = block as EmailBuilderBlock<ColumnsBlockAttrs>
            return {
              ...cols,
              id: copiedBlockId,
              attrs: {
                ...cols.attrs,
                columns: cols.attrs.columns.map((column) => ({
                  ...column,
                  id: generateId(),
                  blocks: column.blocks.map((columnBlock) => ({
                    ...columnBlock,
                    id: generateId()
                  }))
                }))
              }
            }
          }

          return {
            ...block,
            id: copiedBlockId
          }
        }

        const copy = (blocks: EmailBuilderBlock[]) => {
          const newBlocks: EmailBuilderBlock[] = []
          blocks.forEach((block) => {
            newBlocks.push(block)
            if (block.id === blockId) {
              newBlocks.push(copyBlock(block))
            }
          })
          return newBlocks
        }

        const blocks = copy(prev.blocks).map((block) => {
          if (block.type === 'columns') {
            const cols = block as EmailBuilderBlock<ColumnsBlockAttrs>
            return {
              ...cols,
              attrs: {
                ...cols.attrs,
                columns: cols.attrs.columns.map((col) => ({
                  ...col,
                  blocks: copy(col.blocks)
                }))
              }
            }
          }
          return block
        })

        console.log(prev.selectedId, copiedBlockId)

        return {
          ...prev,
          blocks,
          selectedId: copiedBlockId
        }
      })
    },
    [setState]
  )
}

import clsx from 'clsx'
import React, { memo, useCallback, useMemo } from 'react'
import { getCss } from '../../utils'
import {
  useBlockStyle,
  useEmailBuilderState,
  useSetEmailBuilderState
} from '../../hooks'
import { Block as RawBlock } from '../Block'
import type { EmailBuilderBlock, EmailBuilderState } from '../../types'
import type { ColumnsBlockAttrs } from '../../blocks/columns/types'

const Block = memo(RawBlock)

export function Blocks({
  onClick
}: {
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}) {
  const css = getCss('Blocks', (ns) => ({
    root: ns()
  }))
  const state = useEmailBuilderState()
  const setState = useSetEmailBuilderState()
  const onMouseLeave = useCallback(() => {
    setState((prev) =>
      prev.draggingType && prev.dragoverId
        ? { ...prev, dragoverId: undefined }
        : prev
    )
  }, [setState])

  return (
    <div
      className={css.root}
      onClick={onClick}
      onMouseLeave={state.draggingType ? onMouseLeave : undefined}
    >
      <List
        blocks={state.blocks}
        draggingType={state.draggingType}
        dragover={state.dragover}
        dragoverId={state.dragoverId}
        selectedId={state.selectedId}
      />
    </div>
  )
}

function List({
  blocks,
  draggingType,
  dragover,
  dragoverId,
  inColumns,
  selectedId
}: {
  blocks: EmailBuilderBlock[]
  draggingType?: EmailBuilderState['draggingType']
  dragover?: EmailBuilderState['dragover']
  dragoverId?: EmailBuilderState['dragoverId']
  selectedId?: EmailBuilderState['selectedId']
  inColumns?: boolean
}) {
  const dragging = !!draggingType
  const showDropArea = dragging && !(draggingType === 'columns' && inColumns)

  return (
    <>
      {blocks.map((block) => {
        return block.type === 'columns' ? (
          <Columns
            key={block.id}
            block={block}
            draggingType={draggingType}
            dragover={dragover}
            dragoverId={dragoverId}
            selectedId={selectedId}
          />
        ) : (
          <Block
            key={block.id}
            block={block}
            showDropArea={showDropArea}
            dragging={dragging}
            dragover={dragoverId === block.id ? dragover : false}
            selected={block.id === selectedId}
            role={inColumns ? 'column' : undefined}
          />
        )
      })}
    </>
  )
}

function Columns({
  block,
  draggingType,
  dragover,
  dragoverId,
  selectedId
}: {
  block: EmailBuilderBlock<ColumnsBlockAttrs>
  draggingType?: EmailBuilderState['draggingType']
  dragoverId?: EmailBuilderState['dragoverId']
  dragover?: EmailBuilderState['dragover']
  selectedId?: EmailBuilderState['selectedId']
}) {
  const dragging = !!draggingType
  const blockStyle = useBlockStyle(block)
  const childrenSelected = useMemo(() => {
    if (selectedId && block.id !== selectedId) {
      return block.attrs.columns.some((col) => {
        return col.blocks.some((b) => b.id === selectedId)
      })
    }
    return false
  }, [block, selectedId])

  const css = getCss('Columns', (ns) => ({
    root: ns(),
    grid: ns('grid'),
    column: ns('column'),
    notAllowed: ns('not-allowed')
  }))

  const { columns } = block.attrs

  return (
    <Block
      block={block}
      dragover={dragoverId === block.id ? dragover : false}
      dragging={dragging}
      selected={block.id === selectedId}
      showDropArea={dragging}
      childrenSelected={childrenSelected}
      role="columns"
    >
      <div
        className={clsx(css.root, {
          [css.notAllowed]: draggingType === 'columns'
        })}
        style={blockStyle}
      >
        <div className={css.grid + ' ' + css.grid + '-' + columns.length}>
          {columns.map((column) => {
            const attrs = column.attrs || {}
            const p = attrs.padding || []
            const nil = undefined
            return (
              <div key={column.id} className={css.column}>
                <div
                  style={{
                    backgroundColor: attrs.bgColor,
                    paddingTop: p[0] ?? nil,
                    paddingRight: p[1] ?? nil,
                    paddingBottom: p[2] ?? nil,
                    paddingLeft: p[3] ?? nil
                  }}
                >
                  <List
                    inColumns
                    blocks={column.blocks}
                    draggingType={draggingType}
                    dragover={dragover}
                    dragoverId={dragoverId}
                    selectedId={selectedId}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Block>
  )
}

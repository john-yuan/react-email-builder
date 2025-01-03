import clsx from 'clsx'
import React, { useCallback } from 'react'
import { useEmailBuilderConfig, useSetEmailBuilderState } from '../../hooks'
import { createBlock, createPlaceholder, getCss, varsClass } from '../../utils'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import type { ColumnsBlockAttrs } from '../../blocks/columns/types'

export function BlockIcons() {
  const { blocks } = useEmailBuilderConfig()
  const css = useCss()
  return (
    <div className={css.root}>
      {blocks.map((block) => (
        <BlockIcon key={block.type} block={block} />
      ))}
    </div>
  )
}

function useCss() {
  return getCss('BlockIcons', (ns) => ({
    root: ns(),
    item: ns('item'),
    dragged: ns('item-dragged'),
    dragging: ns('item-dragging'),
    icon: ns('icon'),
    name: ns('name'),
    body: ns('body')
  }))
}

function BlockIcon({
  block,
}: {
  block: EmailBuilderBlockConfig
}) {
  const css = useCss()
  const type = block.type
  const config = useEmailBuilderConfig()
  const setState = useSetEmailBuilderState()
  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const dragged = e.currentTarget
      const rect = dragged.getBoundingClientRect()
      const startX = e.clientX
      const startY = e.clientY
      const startTop = rect.top
      const startLeft = rect.left
      const dragging = dragged.cloneNode(true) as HTMLDivElement

      let placeholder: EmailBuilderBlock | null = null

      const updatePosition = (top: number, left: number) => {
        dragging.style.transform = `translate3d(${left}px, ${top}px, 0) rotate(-10deg)`
      }

      const dragstart = () => {
        dragged.className = clsx(css.item, css.dragged)
        dragging.className = clsx(varsClass(), css.item, css.dragging)

        const body = document.body

        updatePosition(startTop, startLeft)
        body.appendChild(dragging)
        body.classList.add(css.body)

        setState((prev) => {
          let blocks = prev.blocks

          if (
            !blocks.length ||
            blocks[blocks.length - 1].type !== 'placeholder'
          ) {
            placeholder = createPlaceholder({ end: true })
            blocks = [...blocks, placeholder]
          }

          return {
            ...prev,
            blocks,
            draggingType: type,
            selectedId: undefined,
            dragoverId: undefined,
            dragover: false
          }
        })
      }

      let mousemove: ((e: MouseEvent) => void) | null = (e: MouseEvent) => {
        const movedX = e.clientX - startX
        const movedY = e.clientY - startY

        updatePosition(startTop + movedY, startLeft + movedX)
      }

      let dragend: (() => void) | null = () => {
        if (dragend) {
          window.removeEventListener('mouseup', dragend, true)
          dragend = null
        }

        if (mousemove) {
          window.removeEventListener('mousemove', mousemove, true)
          mousemove = null
        }

        dragged.className = css.item

        if (dragging.parentNode) {
          dragging.parentNode.removeChild(dragging)
        }

        document.body.classList.remove(css.body)

        setState((prev) => {
          let added = false

          const addBlock = (blocks: EmailBuilderBlock[]) => {
            const newBlocks: EmailBuilderBlock[] = []

            blocks.forEach((block) => {
              if (block.id === prev.dragoverId) {
                const newBlock = createBlock(config, type)

                if (block.type === 'placeholder') {
                  newBlocks.push(newBlock)
                } else if (prev.dragover === 'top') {
                  newBlocks.push(newBlock)
                  newBlocks.push(block)
                } else if (prev.dragover === 'bottom') {
                  newBlocks.push(block)
                  newBlocks.push(newBlock)
                }

                added = true
              } else if (block.type === 'columns') {
                if (added) {
                  newBlocks.push(block)
                } else {
                  const oldCols = block as EmailBuilderBlock<ColumnsBlockAttrs>
                  const newCols: EmailBuilderBlock<ColumnsBlockAttrs> = {
                    ...oldCols,
                    attrs: {
                      ...oldCols.attrs,
                      columns: oldCols.attrs.columns.map((col) => ({
                        ...col,
                        blocks: addBlock(col.blocks)
                      }))
                    }
                  }
                  newBlocks.push(newCols)
                }
              } else {
                newBlocks.push(block)
              }
            })

            return newBlocks
          }

          let nextBlocks = addBlock(prev.blocks)

          if (placeholder) {
            nextBlocks = nextBlocks.filter((b) => b !== placeholder)
          }

          return {
            ...prev,
            blocks: nextBlocks,
            draggingType: undefined,
            dragover: undefined,
            dragoverId: undefined
          }
        })
      }

      dragstart()

      window.addEventListener('mousemove', mousemove, true)
      window.addEventListener('mouseup', dragend, true)
    },
    [setState, type, config, css]
  )

  return (
    <div className={css.item} onMouseDown={onMouseDown}>
      <div className={css.icon}>{block.icon}</div>
      <div className={css.name}>{block.name}</div>
    </div>
  )
}

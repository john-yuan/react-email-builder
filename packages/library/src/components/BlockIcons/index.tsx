import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { useEmailBuilderConfig, useSetEmailBuilderState } from '../../hooks'
import { namespace, varsClass } from '../../utils'
import type { EmailBuilderBlockConfig } from '../../types'

type CssNames = ReturnType<typeof useCss>

export function BlockIcons() {
  const { blocks } = useEmailBuilderConfig()
  const css = useCss()
  return (
    <div className={css.root}>
      {blocks.map((block) => (
        <BlockIcon key={block.type} css={css} block={block} />
      ))}
    </div>
  )
}

function useCss() {
  return useMemo(() => {
    const ns = namespace('BlockIcons')
    return {
      root: ns(),
      item: ns('item'),
      dragged: ns('item-dragged'),
      dragging: ns('item-dragging'),
      icon: ns('icon'),
      name: ns('name'),
      body: ns('body')
    }
  }, [])
}

function BlockIcon({
  block,
  css
}: {
  block: EmailBuilderBlockConfig
  css: CssNames
}) {
  const type = block.type
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
      }

      dragstart()

      window.addEventListener('mousemove', mousemove, true)
      window.addEventListener('mouseup', dragend, true)
    },
    [setState, type, css]
  )

  return (
    <div className={css.item} onMouseDown={onMouseDown}>
      <div className={css.icon}>{block.icon}</div>
      <div className={css.name}>{block.name}</div>
    </div>
  )
}

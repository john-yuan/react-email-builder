import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Placement } from '@floating-ui/dom'
import {
  computePosition,
  flip,
  shift,
  offset,
  autoUpdate,
  hide,
  arrow
} from '@floating-ui/dom'
import { getCss, varsClass } from '../../utils'

type InfoObject = {
  trigger?: HTMLElement | null
  popover?: HTMLDivElement | null
  open?: boolean
  placement?: Placement
  offset?: number
  shiftPadding?: number
  arrowPadding?: number
  ignoreClickOutside?: boolean
  cleanup?: (() => void) | null
  setOpen: (open: boolean) => void
}

export function css() {
  return getCss('Popover', (ns) => ({
    root: clsx(varsClass(), ns()),
    bg: ns('bg'),
    body: ns('body'),
    arrow: ns('arrow'),
    top: clsx(ns('arrow'), ns('arrow-top')),
    right: clsx(ns('arrow'), ns('arrow-right')),
    bottom: clsx(ns('arrow'), ns('arrow-bottom')),
    left: clsx(ns('arrow'), ns('arrow-left'))
  }))
}

export function usePopover({
  placement,
  offset,
  shiftPadding,
  arrowPadding,
  ignoreClickOutside
}: {
  placement?: Placement
  offset?: number
  shiftPadding?: number
  arrowPadding?: number
  ignoreClickOutside?: boolean
} = {}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<InfoObject>({
    open,
    setOpen,
    placement,
    offset,
    arrowPadding,
    shiftPadding,
    ignoreClickOutside
  })

  const triggerRef = useCallback(
    (node: HTMLElement | null) => {
      ref.current.trigger = node
      refresh(ref.current)
    },
    [ref]
  )

  const popoverRef = useCallback(
    (node: HTMLDivElement | null) => {
      ref.current.popover = node
      refresh(ref.current)
    },
    [ref]
  )

  useEffect(() => {
    ref.current.open = open
    ref.current.setOpen = setOpen
    ref.current.placement = placement
    ref.current.offset = offset
    ref.current.arrowPadding = arrowPadding
    ref.current.shiftPadding = shiftPadding
    ref.current.ignoreClickOutside = ignoreClickOutside
    refresh(ref.current)
  }, [
    ref,
    open,
    setOpen,
    placement,
    offset,
    arrowPadding,
    shiftPadding,
    ignoreClickOutside
  ])

  return {
    open,
    setOpen,
    triggerRef,
    popoverRef
  }
}

function refresh(info: InfoObject) {
  info.cleanup?.()
  info.cleanup = null

  const {
    open,
    trigger,
    popover,
    placement,
    offset: offsetValue,
    arrowPadding,
    shiftPadding,
    ignoreClickOutside,
    setOpen
  } = info

  if (open && trigger && popover) {
    const updatePosition = () => {
      const arrowElement = popover.querySelector<HTMLDivElement>(
        '.' + css().arrow
      )

      computePosition(trigger, popover, {
        placement,
        middleware: [
          offset(offsetValue),
          flip(),
          shift({ padding: shiftPadding }),
          hide(),
          arrowElement
            ? arrow({ element: arrowElement, padding: arrowPadding })
            : false
        ]
      }).then(({ x, y, placement, middlewareData: { hide, arrow } }) => {
        popover.style.top = y + 'px'
        popover.style.left = x + 'px'

        if (arrow) {
          if (arrowElement) {
            if (placement.includes('top')) {
              arrowElement.className = css().bottom
            } else if (placement.includes('bottom')) {
              arrowElement.className = css().top
            } else if (placement.includes('left')) {
              arrowElement.className = css().right
            } else if (placement.includes('right')) {
              arrowElement.className = css().left
            }

            arrowElement.style.left = arrow.x != null ? `${arrow.x}px` : ''
            arrowElement.style.top = arrow.y != null ? `${arrow.y}px` : ''
          }
        }

        if (hide) {
          if (hide.referenceHidden) {
            popover.style.visibility = 'hidden'
            popover.style.zIndex = '-1'
          } else {
            popover.style.visibility = ''
            popover.style.zIndex = ''
          }
        }
      })
    }

    const stopUpdate = autoUpdate(trigger, popover, updatePosition)

    let onClick: ((e: MouseEvent) => void) | null = null

    if (!ignoreClickOutside) {
      onClick = (e: MouseEvent) => {
        const target = e.target as Element

        if (target && target.nodeType === 1) {
          if (popover.contains(target)) {
            return
          }

          if (trigger.contains(target)) {
            return
          }

          setOpen(false)
        }
      }

      window.addEventListener('click', onClick, true)
    }

    info.cleanup = () => {
      stopUpdate()
      if (onClick) {
        window.removeEventListener('click', onClick, true)
        onClick = null
      }
    }
  }
}

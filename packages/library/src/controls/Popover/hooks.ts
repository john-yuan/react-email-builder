import { useCallback, useEffect, useRef, useState } from 'react'
import type { Placement } from '@floating-ui/dom'
import {
  computePosition,
  flip,
  shift,
  offset,
  autoUpdate
} from '@floating-ui/dom'

type InfoObject = {
  trigger?: HTMLElement | null
  popover?: HTMLDivElement | null
  open?: boolean
  placement?: Placement
  offset?: number
  shiftPadding?: number
  cleanup?: (() => void) | null
  setOpen: (open: boolean) => void
}

export function usePopover({
  placement,
  offset,
  shiftPadding
}: {
  placement?: Placement
  offset?: number
  shiftPadding?: number
} = {}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<InfoObject>({
    open,
    setOpen,
    placement,
    offset,
    shiftPadding
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
    ref.current.shiftPadding = shiftPadding
    refresh(ref.current)
  }, [ref, open, setOpen, placement, offset, shiftPadding])

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
    shiftPadding,
    setOpen
  } = info

  if (open && trigger && popover) {
    const updatePosition = () => {
      computePosition(trigger, popover, {
        placement,
        middleware: [
          offset(offsetValue),
          flip(),
          shift({ padding: shiftPadding })
        ]
      }).then(({ x, y }) => {
        popover.style.top = y + 'px'
        popover.style.left = x + 'px'
      })
    }

    const stopUpdate = autoUpdate(trigger, popover, updatePosition)
    const onClick = (e: MouseEvent) => {
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

    info.cleanup = () => {
      stopUpdate()
      window.removeEventListener('click', onClick, true)
    }
  }
}

import { useCallback, useRef } from 'react'
import { usePopover } from '../Popover/hooks'
import type { Placement } from '@floating-ui/dom'

export function useTooltip({
  showDelay,
  hideDelay,
  placement
}: {
  /**
   * Default `300`.
   */
  showDelay?: number
  /**
   * Default `100`.
   */
  hideDelay?: number
  placement?: Placement
} = {}) {
  const { open, setOpen, popoverRef, triggerRef } = usePopover({
    placement: placement || 'bottom-start',
    ignoreClickOutside: true,
    offset: 8,
    arrowPadding: 8
  })

  const ref = useRef<{
    clear1?: (() => void) | null
    clear2?: (() => void) | null
    hideId?: number | null
  }>({})

  const tipTriggerRef = useCallback(
    (node: HTMLElement | null) => {
      triggerRef(node)

      ref.current.clear1?.()
      ref.current.clear1 = null

      if (node) {
        let showId: number | null = null

        const mouseenter = () => {
          if (ref.current.hideId != null) {
            clearTimeout(ref.current.hideId)
            ref.current.hideId = null
          }

          if (showId == null) {
            showId = setTimeout(() => {
              showId = null
              setOpen(true)
            }, showDelay ?? 300)
          }
        }

        const mouseleave = () => {
          if (showId != null) {
            clearTimeout(showId)
            showId = null
          }

          if (ref.current.hideId != null) {
            clearTimeout(ref.current.hideId)
          }

          ref.current.hideId = setTimeout(() => {
            ref.current.hideId = null
            setOpen(false)
          }, hideDelay ?? 100)
        }

        node.addEventListener('mouseenter', mouseenter, false)
        node.addEventListener('mouseleave', mouseleave, false)

        ref.current.clear1 = () => {
          if (showId != null) {
            clearTimeout(showId)
            showId = null
          }

          node.removeEventListener('mouseenter', mouseenter, false)
          node.removeEventListener('mouseleave', mouseleave, false)
        }
      }
    },
    [ref, showDelay, hideDelay, triggerRef, setOpen]
  )

  const tooltipRef = useCallback(
    (node: HTMLDivElement | null) => {
      popoverRef(node)

      ref.current.clear2?.()
      ref.current.clear2 = null

      if (node) {
        const mouseenter = () => {
          if (ref.current.hideId != null) {
            clearTimeout(ref.current.hideId)
            ref.current.hideId = null
          }
        }

        const mouseleave = () => {
          if (ref.current.hideId != null) {
            clearTimeout(ref.current.hideId)
          }

          ref.current.hideId = setTimeout(() => {
            ref.current.hideId = null
            setOpen(false)
          }, hideDelay || 100)
        }

        node.addEventListener('mouseenter', mouseenter, false)
        node.addEventListener('mouseleave', mouseleave, false)

        ref.current.clear2 = () => {
          node.removeEventListener('mouseenter', mouseenter, false)
          node.removeEventListener('mouseleave', mouseleave, false)
        }
      }
    },
    [ref, hideDelay, setOpen, popoverRef]
  )

  return { open, setOpen, tooltipRef, triggerRef: tipTriggerRef }
}

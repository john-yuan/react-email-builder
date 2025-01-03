import clsx from 'clsx'
import React, { useCallback, useMemo } from 'react'
import { namespace } from '../../utils'
import { useSetEmailBuilderState } from '../../hooks'
import type { EmailBuilderBlock, EmailBuilderState } from '../../types'

export interface Props {
  role?: 'columns' | 'column'
  dragover?: EmailBuilderState['dragover']
  block: EmailBuilderBlock
}

export function DropArea({ role, dragover, block }: Props) {
  const css = useMemo(() => {
    const ns = namespace('DropArea')
    return {
      root: ns(),
      dragover: ns('dragover'),
      column: ns('column'),
      columns: ns('columns'),

      border: ns('border'),
      active: ns('active'),
      top: ns('top'),
      bottom: ns('bottom'),

      text: ns('text'),
      textVisible: ns('text-visible'),
      textTop: ns('text-top'),
      textBottom: ns('text-bottom'),
      textCenter: ns('text-center')
    }
  }, [])

  const placeholder = block.type === 'placeholder'

  const setState = useSetEmailBuilderState()
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const target = e.currentTarget
      const rect = target.getBoundingClientRect()
      const y = e.clientY - rect.y

      let dragover: 'top' | 'bottom' | false = false

      if (!(y < 0 || y > rect.height)) {
        dragover = y < rect.height / 2 ? 'top' : 'bottom'
      }

      setState((prev) => ({
        ...prev,
        dragover,
        dragoverId: block.id
      }))
    },
    [setState, block]
  )

  return (
    <div
      onMouseMove={onMouseMove}
      className={clsx(css.root, {
        [css.dragover]: dragover,
        [css.column]: role === 'column',
        [css.columns]: role === 'columns'
      })}
    >
      <div
        className={clsx(css.border, {
          [css.active]: dragover,
          [css.top]: !placeholder && dragover === 'top',
          [css.bottom]: !placeholder && dragover === 'bottom'
        })}
      />

      <div
        className={clsx(css.text, {
          [css.textVisible]: dragover,
          [css.textTop]: !placeholder && dragover === 'top',
          [css.textBottom]: !placeholder && dragover === 'bottom',
          [css.textCenter]: placeholder
        })}
      >
        <span>Drop it here</span>
      </div>
    </div>
  )
}

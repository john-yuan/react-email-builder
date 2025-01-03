import React, { useMemo } from 'react'
import type { EmailBuilderBlock } from '../../types'
import type { PlaceholderAttrs } from './types'
import { namespace } from '../../utils'
import { useEmailBuilderState } from '../../hooks'
import clsx from 'clsx'

export interface Props {
  block: EmailBuilderBlock<PlaceholderAttrs>
}

export function Placeholder({ block }: Props) {
  const { draggingType, dragoverId } = useEmailBuilderState()
  const css = useMemo(() => {
    const ns = namespace('Placeholder')
    return { root: ns(), dragging: ns('dragging'), dragover: ns('dragover') }
  }, [])

  return (
    <div
      className={clsx(css.root, {
        [css.dragging]: !!draggingType,
        [css.dragover]: block.id === dragoverId
      })}
    >
      {block.attrs.end && draggingType ? 'Drop it here' : 'No content here'}
    </div>
  )
}

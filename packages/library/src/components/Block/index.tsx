import clsx from 'clsx'
import React, { memo, useCallback, useMemo } from 'react'
import type {
  EmailBuilderBlock,
  EmailBuilderConfig,
  EmailBuilderState
} from '../../types'
import { namespace } from '../../utils'
import { useEmailBuilderConfig, useSetEmailBuilderState } from '../../hooks'
import { DropArea } from '../DropArea'
import { Placeholder } from '../../blocks/placeholder'

const BlockContent = memo(
  ({
    className,
    config,
    block
  }: {
    className?: string
    block: EmailBuilderBlock
    config: EmailBuilderConfig
  }) => {
    let content = null

    if (block.type === 'placeholder') {
      content = <Placeholder block={block} />
    } else {
      const Component = config.blocks.find(
        (b) => b.type === block.type
      )?.blockComponent
      content = Component ? <Component block={block} /> : null
    }

    return <div className={className}>{content}</div>
  }
)

export interface Props {
  block: EmailBuilderBlock

  /**
   * Is in drag and drop mode.
   */
  dragging?: boolean

  /**
   * Is block dragged-over.
   */
  dragover?: EmailBuilderState['dragover']

  /**
   * Show dorp area or not.
   */
  showDropArea?: boolean

  /**
   * Is block selected.
   */
  selected?: boolean

  /**
   * Is children selected. If a column in columns is selected,
   * the `childrenSelected` field of its parent columns is `true`.
   */
  childrenSelected?: boolean

  /**
   * The role of the block.
   */
  role?: 'columns' | 'column'

  /**
   * The children to render. If the value is undefined, the block will be
   * rendered.
   */
  children?: React.ReactNode
}

export function Block({
  block,
  dragging,
  dragover,
  children,
  childrenSelected,
  role,
  selected,
  showDropArea
}: Props) {
  const css = useMemo(() => {
    const ns = namespace('Block')

    return {
      section: ns('section'),
      full: ns('section-full'),
      block: ns(),
      dropArea: ns('drop-area'),
      dragover: ns('dragover'),
      selected: ns('selected'),
      active: ns('active'),
      column: ns('column'),
      content: ns('content')
    }
  }, [])

  const { sectionStyle } = block
  const config = useEmailBuilderConfig()

  const setState = useSetEmailBuilderState()
  const onClickBlock = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation()
      setState((prev) => {
        return prev.selectedId === block.id
          ? prev
          : {
              ...prev,
              selectedId: block.id
            }
      })
    },
    [block, setState]
  )

  return (
    <div
      className={clsx(css.section, {
        [css.full]: sectionStyle.full === 'yes'
      })}
      style={{
        backgroundColor: sectionStyle.bgColor
      }}
    >
      <div
        onClick={onClickBlock}
        className={clsx(css.block, {
          [css.dropArea]: dragging && showDropArea,
          [css.dragover]: dragover,
          [css.selected]: selected,
          [css.active]: selected || childrenSelected,
          [css.column]: role === 'column'
        })}
      >
        {children ? (
          children
        ) : (
          <BlockContent block={block} className={css.content} config={config} />
        )}
        {showDropArea ? (
          <DropArea block={block} dragover={dragover} role={role} />
        ) : null}
      </div>
    </div>
  )
}

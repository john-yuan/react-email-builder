import clsx from 'clsx'
import React, { memo, useCallback } from 'react'
import type {
  EmailBuilderBlock,
  EmailBuilderConfig,
  EmailBuilderState
} from '../../types'
import type { SvgSymbolName } from '../SvgSymbols/symbols'
import { getCss } from '../../utils'
import {
  useCopyBlock,
  useDeleteBlock,
  useEmailBuilderConfig,
  useMoveBlock,
  useSelectedBlock,
  useSetEmailBuilderState
} from '../../hooks'
import { usePopover } from '../../controls/Popover/hooks'
import { DropArea } from '../DropArea'
import { Placeholder } from '../../blocks/placeholder'
import { useTooltip } from '../../controls/Tooltip/hooks'
import { Icon } from '../Icon'
import { Tooltip } from '../../controls/Tooltip'
import { Popover } from '../../controls/Popover'
import { Button } from '../../controls/Button'

const Content = memo(function Content({
  className,
  config,
  block
}: {
  className?: string
  block: EmailBuilderBlock
  config: EmailBuilderConfig
}) {
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
})

const Toolbar = memo(function Toolbar() {
  const css = useCss()
  const { block, first, last } = useSelectedBlock()
  const moveBlock = useMoveBlock()
  const copyBlock = useCopyBlock()

  return block ? (
    <div className={css.toolbar}>
      <div className={css.actions}>
        {first ? null : (
          <Action
            icon="up"
            title="Move up"
            onClick={() => {
              moveBlock(block.id, -1)
            }}
          />
        )}
        {last ? null : (
          <Action
            icon="down"
            title="Move down"
            onClick={() => {
              moveBlock(block.id, 1)
            }}
          />
        )}

        <Action
          icon="copy"
          title="Copy"
          onClick={(e) => {
            e.stopPropagation()
            copyBlock(block.id)
          }}
        />

        {block.type === 'placeholder' && first && last ? null : (
          <Delete blockId={block.id} />
        )}
      </div>
    </div>
  ) : null
})

const Delete = memo(function Delete({ blockId }: { blockId: string }) {
  const css = useCss()
  const tooltip = useTooltip({ showDelay: 500 })
  const popover = usePopover({
    placement: 'bottom-start',
    offset: 8
  })
  const deleteBlock = useDeleteBlock()
  return (
    <>
      <div
        ref={(node) => {
          tooltip.triggerRef(node)
          popover.triggerRef(node)
        }}
        className={clsx(css.action, {
          [css.actionActive]: popover.open
        })}
        onClick={() => {
          popover.setOpen(true)
        }}
      >
        <Icon name="delete" />
      </div>
      {popover.open ? null : (
        <Tooltip open={tooltip.open} tooltipRef={tooltip.tooltipRef}>
          Delete
        </Tooltip>
      )}
      <Popover open={popover.open} popoverRef={popover.popoverRef} arrow>
        <div
          style={{
            padding: 20,
            minWidth: 300,
            maxWidth: 400,
            boxSizing: 'border-box'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: 16 }}>
            Delete block
          </div>
          <div>
            Are you sure you want to delete this block?
            <br />
            This action cannot be undone.
          </div>
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button
              secondary
              style={{ marginRight: 12 }}
              onClick={() => {
                popover.setOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                popover.setOpen(false)
                deleteBlock(blockId)
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Popover>
    </>
  )
})

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
  const css = useCss()
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
              selectedId: block.id,
              tab: 'settings'
            }
      })
    },
    [block, setState]
  )

  return (
    <div
      className={clsx(css.section, {
        [css.full]: block.style.full !== 'no'
      })}
      style={{
        backgroundColor: block.style.sectionBgColor
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
          <Content block={block} className={css.content} config={config} />
        )}
        {showDropArea ? (
          <DropArea block={block} dragover={dragover} role={role} />
        ) : null}
        {selected ? <Toolbar /> : null}
      </div>
    </div>
  )
}

function Action({
  title,
  icon,
  onClick
}: {
  title?: string
  icon: SvgSymbolName
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}) {
  const css = useCss()
  const tooltip = useTooltip({ showDelay: 500 })
  return (
    <>
      <div ref={tooltip.triggerRef} className={css.action} onClick={onClick}>
        <Icon name={icon} />
      </div>
      {title ? (
        <Tooltip open={tooltip.open} tooltipRef={tooltip.tooltipRef}>
          {title}
        </Tooltip>
      ) : null}
    </>
  )
}

function useCss() {
  return getCss('Block', (ns) => ({
    section: ns('section'),
    full: ns('section-full'),
    block: ns(),
    dropArea: ns('drop-area'),
    dragover: ns('dragover'),
    selected: ns('selected'),
    active: ns('active'),
    column: ns('column'),
    content: ns('content'),
    toolbar: ns('toolbar'),
    actions: ns('actions'),
    action: ns('action'),
    actionActive: ns('action-active')
  }))
}

import React, { useMemo } from 'react'
import {
  useBlockAttrsEditor,
  useBlockEditor,
  useEmailBuilderConfig,
  useSelectedBlock,
  useSetEmailBuilderState
} from '../../hooks'
import type {
  EmailBuilderBlock,
  EmailBuilderBlockConfig,
  EmailBuilderBlockStyle
} from '../../types'
import type {
  ColumnsBlockAttrs,
  EmailBuilderColumn,
  EmailBuilderColumnAttrs
} from '../../blocks/columns/types'
import { FormSection } from '../../controls/FormSection'
import { Field } from '../../controls/Field'
import { ColorPicker } from '../../controls/ColorPicker'
import { PaddingInput } from '../../controls/PaddingInput'
import { Button } from '../../controls/Button'
import { Select } from '../../controls/Select'

export function BlockEditor() {
  const { block, column, columns } = useSelectedBlock()
  const config = useEmailBuilderConfig()
  const type = block?.type
  const blockConfig = useMemo(() => {
    return config.blocks.find((b) => b.type === type)
  }, [config, type])

  if (block) {
    return (
      <Editor
        key={block.id}
        block={block}
        blockConfig={blockConfig}
        column={column}
        columns={columns}
      />
    )
  }

  return null
}

function Editor({
  block,
  blockConfig,
  column,
  columns
}: {
  block: EmailBuilderBlock
  blockConfig?: EmailBuilderBlockConfig
  columns?: EmailBuilderBlock<ColumnsBlockAttrs>
  column?: EmailBuilderColumn
}) {
  const EditorComponent = blockConfig?.editorComponent
  const isPlaceholder = block.type === 'placeholder'
  const setState = useSetEmailBuilderState()
  const setBlock = useBlockEditor(block.id)
  const style = block.style || {}
  const setStyle = (newStyle: Partial<EmailBuilderBlockStyle>) => {
    setBlock((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        ...newStyle
      }
    }))
  }

  return (
    <div style={{ paddingBottom: 64 }}>
      <div style={{ padding: 16 }}>
        {blockConfig ? blockConfig.name : 'No content'}
      </div>
      {EditorComponent ? (
        <FormSection name="Attributes" defaultOpen>
          <EditorComponent block={block} />
        </FormSection>
      ) : null}
      {isPlaceholder ? null : (
        <FormSection name="Block attributes" defaultOpen>
          {block.type !== 'columns' ? (
            <Field label="Background color">
              <ColorPicker
                color={style.bgColor}
                onChange={(bgColor) => {
                  setStyle({ bgColor })
                }}
              />
            </Field>
          ) : null}
          <PaddingInput
            value={style.padding}
            onChange={(padding) => {
              setStyle({ padding })
            }}
          />
        </FormSection>
      )}
      {isPlaceholder || columns || column ? null : (
        <FormSection name="Section attributes" defaultOpen>
          <Field label="Background color">
            <ColorPicker
              color={style.sectionBgColor}
              onChange={(sectionBgColor) => {
                setStyle({ sectionBgColor })
              }}
            />
          </Field>
          <Field label="Fill parent width">
            <Select
              value={style.full || 'yes'}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
              ]}
              onChange={(full) => {
                setStyle({ full: full === 'no' ? 'no' : undefined })
              }}
            />
          </Field>
        </FormSection>
      )}
      {columns && column ? (
        <ColumnEditor column={column} columns={columns} />
      ) : null}
      {columns ? (
        <FormSection name="Columns attributes" defaultOpen>
          <Button
            onClick={() => {
              setState((prev) => ({
                ...prev,
                selectedId: columns.id
              }))
            }}
          >
            Edit columns
          </Button>
        </FormSection>
      ) : null}
    </div>
  )
}

function ColumnEditor({
  column,
  columns
}: {
  columns: EmailBuilderBlock<ColumnsBlockAttrs>
  column: EmailBuilderColumn
}) {
  const setAttrs = useBlockAttrsEditor(columns)
  const setColumnAttrs = (attrs: Partial<EmailBuilderColumnAttrs>) => {
    setAttrs({
      columns: columns.attrs.columns.map((col) =>
        col.id === column.id
          ? {
              ...col,
              attrs: {
                ...col.attrs,
                ...attrs
              }
            }
          : col
      )
    })
  }

  const attrs = column.attrs || {}

  return (
    <FormSection name="Column attributes" defaultOpen>
      <Field label="Background color">
        <ColorPicker
          color={attrs.bgColor}
          onChange={(bgColor) => {
            setColumnAttrs({ bgColor })
          }}
        />
      </Field>
      <PaddingInput
        value={attrs.padding}
        onChange={(padding) => {
          setColumnAttrs({ padding })
        }}
      />
    </FormSection>
  )
}

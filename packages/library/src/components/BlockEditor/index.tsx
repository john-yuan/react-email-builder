import React, { useMemo } from 'react'
import {
  useBlockAttrsEditor,
  useBlockEditor,
  useEmailBuilderConfig,
  useSelectedBlock,
  useSetEmailBuilderState
} from '../../hooks'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
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
  const blockStyle = block.blockStyle || {}
  const sectionStyle = block.sectionStyle || {}

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
                color={blockStyle.bgColor}
                onChange={(bgColor) => {
                  setBlock((prev) => ({
                    ...prev,
                    blockStyle: {
                      ...prev.blockStyle,
                      bgColor
                    }
                  }))
                }}
              />
            </Field>
          ) : null}
          <PaddingInput
            value={blockStyle.padding}
            onChange={(padding) => {
              setBlock((prev) => ({
                ...prev,
                blockStyle: {
                  ...prev.blockStyle,
                  padding
                }
              }))
            }}
          />
        </FormSection>
      )}
      {isPlaceholder || columns || column ? null : (
        <FormSection name="Section attributes" defaultOpen>
          <Field label="Background color">
            <ColorPicker
              color={sectionStyle.bgColor}
              onChange={(bgColor) => {
                setBlock((prev) => ({
                  ...prev,
                  sectionStyle: {
                    ...prev.sectionStyle,
                    bgColor
                  }
                }))
              }}
            />
          </Field>
          <Field label="Fill parent width">
            <Select
              value={sectionStyle.full || 'no'}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
              ]}
              onChange={(full) => {
                setBlock((prev) => ({
                  ...prev,
                  sectionStyle: {
                    ...prev.sectionStyle,
                    full: full as any
                  }
                }))
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

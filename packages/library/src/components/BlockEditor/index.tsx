import React, { useMemo } from 'react'
import { useEmailBuilderConfig, useSelectedBlock } from '../../hooks'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import { FormSection } from '../../controls/FormSection'

export function BlockEditor() {
  const { block } = useSelectedBlock()
  const config = useEmailBuilderConfig()
  const type = block?.type
  const blockConfig = useMemo(() => {
    return config.blocks.find((b) => b.type === type)
  }, [config, type])

  if (block && blockConfig) {
    return <Editor key={block.id} block={block} blockConfig={blockConfig} />
  }

  return null
}

function Editor({
  block,
  blockConfig
}: {
  block: EmailBuilderBlock
  blockConfig: EmailBuilderBlockConfig
}) {
  const EditorComponent = blockConfig.editorComponent
  return (
    <div>
      <div style={{ padding: 16 }}>{blockConfig.name}</div>
      {EditorComponent ? (
        <FormSection name="Attributes" defaultOpen>
          <EditorComponent block={block} />
        </FormSection>
      ) : null}
    </div>
  )
}

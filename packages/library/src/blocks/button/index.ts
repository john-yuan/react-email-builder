import React from 'react'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import type { ButtonBlockAttrs } from './types'
import { Icon } from '../../components/Icon'
import { ButtonBlock } from './ButtonBlock'
import { ButtonBlockEditor } from './ButtonBlockEditor'

export function buttonBlock(): EmailBuilderBlockConfig<ButtonBlockAttrs> {
  return {
    type: 'button',
    name: 'Button',
    icon: React.createElement(Icon, { name: 'button' }),
    createBlock: (base) => {
      const block = base as any as EmailBuilderBlock<ButtonBlockAttrs>
      block.attrs = { text: 'Button' }
      return block
    },
    blockComponent: ButtonBlock,
    editorComponent: ButtonBlockEditor
  }
}

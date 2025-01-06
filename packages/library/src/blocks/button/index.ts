import React from 'react'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import type { ButtonBlockAttrs } from './types'
import { Icon } from '../../components/Icon'
import { ButtonBlock } from './ButtonBlock'
import { ButtonBlockEditor } from './ButtonBlockEditor'
import { getDefaultFonts } from '../../utils'

export function buttonBlock(): EmailBuilderBlockConfig<ButtonBlockAttrs> {
  return {
    type: 'button',
    name: 'Button',
    icon: React.createElement(Icon, { name: 'button' }),
    createBlock: (base, config) => {
      const block = base as any as EmailBuilderBlock<ButtonBlockAttrs>
      const fonts = config.fonts || getDefaultFonts()
      block.attrs = {
        text: 'Button',
        padding: [10, 25, 10, 25],
        bgColor: '#117CEE',
        color: '#FFFFFF',
        align: 'center',
        block: 'no',
        borderRadius: 3,
        fontSize: 14,
        fontWeight: 'normal',
        letterSpacing: 0,
        lineHeight: 120,
        target: '_blank',
        textDecoration: 'none',
        fontFamily: fonts?.[0].value
      }
      return block
    },
    blockComponent: ButtonBlock,
    editorComponent: ButtonBlockEditor
  }
}

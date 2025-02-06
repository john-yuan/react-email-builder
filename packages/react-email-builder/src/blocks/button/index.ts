import React from 'react'
import type { EmailBuilderBlock, EmailBuilderBlockConfig } from '../../types'
import type { ButtonBlockAttrs } from './types'
import { Icon } from '../../components/Icon'
import { ButtonBlock } from './ButtonBlock'
import { ButtonBlockEditor } from './ButtonBlockEditor'
import { getDefaultFonts, normalizeUrl } from '../../utils'
import {
  color,
  createBlockAttrs,
  padding,
  px,
  renderTag
} from '../../utils/mjml'

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
    editorComponent: ButtonBlockEditor,
    renderMJML: (block) => {
      const attrs = block.attrs
      return renderTag('mj-button', {
        children: block.attrs.text,
        attrs: createBlockAttrs(block, {
          href: attrs.url ? normalizeUrl(attrs.url) : null,
          target: attrs.target,
          width: attrs.block === 'yes' ? '100%' : null,
          color: color(attrs.color),
          'background-color': color(attrs.bgColor),
          'font-family': attrs.fontFamily,
          'font-size': px(attrs.fontSize),
          'line-height': (attrs.lineHeight || 100) + '%',
          'letter-spacing': px(attrs.letterSpacing),
          'font-weight': attrs.fontWeight === 'bold' ? '700' : null,
          'text-decoration': attrs.textDecoration,
          align: attrs.align || 'center',
          'inner-padding': padding(attrs.padding),
          'border-radius': px(attrs.borderRadius)
        })
      })
    }
  }
}

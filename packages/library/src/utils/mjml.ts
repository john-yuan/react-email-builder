import type { ColumnsBlockAttrs } from '../blocks/columns/types'
import type {
  EmailBuilderBlock,
  EmailBuilderConfig,
  EmailBuilderState
} from '../types'

export type TagAttributes = Record<string, string | null | undefined>
export type ReplaceVariableFn = (key: string, placeholder: string) => string

export interface RenderTagOptions {
  /**
   * The attributes to add. Can be a object or an array of attributes.
   * Any non-string value will skipped.
   */
  attrs?: TagAttributes

  /**
   * Specify the children of the tag.
   */
  children?: string | string[]
}

export interface GenerateOptions {
  /**
   * The email builder config.
   */
  config: EmailBuilderConfig

  /**
   * The email builder state.
   */
  state: EmailBuilderState

  /**
   * Extra MJML tags to add as the children of the `<mj-head>` tag.
   */
  extraHeadTags?: string[]

  /**
   * Specify the function to replace the variables in the code.
   */
  replaceVariable?: ReplaceVariableFn
}

/**
 * Render MJML tag.
 *
 * @param tagName The tag name. i.e. `mj-image`.
 * @param options The render options.
 * @returns The rendered string.
 */
export function renderTag(tagName: string, options?: RenderTagOptions) {
  const attrs = options?.attrs
  const children = options?.children

  let code = '<' + tagName

  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (typeof value === 'string') {
        code = code + ' ' + key + '=' + JSON.stringify(value)
      }
    })
  }

  code += '>'

  if (children) {
    if (typeof children === 'string') {
      code = code + '\n' + children + '\n'
    } else if (children.length) {
      code = code + '\n' + children.join('\n') + '\n'
    }
  }

  return code + '</' + tagName + '>'
}

/**
 * Add `px` suffix to the value. If the value is `null` or `undefined`,
 * returns `null`.
 */
export function px(value?: number | null) {
  return value == null ? null : '' + value + 'px'
}

/**
 * Normalize the color value.
 */
export function color(value?: string | null) {
  if (value != null) {
    return value.startsWith('#') ? value.toUpperCase() : value
  }
  return null
}

/**
 * Render padding array.
 *
 * @example
 *
 * // '10px 20px 10px 20px'
 * padding([10, 20, 10, 20])
 */
export function padding(value?: (number | null | undefined)[] | null) {
  if (value) {
    return (
      '' +
      (value[0] || 0) +
      'px ' +
      (value[1] || 0) +
      'px ' +
      (value[2] || 0) +
      'px ' +
      (value[3] || 0) +
      'px'
    )
  }
  return null
}

/**
 * Combines multiple arrays of strings into a single string, with each string
 * in the arrays separated by newlines. Null or undefined inputs are ignored.
 */
export function lines(...text: (string[] | null | undefined)[]) {
  let code = ''

  text.forEach((value) => {
    if (Array.isArray(value)) {
      code = code + (code ? '\n' : '') + value.join('\n')
    }
  })

  return code
}

/**
 * Create block attrs and merge the extra attrs into it.
 */
export function createBlockAttrs(
  block: EmailBuilderBlock,
  extra?: TagAttributes
): TagAttributes {
  const style = block.style
  const padding = style.padding || []
  return {
    'container-background-color': color(style.bgColor),
    'padding-top': px(padding[0]),
    'padding-right': px(padding[1]),
    'padding-bottom': px(padding[2]),
    'padding-left': px(padding[3]),
    ...extra
  }
}

/**
 * Generate MJML code from EmailBuilderState.
 */
export function generateMJML(options: GenerateOptions) {
  const sections: string[] = []
  const { state } = options
  const padding = state.style?.padding || []
  const paddingTop = padding[0]
  const paddingBottom = padding[2]
  const headTags: string[] = []

  options.config.blocks.forEach((block) => {
    const code = block.renderMJMLHeadTags?.()
    if (code) {
      headTags.push(code)
    }
  })

  if (paddingTop) {
    sections.push(
      renderTag('mj-section', {
        children: renderColumn({
          children: renderTag('mj-spacer', {
            attrs: { height: px(paddingTop) }
          })
        })
      })
    )
  }

  state.blocks.forEach((block) => {
    if (block.type === 'columns') {
      const cols = block as EmailBuilderBlock<ColumnsBlockAttrs>
      sections.push(
        renderSection({
          block,
          children: cols.attrs.columns.map((column) => {
            const style = column.attrs
            const padding = style.padding || []
            return renderColumn({
              attrs: {
                'background-color': color(style.bgColor),
                'padding-top': px(padding[0]),
                'padding-right': px(padding[1]),
                'padding-bottom': px(padding[2]),
                'padding-left': px(padding[3])
              },
              children: column.blocks.map((b) => renderBlock(b, options))
            })
          })
        })
      )
    } else if (block.type !== 'placeholder') {
      sections.push(
        renderSection({
          block,
          children: renderColumn({
            children: renderBlock(block, options)
          })
        })
      )
    }
  })

  if (paddingBottom) {
    sections.push(
      renderTag('mj-section', {
        children: renderColumn({
          children: renderTag('mj-spacer', {
            attrs: { height: px(paddingBottom) }
          })
        })
      })
    )
  }

  const textColor = color(state.style?.color || '#000000')
  const fontSize = px(state.style?.fontSize ?? 14)
  const fontFamily = state.style?.fontFamily ?? 'Arial, helvetica, sans-serif'

  return renderTag('mjml', {
    children: [
      renderTag('mj-head', {
        children: lines(
          [
            renderTag('mj-style', {
              children: [
                'html, body { color: ' +
                  textColor +
                  '; font-size: ' +
                  fontSize +
                  '; font-family: ' +
                  fontFamily +
                  '; }'
              ]
            }),
            renderTag('mj-breakpoint', { attrs: { width: '600px' } }),
            renderTag('mj-attributes', {
              children: [
                renderTag('mj-all', {
                  attrs: {
                    padding: '0px',
                    color: textColor,
                    'font-size': fontSize,
                    'font-family': fontFamily
                  }
                })
              ]
            })
          ],
          headTags,
          options.extraHeadTags
        )
      }),
      renderTag('mj-body', {
        children: sections,
        attrs: { 'background-color': color(options.state.style?.bgColor) }
      })
    ]
  })
}

/**
 * Render the block to MJML code.
 */
export function renderBlock(
  block: EmailBuilderBlock,
  options: GenerateOptions
) {
  const renderMJML = options.config.blocks.find(
    (b) => b.type === block.type
  )?.renderMJML

  if (renderMJML) {
    return renderMJML(block, options)
  }

  return renderTag('mj-raw', {
    children: renderTag('div', {
      attrs: {
        style: 'padding: 10px 20px; background: #fff; color: #f00;'
      },
      children:
        'Error: the renderMJML method of the ' +
        block.type +
        ' block is not defined.'
    })
  })
}

/**
 * Replace variables in the html code.
 */
export function replaceHtmlVariables(
  html?: string,
  replace?: ReplaceVariableFn
) {
  const needle = 'data-variable-value='

  if (replace && html && html.indexOf(needle) > -1) {
    return html.replace(
      /(<[a-zA-Z0-9]+\s+[^>]*\bdata-variable-value=['"])\(([^)]+)\)([^>]+>)([^<]+)(<\/[^>]+>)/g,
      (_, openTag: string, varKey, attrs, placeholder, endTag) => {
        return (
          openTag.slice(0, -(needle.length + 1)) +
          attrs.slice(1) +
          replace(varKey, placeholder) +
          endTag
        )
      }
    )
  }

  return html
}

function renderColumn(options: {
  attrs?: Record<string, string | null | undefined>
  children?: string | string[]
}) {
  return renderTag('mj-column', options)
}

function renderSection({
  block,
  children
}: {
  block: EmailBuilderBlock
  children?: string | string[]
}) {
  const attrs: TagAttributes = {}
  const style = block.style || {}

  if (block.type === 'columns') {
    const padding = style.padding || []
    attrs['padding-top'] = px(padding[0])
    attrs['padding-right'] = px(padding[1])
    attrs['padding-bottom'] = px(padding[2])
    attrs['padding-left'] = px(padding[3])
  }

  if (style.sectionBgColor) {
    attrs['background-color'] = color(style.sectionBgColor)

    if (style.full !== 'no') {
      attrs['full-width'] = 'full-width'
    }
  }

  return renderTag('mj-section', {
    attrs,
    children
  })
}

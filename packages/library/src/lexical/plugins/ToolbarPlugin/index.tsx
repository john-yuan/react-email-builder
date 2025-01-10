import clsx from 'clsx'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import type {
  ElementFormatType,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
  TextFormatType,
  TextNode
} from 'lexical'

import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $isElementNode,
  createCommand,
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  FORMAT_ELEMENT_COMMAND
} from 'lexical'

import {
  $getSelectionStyleValueForProperty,
  $isAtNodeEnd,
  $patchStyleText
} from '@lexical/selection'

import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $findMatchingParent } from '@lexical/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { Alert } from '../../../controls/Alert'
import { Icon } from '../../../components/Icon'
import { Popover } from '../../../controls/Popover'
import { Tooltip } from '../../../controls/Tooltip'
import { ColorPalette } from '../../../controls/ColorPalette'
import { useTooltip } from '../../../controls/Tooltip/hooks'
import { usePopover } from '../../../controls/Popover/hooks'
import { getCss, getDefaultFonts, normalizeUrl } from '../../../utils'
import { FileButton } from '../../../controls/FileButton'
import { Button } from '../../../controls/Button'
import { TextInput } from '../../../controls/TextInput'
import { $createImageNode } from '../../nodes/ImageNode'

import type { SvgSymbolName } from '../../../components/SvgSymbols/symbols'
import type { FileUploadFunction, TextEditorVariable } from '../../../types'
import { $createVariableNode } from '../../nodes/VariableNode'

type ImagePayload = {
  url: string
  alt?: string
}

type LinkPayload = {
  url: string
}

const INSERT_IMAGE_COMMAND = createCommand<ImagePayload>('INSERT_IMAGE_COMMAND')

export const INSERT_VARIABLE_COMMAND = createCommand<TextEditorVariable>(
  'INSERT_VARIABLE_COMMAND'
)

export interface Props {
  /**
   * The function to upload image.
   */
  upload?: FileUploadFunction

  /**
   * The variable list.
   */
  variables?: TextEditorVariable[]

  /**
   * The font family list.
   *
   * @example
   * [
   *   { value: 'Arial, helvetica, sans-serif', label: 'Arial' }
   *   { value: 'Georgia, serif', label: 'Georgia' },
   * ]
   */
  fonts?: {
    value: string
    label: string
  }[]

  /**
   * The default font. If not set, the first font in `fonts` will be
   * used.
   *
   * If you set a default font, don't forget to overwrite the
   * `font-family` of the css class named `.REB-Lexical-editor` and
   * `.REB-Lexical-placeholder`.
   *
   * @example 'Arial, helvetica, sans-serif'
   */
  defaultFont?: string

  /**
   * The font size list.
   *
   * @example ['12px', '13px', '14px', '15px', '16px', '24px', '32px']
   */
  fontSizes?: string[]

  /**
   * The default font size. If not set, `14px` will be used.
   *
   * If you set a default font size, don't forget to overwrite the
   * `font-size` of the css class named `.REB-Lexical-editor` and
   * `.REB-Lexical-placeholder`.
   *
   * @example '14px'
   */
  defaultFontSize?: string

  /**
   * The default text color.
   */
  defaultTextColor?: string

  /**
   * The default text background color.
   */
  defaultTextBgColor?: string

  /**
   * The default alignment.
   */
  defaultAlignment?: 'left' | 'right' | 'center' | 'justify'
}

export function ToolbarPlugin({
  upload,
  variables,
  defaultFont,
  defaultFontSize,
  fontSizes,
  fonts,
  defaultTextColor,
  defaultTextBgColor,
  defaultAlignment
}: Props) {
  const css = useCss()

  const { FONTS, DEFAULT_FONT_FAMILY } = useMemo(() => {
    const list = fonts || getDefaultFonts()
    return {
      FONTS: list,
      DEFAULT_FONT_FAMILY: defaultFont ?? list[0]?.value
    }
  }, [fonts, defaultFont])

  const { FONT_SIZES, DEFAULT_FONT_SIZE } = useMemo(() => {
    const list: {
      value: string
      label: string
    }[] = []

    if (fontSizes) {
      fontSizes.forEach((value) => {
        list.push({ value, label: value })
      })
    } else {
      for (let i = 12; i <= 72; i += 1) {
        const value = i + 'px'
        list.push({ value, label: value })
      }
    }

    return {
      FONT_SIZES: list,
      DEFAULT_FONT_SIZE: defaultFontSize ?? '14px'
    }
  }, [fontSizes, defaultFontSize])

  const DEFAULT_TEXT_COLOR = defaultTextColor
  const DEFAULT_TEXT_BG_COLOR = defaultTextBgColor
  const DEFAULT_ALIGNMENT = defaultAlignment || 'left'

  const [editor] = useLexicalComposerContext()
  const [activeEditor, setActiveEditor] = useState(editor)
  const [state, setState] = useState<{
    color?: string
    bgColor?: string
    fontSize?: string
    fontFamily?: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
    format?: ElementFormatType
    link?: LinkPayload
  }>({
    fontSize: DEFAULT_FONT_SIZE,
    fontFamily: DEFAULT_FONT_FAMILY
  })

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      const color = $getSelectionStyleValueForProperty(
        selection,
        'color',
        DEFAULT_TEXT_COLOR
      )

      const bgColor = $getSelectionStyleValueForProperty(
        selection,
        'background-color',
        DEFAULT_TEXT_BG_COLOR
      )

      const fontFamily = $getSelectionStyleValueForProperty(
        selection,
        'font-family',
        DEFAULT_FONT_FAMILY
      )

      const fontSize = $getSelectionStyleValueForProperty(
        selection,
        'font-size',
        DEFAULT_FONT_SIZE
      )

      const node = getSelectedNode(selection)
      const parent = node.getParent()

      let matchingParent: LexicalNode | undefined | null
      let link: LinkPayload | undefined

      if ($isLinkNode(parent)) {
        link = { url: parent.getURL() }
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        )
      }

      const format = $isElementNode(matchingParent)
        ? matchingParent.getFormatType()
        : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType()

      setState({
        color,
        bgColor,
        fontFamily,
        fontSize,
        format,
        link,
        bold: selection.hasFormat('bold'),
        italic: selection.hasFormat('italic'),
        underline: selection.hasFormat('underline'),
        strikethrough: selection.hasFormat('strikethrough')
      })
    }
  }, [
    setState,
    DEFAULT_TEXT_BG_COLOR,
    DEFAULT_TEXT_COLOR,
    DEFAULT_FONT_FAMILY,
    DEFAULT_FONT_SIZE
  ])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_, newEditor) => {
        setActiveEditor(newEditor)
        updateToolbar()
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor, updateToolbar, setActiveEditor])

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      updateToolbar()
    })
  }, [activeEditor, updateToolbar])

  useEffect(() => {
    return activeEditor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar()
      })
    })
  }, [updateToolbar, activeEditor, editor])

  useEffect(() => {
    return activeEditor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        if (payload.url) {
          const imageNode = $createImageNode(payload.url, payload.alt)
          $insertNodes([imageNode])
          return true
        }
        return false
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [activeEditor])

  useEffect(() => {
    return activeEditor.registerCommand(
      INSERT_VARIABLE_COMMAND,
      (payload) => {
        const node = $createVariableNode(
          payload.value,
          payload.placeholder || payload.label
        )
        $insertNodes([node])
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [activeEditor])

  const setTextStyle = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection()
        if (selection != null) {
          $patchStyleText(selection, styles)
        }
      })
    },
    [activeEditor]
  )

  const prevent = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const target = e.target as Element

      if (target && typeof target.tagName === 'string') {
        const tag = target.tagName.toLowerCase()
        if (tag === 'input' || tag === 'textarea') {
          return
        }
      }

      e.preventDefault()
    },
    []
  )

  return (
    <div className={css.root} onMouseDown={prevent}>
      <FontFormat
        activeEditor={activeEditor}
        format="bold"
        icon="bold"
        active={state.bold}
        title="Bold"
      />
      <FontFormat
        activeEditor={activeEditor}
        format="italic"
        icon="italic"
        active={state.italic}
        title="Italic"
      />
      <FontFormat
        activeEditor={activeEditor}
        format="underline"
        icon="underline"
        active={state.underline}
        title="Underline"
      />
      <FontFormat
        activeEditor={activeEditor}
        format="strikethrough"
        icon="strikethrough"
        active={state.strikethrough}
        title="Strikethrough"
      />
      <Color
        icon="text-color"
        color={state.color}
        title="Text color"
        onChange={(color) => {
          setTextStyle({ color })
        }}
      />
      <Color
        icon="bg-color"
        color={state.bgColor}
        title="Background color"
        onChange={(color) => {
          setTextStyle({ 'background-color': color })
        }}
      />
      <Link title="Link" link={state.link} activeEditor={activeEditor} />
      <InsertImage
        title="Insert image"
        upload={upload}
        onConfirm={(payload) => {
          activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)
        }}
      />
      {variables?.length ? (
        <Variables
          title="Insert variable"
          variables={variables}
          activeEditor={activeEditor}
        />
      ) : null}
      <Alignment
        value={state.format || DEFAULT_ALIGNMENT}
        onChange={(payload) => {
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, payload)
        }}
      />
      {FONT_SIZES.length ? (
        <FontSize
          options={FONT_SIZES}
          value={state.fontSize || DEFAULT_FONT_SIZE}
          setTextStyle={setTextStyle}
        />
      ) : null}
      {FONTS.length ? (
        <FontFamily
          options={FONTS}
          value={state.fontFamily || DEFAULT_FONT_FAMILY}
          setTextStyle={setTextStyle}
        />
      ) : null}
    </div>
  )
}

function useCss() {
  return getCss('ToolbarPlugin', (ns) => ({
    root: ns(),
    icon: ns('icon'),
    active: ns('active'),
    open: ns('open'),
    input: ns('input'),
    label: ns('label'),
    dropdown: ns('dropdown'),
    options: ns('options'),
    option: ns('option'),
    optionText: ns('option-text'),
    selected: ns('selected')
  }))
}

function FontFormat({
  active,
  icon,
  activeEditor,
  format,
  title
}: {
  active?: boolean
  icon: SvgSymbolName
  format: TextFormatType
  activeEditor: LexicalEditor
  title?: string
}) {
  const css = useCss()
  const { triggerRef, tooltipRef, open } = useTooltip({ showDelay: 1000 })
  return (
    <>
      <div
        ref={triggerRef}
        className={clsx(css.icon, { [css.active]: active })}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
        }}
      >
        <Icon name={icon} />
      </div>
      {title ? (
        <Tooltip open={open} tooltipRef={tooltipRef}>
          {title}
        </Tooltip>
      ) : null}
    </>
  )
}

function Color({
  icon,
  color,
  title,
  onChange
}: {
  icon: SvgSymbolName
  color?: string
  title?: string
  onChange: (color: string) => void
}) {
  const popover = useIconPopover()
  return (
    <IconPopover title={title} icon={icon} {...popover}>
      <ColorPalette color={color} onChange={onChange} />
    </IconPopover>
  )
}

function InsertImage({
  title,
  upload,
  onConfirm
}: {
  title?: string
  upload?: FileUploadFunction
  onConfirm: (payload: ImagePayload) => void
}) {
  const popover = useIconPopover()

  return (
    <IconPopover title={title} icon="image" {...popover}>
      <ImageInput
        upload={upload}
        onConfirm={(payload) => {
          popover.setOpen(false)
          onConfirm(payload)
        }}
      />
    </IconPopover>
  )
}

function ImageInput({
  upload,
  onConfirm
}: {
  upload?: FileUploadFunction
  onConfirm: (payload: ImagePayload) => void
}) {
  const css = useCss()

  const [state, setState] = useState<{
    url: string
    alt: string
    uploading?: boolean
    error?: string | boolean
  }>({ url: '', alt: '' })

  return (
    <div className={css.input}>
      <div className={css.label}>
        <span>Image URL</span>
        {upload ? (
          <div>
            <FileButton
              plain
              size="small"
              icon={<Icon name="plus" />}
              accept="image/*"
              loading={state.uploading}
              onMouseDown={(e) => {
                e.currentTarget.value = ''
              }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setState((prev) => ({
                    ...prev,
                    uploading: true,
                    error: false
                  }))
                  upload(file)
                    .then((res) => {
                      setState((prev) => ({
                        ...prev,
                        url: res.url,
                        uploading: false,
                        error: false
                      }))
                    })
                    .catch(() => {
                      setState((prev) => ({
                        ...prev,
                        uploading: false,
                        error: 'Failed uploading image.'
                      }))
                    })
                }
              }}
            >
              Upload
            </FileButton>
          </div>
        ) : null}
      </div>
      <TextInput
        textarea
        value={state.url}
        onChange={(val) => {
          setState((prev) => ({ ...prev, error: false, url: val }))
        }}
      />
      {state.error ? (
        <Alert
          style={{ margin: '10px 0' }}
          onClose={() => {
            setState((prev) => ({ ...prev, error: false }))
          }}
        >
          {state.error}
        </Alert>
      ) : null}
      <div style={{ margin: '14px 0 4px 0' }}>Alternate Text</div>
      <TextInput
        value={state.alt}
        onChange={(val) => {
          setState((prev) => ({ ...prev, alt: val }))
        }}
      />
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Button
          onClick={() => {
            const url = normalizeUrl(state.url)

            if (url) {
              onConfirm({ url, alt: state.alt.trim() })
            } else {
              setState((prev) => ({
                ...prev,
                error: 'Please enter image URL.'
              }))
            }
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  )
}

function FontSize({
  value,
  setTextStyle,
  options
}: {
  value?: string
  setTextStyle: (style: Record<string, string>) => void
  options: { value: string; label: string }[]
}) {
  return (
    <Dropdown
      value={value}
      options={options}
      title="Font size"
      onChange={(fontSize) => {
        setTextStyle({ 'font-size': fontSize })
      }}
    />
  )
}

function FontFamily({
  value,
  setTextStyle,
  options
}: {
  value?: string
  setTextStyle: (style: Record<string, string>) => void
  options: { value: string; label: string }[]
}) {
  return (
    <Dropdown
      value={value}
      options={options}
      title="Font family"
      onChange={(fontFamily) => {
        setTextStyle({ 'font-family': fontFamily })
      }}
    />
  )
}

function Alignment({
  value,
  onChange
}: {
  value: ElementFormatType
  onChange: (value: ElementFormatType) => void
}) {
  const options = useMemo<
    {
      icon: SvgSymbolName
      value: string
      label: string
    }[]
  >(
    () => [
      { value: 'left', icon: 'align-left', label: 'Left' },
      { value: 'center', icon: 'align-center', label: 'Center' },
      { value: 'right', icon: 'align-right', label: 'Right' },
      { value: 'justify', icon: 'align-justify', label: 'Justify' }
    ],
    []
  )

  return (
    <Dropdown
      options={options}
      value={value}
      title="Alignment"
      onChange={onChange as (value: string) => void}
    />
  )
}

function Link({
  title,
  link,
  activeEditor
}: {
  title?: string
  link?: LinkPayload
  activeEditor: LexicalEditor
}) {
  const popover = useIconPopover()

  return (
    <IconPopover title={title} icon="link" {...popover}>
      <LinkInput
        value={link?.url || ''}
        onChange={(url) => {
          popover.setOpen(false)
          activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url || null)
        }}
      />
    </IconPopover>
  )
}

function LinkInput({
  value,
  onChange
}: {
  value: string
  onChange: (value?: string) => void
}) {
  const css = useCss()
  const [input, setInput] = useState(value)

  useEffect(() => {
    setInput(value)
  }, [value])

  return (
    <div className={css.input}>
      <div style={{ marginBottom: 4 }}>URL</div>
      <TextInput textarea rows={3} value={input} onChange={setInput} />
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Button
          secondary
          style={{ marginRight: 10 }}
          onClick={() => {
            onChange()
          }}
        >
          Delete
        </Button>
        <Button
          onClick={() => {
            onChange(normalizeUrl(input.trim()))
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  )
}

function Variables({
  title,
  variables,
  activeEditor
}: {
  title?: string
  variables: TextEditorVariable[]
  activeEditor: LexicalEditor
}) {
  const popover = useIconPopover()

  return (
    <IconPopover icon="variable" title={title} {...popover}>
      <Options
        options={variables}
        onChange={(option) => {
          popover.setOpen(false)
          activeEditor.dispatchCommand(INSERT_VARIABLE_COMMAND, option)
        }}
      />
    </IconPopover>
  )
}

function useIconPopover() {
  return usePopover({
    placement: 'bottom-start',
    offset: 8
  })
}

function IconPopover({
  title,
  icon,
  children,
  ...popover
}: {
  icon: SvgSymbolName
  children: React.ReactNode
  title?: string
} & ReturnType<typeof useIconPopover>) {
  const css = useCss()
  const tooltip = useTooltip({ showDelay: 1000 })

  return (
    <>
      <div
        ref={(node) => {
          tooltip.triggerRef(node)
          popover.triggerRef(node)
        }}
        className={clsx(css.icon, { [css.open]: popover.open })}
        onClick={() => {
          popover.setOpen(!popover.open)
        }}
      >
        <Icon name={icon} />
      </div>
      {title && !popover.open ? (
        <Tooltip open={tooltip.open} tooltipRef={tooltip.tooltipRef}>
          {title}
        </Tooltip>
      ) : null}
      <Popover open={popover.open} popoverRef={popover.popoverRef} arrow>
        {children}
      </Popover>
    </>
  )
}

function Dropdown({
  title,
  options,
  value,
  onChange
}: {
  title?: string
  options: {
    icon?: SvgSymbolName
    value: string
    label: string
  }[]
  value?: string
  onChange: (value: string) => void
}) {
  const css = useCss()
  const tooltip = useTooltip({ showDelay: 1000 })
  const popover = usePopover({
    placement: 'bottom-start',
    offset: 8
  })

  const selected = options.find((el) => el.value === value)

  let content: React.ReactNode = 'Select'

  if (selected) {
    if (selected.icon) {
      content = <Icon name={selected.icon} />
    } else {
      content = selected.label
    }
  }

  return (
    <>
      <div
        ref={(node) => {
          tooltip.triggerRef(node)
          popover.triggerRef(node)
        }}
        className={clsx(css.dropdown, { [css.open]: popover.open })}
        onClick={() => {
          popover.setOpen(!popover.open)
        }}
      >
        {content}
        <Icon name={popover.open ? 'caret-up' : 'caret-down'} />
      </div>
      {title && !popover.open ? (
        <Tooltip open={tooltip.open} tooltipRef={tooltip.tooltipRef}>
          {title}
        </Tooltip>
      ) : null}
      <Popover open={popover.open} popoverRef={popover.popoverRef} arrow>
        <Options
          options={options}
          value={value}
          onChange={(option) => {
            onChange(option.value)
            popover.setOpen(false)
          }}
        />
      </Popover>
    </>
  )
}

function Options({
  options,
  value,
  onChange
}: {
  options: {
    icon?: SvgSymbolName
    value: string
    label: string
  }[]
  value?: string
  onChange: (option: {
    icon?: SvgSymbolName
    value: string
    label: string
  }) => void
}) {
  const css = useCss()
  return (
    <div className={css.options}>
      {options.map((option) => (
        <div
          key={option.value}
          className={clsx(css.option, {
            [css.selected]: option.value === value
          })}
          onClick={() => {
            onChange(option)
          }}
        >
          {option.icon ? <Icon name={option.icon} /> : null}
          <div className={css.optionText}>{option.label}</div>
        </div>
      ))}
    </div>
  )
}

function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  const anchor = selection.anchor
  const focus = selection.focus
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()
  if (anchorNode === focusNode) {
    return anchorNode
  }
  const isBackward = selection.isBackward()
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  } else {
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode
  }
}

import clsx from 'clsx'
import React, { useCallback, useEffect, useState } from 'react'

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
  $isElementNode
} from 'lexical'

import {
  $getSelectionStyleValueForProperty,
  $isAtNodeEnd,
  $patchStyleText
} from '@lexical/selection'

import { $isLinkNode } from '@lexical/link'
import { $findMatchingParent } from '@lexical/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { Icon } from '../../../components/Icon'
import { Popover } from '../../../controls/Popover'
import { Tooltip } from '../../../controls/Tooltip'
import type { SvgSymbolName } from '../../../components/SvgSymbols/symbols'
import { ColorPalette } from '../../../controls/ColorPalette'
import { useTooltip } from '../../../controls/Tooltip/hooks'
import { usePopover } from '../../../controls/Popover/hooks'
import { getCss } from '../../../utils'
import type { FileUploadFunction, TextEditorVariable } from '../../../types'

const DEFAULT_FONT_COLOR = '#000000'
const DEFAULT_BG_COLOR = '#ffffff'
const DEFAULT_FONT_SIZE = '14px'
const DEFAULT_FONT_FAMILY = 'Arial, helvetica, sans-serif'

type LinkInfo = {
  url: string
}

export interface Props {
  upload?: FileUploadFunction
  variables?: TextEditorVariable[]
}

export function ToolbarPlugin({ upload, variables }: Props) {
  const css = useCss()
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
    link?: LinkInfo
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
        DEFAULT_FONT_COLOR
      )

      const bgColor = $getSelectionStyleValueForProperty(
        selection,
        'background-color',
        DEFAULT_BG_COLOR
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
      let link: LinkInfo | undefined

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
          : parent?.getFormatType() || 'left'

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
  }, [setState])

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

  useEffect(() => {
    console.log({ variables, upload })
  }, [variables, upload])

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
    </div>
  )
}

function useCss() {
  return getCss('ToolbarPlugin', (ns) => ({
    root: ns(),
    icon: ns('icon'),
    active: ns('active'),
    open: ns('open')
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
  const css = useCss()
  const tooltip = useTooltip({ showDelay: 1000 })
  const popover = usePopover({
    placement: 'bottom-start',
    offset: 4
  })

  return (
    <>
      <div
        ref={(node) => {
          tooltip.triggerRef(node)
          popover.triggerRef(node)
        }}
        className={clsx(css.icon, { [css.open]: popover.open })}
        onClick={() => {
          popover.setOpen(true)
        }}
      >
        <Icon name={icon} />
      </div>
      {title && !popover.open ? (
        <Tooltip open={tooltip.open} tooltipRef={tooltip.tooltipRef}>
          {title}
        </Tooltip>
      ) : null}
      <Popover open={popover.open} popoverRef={popover.popoverRef}>
        <ColorPalette color={color} onChange={onChange} />
      </Popover>
    </>
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

import type React from 'react'
import type {
  EmailBuilderColumn,
  ColumnsBlockAttrs
} from '../blocks/columns/types'
import type { EditorState } from 'lexical'

export interface EmailBuilderConfig {
  /**
   * The allowed blocks in the email editor.
   */
  blocks: EmailBuilderBlockConfig[]

  /**
   * The function to upload image.
   */
  upload?: FileUploadFunction

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
   * The text editor config.
   */
  textEditor?: {
    /**
     * The placeholder.
     */
    placeholder?: string

    /**
     * The variable list.
     */
    variables?: TextEditorVariable[]

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
}

export interface EmailBuilderBlockConfig<
  Attrs extends object = any,
  SerializedAttrs extends object = any
> {
  /**
   * Specify the block type. The block type must be unique.
   *
   * Please note that the type of custom block cannot be `placeholder` or
   * `columns`. They are used internally.
   */
  type: string

  /**
   * Block name.
   */
  name: string

  /**
   * Block icon.
   */
  icon?: React.ReactNode

  /**
   * The component to render the block in the canvas.
   */
  blockComponent: React.ComponentType<{
    block: EmailBuilderBlock<Attrs>
  }>

  /**
   * The component to render the block editor.
   */
  editorComponent?: React.ComponentType<{ block: EmailBuilderBlock<Attrs> }>

  /**
   * Specify the function to create a new block. You can modify the `base`
   * block passed in (which contains all the common fields) directly and
   * return it.
   */
  createBlock?: (
    base: EmailBuilderBlock<any>,
    config: EmailBuilderConfig
  ) => EmailBuilderBlock<Attrs>

  /**
   * Specify the function to copy the block.
   *
   * @param block The original block. The value must be treated as immutable.
   * @param config The email builder config.
   * @returns The copied block. The id of the copied block must be different
   * with the original one, you can use `generateId()` to generated a new id.
   */
  copyBlock?: (
    block: EmailBuilderBlock<Attrs>,
    config: EmailBuilderConfig
  ) => EmailBuilderBlock<Attrs>

  /**
   * Specify the function to serialize the block attrs.
   * Must return a valid JSON object that can be serialized.
   */
  exportJSON?: (attrs: Attrs) => SerializedAttrs

  /**
   * Specify the function to deserialize the block attrs.
   */
  importJSON?: (json: SerializedAttrs) => Attrs
}

export type FileUploadFunction = (file: File) => Promise<{ url: string }>

export interface EmailBuilderBlockStyle {
  /**
   * The block background color.
   */
  bgColor?: string

  /**
   * The block padding in pixel: `[top, right, bottom, left]`.
   */
  padding?: (number | null)[]

  /**
   * The section background color.
   */
  sectionBgColor?: string

  /**
   * Indicates if the section full-width. Default `yes`.
   */
  full?: 'yes' | 'no'
}

export interface EmailBuilderBlock<Attrs extends object = any> {
  id: string
  type: string
  attrs: Attrs
  style: EmailBuilderBlockStyle
}

export interface EmailBuilderProps {
  config: EmailBuilderConfig
  className?: string
  style?: React.CSSProperties
  state: EmailBuilderState
  setState: React.Dispatch<React.SetStateAction<EmailBuilderState>>

  /**
   * The sidebar position. The default value is `left`.
   */
  sidebarPosition?: 'left' | 'right'
}

export interface EmailBuilderPageStyle {
  bgColor?: string
  padding?: (number | null)[]
}

export interface EmailBuilderState {
  /**
   * The page style.
   */
  style?: EmailBuilderPageStyle

  /**
   * The blocks on the canvas.
   */
  blocks: EmailBuilderBlock[]

  /**
   * The type of the block being dragged. If the value is undefined,
   * it means no block is currently being dragged.
   */
  draggingType?: string

  /**
   * The id of the block currently being dragged over.
   */
  dragoverId?: string

  /**
   * The drag-over position of the currently targeted block.
   */
  dragover?: 'top' | 'bottom' | false

  /**
   * The id of the selected block. If the value is undefined,
   * it means no block is selected.
   */
  selectedId?: string

  /**
   * The current selected tab in sidebar.
   */
  tab?: 'blocks' | 'settings' | 'page'
}

export interface SerializedEmailBuilderState {
  style?: EmailBuilderPageStyle
  blocks: EmailBuilderBlock<any>[]
}

export interface EmailBuilderSelectedBlockInfo {
  block?: EmailBuilderBlock
  columns?: EmailBuilderBlock<ColumnsBlockAttrs>
  column?: EmailBuilderColumn
  first?: boolean
  last?: boolean
}

export interface TextEditorState {
  editorState?: string | EditorState
  html?: string
}

export interface TextEditorVariable {
  value: string
  label: string
  placeholder?: string
}

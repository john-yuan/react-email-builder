import type React from 'react'
import type {
  EmailEditorColumn,
  ColumnsBlockAttrs
} from '../blocks/columns/types'
import type { EditorState } from 'lexical'

export interface EmailBuilderConfig {
  /**
   * The allowed blocks in the email editor.
   */
  blocks: EmailBuilderBlockConfig[]

  /**
   * The function used to upload image files.
   */
  uploadImage?: FileUploadFunction

  fonts?: {
    value: string
    label: string
  }[]
}

export interface EmailBuilderBlockConfig<Attrs extends object = any> {
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
  editorComponent: React.ComponentType<{ block: EmailBuilderBlock<Attrs> }>

  /**
   * Specify the function to create a new block. You can modify the `base` block
   * passed in (which contains all the common fields) directly and return it.
   */
  createBlock?: (
    base: EmailBuilderBlock<any>,
    config: EmailBuilderConfig
  ) => EmailBuilderBlock<Attrs>
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
}

export interface EmailBuilderSectionStyle {
  /**
   * The section background color.
   */
  bgColor?: string

  /**
   * Set to `yes` make the section full-width.
   */
  full?: 'yes' | 'no'
}

export interface EmailBuilderBlock<Attrs extends object = any> {
  id: string
  type: string
  blockStyle: EmailBuilderBlockStyle
  sectionStyle: EmailBuilderSectionStyle
  attrs: Attrs
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
  pageStyle?: EmailBuilderPageStyle

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

export interface EmailBuilderSelectedBlockInfo {
  block?: EmailBuilderBlock
  columns?: EmailBuilderBlock<ColumnsBlockAttrs>
  column?: EmailEditorColumn
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

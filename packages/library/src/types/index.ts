import type React from 'react'

export interface EmailBuilderConfig {
  /**
   * The allowed blocks in the email editor.
   */
  blocks: EmailBuilderBlockConfig[]

  /**
   * The function used to upload image files.
   */
  uploadImage?: FileUploadFunction
}

export interface EmailBuilderBlockConfig<Attrs extends object = any> {
  /**
   * Specify the block type. The block type must be unique.
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
  blockComponent: React.ComponentType<{ block: EmailBuilderBlock<Attrs> }>

  /**
   * The component to render the block editor.
   */
  editorComponent: React.ComponentType<{ block: EmailBuilderBlock<Attrs> }>

  /**
   * Specify the function to create a new block. You can modify the `base` block
   * passed in (which contains all the common fields) directly and return it.
   */
  createBlock?: (base: EmailBuilderBlock<any>) => EmailBuilderBlock<Attrs>
}

export type FileUploadFunction = (file: File) => Promise<{ url: string }>

export interface EmailBuilderBlockStyle {
  bgColor?: string
}

export interface EmailBuilderSectionStyle {
  bgColor?: string
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

export interface EmailBuilderState {
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
}

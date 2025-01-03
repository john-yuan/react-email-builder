import type { EmailBuilderBlock } from '../../types'

export interface ColumnStyle {
  bgColor?: string
  padding?: number[]
}

export interface EmailEditorColumn {
  id: string
  style: ColumnStyle
  blocks: EmailBuilderBlock[]
}

export interface ColumnsBlockAttrs {
  columns: EmailEditorColumn[]
}

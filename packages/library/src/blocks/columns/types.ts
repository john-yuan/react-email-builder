import type { EmailBuilderBlock } from '../../types'

export interface EmailBuilderColumnAttrs {
  bgColor?: string
  padding?: (number | null)[]
}

export interface EmailBuilderColumn {
  id: string
  attrs: EmailBuilderColumnAttrs
  blocks: EmailBuilderBlock[]
}

export interface ColumnsBlockAttrs {
  columns: EmailBuilderColumn[]
}

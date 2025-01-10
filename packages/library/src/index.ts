export { EmailBuilder } from './components/EmailBuilder'
export { TextEditor } from './components/TextEditor'

export {
  generateId,
  createBlock,
  createBaseBlock,
  createPlaceholder,
  namespace,
  varsClass,
  getDefaultFonts,
  serializeEmailBuilderState,
  deserializeEmailBuilderState
} from './utils'

export { columnsBlock } from './blocks/columns'
export { buttonBlock } from './blocks/button'
export { dividerBlock } from './blocks/divider'
export { textBlock } from './blocks/text'
export { imageBlock } from './blocks/image'
export { spacerBlock } from './blocks/spacer'

export type {
  EmailBuilderBlock,
  EmailBuilderBlockConfig,
  EmailBuilderBlockStyle,
  EmailBuilderSectionStyle,
  EmailBuilderConfig,
  EmailBuilderProps,
  EmailBuilderState,
  EmailBuilderPageStyle,
  EmailBuilderSelectedBlockInfo,
  FileUploadFunction,
  TextEditorState,
  TextEditorVariable
} from './types'

export type { ColumnsBlockAttrs } from './blocks/columns/types'
export type { ButtonBlockAttrs } from './blocks/button/types'
export type { DividerBlockAttrs } from './blocks/divider/types'
export type { TextBlockAttrs } from './blocks/text/types'
export type { ImageBlockAttrs } from './blocks/image/types'
export type { SpacerBlockAttrs } from './blocks/spacer/types'
export type { Props as TextEditorProps } from './components/TextEditor'

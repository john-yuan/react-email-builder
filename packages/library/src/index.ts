export { EmailBuilder } from './components/EmailBuilder'
export { TextEditor } from './components/TextEditor'

export {
  generateId,
  createBlock,
  copyBlock,
  createBaseBlock,
  createColumn,
  createPlaceholder,
  namespace,
  varsClass,
  getDefaultFonts,
  serializeEmailBuilderState,
  deserializeEmailBuilderState,
  getCss,
  getSelectedBlock,
  isAbsoluteUrl,
  normalizeUrl,
  createEmailBuilderState
} from './utils'

export {
  color,
  generateMJML,
  createBlockAttrs,
  lines,
  px,
  renderBlock,
  renderTag,
  padding,
  replaceHtmlVariables
} from './utils/mjml'

export {
  useBlockAttrsEditor,
  useBlockEditor,
  useBlockStyle,
  useCopyBlock,
  useDeleteBlock,
  useEmailBuilderConfig,
  useEmailBuilderState,
  useMoveBlock,
  useSelectedBlock,
  useSetEmailBuilderState
} from './hooks'

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
  EmailBuilderConfig,
  EmailBuilderProps,
  EmailBuilderState,
  EmailBuilderPageStyle,
  EmailBuilderSelectedBlockInfo,
  FileUploadFunction,
  TextEditorState,
  TextEditorVariable,
  SerializedEmailBuilderState
} from './types'

export type {
  GenerateOptions,
  RenderTagOptions,
  TagAttributes,
  ReplaceVariableFn
} from './utils/mjml'

export type { ColumnsBlockAttrs } from './blocks/columns/types'
export type { ButtonBlockAttrs } from './blocks/button/types'
export type { DividerBlockAttrs } from './blocks/divider/types'
export type { TextBlockAttrs } from './blocks/text/types'
export type { ImageBlockAttrs } from './blocks/image/types'
export type { SpacerBlockAttrs } from './blocks/spacer/types'
export type { Props as TextEditorProps } from './components/TextEditor'

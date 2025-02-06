export interface ImageBlockAttrs {
  src?: string
  alt?: string
  width?: number // px
  /**
   * default `yes`
   */
  full?: 'yes' | 'no'
  align?: 'left' | 'right' | 'center'
  href?: string
}

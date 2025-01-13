export interface ImageBlockAttrs {
  src?: string
  alt?: string
  width?: number // px
  full?: 'yes' | 'no' // default `yes`
  align?: 'left' | 'right' | 'center'
  href?: string
}

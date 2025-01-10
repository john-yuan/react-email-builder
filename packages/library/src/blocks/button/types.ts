export interface ButtonBlockAttrs {
  text?: string
  url?: string
  target?: '_blank' | '_self'
  block?: 'yes' | 'no'

  color?: string
  bgColor?: string
  fontFamily?: string
  fontSize?: number // px
  lineHeight?: number // %
  letterSpacing?: number // px
  fontWeight?: 'bold' | 'normal'
  textDecoration?: 'underline' | 'none'

  align?: 'left' | 'right' | 'center' | 'justify'
  padding?: (number | null)[] // [top, right, bottom, left] px
  borderRadius?: number // px
}

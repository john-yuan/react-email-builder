import React from 'react'
import clsx from 'clsx'
import { Button } from '../Button'
import { getCss } from '../../utils'

export interface Props
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'className' | 'style' | 'size'
  > {
  style?: React.CSSProperties
  children?: React.ReactNode
  loading?: boolean
  className?: string
  block?: boolean
  size?: 'small' | 'default'
  plain?: boolean
  icon?: React.ReactNode
}

export function FileButton({
  style,
  children,
  loading,
  size,
  block,
  className,
  plain,
  icon,
  ...inputProps
}: Props) {
  const css = getCss('FileButton', (ns) => ({
    root: ns(),
    input: ns('input'),
    hidden: ns('hidden')
  }))
  return (
    <Button
      className={clsx(className, css.root)}
      style={style}
      loading={loading}
      block={block}
      size={size}
      plain={plain}
      icon={icon}
    >
      {children}
      <input
        type="file"
        className={clsx(css.input, {
          [css.hidden]: loading
        })}
        {...inputProps}
      />
    </Button>
  )
}

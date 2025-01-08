import clsx from 'clsx'
import React from 'react'
import { Icon } from '../../components/Icon'
import { getCss } from '../../utils'

export interface Props {
  className?: string
  children?: React.ReactNode
  loading?: boolean
  style?: React.CSSProperties
  block?: boolean
  size?: 'small' | 'default'
  secondary?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export function Button({
  className,
  loading,
  children,
  style,
  block,
  size,
  secondary,
  onClick
}: Props) {
  const css = getCss('Button', (ns) => ({
    root: ns(),
    icon: ns('icon'),
    text: ns('text'),
    loading: ns('loading'),
    input: ns('input'),
    inline: ns('inline'),
    small: ns('small'),
    primary: ns('primary')
  }))

  return (
    <div
      className={clsx(css.root, className, {
        [css.loading]: loading,
        [css.inline]: !block,
        [css.small]: size === 'small',
        [css.primary]: !secondary
      })}
      style={style}
      onClick={onClick}
    >
      {loading ? (
        <div className={css.icon}>
          <Icon name="loading" />
        </div>
      ) : null}
      <div className={css.text}>{children}</div>
    </div>
  )
}

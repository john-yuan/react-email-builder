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
  plain?: boolean
  icon?: React.ReactNode
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
  icon,
  plain,
  onClick
}: Props) {
  const css = getCss('Button', (ns) => ({
    root: ns(),
    icon: ns('icon'),
    spin: clsx(ns('icon'), ns('spin')),
    text: ns('text'),
    loading: ns('loading'),
    input: ns('input'),
    inline: ns('inline'),
    small: ns('small'),
    primary: ns('primary'),
    plain: ns('plain')
  }))

  return (
    <div
      className={clsx(css.root, className, {
        [css.loading]: loading,
        [css.inline]: !block,
        [css.small]: size === 'small',
        [css.primary]: !secondary && !plain,
        [css.plain]: plain
      })}
      style={style}
      onClick={onClick}
      role="button"
    >
      {loading ? (
        <div className={css.spin}>
          <Icon name="loading" />
        </div>
      ) : (
        <>{icon ? <div className={css.icon}>{icon}</div> : null}</>
      )}
      <div className={css.text}>{children}</div>
    </div>
  )
}

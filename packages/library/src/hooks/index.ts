import type React from 'react'
import { useContext, useMemo } from 'react'
import {
  EmailBuilderConfigContext,
  EmailBuilderStateContext,
  SetEmailBuilderStateContext
} from '../context'

import type { EmailBuilderBlock } from '../types'

export function useEmailBuilderConfig() {
  return useContext(EmailBuilderConfigContext)
}

export function useEmailBuilderState() {
  return useContext(EmailBuilderStateContext)
}

export function useSetEmailBuilderState() {
  return useContext(SetEmailBuilderStateContext)
}

export function useBlockStyle(block: EmailBuilderBlock) {
  const style = block.blockStyle
  return useMemo<React.CSSProperties>(() => {
    const p = style.padding || []
    return {
      backgroundColor: style.bgColor,
      paddingTop: p[0],
      paddingRight: p[1],
      paddingBottom: p[2],
      paddingLeft: p[3]
    }
  }, [style])
}

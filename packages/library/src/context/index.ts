import type React from 'react'
import { createContext } from 'react'
import type { EmailBuilderConfig, EmailBuilderState } from '../types'

export const EmailBuilderConfigContext = createContext<EmailBuilderConfig>({
  blocks: []
})

export const EmailBuilderStateContext = createContext<EmailBuilderState>({
  blocks: []
})

export const SetEmailBuilderStateContext = createContext<
  React.Dispatch<React.SetStateAction<EmailBuilderState>>
>(() => {})

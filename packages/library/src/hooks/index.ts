import { useContext } from 'react'
import {
  EmailBuilderConfigContext,
  EmailBuilderStateContext,
  SetEmailBuilderStateContext
} from '../context'

export function useEmailBuilderConfig() {
  return useContext(EmailBuilderConfigContext)
}

export function useEmailBuilderState() {
  return useContext(EmailBuilderStateContext)
}

export function useSetEmailBuilderState() {
  return useContext(SetEmailBuilderStateContext)
}

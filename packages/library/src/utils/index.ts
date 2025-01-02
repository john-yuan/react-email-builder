import type { EmailBuilderBlock } from '../types'

let counter = 0
let prefix: string | null = null

export function generateId() {
  if (prefix == null) {
    prefix = Math.random().toFixed(6).slice(-6)
  }

  if (counter >= Number.MAX_SAFE_INTEGER) {
    counter = 0
  }

  counter += 1

  const time = Date.now().toString().slice(-6)

  return prefix + '-' + time + '-' + counter
}

export function createBlock<Attrs extends object = Record<string, string>>(
  type: string,
  attrs?: Attrs
): EmailBuilderBlock<Attrs> {
  return {
    id: generateId(),
    type,
    attrs: attrs || ({} as any),
    blockStyle: {},
    sectionStyle: {}
  }
}

export function namespace(module: string) {
  const base = 'REB-' + module

  return (className?: string) => {
    return className ? base + '-' + className : base
  }
}

export function varsClass() {
  return namespace('vars')()
}

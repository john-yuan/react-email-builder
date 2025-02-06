import clsx from 'clsx'
import type {
  EditorConfig,
  LexicalEditor,
  NodeKey,
  SerializedTextNode
} from 'lexical'
import { TextNode } from 'lexical'
import { namespace } from '../../../utils'

type SerializedVariableNode = SerializedTextNode & {
  varValue: string
  varLabel: string
}

export class VariableNode extends TextNode {
  __var_value: string
  __var_label: string

  static getType(): string {
    return 'variable'
  }

  static clone(node: VariableNode): VariableNode {
    return new VariableNode(node.__var_value, node.__var_label, node.__key)
  }

  constructor(varValue: string, varLabel: string, key?: NodeKey) {
    super(varLabel, key)

    this.__var_value = varValue
    this.__var_label = varLabel
  }

  createDOM(config: EditorConfig, editor?: LexicalEditor): HTMLElement {
    const dom = super.createDOM(config, editor)

    dom.className = clsx(dom.className, namespace('VariableNode')())
    dom.setAttribute('data-variable-value', '(' + this.__var_value + ')')

    return dom
  }

  static importJSON(serializedNode: SerializedVariableNode): VariableNode {
    const node = $createVariableNode(
      serializedNode.varValue,
      serializedNode.varLabel
    )

    node.setFormat(serializedNode.format)
    node.setDetail(serializedNode.detail)
    node.setMode(serializedNode.mode)
    node.setStyle(serializedNode.style)

    return node
  }

  exportJSON(): SerializedVariableNode {
    return {
      ...super.exportJSON(),
      type: 'variable',
      version: 1,
      varValue: this.__var_value,
      varLabel: this.__var_label
    }
  }
}

export function $createVariableNode(varValue: string, varLabel: string) {
  const node = new VariableNode(varValue, varLabel)

  node.setMode('token')

  return node
}

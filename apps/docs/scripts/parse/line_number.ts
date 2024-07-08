import { Node } from 'ts-morph'

export function getLineNumber(node: Node) {
  return node.getStartLineNumber(true)
}

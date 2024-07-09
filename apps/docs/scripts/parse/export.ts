import { ExportDeclaration, ExportSpecifier, Symbol } from 'ts-morph'
import { docOfContent } from './jsdoc'
import { adjustSignature } from './signature'
import { DocEntity } from './doc-entity'
import { getLineNumber } from './line-number'

export const exportOfDeclaration = async (
  e: ExportDeclaration
): Promise<DocEntity[]> => {
  return Promise.all(e.getNamedExports().map(exportOfSpecifier))
}

const exportOfSpecifier = async (e: ExportSpecifier): Promise<DocEntity> => {
  const signatures = [await adjustSignature(e.getType().getText(e))] // TODO signature seems wrong ?
  const name = e.compilerNode.name.text
  const comment = e.getLeadingCommentRanges()[0]?.getText()
  const doc = docOfContent(comment ?? '')
  return {
    ...doc,
    kind: 'export',
    name,
    line: getLineNumber(e),
    signatures,
  }
}

export const exportOfSymbol = async (
  e: Symbol
): Promise<DocEntity> => {
  // TODO
  const signatures = [e.getName()]
  const name = e.getName()
  return {
    description: undefined,
    isDeprecated: false,
    examples: [],
    since: undefined,
    todos: [],
    kind: 'export',
    name,
    line: 0,
    signatures,
  }
}

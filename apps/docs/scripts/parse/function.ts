import { FunctionDeclaration } from 'ts-morph'
import { docOfJsDoc } from './jsdoc'
import { adjustSignature } from './signature'
import { DocEntity } from './doc-entity'
import { getLineNumber } from './line-number'

export function getFunctionDeclarationSignature(
  fun: FunctionDeclaration
): Promise<string> {
  let text = fun.getText()
  const body = fun.compilerNode.body
  if (body !== undefined) {
    const end = body.getStart() - fun.getStart() - 1
    text = text.substring(0, end)
  }
  text = text.trim()
  if (text.endsWith(')')) {
    text += ': ' + fun.getReturnType().getText()
  }
  return adjustSignature(text)
}

export const functionOfDeclaration = async (
  fun: FunctionDeclaration
): Promise<DocEntity> => {
  // fun.getModifiers
  // fun.getParameters
  // fun.getReturnType
  // fun.getSignature
  // fun.getStatement
  const name = fun.getName()
  if (!name) {
    throw `Function name required in module ${fun.getSourceFile().getFilePath()}`
  }
  const overloads = fun.getOverloads()
  const signatures = await Promise.all(
    overloads.length > 0
      ? overloads.map(o => getFunctionDeclarationSignature(o))
      : [getFunctionDeclarationSignature(fun)]
  )
  const ref = overloads.length > 0 ? overloads[0] : fun

  return {
    ...docOfJsDoc(fun.getJsDocs()),
    kind: 'function',
    name,
    line: getLineNumber(ref),
    signatures,
  }
}

import { VariableDeclaration } from 'ts-morph'
import { docOfJsDoc } from './jsdoc'
import { stripImportTypes } from '../utils/strip_imports'
import { DocEntity } from './doc_entity'
import { getLineNumber } from './line_number'
import { adjustSignature } from './signature'

async function getConstantVariableDeclarationSignature(
  vd: VariableDeclaration
): Promise<string> {
  const text = vd.getText()
  const lt = text.indexOf('<')
  let end = text.indexOf(' = ')
  if (lt !== -1 && lt < end) {
    const gt = text.indexOf('>', lt)
    end = text.indexOf(' = ', gt)
  }
  let s = text.substring(0, end)
  if (s.indexOf(':') === -1) {
    s += ': ' + stripImportTypes(vd.getType().getText(vd))
  }
  return adjustSignature(`const ${s}`)
}

export const variableOfDeclaration = async (
  v: VariableDeclaration
): Promise<DocEntity> => {
  const doc = docOfJsDoc(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((v.getParent() as any)?.getParent() as any)?.getJsDocs() || ''
  )
  const name = v.getName()
  const signatures = [await getConstantVariableDeclarationSignature(v)]
  return {
    ...doc,
    kind: 'variable',
    name,
    line: getLineNumber(v),
    signatures,
  }
}

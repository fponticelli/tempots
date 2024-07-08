import { InterfaceDeclaration } from 'ts-morph'
import { docOfJsDoc as docOfJsDocs } from './jsdoc'
import { adjustSignature } from './signature'
import { DocEntity } from './doc_entity'
import { getLineNumber } from './line_number'

export const interfaceOfDeclaration = async (
  interf: InterfaceDeclaration
): Promise<DocEntity> => {
  const doc = docOfJsDocs(interf.getJsDocs())
  const name = interf.getName()
  const signatures = [await adjustSignature(interf.getText())]

  return {
    kind: 'interface',
    ...doc,
    name,
    line: getLineNumber(interf),
    signatures,
  }
}

import { TypeAliasDeclaration } from 'ts-morph'
import { docOfJsDoc } from './jsdoc'
import { adjustSignature } from './signature'
import { DocEntity } from './doc_entity'
import { getLineNumber } from './line_number'

export const typeAliasOfDeclaration = async (
  ta: TypeAliasDeclaration
): Promise<DocEntity> => {
  const signatures = [await adjustSignature(ta.getText())]
  const name = ta.getName()

  return {
    ...docOfJsDoc(ta.getJsDocs()),
    kind: 'type_alias',
    name,
    line: getLineNumber(ta),
    signatures,
  }
}

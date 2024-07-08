import { stripImportTypes } from '../utils/strip-imports'
import { makePretty } from '../utils/pretty'
import { replace } from '@tempots/std/string'

export const adjustSignature = async (signature: string) => {
  signature = signature.trim()
  signature = replace(signature, 'export ', '')
  signature = stripImportTypes(signature)
  // signature = await makePretty(signature)
  signature = replace(signature, 'declare ', '')
  return signature
}

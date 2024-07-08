import {
  ClassDeclaration,
  MethodDeclaration,
  ClassStaticPropertyTypes,
  ConstructorDeclaration,
  ClassInstancePropertyTypes,
  ts,
} from 'ts-morph'
import { docOfJsDoc } from './jsdoc'
import { adjustSignature } from './signature'
import { flatten } from '@tempots/std/array'
import { replace } from '@tempots/std/string'
import { DocEntity } from './doc_entity'
import { getLineNumber } from './line_number'

function getMethodDeclarationSignature(fun: MethodDeclaration): string {
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
  return text
}

function getValueDeclarationSignature(
  o: ClassStaticPropertyTypes | ClassInstancePropertyTypes
): string {
  const text = o.getText()
  // console.log(text)
  // const lt = text.indexOf('<')
  // let end = text.indexOf(' = ')
  // if (lt !== -1 && lt < end) {
  //   const gt = text.indexOf('>', lt)
  //   end = text.indexOf(' = ', gt)
  // }
  // let s = text.substring(0, end)
  // if (s.indexOf(':') === -1) {
  //   s += ': ' + o.getType().getText(o)
  // }
  return text
}

const keywordsToRemove = ['readonly', 'private', 'public']

function getConstructorDeclarationSignature(o: ConstructorDeclaration): string {
  let text = o.getText()
  const body = o.compilerNode.body
  if (body !== undefined) {
    const end = body.getStart() - o.getStart() - 1
    text = text.substring(0, end)
  }
  keywordsToRemove.forEach(k => {
    text = replace(text, ` ${k} `, ' ')
  })
  text = text.trim()
  return text
}

function isPublic(
  p:
    | ClassStaticPropertyTypes
    | MethodDeclaration
    | ConstructorDeclaration
    | ClassInstancePropertyTypes
): boolean {
  return (
    p.hasModifier(ts.SyntaxKind.PublicKeyword) ||
    (!p.hasModifier(ts.SyntaxKind.PrivateKeyword) &&
      !p.hasModifier(ts.SyntaxKind.ProtectedKeyword))
  )
}

function getSignature(cls: ClassDeclaration) {
  let tp =
    cls
      .getTypeParameters()
      ?.map(t => t.getText())
      .join(', ') ?? ''
  if (tp) {
    tp = `<${tp}>`
  }
  let ext = cls.getExtends()?.getText() ?? ''
  if (ext) {
    ext = ` extends ${ext}`
  }
  let impl =
    cls
      .getImplements()
      ?.map(i => i.getText())
      .join(', ') ?? ''
  if (impl) {
    impl = ` implements ${impl}`
  }

  let abstract = cls.getAbstractKeyword() ?? ''
  if (abstract) {
    abstract = `abstract `
  }

  const lines = flatten([
    cls
      .getStaticProperties()
      .filter(isPublic)
      .map(m => getValueDeclarationSignature(m)),
    cls
      .getStaticMethods()
      .filter(isPublic)
      .map(m => getMethodDeclarationSignature(m)),
    cls
      .getConstructors()
      .filter(isPublic)
      .map(c => getConstructorDeclarationSignature(c)),
    cls
      .getInstanceProperties()
      .filter(isPublic)
      .map(m => getValueDeclarationSignature(m)),
    cls
      .getInstanceMethods()
      .filter(isPublic)
      .map(m => getMethodDeclarationSignature(m)),
  ]).join('\n  ')

  return adjustSignature(`declare ${abstract}class ${cls.getName()}${tp}${ext}${impl} {
  ${lines}
}`)
}

export const classOfDeclaration = async (
  ta: ClassDeclaration
): Promise<DocEntity> => {
  const signatures = [await adjustSignature(await getSignature(ta))]
  const name = ta.getName()
  if (!name) {
    throw `Class has no name in modle ${ta.getSourceFile().getFilePath()}`
  }

  return {
    ...docOfJsDoc(ta.getJsDocs()),
    kind: 'class',
    name,
    line: getLineNumber(ta),
    signatures,
  }
}

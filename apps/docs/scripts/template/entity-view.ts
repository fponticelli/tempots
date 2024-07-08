import { Description, ToDos, Examples, Tags } from './base-doc-view'
import { Title } from './title'
import { Signature } from './signature'
import { DocEntity } from '../parse/doc_entity'
import { highlight } from '../utils/highlight'
import { attr, ForEach, Fragment, html, Signal } from '@tempots/dom'
import { Merge } from '@tempots/std/domain'
import { BaseDoc } from '../parse/jsdoc'

const getUrl = (project: string, module: string, line: number) => {
  return `https://github.com/fponticelli/tempo/blob/master/${project}/src/${module}#L${line}`
}

const getModule = (project: string, module: string) => {
  return `${project}/src/${module}`
}

const getImport = (name: string, project: string, module: string) => {
  return `import { ${name} } from 'tempo-${project}/lib/${module}'`
}

export const Signatures = (
  doc: Signal<DocEntity & { project: string; module: string }>
) => {
  const signatures = doc.$.signatures
  return Fragment(
    ForEach(signatures, Signature),
    Fragment(
      html.p(
        attr.class('defined-in'),
        'defined in ',
        html.a(
          attr.href(doc.map(s => getUrl(s.project, s.module, s.line))),
          doc.map(s => getModule(s.project, s.module)),
          ' at line ',
          doc.map(s => String(s.line))
        )
      ),
      html.pre(
        attr.class('import-code ts language-ts'),
        attr.innerHTML(
          doc.map(s => highlight(getImport(s.name, s.project, s.module)))
        )
      )
    )
  )
}

export const EntityView = (
  doc: Signal<Merge<DocEntity, { project: string; module: string }>>
) =>
  Fragment(
    Title(doc as unknown as Signal<{ name: string; kind: string }>),
    Tags(doc as unknown as Signal<BaseDoc>),
    Description(doc as unknown as Signal<BaseDoc>),
    ToDos(doc as unknown as Signal<BaseDoc>),
    Examples(doc as unknown as Signal<BaseDoc>),
    Signatures(doc)
  )

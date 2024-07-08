import { description, todos, examples, tags } from './base_doc'
import { Title } from './title'
import { signature } from './signature'
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

export const signatures = (
  doc: Signal<DocEntity & { project: string; module: string }>
) => {
  const signatures = doc.$.signatures
  return Fragment(
    ForEach(signatures, signature),
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
// Fragment<
//   DocEntity & { project: string; module: string },
//   unknown,
//   unknown
// >($ =>
//   $.MapField('signatures', $ => $.ForEach($ => $.Append(signature)))
//     .P($ =>
//       $.class('defined-in')
//         .text('defined in ')
//         .A($ =>
//           $.href(s => getUrl(s.project, s.module, s.line))
//             .text(s => getModule(s.project, s.module))
//             .text(' at line ')
//             .text(s => String(s.line))
//         )
//     )
//     .PRE($ =>
//       $.class('import-code ts language-ts').Lifecycle(
//         unsafeHtml(s => highlight(getImport(s.name, s.project, s.module)))
//       )
//     )
// )

export const entityTemplate = (
  doc: Signal<Merge<DocEntity, { project: string; module: string }>>
) =>
  Fragment(
    Title(doc as unknown as Signal<{ name: string; kind: string }>),
    tags(doc as unknown as Signal<BaseDoc>),
    description(doc as unknown as Signal<BaseDoc>),
    todos(doc as unknown as Signal<BaseDoc>),
    examples(doc as unknown as Signal<BaseDoc>),
    signatures(doc)
  )
// Fragment<
//   DocEntity & { project: string; module: string },
//   unknown,
//   unknown
// >($ => $.AppendMany(title, tags, description, todos, signatures, examples))

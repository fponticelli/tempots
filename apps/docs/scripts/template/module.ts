import { entityTemplate } from './entity_template'
import { baseDoc } from './base_doc'
import { moduleToc } from './module_toc'
import { State } from './state'
import { attr, computed, ForEach, Fragment, html, Signal } from '@tempots/dom'
import { BaseDoc } from '../parse/jsdoc'

const getUrl = (project: string, module: string) => {
  return `https://github.com/fponticelli/tempo/edit/master/${project}/src/${module}`
}

export const module = (state: Signal<State>) =>
  Fragment(
    html.div(
      attr.class('top-right'),
      html.a(
        attr.href(
          computed(
            () => getUrl(state.value.project, state.value.module.path),
            [state]
          )
        ),
        '✏️ edit me'
      )
    ),
    html.h1(state.map(s => `module '${s.module.title}'`)),
    baseDoc(state.$.module as unknown as Signal<BaseDoc>),
    moduleToc(state),
    ForEach(
      state.map(s =>
        s.module.docEntities.map(e => ({
          module: s.module.path,
          project: s.project,
          ...e,
        }))
      ),
      entityTemplate
    )
  )
// Fragment<State, unknown, unknown>($ =>
//   $.DIV($ =>
//     $.class('top-right').A($ =>
//       $.href(s => getUrl(s.project, s.module.path)).text('✏️ edit me')
//     )
//   )
//     .H1($ => $.text(m => `module '${m.module.title}'`))
//     .MapField('module', $ => $.Append(baseDoc))
//     .Append(moduleToc)
//     .MapState(
//       s =>
//         s.module.docEntities.map(e => ({
//           module: s.module.path,
//           project: s.project,
//           ...e,
//         })),
//       $ => $.ForEach($ => $.Append(entityTemplate))
//     )
// )

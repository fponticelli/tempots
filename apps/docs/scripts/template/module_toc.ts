import { attr, Ensure, ForEach, Fragment, html, Signal } from '@tempots/dom'
import { State } from './state'

const mapModuleToToc = (state: State) => {
  const mod = state.module
  return mod.docEntities.map(e => ({
    ...e,
    path: `#/api/${state.project}/${mod.path.substr(
      0,
      mod.path.length - 3
    )}.html#${e.name}`,
  }))
}

export const moduleToc = (state: Signal<State>) =>
  html.nav(
    Ensure(
      state.map(s => {
        const v = mapModuleToToc(s)
        return v.length > 5 ? v : null
      }),
      v =>
        Fragment(
          html.p(attr.class('title is-6'), 'Table of Contents'),
          html.ul(
            attr.class('module-toc-list'),
            ForEach(v, e =>
              html.li(
                html.a(
                  attr.href(e.$.path),
                  attr.class('is-family-monospace'),
                  e.$.name
                )
              )
            )
          )
        )
    )
  )
// NAV<State, unknown, unknown>($ =>
//   $.MapState(mapModuleToToc, $ =>
//     $.When(
//       s => s.length > 5,
//       $ =>
//         $.P($ => $.class('title is-6').text('Table of Contents')).UL($ =>
//           $.class('module-toc-list').ForEach($ =>
//             $.LI($ =>
//               $.A($ =>
//                 $.href(s => s.path)
//                   .class('is-family-monospace')
//                   .text(s => s.name)
//               )
//             )
//           )
//         )
//     )
//   )
// )

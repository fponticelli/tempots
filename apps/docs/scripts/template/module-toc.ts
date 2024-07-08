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

export const ModuleToc = (state: Signal<State>) =>
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

import { EntityView } from './entity-view'
import { BaseDocView } from './base-doc-view'
import { ModuleToc } from './module-toc'
import { State } from './state'
import { attr, computed, ForEach, Fragment, html, Signal } from '@tempots/dom'
import { BaseDoc } from '../parse/jsdoc'

const getUrl = (project: string, module: string) => {
  return `https://github.com/fponticelli/tempo/edit/master/${project}/src/${module}`
}

export const Module = (state: Signal<State>) =>
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
    BaseDocView(state.$.module as unknown as Signal<BaseDoc>),
    ModuleToc(state),
    ForEach(
      state.map(s =>
        s.module.docEntities.map(e => ({
          module: s.module.path,
          project: s.project,
          ...e,
        }))
      ),
      EntityView
    )
  )

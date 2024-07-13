import { Toc, DemoRef, ProjectRef } from './toc'
import { AsyncResult } from '@tempots/std/async-result'
import { HttpError } from './request'
import { Route } from './route'
import {
  TNode,
  makeProviderMark,
  Signal,
  UseProvider,
  WithProvider,
} from '@tempots/dom'
import { Action } from './action'

export type Content =
  | {
      kind: 'HtmlPage'
      title: string | undefined
      html: string
      path: string | undefined
    }
  | { kind: 'Demos'; demos: DemoRef[] }
  | { kind: 'Project'; project: ProjectRef }

export const Content = {
  htmlPage(
    title: string | undefined,
    html: string,
    path: string | undefined
  ): Content {
    return { kind: 'HtmlPage', title, html, path }
  },
  demos(demos: DemoRef[]): Content {
    return { kind: 'Demos', demos }
  },
  project(project: ProjectRef): Content {
    return { kind: 'Project', project }
  },
}

export interface State {
  toc: AsyncResult<Toc, HttpError>
  content: AsyncResult<Content, HttpError>
  route: Route
}

export const makeState = (route: Route): State => ({
  toc: AsyncResult.notAsked,
  content: AsyncResult.notAsked,
  route,
})

const stateProviderMark = makeProviderMark<Signal<State>>('State')

export const StateProvider = (state: Signal<State>, child: TNode) =>
  WithProvider(stateProviderMark, state, child)

export const UseState = (fn: (state: Signal<State>) => TNode) =>
  UseProvider(stateProviderMark, fn)

const dispatchProviderMark =
  makeProviderMark<(action: Action) => void>('Dispatch')

export const DispatchProvider = (
  dispatch: (action: Action) => void,
  child: TNode
) => WithProvider(dispatchProviderMark, dispatch, child)

export const UseDispatch = (
  fn: (dispatch: (action: Action) => void) => TNode
) => UseProvider(dispatchProviderMark, fn)

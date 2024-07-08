import { State, Content } from './state'
import { Action } from './action'
import { loading, success } from 'tempo-std/lib/async_result'
import { reduceOnKind } from 'tempo-core/lib/reducer'
import { HttpError } from './request'

export const reducer = reduceOnKind<State, Action>({
  GoTo: (state, action) => {
    let content = state.content

    if (state.toc.kind === 'Success') {
      if (action.route.kind === 'Demos') {
        content = success<Content, HttpError>(
          Content.demos(state.toc.value.demos)
        )
      } else if (action.route.kind === 'Api') {
      }
    }

    return {
      ...state,
      route: action.route,
      content
    }
  },
  LoadedToc: (state, action) => ({
    ...state,
    toc: action.toc
  }),
  RequestToc: state => ({
    ...state,
    toc: loading(null)
  }),
  LoadedContent: (state, action) => ({
    ...state,
    content: action.content
  }),
  RequestPageContent: state => ({
    ...state,
    content: loading(null)
  })
})

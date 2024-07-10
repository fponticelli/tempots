import { State, Content } from './state'
import { Action } from './action'
import { AsyncResult } from '@tempots/std/async-result'
import { Toc } from './toc'

export const reducer = (state: State, action: Action): State => {
  switch (action.kind) {
    case 'GoTo': {
      let content = state.content

      if (state.toc.type === 'Success') {
        if (action.route.kind === 'Demos') {
          content = AsyncResult.success<Content>(
            Content.demos(state.toc.value.demos)
          )
        }
      }

      return {
        ...state,
        route: action.route,
        content,
      }
    }
    case 'LoadedToc':
      return {
        ...state,
        toc: action.toc,
      }
    case 'RequestToc':
      return {
        ...state,
        toc: AsyncResult.loading<Toc>(undefined),
      }
    case 'LoadedContent':
      return {
        ...state,
        content: action.content,
      }
    case 'RequestPageContent':
      return {
        ...state,
        content: AsyncResult.loading<Content>(undefined),
      }
  }
}

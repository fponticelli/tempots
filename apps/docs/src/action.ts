import { AsyncResult } from 'tempo-std/lib/async_result'
import { Toc } from './toc'
import { HttpError } from './request'
import { Route } from './route'
import { Content } from './state'

export type Action =
  | { kind: 'RequestToc' }
  | { kind: 'LoadedToc'; toc: AsyncResult<Toc, HttpError, unknown> }
  | { kind: 'RequestPageContent' }
  | {
      kind: 'LoadedContent'
      content: AsyncResult<Content, HttpError, unknown>
    }
  | { kind: 'GoTo'; route: Route }

export const Action = {
  requestToc: { kind: 'RequestToc' } as Action,
  loadedToc: (toc: AsyncResult<Toc, HttpError, unknown>) =>
    ({ kind: 'LoadedToc', toc } as Action),
  requestPageContent: { kind: 'RequestPageContent' } as Action,
  loadedContent: (content: AsyncResult<Content, HttpError, unknown>) =>
    ({ kind: 'LoadedContent', content } as Action),
  goTo: (route: Route) => ({ kind: 'GoTo', route } as Action)
}

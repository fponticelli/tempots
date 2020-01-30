import { State, Content } from './state'
import { Action } from './action'
import { loadJson, loadText } from './request'
import { Store } from 'tempo-store/lib/store'
import { outcome } from 'tempo-std/lib/async'
import { forEach } from 'tempo-std/lib/async_result'
import { Toc } from './toc'
import { HttpError } from './request'
import { Result, map } from 'tempo-std/lib/result'
import { toContentUrl, contentFromRoute } from './route'
import { each } from 'tempo-std/lib/option'

export const middleware = (store: Store<State, Action>) => (
  state: State,
  action: Action
) => {
  console.log(state)
  switch (action.kind) {
    case 'RequestToc':
      loadJson('toc.json')
        .then((json) => {
          const toc = map(t => ({
            ...t,
            pages: t.pages.filter(p => p.path !== 'index.html')
          }), json as Result<Toc, HttpError>)
          store.process(Action.loadedToc(outcome(toc)))
        }) // TODO parse Toc
      break
    case 'RequestPageContent':
      each(
        (url: string) => {
          loadText(url).then(
            (htmlResult: Result<string, HttpError>) =>
              store.process(Action.loadedContent(outcome(map(Content.htmlPage, htmlResult))))
          )
        },
        toContentUrl(state.route)
      )
      break
    case 'GoTo':
      forEach(toc => contentFromRoute(store, toc, action.route), state.toc)
      break
  }
}
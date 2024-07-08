import { State, Content } from './state'
import { Action } from './action'
import { loadJson, loadText } from './request'
import { outcome, toAsyncResult } from 'tempo-std/lib/async'
import { forEach, isSuccess } from 'tempo-std/lib/async_result'
import { Toc } from './toc'
import { HttpError } from './request'
import { Result, map } from 'tempo-std/lib/result'
import {
  toContentUrl,
  contentFromRoute,
  sameRoute,
  toUrlForAnalytics
} from './route'
import { each } from 'tempo-std/lib/option'
import { splitOnLast } from 'tempo-std/lib/strings'
import { Middleware } from 'tempo-dom/lib/tempo'

declare const ga: any

export const scrollTo = () => {
  const ref = location.hash.split('#').pop()
  if (ref) {
    const refEl = document.getElementById(ref)
    let el: null | HTMLElement = refEl
    while (el && !el?.classList.contains('scrollable')) {
      el = el.parentElement
    }
    if (refEl && el && el.parentElement) {
      el.scrollTop = refEl.offsetTop - el.offsetTop
      // el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    }
  }
}

const urlToGitHubContent = (url: string) => {
  if (url.startsWith('pages/')) {
    const path = splitOnLast(url, '.')[0] + '.md'
    return `https://github.com/fponticelli/tempo/edit/master/${path}`
  } else {
    return undefined
  }
}

export const middleware: Middleware<State, Action> = (
  dispatch: (action: Action) => void
) => (state: State, action: Action, prev: State) => {
  // console.log(state, action)
  switch (action.kind) {
    case 'LoadedToc':
      if (isSuccess(action.toc)) {
        contentFromRoute(dispatch, action.toc.value, state.route)
      }
      break
    case 'RequestToc':
      loadJson('toc.json').then(json => {
        const toc = map(json as Result<Toc, HttpError>, t => ({
          ...t,
          pages: t.pages.filter(p => p.path !== 'index.html')
        }))
        dispatch(Action.loadedToc(toAsyncResult(outcome(toc))))
      }) // TODO parse Toc
      break
    case 'RequestPageContent':
      each((url: string) => {
        loadText(url).then((htmlResult: Result<string, HttpError>) =>
          dispatch(
            Action.loadedContent(
              toAsyncResult(
                outcome(
                  map(htmlResult, h =>
                    Content.htmlPage(undefined, h, urlToGitHubContent(url))
                  )
                )
              )
            )
          )
        )
      }, toContentUrl(state.route))
      break
    case 'LoadedContent':
      scrollTo()
      break
    case 'GoTo':
      if (!sameRoute(action.route, prev.route)) {
        const path = toUrlForAnalytics(action.route)
        if (ga) {
          ga('set', 'page', path)
          ga('send', 'pageview')
        }
        forEach(state.toc, toc => contentFromRoute(dispatch, toc, action.route))
      } else {
        scrollTo()
      }
      break
  }
}

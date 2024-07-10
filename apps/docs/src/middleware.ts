import { State, Content } from './state'
import { Action } from './action'
import { loadJson, loadText } from './request'
import { Toc } from './toc'
import { HttpError } from './request'
import {
  toContentUrl,
  contentFromRoute,
  sameRoute,
  toUrlForAnalytics,
} from './route'
import { splitOnLast } from '@tempots/std/string'
import { AsyncResult } from '@tempots/std/async-result'
import { Result } from '@tempots/std/result'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const middleware = ({
  dispatch,
  state,
  action,
  previousState,
}: {
  dispatch: (action: Action) => void
  state: State
  action: Action
  previousState: State
}) => {
  // console.log(state, action)
  switch (action.kind) {
    case 'LoadedToc':
      if (AsyncResult.isSuccess(action.toc)) {
        contentFromRoute(dispatch, action.toc.value, state.route)
      }
      break
    case 'RequestToc':
      loadJson('toc.json').then(json => {
        const toc = Result.map(json as Result<Toc, HttpError>, t => ({
          ...t,
          pages: t.pages.filter(p => p.path !== 'index.html'),
        }))
        dispatch(Action.loadedToc(Result.toAsync(toc)))
      }) // TODO parse Toc
      break
    case 'RequestPageContent': {
      const url = toContentUrl(state.route)
      if (url != null) {
        loadText(url).then((htmlResult: Result<string, HttpError>) =>
          dispatch(
            Action.loadedContent(
              Result.toAsync(
                Result.map(htmlResult, h =>
                  Content.htmlPage(undefined, h, urlToGitHubContent(url))
                )
              )
            )
          )
        )
      }
      break
    }
    case 'LoadedContent':
      scrollTo()
      break
    case 'GoTo':
      if (!sameRoute(action.route, previousState.route)) {
        const path = toUrlForAnalytics(action.route)
        if (ga) {
          ga('set', 'page', path)
          ga('send', 'pageview')
        }
        if (state.toc.type === 'Success') {
          contentFromRoute(dispatch, state.toc.value, action.route)
        }
      } else {
        scrollTo()
      }
      break
  }
}

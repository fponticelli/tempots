import { PageRef, Toc } from './toc'
import { ProjectRef } from './toc'
import { Content } from './state'
import { Action } from './action'
import { AsyncResult } from '@tempots/std/async-result'
import { deepEqual } from '@tempots/std/equal'
import { Maybe } from '@tempots/std/maybe'

export type Route =
  | { kind: 'Page'; path: string }
  | { kind: 'Demos' }
  | { kind: 'Project'; name: string }
  | { kind: 'Api'; name: string; path: string }
  | { kind: 'Changelog'; name: string }
  | { kind: 'NotFound'; path: string }
  | { kind: 'Home' }

export const toHref = (route: Route) => {
  switch (route.kind) {
    case 'Api':
      return `#/api/${route.name}/${route.path}`
    case 'Changelog':
      return `#/changelog/${route.name}`
    case 'Demos':
      return `#/demo`
    case 'Home':
      return `#/`
    case 'NotFound':
      return route.path
    case 'Page':
      return `#/page/${route.path}`
    case 'Project':
      return `#/project/${route.name}`
  }
}

export const toUrlForAnalytics = (r: Route) => {
  const href = toHref(r)
  if (!href) return '/'
  if (href.startsWith('#')) return href.substring(1)
  return href
}

export const toContentUrl = (route: Route) => {
  switch (route.kind) {
    case 'Api':
      return `api/${route.name}/${route.path}`
    case 'Changelog':
      return `changelog/${route.name}.html`
    case 'Demos':
      return Maybe.nothing
    case 'Home':
      return 'pages/index.html'
    case 'NotFound':
      return Maybe.nothing
    case 'Page':
      return `pages/${route.path}`
    case 'Project':
      return Maybe.nothing
  }
}

export const Route = {
  home: { kind: 'Home' } as Route,
  api: (name: string, path: string): Route => ({ kind: 'Api', name, path }),
  demos: { kind: 'Demos' } as Route,
  page: (path: string): Route => {
    if (path === 'index.html') return Route.home
    else return { kind: 'Page', path }
  },
  project: (name: string): Route => ({ kind: 'Project', name }),
  changelog: (name: string): Route => ({ kind: 'Changelog', name }),
  notFound: (path: string): Route => ({ kind: 'NotFound', path }),
}

export type Link = {
  label: string
  route: Maybe<Route>
}

export const pageToRoute = (page: PageRef): Route => {
  return Route.page(page.path)
}

export const sameRoute = (a: Route, b: Route) => deepEqual(a, b)

export const pageMatchesRoute = (p: PageRef, r: Route) => {
  return sameRoute(Route.page(p.path), r)
}

export const projectChangelogMatchesRoute = (p: ProjectRef, r: Route) => {
  return sameRoute(Route.changelog(p.name), r)
}

export const apiMatchesRoute = (name: string, path: string, r: Route) => {
  return sameRoute(Route.api(name, path), r)
}

export const parseUrl = (url: string): Route => {
  if (url === '' || url === 'index.html') {
    return Route.home
  } else {
    const parts = url.substring(1).split('#')
    url = parts[0]
    if (url.startsWith('/api/')) {
      const parts = url.substring(5).split('/')
      const name = parts.shift()!
      const path = parts.join('/')
      return Route.api(name, path)
    } else if (url === '/demo') {
      return Route.demos
    } else if (url.startsWith('/project/')) {
      return Route.project(url.substring(9))
    } else if (url.startsWith('/page/')) {
      return Route.page(url.substring(6))
    } else if (url.startsWith('/changelog/')) {
      return Route.changelog(url.substring(11))
    } else {
      return Route.notFound(url)
    }
  }
}

export const isApiProjectRoute = (route: Route, name: string) => {
  return (
    (route.kind === 'Api' && route.name === name) ||
    (route.kind === 'Changelog' && route.name === name)
  )
}

export const contentFromRoute = (
  dispatch: (action: Action) => void,
  toc: Toc,
  route: Route
) => {
  if (route.kind === 'Project') {
    const proj = toc.projects.find(p => p.name === route.name)!
    dispatch(Action.loadedContent(AsyncResult.success(Content.project(proj))))
  } else if (route.kind === 'Demos') {
    dispatch(
      Action.loadedContent(AsyncResult.success(Content.demos(toc.demos)))
    )
  } else {
    dispatch(Action.requestPageContent)
  }
}

export const parseLocation = () => {
  const url = location.pathname.split('/').pop() + location.hash
  return parseUrl(url)
}

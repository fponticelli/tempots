import { decodeText, match, digits, rest, eoi } from 'partsing/text'

import { oneOf } from 'partsing/core/decoder'
import { Page } from './types'
import { Result } from './utils/result'
import { Request } from './utils/request'
import { getCurrentPath } from './config'
import { deepEqual } from './utils/equals'
import { useProp, Prop } from '@tempots/dom'

export enum Feed {
  top = 'top',
  new = 'new',
  ask = 'ask',
  show = 'show',
  jobs = 'jobs',
}

export interface RootRoute {
  readonly type: 'RootRoute'
}

export interface FeedsRoute {
  readonly type: 'FeedsRoute'
  readonly feed: Feed
  readonly page: number
}

export interface ExternalRoute {
  readonly type: 'ExternalRoute'
  readonly path: string
}

export interface ItemRoute {
  readonly type: 'ItemRoute'
  readonly item: number
}

export interface UserRoute {
  readonly type: 'UserRoute'
  readonly user: string
}

export interface NotFoundRoute {
  readonly type: 'NotFoundRoute'
}

export type Route =
  | RootRoute
  | FeedsRoute
  | ItemRoute
  | UserRoute
  | NotFoundRoute
  | ExternalRoute

export const Route = {
  root: { type: 'RootRoute' } as Route,
  feeds: (feed: Feed, page: number): Route => ({
    type: 'FeedsRoute',
    feed,
    page,
  }),
  item: (item: number): Route => ({ type: 'ItemRoute', item }),
  user: (user: string | undefined): Route => ({
    type: 'UserRoute',
    user: user || '',
  }),
  notFound: { type: 'NotFoundRoute' } as Route,
  externalRoute: (path: string): Route => ({ type: 'ExternalRoute', path }),

  fromUrl: (url: string): Route => {
    const result = urlDecoder(url)
    switch (result.kind) {
      case 'decode-success':
        return result.value
      default:
        return Route.notFound
    }
  },
}

export interface RouteData {
  readonly title: string
  readonly url: string
}

export const routeData = (title: string, url: string): RouteData => ({
  title,
  url,
})

export const maxPage = (feed: Feed) => {
  switch (feed) {
    case Feed.top:
      return 10
    case Feed.new:
      return 10
    case Feed.ask:
      return 2
    case Feed.show:
      return 2
    case Feed.jobs:
      return 1
    default:
      throw `should never happen ${feed}`
  }
}

const feedToTitle = (feed: Feed) => {
  const s = feed.toString()
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

export const toRouteData = (route: Route) => {
  switch (route.type) {
    case 'ExternalRoute':
      return routeData('External', route.path)
    case 'FeedsRoute':
      return routeData(
        feedToTitle(route.feed),
        route.page === 1
          ? `/${route.feed}`
          : `/${route.feed}/page/${route.page}`
      )
    case 'ItemRoute':
      return routeData('Item', `/item/${route.item}`)
    case 'NotFoundRoute':
      return routeData('404', '/404')
    case 'RootRoute':
      return routeData('Top', '/')
    case 'UserRoute':
      return routeData(route.user, `/user/${route.user}`)
  }
}

export const loadRoute = async (route: Route) => {
  switch (route.type) {
    case 'ExternalRoute':
      window.open(route.path, '_blank')
      break
    case 'FeedsRoute': {
      const res = await Request.feed(route.feed, route.page)
      return Result.match(
        res,
        items => Page.feed(route.feed, route.page, items),
        Page.error
      )
    }
    case 'ItemRoute': {
      const res = await Request.item(route.item)
      return Result.match(res, Page.article, Page.error)
    }
    case 'NotFoundRoute':
      return Page.notFound
    case 'RootRoute': {
      const res = await Request.feed(Feed.top, 1)

      return Result.match(
        res,
        items => Page.feed(Feed.top, 1, items),
        Page.error
      )
    }
    case 'UserRoute': {
      const res = await Request.user(route.user)
      return Result.match(res, Page.profile, Page.error)
    }
  }
}

export const toTitle = (route: Route): string => toRouteData(route).title
export const toUrl = (route: Route): string => toRouteData(route).url

const parseFeed = oneOf(
  match('/top').withResult(Feed.top),
  match('/new').withResult(Feed.new),
  match('/ask').withResult(Feed.ask),
  match('/show').withResult(Feed.show),
  match('/jobs').withResult(Feed.jobs)
)

const urlDecoder = decodeText<Route>(
  oneOf(
    oneOf(
      parseFeed.skipNext(eoi).map(feed => Route.feeds(feed, 1)),
      parseFeed
        .join(match('/page/').pickNext(digits(1)).map(Number))
        .map(([feed, page]: [Feed, number]) => Route.feeds(feed, page))
    ),
    match('/item/').pickNext(digits(0)).map(Number).map(Route.item),
    match('/user/')
      .pickNext(rest)
      .map(i => Route.user(i)),
    match('/404').map(() => Route.notFound),
    match('/')
      .skipNext(eoi)
      .map(() => Route.root)
  )
)

export const getCurrentRoute = () => Route.fromUrl(getCurrentPath())

export const makeRouteFlow = (): Prop<Route> => {
  const route = useProp(getCurrentRoute(), deepEqual)
  window.addEventListener('popstate', () => {
    route.set(getCurrentRoute())
  })
  return route
}

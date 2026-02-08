import { Page } from './types'
import { Result } from './utils/result'
import { Request } from './utils/request'

export enum Feed {
  top = 'top',
  new = 'new',
  ask = 'ask',
  show = 'show',
  jobs = 'jobs',
}

export interface FeedsRoute {
  readonly type: 'FeedsRoute'
  readonly feed: Feed
  readonly page: number
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

export type Route = FeedsRoute | ItemRoute | UserRoute | NotFoundRoute

export const Route = {
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
}

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

export const feedToTitle = (feed: Feed) => {
  const s = feed.toString()
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

export const loadRoute = async (route: Route) => {
  switch (route.type) {
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
    case 'UserRoute': {
      const res = await Request.user(route.user)
      return Result.match(res, Page.profile, Page.error)
    }
  }
}

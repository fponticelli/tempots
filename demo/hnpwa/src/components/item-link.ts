import { Signal } from '@tempots/dom'
import { Item } from '../types'
import { LinkRoute } from './link-route'
import { Route } from '../route'

export const ItemLink = (item: Signal<Item>) =>
  LinkRoute({
    route: item.map(i => {
      if (i.url.type === 'External') return Route.externalRoute(i.url.path)
      else return Route.item(i.id)
    }),
    children: item.at('title').map(v => v ?? ''),
  })

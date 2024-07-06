import { For, If, Show, Signal } from '@tempots/dom'
import { Route } from '../route'
import { Item, PageFeed } from '../types'
import { LinkRoute } from './link-route'
import { Pagination } from './pagination'

export interface ItemProps {
  item: Signal<Item>
}

export const ItemLink = ({ item }: ItemProps) => (
  <LinkRoute
    route={item.map(it => {
      if (it.url.type === 'External') return Route.externalRoute(it.url.path)
      else return Route.item(it.id)
    })}
  >
    {item.at('title')}
  </LinkRoute>
)

export const ItemMainLink = ({ item }: ItemProps) => (
  <h2>
    <ItemLink item={item} />
  </h2>
)

export const ItemFooter = ({ item }: ItemProps) => (
  <footer>
    <If
      is={item.map(i => i.type === 'job')}
      then={item.at('time_ago')}
      otherwise={
        <>
          {item.at('points')} points by{' '}
          <LinkRoute route={item.map(i => Route.user(i.user))} />{' '}
          {item.at('time_ago')} |{' '}
          <LinkRoute route={item.map(i => Route.item(i.id))}>
            {item.at('comments_count')}
          </LinkRoute>
        </>
      }
    />
  </footer>
)

export interface PageFeedProps {
  page: Signal<PageFeed>
}

export function PageFeed({ page }: PageFeedProps) {
  return (
    <section className="list-view">
      <ul>
        <For of={page.at('items')}>
          {(item: Signal<Item>, index: number) => (
            <li>
              <aside>{page.map(p => (p.page - 1) * 30 + index + 1)}</aside>
              <div>
                <ItemLink item={item} />
                <Show when={item.at('domain')}>
                  {(d: Signal<string>) => <span className="domain">{d}</span>}
                </Show>
                <ItemFooter item={item} />
              </div>
            </li>
          )}
        </For>
      </ul>
      <Pagination feed={page.at('feed')} page={page.at('page')} />
    </section>
  )
}

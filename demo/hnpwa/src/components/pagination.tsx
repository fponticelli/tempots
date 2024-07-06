import { For, If, Signal } from '@tempots/dom'
import { Feed, maxPage, Route } from '../route'
import { LinkRoute } from './link-route'

export interface PaginationProps {
  feed: Signal<Feed>
  page: Signal<number>
}

const pageRange = (
  feed: Feed,
  current: number
): { feed: Feed; current: number; page: number }[] =>
  Array.from({ length: maxPage(feed) }, (_, i) => ({
    feed,
    current,
    page: i + 1
  }))

export const Pagination = ({ feed, page }: PaginationProps) => (
  <section className="pagination">
    <section>
      <If
        is={page.map(v => v === 1)}
        then={<span className="inactive">Previous</span>}
        otherwise={
          <LinkRoute
            route={feed.combine(page, (f, p) => Route.feeds(f, p - 1))}
          >
            Previous
          </LinkRoute>
        }
      />
    </section>
    <nav>
      <For of={feed.combine(page, pageRange)}>
        {(res: Signal<{ feed: Feed; current: number; page: number }>) => (
          <If
            is={res.map(({ current, page }) => current === page)}
            then={<span aria-current="page">{res.at('page')}</span>}
            otherwise={
              <LinkRoute
                route={res.map(({ feed, page }) => Route.feeds(feed, page))}
              >
                {res.at('page')}
              </LinkRoute>
            }
          />
        )}
      </For>
    </nav>
    <div className="mobile">
      <span>{page}</span>
      <span>/</span>
      <span>{feed.map(maxPage)}</span>
    </div>
    <section>
      <If
        is={feed.combine(page, (f, p) => maxPage(f) === p)}
        then={<span className="inactive">Next</span>}
        otherwise={
          <LinkRoute
            route={feed.combine(page, (f, p) => Route.feeds(f, p + 1))}
          >
            Next
          </LinkRoute>
        }
      />
    </section>
  </section>
)

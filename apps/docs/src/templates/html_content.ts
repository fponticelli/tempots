import { unsafeHtml } from 'tempo-dom/lib/lifecycle/unsafe_html'
import { Action } from '../action'
import { Fragment } from 'tempo-dom/lib/html'

export const htmlContent = Fragment<
  { title: string | undefined; html: string; path: string | undefined },
  Action,
  unknown
>($ =>
  $.When(
    s => typeof s.path === 'string',
    $ =>
      $.DIV($ =>
        $.class('top-right').A($ => $.href(s => s.path).text('✏️ edit me'))
      )
  )
    .When(
      s => typeof s.title === 'string',
      $ => $.text(s => s.title)
    )
    .ARTICLE($ => $.class('content').Lifecycle(unsafeHtml(s => s.html)))
)

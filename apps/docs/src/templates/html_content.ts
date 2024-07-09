import { attr, Ensure, Fragment, html, Signal } from '@tempots/dom'

export type HtmlContentProps = { title?: string; html: string; path?: string }

export const htmlContent = (data: Signal<HtmlContentProps>) =>
  Fragment(
    Ensure(
      data.map(s => (typeof s.path === 'string' ? s.path : null)),
      path =>
        html.div(attr.class('top-right'), html.a(attr.href(path), '✏️ edit me'))
    ),
    Ensure(
      data.map(s => (typeof s.title === 'string' ? s.title : null)),
      title => title
    ),
    html.article(attr.class('content'), attr.innerHTML(data.map(s => s.html)))
  )

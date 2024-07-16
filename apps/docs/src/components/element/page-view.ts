import { attr, html, Signal } from '@tempots/dom'
import { Page } from '../../model/domain'
import { fetchPage } from '../../services/page-service'
import { EmbedHTML } from './embed-html'

export function PageView(page: Signal<Page>) {
  const editPath = page.map(p => {
    console.log(p.path)
    const value = `${p.path}.md`
    return `https://github.com/fponticelli/tempots/edit/main/apps/docs/pages/${value}`
  })
  return html.div(
    attr.class('w-full h-full print:overflow-visible overflow-auto p-2'),
    html.div(
      attr.class('text-center'),
      html.a(
        attr.target('_blank'),
        attr.class(
          'bg-sky-700 text-white text-sm rounded-md px-2 py-1 hover:bg-sky-800'
        ),
        attr.href(editPath),
        'edit this page'
      )
    ),
    html.div(
      attr.class('px-4'),
      html.div(EmbedHTML(page.$.path.mapAsync(fetchPage, 'loading...')))
    )
  )
}

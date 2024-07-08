import { Action } from '../action'
import { ProjectRef } from '../toc'
import { ARTICLE } from 'tempo-dom/lib/html'
import { Route } from '../route'
import { link } from './link'
import { unsafeHtml } from 'tempo-dom/lib/lifecycle/unsafe_html'

function renamePackage(s: string) {
  return s
}

export const projectContent = ARTICLE<ProjectRef, Action, unknown>($ =>
  $.class('content')
    .H1($ => $.class('title').text(s => s.title))
    .P($ => $.class('subtitile').text(s => s.description))
    .MapField('keywords', $ =>
      $.When(
        tags => tags.length > 0,
        $ =>
          $.DIV($ =>
            $.class('tags').ForEach($ =>
              $.SPAN($ => $.class('tag').text(s => s))
            )
          )
      )
    )
    .P($ =>
      $.class('version')
        .A($ =>
          $.href(
            s => `https://www.npmjs.com/package/tempo-${renamePackage(s.name)}`
          ).IMG($ =>
            $.src(
              s =>
                `https://img.shields.io/npm/v/tempo-${renamePackage(
                  s.name
                )}?label=npm%3A%20tempo-${renamePackage(s.name)}`
            ).alt(s => `npm tempo ${s.name}`)
          )
        )
        .BR()
        .A($ =>
          $.Append(
            link({
              label: 'change log',
              route: p => Route.changelog(p.name)
            })
          )
        )
    )
    .DIV($ => $.Lifecycle(unsafeHtml(s => s.content)))
)

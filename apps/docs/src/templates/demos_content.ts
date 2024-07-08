import { Action } from '../action'
import { DemoRef } from '../toc'
import { DIV } from 'tempo-dom/lib/html'

function demoSrc(path: string) {
  return `https://github.com/fponticelli/tempo/tree/master/demo/${path}`
}

const demo = DIV<DemoRef, Action, unknown>($ =>
  $.class('tile is-parent tile-width').DIV($ =>
    $.class('tile is-child box')
      .P($ =>
        $.class('title is-5').A($ =>
          $.href(s => `demo/${s.path}/`).text(s => s.title)
        )
      )
      .P($ => $.class('description').text(s => s.description))
      .P($ =>
        $.class('source').A($ =>
          $.href(s => demoSrc(s.path)).text('source code')
        )
      )
  )
)

export const demosContent = DIV<DemoRef[], Action, unknown>($ =>
  $.P($ => $.class('title').text('Demos')).DIV($ =>
    $.class('tile is-ancestor wrap').ForEach($ => $.Append(demo))
  )
)

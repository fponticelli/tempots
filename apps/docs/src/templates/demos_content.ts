import { attr, ForEach, html, Signal } from '@tempots/dom'
import { DemoRef } from '../toc'

function demoSrc(path: string) {
  return `https://github.com/fponticelli/tempo/tree/master/demo/${path}`
}

const demo = (data: Signal<DemoRef>) =>
  html.div(
    attr.class('tile is-parent tile-width'),
    html.div(
      attr.class('tile is-child box'),
      html.p(
        attr.class('title is-5'),
        html.a(attr.href(data.map(d => `demo/${d.path}/`)), data.$.title)
      ),
      html.p(attr.class('description'), data.$.description),
      html.p(
        attr.class('source'),
        html.a(attr.href(data.map(s => demoSrc(s.path))), 'source code')
      )
    )
  )

export const demosContent = (data: Signal<DemoRef[]>) =>
  html.div(
    html.p(attr.class('title'), 'Demos'),
    html.div(attr.class('tile is-ancestor wrap'), ForEach(data, demo))
  )

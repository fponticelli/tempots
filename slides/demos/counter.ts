import { html, prop, on, attr, type DOMRenderable } from '@tempots/dom'

export function counterDemo(): DOMRenderable {
  const count = prop(0)

  return html.div(
    html.div(attr.class('count'), count.map(v => v.toLocaleString())),
    html.div(
      html.button(
        on.click(() => count.update(v => v - 1)),
        '-'
      ),
      html.button(
        on.click(() => count.update(v => v + 1)),
        '+'
      )
    )
  )
}

export const counterCode = `const count = prop(0)

html.div(
  html.div(
    attr.class('count'),
    count.map(v => v.toLocaleString())
  ),
  html.div(
    html.button(
      on.click(() => count.update(v => v - 1)),
      '-'
    ),
    html.button(
      on.click(() => count.update(v => v + 1)),
      '+'
    )
  )
)`

import { html, prop, on, attr, type DOMRenderable } from '@tempots/dom'

export function counterDerivedDemo(): DOMRenderable {
  const count = prop(0)
  const doubled = count.map(v => v * 2)
  const isEven = count.map(v => v % 2 === 0)

  return html.div(
    html.div('Count: ', count),
    html.div('Doubled: ', doubled),
    html.div(
      attr.class(isEven.map(e => e ? 'even' : 'odd')),
      isEven.map(e => e ? 'Even!' : 'Odd!')
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
  )
}

export const counterDerivedCode = `const count = prop(0)
const doubled = count.map(v => v * 2)
const isEven = count.map(v => v % 2 === 0)

html.div(
  html.div('Count: ', count),
  html.div('Doubled: ', doubled),
  html.div(
    attr.class(isEven.map(e => e ? 'even' : 'odd')),
    isEven.map(e => e ? 'Even!' : 'Odd!')
  ),
  html.div(
    html.button(on.click(() => count.update(v => v - 1)), '-'),
    html.button(on.click(() => count.update(v => v + 1)), '+')
  )
)`

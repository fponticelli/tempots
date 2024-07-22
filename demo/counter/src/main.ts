import { attr, html, Renderable, on, makeProp, render } from '@tempots/dom'

function App(): Renderable {
  const count = makeProp(0)
  const disabled = count.map(v => v === 0)
  return html.div(
    attr.class('app'),
    html.div(attr.class('count count-small'), 'count'),
    html.div(
      attr.class('count'),
      count.map(v => v.toLocaleString()),
      html.div(
        attr.class('buttons'),
        html.button(
          attr.disabled(disabled),
          on.click(() => count.value--),
          '-'
        ),
        html.button(
          on.click(() => count.value++),
          '+'
        )
      )
    )
  )
}

render(App(), document.body)

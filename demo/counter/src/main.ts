import { attr, html, Mountable, on, prop, render } from '@tempots/dom'

function App(): Mountable {
  const count = prop(0)
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
          on.click(() => {
            count.update(v => v - 1)
          }),
          '-'
        ),
        html.button(
          on.click(() => {
            count.update(v => v + 1)
          }),
          '+'
        )
      )
    )
  )
}

render(App(), document.body)

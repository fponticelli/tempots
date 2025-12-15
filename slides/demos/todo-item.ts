import { html, prop, on, attr, input, type DOMRenderable } from '@tempots/dom'

export function todoItemDemo(): DOMRenderable {
  const completed = prop(false)

  return html.li(
    attr.class(completed.map(c => c ? 'completed' : '')),
    input.checkbox(
      attr.checked(completed),
      on.change(() => completed.update(v => !v))
    ),
    html.span('Buy milk')
  )
}

export const todoItemCode = `const completed = prop(false)

html.li(
  attr.class(completed.map(c => c ? 'completed' : '')),
  input.checkbox(
    attr.checked(completed),
    on.change(() => completed.update(v => !v))
  ),
  html.span('Buy milk')
)`

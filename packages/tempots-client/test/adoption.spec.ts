import { html, KeyedForEach, prop, runHeadless, When } from '@tempots/dom'
import { afterEach, expect, test } from 'vitest'
import { hydrate } from '../src'

const containers: HTMLElement[] = []
afterEach(() => {
  containers.splice(0).forEach(container => container.remove())
})

function fromHeadless(factory: Parameters<typeof runHeadless>[0]) {
  const container = document.createElement('div')
  const { root, clear } = runHeadless(factory)
  container.innerHTML = root.contentToHTML(true)
  clear()
  document.body.appendChild(container)
  containers.push(container)
  return container
}

test('hydrates mixed and adjacent siblings in order and keeps them reactive', () => {
  const view = (label: ReturnType<typeof prop<string>>) => html.div(
    'before ', html.span('one'), 'text: ', label, html.span('two'),
  )
  const container = fromHeadless(() => view(prop('server')))
  const spans = Array.from(container.querySelectorAll('span'))
  const label = prop('server')
  const clear = hydrate(view(label), container)

  const hydratedSpans = container.querySelectorAll('span')
  expect(hydratedSpans).toHaveLength(2)
  expect(hydratedSpans[0]).toBe(spans[0])
  expect(hydratedSpans[1]).toBe(spans[1])
  expect(container.textContent).toBe('before onetext: servertwo')
  label.set('client')
  expect(container.textContent).toBe('before onetext: clienttwo')
  clear(true)
  expect(container.childNodes).toHaveLength(0)
})

test('hydrates existing conditional and repeated nodes before their anchors', () => {
  const view = (show: ReturnType<typeof prop<boolean>>, items: ReturnType<typeof prop<string[]>>) =>
    html.section(
      When(show, () => html.span('branch'), () => html.i('else')),
      html.ul(KeyedForEach(items, item => item, value => html.li(value))),
      html.footer('end'),
    )
  const container = fromHeadless(() => view(prop(true), prop(['a', 'b'])))
  const oldBranch = container.querySelector('span')
  const oldRows = Array.from(container.querySelectorAll('li'))
  const oldFooter = container.querySelector('footer')
  const show = prop(true)
  const items = prop(['a', 'b'])
  const clear = hydrate(view(show, items), container)

  expect(container.querySelector('span')).toBe(oldBranch)
  const hydratedRows = container.querySelectorAll('li')
  expect(hydratedRows).toHaveLength(2)
  expect(hydratedRows[0]).toBe(oldRows[0])
  expect(hydratedRows[1]).toBe(oldRows[1])
  expect(container.querySelector('footer')).toBe(oldFooter)
  items.set(['b', 'a', 'c'])
  expect(Array.from(container.querySelectorAll('li')).map(li => li.textContent)).toEqual(['b', 'a', 'c'])
  expect(container.querySelector('li')).toBe(oldRows[1])
  show.set(false)
  expect(container.querySelector('span')).toBeNull()
  expect(container.querySelector('i')?.textContent).toBe('else')
  expect(container.querySelector('footer')).toBe(oldFooter)
  clear(true)
  expect(container.childNodes).toHaveLength(0)
})

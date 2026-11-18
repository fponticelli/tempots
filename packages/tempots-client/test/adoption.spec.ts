import {
  DataAttr,
  BrowserContext,
  html,
  KeyedForEach,
  prop,
  on,
  type Renderable,
  style,
  When,
  WithBrowserCtx,
} from '@tempots/dom'
import { createRenderer } from '@tempots/server'
import { afterEach, expect, test } from 'vitest'
import { hydrate } from '../src'

const containers: HTMLElement[] = []
afterEach(() => {
  containers.splice(0).forEach(container => container.remove())
})

const formats = ['string', 'stream'] as const

async function fromServer(
  factory: () => Renderable,
  format: (typeof formats)[number] = 'string'
) {
  const container = document.createElement('div')
  const renderer = createRenderer(factory)
  if (format === 'string') {
    container.innerHTML = await renderer.render('/')
  } else {
    const chunks: string[] = []
    for await (const chunk of renderer.renderStream('/'))
      chunks.push(String(chunk))
    container.innerHTML = chunks.join('')
  }
  document.body.appendChild(container)
  containers.push(container)
  return container
}

test('hydrated bindings use browser attribute and CSS accessors', async () => {
  const view = (state: ReturnType<typeof prop<string>>) =>
    html.div(DataAttr('state', state), style.variable('--state', state))
  const container = await fromServer(() => view(prop('initial')))
  const original = container.firstElementChild as HTMLElement
  const state = prop('initial')
  const clear = hydrate(view(state), container)
  state.set('updated')

  expect(container.firstElementChild).toBe(original)
  expect(original.getAttribute('data-state')).toBe('updated')
  expect(original.style.getPropertyValue('--state')).toBe('updated')
  clear()
})

test('browser-only renderables receive a real browser context during hydration', async () => {
  const container = await fromServer(() => html.div())
  const original = container.firstElementChild
  const clear = hydrate(
    html.div(
      WithBrowserCtx(ctx => {
        expect(ctx).toBeInstanceOf(BrowserContext)
        expect(ctx.element).toBe(original)
        expect(ctx.getWindow()).toBe(window)
      })
    ),
    container
  )
  clear()
})

test.each(formats)(
  'hydrates mixed and adjacent siblings in %s output',
  async format => {
    const view = (label: ReturnType<typeof prop<string>>) =>
      html.div('before ', html.span('one'), 'text: ', label, html.span('two'))
    const container = await fromServer(() => view(prop('server')), format)
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
  }
)

test.each(formats)(
  'adopts conditional and keyed ranges in %s output',
  async format => {
    const view = (
      show: ReturnType<typeof prop<boolean>>,
      items: ReturnType<typeof prop<string[]>>
    ) =>
      html.section(
        When(
          show,
          () => html.span('branch'),
          () => html.i('else')
        ),
        html.ul(
          KeyedForEach(
            items,
            item => item,
            value => html.li(value)
          )
        ),
        html.footer('end')
      )
    const container = await fromServer(
      () => view(prop(true), prop(['a', 'b'])),
      format
    )
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
    expect(
      Array.from(container.querySelectorAll('li')).map(li => li.textContent)
    ).toEqual(['b', 'a', 'c'])
    expect(container.querySelector('li')).toBe(oldRows[1])
    show.set(false)
    expect(container.querySelector('span')).toBeNull()
    expect(container.querySelector('i')?.textContent).toBe('else')
    expect(container.querySelector('footer')).toBe(oldFooter)
    clear(true)
    expect(container.childNodes).toHaveLength(0)
  }
)

test.each(formats)(
  'attaches events and disposes reactive bindings on adopted %s HTML',
  async format => {
    const counter = (value: ReturnType<typeof prop<number>>) =>
      html.button(
        on.click(() => value.update(n => n + 1)),
        'Count: ',
        value
      )
    const container = await fromServer(() => counter(prop(3)), format)
    const button = container.querySelector('button')!
    const state = prop(3)
    const clear = hydrate(counter(state), container)

    expect(container.querySelector('button')).toBe(button)
    expect(button.textContent).toBe('Count: 3')
    button.click()
    expect(button.textContent).toBe('Count: 4')

    clear()
    expect(state.hasListeners()).toBe(false)
    state.set(5)
    expect(container.querySelector('button')).toBe(button)
    expect(button.textContent).toBe('Count: 4')
  }
)

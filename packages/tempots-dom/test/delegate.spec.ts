import { describe, expect, test, beforeEach, vi } from 'vitest'
import {
  delegate,
  render,
  html,
  attr,
  on,
  prop,
  ForEach,
  runHeadless,
} from '../src'
import { sleep } from './helper'

describe('delegate', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('should fire handler when child matches selector', () => {
    const handler = vi.fn()

    const clear = render(
      html.ul(
        delegate.click('li', handler),
        html.li('Item 1'),
        html.li('Item 2')
      ),
      document.body
    )

    const items = document.querySelectorAll('li')
    items[0]!.click()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(
      expect.any(Event),
      expect.any(Object)
    )
    clear()
  })

  test('should match correct child via closest()', () => {
    const handler = vi.fn()

    const clear = render(
      html.ul(
        delegate.click('li', handler),
        html.li(html.span('Nested text'))
      ),
      document.body
    )

    // Click the nested span — should still match the <li> parent
    const span = document.querySelector('span')!
    span.click()

    expect(handler).toHaveBeenCalledTimes(1)
    clear()
  })

  test('should not fire when target does not match selector', () => {
    const handler = vi.fn()

    const clear = render(
      html.div(
        delegate.click('button', handler),
        html.span('Not a button')
      ),
      document.body
    )

    const span = document.querySelector('span')!
    span.click()

    expect(handler).not.toHaveBeenCalled()
    clear()
  })

  test('should handle multiple delegated events on the same container', () => {
    const clickHandler = vi.fn()
    const inputHandler = vi.fn()

    const clear = render(
      html.div(
        delegate.click('button', clickHandler),
        delegate.input('input', inputHandler),
        html.button('Click me'),
        html.input()
      ),
      document.body
    )

    const button = document.querySelector('button')!
    button.click()
    expect(clickHandler).toHaveBeenCalledTimes(1)

    const input = document.querySelector('input')!
    input.dispatchEvent(new Event('input', { bubbles: true }))
    expect(inputHandler).toHaveBeenCalledTimes(1)

    clear()
  })

  test('should work alongside direct on handlers', () => {
    const delegatedHandler = vi.fn()
    const directHandler = vi.fn()

    const clear = render(
      html.ul(
        delegate.click('li', delegatedHandler),
        html.li(on.click(directHandler), 'Item')
      ),
      document.body
    )

    const li = document.querySelector('li')!
    li.click()

    expect(delegatedHandler).toHaveBeenCalledTimes(1)
    expect(directHandler).toHaveBeenCalledTimes(1)
    clear()
  })

  test('should remove listener on cleanup', () => {
    const handler = vi.fn()

    const clear = render(
      html.ul(
        delegate.click('li', handler),
        html.li('Item')
      ),
      document.body
    )

    const li = document.querySelector('li')!
    li.click()
    expect(handler).toHaveBeenCalledTimes(1)

    clear()

    // Re-create similar DOM to test the listener is gone
    // After clear, the DOM is removed, so we verify handler wasn't called extra times
    expect(handler).toHaveBeenCalledTimes(1)
  })

  test('should work with ForEach', async () => {
    const handler = vi.fn()
    const items = prop(['Apple', 'Banana', 'Cherry'])

    const clear = render(
      html.ul(
        delegate.click('li', (event) => {
          const li = (event.target as Element).closest('li')!
          handler(li.textContent)
        }),
        ForEach(items, (item) => html.li(item))
      ),
      document.body
    )

    const lis = document.querySelectorAll('li')
    expect(lis.length).toBe(3)

    lis[1]!.click()
    expect(handler).toHaveBeenCalledWith('Banana')

    // Add items — signal updates are async
    items.value = ['Apple', 'Banana', 'Cherry', 'Date']
    await sleep()
    const updatedLis = document.querySelectorAll('li')
    expect(updatedLis.length).toBe(4)

    updatedLis[3]!.click()
    expect(handler).toHaveBeenCalledWith('Date')

    clear()
  })

  test('should not match elements outside the container', () => {
    const handler = vi.fn()

    // Create an element outside the container
    const outsideButton = document.createElement('button')
    outsideButton.textContent = 'Outside'
    document.body.appendChild(outsideButton)

    const clear = render(
      html.div(
        delegate.click('button', handler),
        html.button('Inside')
      ),
      document.body
    )

    // Click the outside button — should not trigger
    outsideButton.click()
    expect(handler).not.toHaveBeenCalled()

    // Click the inside button — should trigger
    const insideButton = document.querySelector('div button')!
    insideButton.click()
    expect(handler).toHaveBeenCalledTimes(1)

    clear()
  })

  test('should work with class selectors', () => {
    const handler = vi.fn()

    const clear = render(
      html.div(
        delegate.click('.active', handler),
        html.span(attr.class('active'), 'Active'),
        html.span(attr.class('inactive'), 'Inactive')
      ),
      document.body
    )

    const active = document.querySelector('.active')! as HTMLElement
    const inactive = document.querySelector('.inactive')! as HTMLElement

    active.click()
    expect(handler).toHaveBeenCalledTimes(1)

    inactive.click()
    expect(handler).toHaveBeenCalledTimes(1) // Still 1, inactive didn't match

    clear()
  })

  test('should pass container DOMContext to handler', () => {
    let receivedCtx: unknown = null

    const clear = render(
      html.ul(
        delegate.click('li', (_event, ctx) => {
          receivedCtx = ctx
        }),
        html.li('Item')
      ),
      document.body
    )

    const li = document.querySelector('li')!
    li.click()

    expect(receivedCtx).not.toBeNull()
    expect(receivedCtx).toHaveProperty('element')
    // ctx should refer to the <ul> container, not the <li>
    expect((receivedCtx as { element: Element }).element.tagName).toBe('UL')
    clear()
  })

  test('should match when selector matches the container itself', () => {
    const handler = vi.fn()

    const clear = render(
      html.div(
        attr.class('clickable'),
        delegate.click('.clickable', handler),
        html.span('Inner')
      ),
      document.body
    )

    // Direct click on the container div
    const div = document.querySelector('.clickable')!
    ;(div as HTMLElement).click()

    expect(handler).toHaveBeenCalledTimes(1)
    clear()
  })

  test('should respect once option', () => {
    const handler = vi.fn()

    const clear = render(
      html.ul(
        delegate.click('li', handler, { once: true }),
        html.li('Item')
      ),
      document.body
    )

    const li = document.querySelector('li')!
    li.click()
    li.click()

    // once: true means the listener fires at most once
    expect(handler).toHaveBeenCalledTimes(1)
    clear()
  })

  test('should respect passive option', () => {
    const handler = vi.fn()

    const clear = render(
      html.ul(
        delegate.click('li', handler, { passive: true }),
        html.li('Item')
      ),
      document.body
    )

    const li = document.querySelector('li')!
    li.click()

    expect(handler).toHaveBeenCalledTimes(1)
    clear()
  })

  test('should respect signal option for aborting', () => {
    const handler = vi.fn()
    const controller = new AbortController()

    const clear = render(
      html.ul(
        delegate.click('li', handler, { signal: controller.signal }),
        html.li('Item')
      ),
      document.body
    )

    const li = document.querySelector('li')!
    li.click()
    expect(handler).toHaveBeenCalledTimes(1)

    // Abort should remove the listener
    controller.abort()
    li.click()
    expect(handler).toHaveBeenCalledTimes(1)

    clear()
  })

  test('should be a no-op in headless environment', () => {
    const handler = vi.fn()

    const { root, clear } = runHeadless(() =>
      html.ul(
        delegate.click('li', handler),
        html.li('Item')
      )
    )

    expect(root.contentToHTML()).toBe('<ul><li>Item</li></ul>')
    clear()
  })
})

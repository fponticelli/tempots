import { describe, expect, test, beforeEach, vi } from 'vitest'
import { TransitionKeyedForEach, render, prop, html, attr } from '../src'
import { sleep } from './helper'

describe('TransitionKeyedForEach', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('renders items from signal', async () => {
    const items = prop([
      { id: '1', text: 'one' },
      { id: '2', text: 'two' },
    ])

    const clear = render(
      html.div(
        TransitionKeyedForEach(
          items,
          (item) => item.id,
          (item, _pos, _isExiting) => html.span(item.map((i) => i.text)),
          { exitDuration: 100 }
        )
      ),
      document.body
    )

    await sleep()
    const spans = document.querySelectorAll('span')
    expect(spans).toHaveLength(2)
    expect(spans[0].textContent).toBe('one')
    expect(spans[1].textContent).toBe('two')

    clear()
    items.dispose()
  })

  test('keeps exiting items in DOM for exitDuration', async () => {
    const items = prop([
      { id: '1', text: 'one' },
      { id: '2', text: 'two' },
    ])

    const clear = render(
      html.div(
        TransitionKeyedForEach(
          items,
          (item) => item.id,
          (item, _pos, _isExiting) => html.span(item.map((i) => i.text)),
          { exitDuration: 200 }
        )
      ),
      document.body
    )

    await sleep()
    expect(document.querySelectorAll('span')).toHaveLength(2)

    // Remove second item
    items.set([{ id: '1', text: 'one' }])
    await sleep()

    // Item should still be in DOM (exiting)
    expect(document.querySelectorAll('span')).toHaveLength(2)

    // Wait for exit duration
    await sleep(250)

    // Now item should be removed
    expect(document.querySelectorAll('span')).toHaveLength(1)

    clear()
    items.dispose()
  })

  test('provides isExiting signal to render function', async () => {
    const items = prop([{ id: '1', text: 'one' }])
    let exitSignalValue = false

    const clear = render(
      html.div(
        TransitionKeyedForEach(
          items,
          (item) => item.id,
          (item, _pos, isExiting) => {
            isExiting.on((v) => {
              exitSignalValue = v
            })
            return html.span(item.map((i) => i.text))
          },
          { exitDuration: 200 }
        )
      ),
      document.body
    )

    await sleep()
    expect(exitSignalValue).toBe(false)

    // Remove the item
    items.set([])
    await sleep()

    expect(exitSignalValue).toBe(true)

    clear()
    items.dispose()
  })

  test('works with empty initial list', async () => {
    const items = prop<{ id: string; text: string }[]>([])

    const clear = render(
      html.div(
        TransitionKeyedForEach(
          items,
          (item) => item.id,
          (item) => html.span(item.map((i) => i.text)),
          { exitDuration: 100 }
        )
      ),
      document.body
    )

    await sleep()
    expect(document.querySelectorAll('span')).toHaveLength(0)

    // Add items
    items.set([{ id: '1', text: 'one' }])
    await sleep()
    expect(document.querySelectorAll('span')).toHaveLength(1)

    clear()
    items.dispose()
  })

  test('removes immediately when no exitDuration', async () => {
    const items = prop([
      { id: '1', text: 'one' },
      { id: '2', text: 'two' },
    ])

    const clear = render(
      html.div(
        TransitionKeyedForEach(
          items,
          (item) => item.id,
          (item) => html.span(item.map((i) => i.text)),
          {}
        )
      ),
      document.body
    )

    await sleep()
    expect(document.querySelectorAll('span')).toHaveLength(2)

    items.set([{ id: '1', text: 'one' }])
    await sleep()

    expect(document.querySelectorAll('span')).toHaveLength(1)

    clear()
    items.dispose()
  })
})

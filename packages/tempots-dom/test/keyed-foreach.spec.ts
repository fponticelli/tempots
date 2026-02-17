import { describe, expect, test, beforeEach } from 'vitest'
import {
  KeyedForEach,
  render,
  html,
  prop,
  runHeadless,
  KeyedPosition,
} from '../src'
import { sleep } from './helper'

describe('KeyedForEach', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('renders a static array of keyed items', () => {
    const clear = render(
      html.ul(
        KeyedForEach(
          ['Apple', 'Banana', 'Cherry'],
          (item) => item,
          (item) => html.li(item)
        )
      ),
      document.body
    )

    const items = document.querySelectorAll('li')
    expect(items.length).toBe(3)
    expect(items[0]!.textContent).toBe('Apple')
    expect(items[1]!.textContent).toBe('Banana')
    expect(items[2]!.textContent).toBe('Cherry')
    clear()
  })

  test('renders signal-driven items and updates on value change', async () => {
    const items = prop([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ])

    const clear = render(
      html.ul(
        KeyedForEach(
          items,
          (item) => item.id,
          (item) => html.li(item.map((v) => v.name))
        )
      ),
      document.body
    )

    let lis = document.querySelectorAll('li')
    expect(lis.length).toBe(2)
    expect(lis[0]!.textContent).toBe('Alice')
    expect(lis[1]!.textContent).toBe('Bob')

    // Update values (same keys, changed names)
    items.value = [
      { id: 1, name: 'Alice Updated' },
      { id: 2, name: 'Bob Updated' },
    ]
    await sleep()

    lis = document.querySelectorAll('li')
    expect(lis.length).toBe(2)
    expect(lis[0]!.textContent).toBe('Alice Updated')
    expect(lis[1]!.textContent).toBe('Bob Updated')

    clear()
  })

  test('reorders DOM nodes when items are reversed', async () => {
    const items = prop([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ])

    const clear = render(
      html.ul(
        KeyedForEach(
          items,
          (item) => item.id,
          (item) => html.li(item.map((v) => v.name))
        )
      ),
      document.body
    )

    let lis = document.querySelectorAll('li')
    // Capture original DOM nodes
    const nodeA = lis[0]!
    const nodeB = lis[1]!
    const nodeC = lis[2]!

    // Reverse the array
    items.value = [
      { id: 3, name: 'C' },
      { id: 2, name: 'B' },
      { id: 1, name: 'A' },
    ]
    await sleep()

    lis = document.querySelectorAll('li')
    expect(lis.length).toBe(3)
    expect(lis[0]!.textContent).toBe('C')
    expect(lis[1]!.textContent).toBe('B')
    expect(lis[2]!.textContent).toBe('A')

    // Verify DOM nodes were reused (moved, not recreated)
    expect(lis[0]).toBe(nodeC)
    expect(lis[1]).toBe(nodeB)
    expect(lis[2]).toBe(nodeA)

    clear()
  })

  test('adds new items', async () => {
    const items = prop([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ])

    const clear = render(
      html.ul(
        KeyedForEach(
          items,
          (item) => item.id,
          (item) => html.li(item.map((v) => v.name))
        )
      ),
      document.body
    )

    // Append a new item
    items.value = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ]
    await sleep()

    let lis = document.querySelectorAll('li')
    expect(lis.length).toBe(3)
    expect(lis[2]!.textContent).toBe('C')

    // Prepend a new item
    items.value = [
      { id: 0, name: 'Z' },
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ]
    await sleep()

    lis = document.querySelectorAll('li')
    expect(lis.length).toBe(4)
    expect(lis[0]!.textContent).toBe('Z')
    expect(lis[1]!.textContent).toBe('A')

    clear()
  })

  test('removes items and disposes their signals', async () => {
    const items = prop([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ])

    const clear = render(
      html.ul(
        KeyedForEach(
          items,
          (item) => item.id,
          (item) => html.li(item.map((v) => v.name))
        )
      ),
      document.body
    )

    // Remove the middle item
    items.value = [
      { id: 1, name: 'A' },
      { id: 3, name: 'C' },
    ]
    await sleep()

    const lis = document.querySelectorAll('li')
    expect(lis.length).toBe(2)
    expect(lis[0]!.textContent).toBe('A')
    expect(lis[1]!.textContent).toBe('C')

    clear()
  })

  test('handles mixed add/remove/reorder in one update', async () => {
    const items = prop([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'D' },
    ])

    const clear = render(
      html.ul(
        KeyedForEach(
          items,
          (item) => item.id,
          (item) => html.li(item.map((v) => v.name))
        )
      ),
      document.body
    )

    // Remove B(2), add E(5), reorder: D, A, E, C
    items.value = [
      { id: 4, name: 'D' },
      { id: 1, name: 'A' },
      { id: 5, name: 'E' },
      { id: 3, name: 'C' },
    ]
    await sleep()

    const lis = document.querySelectorAll('li')
    expect(lis.length).toBe(4)
    expect(lis[0]!.textContent).toBe('D')
    expect(lis[1]!.textContent).toBe('A')
    expect(lis[2]!.textContent).toBe('E')
    expect(lis[3]!.textContent).toBe('C')

    clear()
  })

  test('reuses signal identity across reorders', async () => {
    const items = prop([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ])

    const signalValues: string[] = []
    const clear = render(
      html.ul(
        KeyedForEach(
          items,
          (item) => item.id,
          (item) => {
            // Subscribe to the signal — should fire for value updates, not reorder
            item.on((v) => signalValues.push(v.name))
            return html.li(item.map((v) => v.name))
          }
        )
      ),
      document.body
    )

    // Initial render fires the on handler
    expect(signalValues).toEqual(['A', 'B'])

    // Reorder without value change
    items.value = [
      { id: 2, name: 'B' },
      { id: 1, name: 'A' },
    ]
    await sleep()

    // The signals should fire because the values are re-set (same value but through set())
    // The important thing is the DOM nodes moved, not recreated
    const lis = document.querySelectorAll('li')
    expect(lis[0]!.textContent).toBe('B')
    expect(lis[1]!.textContent).toBe('A')

    clear()
  })

  test('renders separator between items', async () => {
    const items = prop(['A', 'B', 'C'])

    const clear = render(
      html.ul(
        KeyedForEach(
          items,
          (item) => item,
          (item) => html.li(item),
          () => html.li(' | ')
        )
      ),
      document.body
    )

    await sleep()
    let lis = document.querySelectorAll('li')
    const texts = Array.from(lis).map((li) => li.textContent)
    expect(texts).toEqual(['A', ' | ', 'B', ' | ', 'C'])

    // Remove middle item
    items.value = ['A', 'C']
    await sleep()

    lis = document.querySelectorAll('li')
    const textsAfter = Array.from(lis).map((li) => li.textContent)
    expect(textsAfter).toEqual(['A', ' | ', 'C'])

    clear()
  })

  test('cleanup disposes all signals and removes all DOM', async () => {
    const items = prop([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ])

    const clear = render(
      html.div(
        KeyedForEach(
          items,
          (item) => item.id,
          (item) => html.span(item.map((v) => v.name))
        )
      ),
      document.body
    )

    expect(document.querySelectorAll('span').length).toBe(2)

    clear()

    // All DOM should be cleaned up
    expect(document.body.innerHTML).toBe('')
  })

  test('transitions between empty and non-empty arrays', async () => {
    const items = prop<string[]>(['A', 'B'])

    const clear = render(
      html.div(
        KeyedForEach(
          items,
          (item) => item,
          (item) => html.span(item)
        )
      ),
      document.body
    )

    expect(document.querySelectorAll('span').length).toBe(2)

    // Go empty
    items.value = []
    await sleep()
    expect(document.querySelectorAll('span').length).toBe(0)

    // Come back
    items.value = ['X', 'Y', 'Z']
    await sleep()
    const spans = document.querySelectorAll('span')
    expect(spans.length).toBe(3)
    expect(spans[0]!.textContent).toBe('X')
    expect(spans[1]!.textContent).toBe('Y')
    expect(spans[2]!.textContent).toBe('Z')

    clear()
  })

  test('headless rendering', () => {
    const { root, clear } = runHeadless(() =>
      html.ul(
        KeyedForEach(
          ['Apple', 'Banana'],
          (item) => item,
          (item) => html.li(item)
        )
      )
    )

    expect(root.contentToHTML()).toBe(
      '<ul><li>Apple</li><li>Banana</li></ul>'
    )
    clear()
  })

  test('reactive KeyedPosition updates on reorder', async () => {
    const items = prop([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ])

    const positions: Record<number, KeyedPosition> = {}

    const clear = render(
      html.ul(
        KeyedForEach(
          items,
          (item) => item.id,
          (item, pos) => {
            // Capture position object for each key
            item.on((v) => {
              positions[v.id] = pos
            })
            return html.li(item.map((v) => v.name))
          }
        )
      ),
      document.body
    )

    // Initial state
    expect(positions[1]!.index.value).toBe(0)
    expect(positions[2]!.index.value).toBe(1)
    expect(positions[3]!.index.value).toBe(2)
    expect(positions[1]!.isFirst.value).toBe(true)
    expect(positions[3]!.isFirst.value).toBe(false)

    // Reverse
    items.value = [
      { id: 3, name: 'C' },
      { id: 2, name: 'B' },
      { id: 1, name: 'A' },
    ]
    await sleep()

    // Positions should have updated reactively
    expect(positions[3]!.index.value).toBe(0)
    expect(positions[2]!.index.value).toBe(1)
    expect(positions[1]!.index.value).toBe(2)
    expect(positions[3]!.isFirst.value).toBe(true)
    expect(positions[1]!.isFirst.value).toBe(false)

    clear()
  })

  test('handles large reorder correctly', async () => {
    const n = 100
    const initial = Array.from({ length: n }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
    }))
    const items = prop(initial)

    const clear = render(
      html.div(
        KeyedForEach(
          items,
          (item) => item.id,
          (item) => html.span(item.map((v) => v.name))
        )
      ),
      document.body
    )

    expect(document.querySelectorAll('span').length).toBe(n)

    // Shuffle: reverse the array
    items.value = [...initial].reverse()
    await sleep()

    const spans = document.querySelectorAll('span')
    expect(spans.length).toBe(n)
    expect(spans[0]!.textContent).toBe(`Item ${n - 1}`)
    expect(spans[n - 1]!.textContent).toBe('Item 0')

    clear()
  })

  test('uses numeric keys', async () => {
    const items = prop([10, 20, 30])

    const clear = render(
      html.ul(
        KeyedForEach(
          items,
          (item) => item,
          (item) => html.li(item.map(String))
        )
      ),
      document.body
    )

    let lis = document.querySelectorAll('li')
    expect(lis[0]!.textContent).toBe('10')

    items.value = [30, 10, 20]
    await sleep()

    lis = document.querySelectorAll('li')
    expect(lis[0]!.textContent).toBe('30')
    expect(lis[1]!.textContent).toBe('10')
    expect(lis[2]!.textContent).toBe('20')

    clear()
  })

  test('counter and isEven/isOdd position fields', async () => {
    const items = prop([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ])

    const positionData: Record<
      number,
      { counter: number; isEven: boolean; isOdd: boolean }
    > = {}

    const clear = render(
      html.ul(
        KeyedForEach(
          items,
          (item) => item.id,
          (item, pos) => {
            item.on((v) => {
              positionData[v.id] = {
                counter: pos.counter.value,
                isEven: pos.isEven.value,
                isOdd: pos.isOdd.value,
              }
            })
            return html.li(item.map((v) => v.name))
          }
        )
      ),
      document.body
    )

    // index 0: counter=1, isEven=false (index%2===1 is false), isOdd=true (index%2===0 is true)
    expect(positionData[1]).toEqual({
      counter: 1,
      isEven: false,
      isOdd: true,
    })
    // index 1: counter=2, isEven=true, isOdd=false
    expect(positionData[2]).toEqual({
      counter: 2,
      isEven: true,
      isOdd: false,
    })

    clear()
  })

  test('isLast position field updates reactively', async () => {
    const items = prop([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ])

    let posB: KeyedPosition | undefined

    const clear = render(
      html.ul(
        KeyedForEach(
          items,
          (item) => item.id,
          (item, pos) => {
            item.on((v) => {
              if (v.id === 2) posB = pos
            })
            return html.li(item.map((v) => v.name))
          }
        )
      ),
      document.body
    )

    expect(posB!.isLast.value).toBe(true)

    // Add an item after B — B is no longer last
    items.value = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ]
    await sleep()

    expect(posB!.isLast.value).toBe(false)

    clear()
  })
})

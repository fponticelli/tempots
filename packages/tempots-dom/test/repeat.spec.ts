import { beforeEach, describe, expect, test } from "vitest";
import {
  computedOf,
  Fragment,
  prop,
  render,
  Repeat,
  computed,
  effect,
} from '../src'
import type { Prop, Computed } from '../src'
import { sleep } from "./helper";

describe("Repeat", () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })
  test("with signals", async () => {
    const s = prop(3)
    render(
      Repeat(s, item => String(item.counter)),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('123')
    s.set(2)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('12')
    s.set(0)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('')
    s.set(1)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('1')
  });
  test("with separator", async () => {
    const s = prop(3)
    render(
      Repeat(
        s,
        item => String(item.counter),
        sep => sep.isLast.map(isLast => `|${sep.index}:${sep.isFirst}:${isLast}|`)
      ),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('1|0:true:false|2|1:false:true|3')
    s.set(2)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('1|0:true:true|2')
    s.set(0)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('')
    s.set(1)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('1')
    s.set(3)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('1|0:true:false|2|1:false:true|3')
  });
  test("with literal", async () => {
    const clear = render(
      Repeat(
        3,
        item => String(item.counter)
      ),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('123')
    clear()
    expect(document.body.innerHTML).toStrictEqual('')
  });
  test("with nested repeat", async () => {
    const s = prop(0)
    render(
      Repeat(s, position => Fragment(Repeat(position.total.map(total => total), pos => pos.index.toString()), '!')),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('')

    s.set(1)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('0!')

    s.set(2)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('01!01!')

    s.set(3)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('012!012!012!')

    s.set(0)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('')

    s.set(2)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('01!01!')

    s.set(1)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('0!')
  });

  test("with prop counter inside item", async () => {
    const s = prop(3)
    const itemCounters = [prop(10), prop(20), prop(30)]

    render(
      Repeat(s, item => {
        // Use the item's counter (1-based) to access the corresponding prop counter
        const itemCounter = itemCounters[item.index]
        return Fragment(
          computedOf(item.counter, itemCounter)((counter, itemCounter) =>
            `[${counter}:${itemCounter}]`
          ),
        )
      }),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('[1:10][2:20][3:30]')

    // Update one of the item counters
    itemCounters[1].set(25)
    await sleep()

    expect(document.body.innerHTML).toStrictEqual('[1:10][2:25][3:30]')

    // Reduce the repeat count
    s.set(2)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('[1:10][2:25]')

    // Increase the repeat count back
    s.set(3)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('[1:10][2:25][3:30]')

    // Update multiple item counters
    itemCounters[0].set(15)
    itemCounters[2].set(35)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('[1:15][2:25][3:35]')
  });

  test("with prop reused inside item", async () => {
    const s = prop(0)

    render(
      Repeat(s, item => {
        // Use the item's counter (1-based) to access the corresponding prop counter
        const itemCounter = computedOf(s, item.index)((v, i) => v * i * 10)
        return Fragment(
          computedOf(item.counter, itemCounter)((counter, itemCounter) =>
            `[${counter}:${itemCounter}]`
          ),
        )
      }),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('')
    s.set(1)
    await sleep()

    expect(document.body.innerHTML).toStrictEqual('[1:0]')

    s.set(2)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('[1:0][2:20]')

    // Increase the repeat count back
    s.set(3)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('[1:0][2:30][3:60]')

    s.set(1)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('[1:0]')
  });

  test("based on array", async () => {
    const list = prop([] as number[])
    const length = list.map(v => v.length)

    render(
      Repeat(
        length,
        item => {
          return Fragment(
            computedOf(
              item.counter,
              length
            )((counter, len) => `[${counter}:${len}]`)
          )
        },
        pos => pos.isLast.map(v => (v ? '!' : '-'))
      ),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('')
    list.set([1, 2])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('[1:2]![2:2]')
    list.set([1])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('[1:1]')
    list.set([1, 2, 3, 4])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('[1:4]-[2:4]-[3:4]![4:4]')
  })
});

describe('Repeat - Automatic Signal Disposal', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('should dispose signals when items are removed', async () => {
    const count = prop(3)
    const signals: Prop<number>[] = []

    const clear = render(
      Repeat(count, pos => {
        const signal = prop(pos.index * 10)
        signals.push(signal)
        return String(signal.value)
      }),
      document.body
    )

    expect(signals.length).toBe(3)
    expect(signals[0].isDisposed()).toBe(false)
    expect(signals[1].isDisposed()).toBe(false)
    expect(signals[2].isDisposed()).toBe(false)

    // Reduce count - should dispose the last signal
    count.set(2)
    await sleep()

    expect(signals[0].isDisposed()).toBe(false)
    expect(signals[1].isDisposed()).toBe(false)
    expect(signals[2].isDisposed()).toBe(true)

    // Reduce to 0 - should dispose all remaining signals
    count.set(0)
    await sleep()

    expect(signals[0].isDisposed()).toBe(true)
    expect(signals[1].isDisposed()).toBe(true)

    clear()
  })

  test('should dispose computed signals in items', async () => {
    const count = prop(2)
    const sources: Prop<number>[] = []
    const deriveds: Computed<number>[] = []

    const clear = render(
      Repeat(count, pos => {
        const source = prop(pos.index)
        const derived = computed(() => source.value * 2, [source])
        sources.push(source)
        deriveds.push(derived)
        return String(derived.value)
      }),
      document.body
    )

    expect(sources.length).toBe(2)
    expect(deriveds.length).toBe(2)
    expect(sources[0].isDisposed()).toBe(false)
    expect(deriveds[0].isDisposed()).toBe(false)

    // Reduce count
    count.set(1)
    await sleep()

    expect(sources[0].isDisposed()).toBe(false)
    expect(deriveds[0].isDisposed()).toBe(false)
    expect(sources[1].isDisposed()).toBe(true)
    expect(deriveds[1].isDisposed()).toBe(true)

    clear()
  })

  test('should dispose effects in items', async () => {
    const count = prop(2)
    const source = prop(0)
    const callCounts: number[] = []

    const clear = render(
      Repeat(count, pos => {
        const index = pos.index
        callCounts[index] = 0
        effect(() => {
          callCounts[index]++
          source.value
        }, [source])
        return String(index)
      }),
      document.body
    )

    await sleep()
    expect(callCounts[0]).toBe(1)
    expect(callCounts[1]).toBe(1)

    source.set(1)
    await sleep()
    expect(callCounts[0]).toBe(2)
    expect(callCounts[1]).toBe(2)

    // Reduce count - effect for item 1 should be disposed
    count.set(1)
    await sleep()

    source.set(2)
    await sleep()
    expect(callCounts[0]).toBe(3)
    expect(callCounts[1]).toBe(2) // Should not increment

    clear()
    source.dispose()
  })

  test('should create new scopes when items are added', async () => {
    const count = prop(1)
    const signals: Prop<number>[] = []

    const clear = render(
      Repeat(count, pos => {
        const signal = prop(pos.index * 10)
        signals.push(signal)
        return String(signal.value)
      }),
      document.body
    )

    expect(signals.length).toBe(1)
    expect(signals[0].isDisposed()).toBe(false)

    // Increase count - should create new items with new scopes
    count.set(3)
    await sleep()

    expect(signals.length).toBe(3)
    expect(signals[0].isDisposed()).toBe(false)
    expect(signals[1].isDisposed()).toBe(false)
    expect(signals[2].isDisposed()).toBe(false)

    // Reduce back to 1 - should dispose the new items
    count.set(1)
    await sleep()

    expect(signals[0].isDisposed()).toBe(false)
    expect(signals[1].isDisposed()).toBe(true)
    expect(signals[2].isDisposed()).toBe(true)

    clear()
  })

  test('should dispose all items when component unmounts', async () => {
    const count = prop(3)
    const signals: Prop<number>[] = []

    const clear = render(
      Repeat(count, pos => {
        const signal = prop(pos.index * 10)
        signals.push(signal)
        return String(signal.value)
      }),
      document.body
    )

    expect(signals.length).toBe(3)
    expect(signals.every(s => !s.isDisposed())).toBe(true)

    // Clear the component
    clear()

    // All signals should be disposed
    expect(signals.every(s => s.isDisposed())).toBe(true)
  })
})


import { beforeEach, describe, expect, test } from "vitest";
import { computedOf, Fragment, prop, render, Repeat } from "../src";
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
      Repeat(length, item => {
        return Fragment(
          computedOf(item.counter, length)((counter, len) =>
            `[${counter}:${len}]`
          ),
        )
      }, pos => pos.isLast.map((v): string => v ? '!' : '-') ),
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


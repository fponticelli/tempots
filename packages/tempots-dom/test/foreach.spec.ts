import { beforeEach, describe, expect, test } from "vitest";
import { ForEach, prop, render } from "../src";
import { sleep } from "./helper";

describe("ForEach", () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })
  test("with signals", async () => {
    const s = prop(['a', 'b', 'c'])
    render(
      ForEach(s, item => item),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('abc<!---->')
    s.set(['d', 'e', 'f'])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('def<!---->')
    s.set([])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('<!---->')
    s.set(['a'])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('a<!---->')
  });
  test("with separator", async () => {
    const s = prop(['A', 'B', 'C'])
    render(
      ForEach(
        s,
        (item) => item,
        sep => sep.isLast.map(isLast => `${sep.index}:${sep.isFirst}:${isLast}`)
      ),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('A0:true:false<!---->B1:false:true<!---->C<!----><!---->')
    s.set(['A', 'B'])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('A0:true:true<!---->B<!----><!---->')
    s.set(['A'])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('A<!----><!---->')
    s.set([])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('<!---->')
    s.set(['A', 'B', 'C', 'D'])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('A0:true:false<!---->B1:false:false<!---->C2:false:true<!---->D<!----><!---->')
  });
  test("with literal", async () => {
    const clear = render(
      ForEach(
        ['a', 'b', 'c'],
        (item) => item
      ),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('abc')
    clear()
    expect(document.body.innerHTML).toStrictEqual('')
  });
  test("nested foreach", async () => {
    const s = prop([['a', 'b'], ['c', 'd']])
    render(
      ForEach(s, items => ForEach(items, item => item)),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('ab<!---->cd<!----><!---->')

    s.set([['a', 'b'], ['c', 'd', 'e']])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('ab<!---->cde<!----><!---->')

    s.set([['a', 'b'], ['c', 'd', 'e'], ['f', 'g', 'h']])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('ab<!---->cde<!---->fgh<!----><!---->')

    s.set([['a', 'b'], ['c', 'd', 'e'], ['f', 'g']])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('ab<!---->cde<!---->fg<!----><!---->')

    s.set([['a'], ['f']])
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('a<!---->f<!----><!---->')
  });
});


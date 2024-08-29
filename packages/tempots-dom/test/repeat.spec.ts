import { beforeEach, describe, expect, test } from "vitest";
import { makeProp, render, Repeat } from "../src";
import { sleep } from "./helper";

describe("Repeat", () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })
  test("with signals", async () => {
    const s = makeProp(3)
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
    const s = makeProp(3)
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
});
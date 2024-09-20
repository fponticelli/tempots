import { describe, expect, test } from "vitest";
import { makeProp, runHeadless, Repeat } from "../src";
import { sleep } from "./helper";

describe("Repeat Headless", () => {
  test("with signals", async () => {
    const s = makeProp(3)
    const { root } = runHeadless(
      () => Repeat(s, item => String(item.counter))
    )
    expect(root.contentToHTML()).toStrictEqual('123')
    s.set(2)
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('12')
    s.set(0)
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('')
    s.set(1)
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('1')
  });
  test("with separator", async () => {
    const s = makeProp(3)
    const { root } = runHeadless(
      () => Repeat(
        s,
        item => String(item.counter),
        sep => sep.isLast.map(isLast => `|${sep.index}:${sep.isFirst}:${isLast}|`)
      )
    )
    expect(root.contentToHTML()).toStrictEqual('1|0:true:false|2|1:false:true|3')
    s.set(2)
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('1|0:true:true|2')
    s.set(0)
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('')
    s.set(1)
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('1')
    s.set(3)
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('1|0:true:false|2|1:false:true|3')
  });
  test("with literal", async () => {
    const { clear, root } = runHeadless(
      () => Repeat(
        3,
        item => String(item.counter)
      )
    )
    expect(root.contentToHTML()).toStrictEqual('123')
    clear()
    expect(root.contentToHTML()).toStrictEqual('')
  });
});
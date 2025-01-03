import { describe, expect, test } from "vitest";
import { ForEach, makeProp, runHeadless } from "../src";
import { sleep } from "./helper";

describe("ForEach Headless", () => {
  test("with signals", async () => {
    const s = makeProp(['a', 'b', 'c'])
    const { root } = runHeadless(
      () => ForEach(s, item => item)
    )
    expect(root.contentToHTML()).toStrictEqual('abc')
    s.set(['d', 'e', 'f'])
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('def')
    s.set([])
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('')
    s.set(['a'])
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('a')
  });
  test("with separator", async () => {
    const s = makeProp(['A', 'B', 'C'])
    const { root } = runHeadless(
      () => ForEach(
        s,
        (item) => item,
        sep => sep.isLast.map(isLast => `${sep.index}:${sep.isFirst}:${isLast}`)
      )
    )
    expect(root.contentToHTML()).toStrictEqual('A0:true:falseB1:false:trueC')
    s.set(['A', 'B'])
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('A0:true:trueB')
    s.set(['A'])
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('A')
    s.set([])
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('')
    s.set(['A', 'B', 'C', 'D'])
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('A0:true:falseB1:false:falseC2:false:trueD')
  });
  test("with literal", async () => {
    const { root, clear } = runHeadless(
      () => ForEach(
        ['a', 'b', 'c'],
        (item) => item
      )
    )
    expect(root.contentToHTML()).toStrictEqual('abc')
    clear()
    expect(root.contentToHTML()).toStrictEqual('')
  });
});
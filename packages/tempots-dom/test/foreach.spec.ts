import { beforeEach, describe, expect, test } from "vitest";
import { ForEach, makeProp, render } from "../src";
import { sleep } from "./helper";

describe("ForEach", () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })
  test("with signals", async () => {
    const s = makeProp(['a', 'b', 'c'])
    render(
      ForEach(
        s,
        (item) => item
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('abc')
    s.set(['d', 'e', 'f'])
    await sleep()
    expect(document.body.innerHTML).toBe('def')
    s.set([])
    await sleep()
    expect(document.body.innerHTML).toBe('')
    s.set(['a'])
    await sleep()
    expect(document.body.innerHTML).toBe('a')
  });
  test("with separator", async () => {
    const s = makeProp(['A', 'B', 'C'])
    render(
      ForEach(
        s,
        (item) => item,
        sep => sep.map(s => `${s.index}:${s.isFirst}:${s.isLast}`)
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('A0:true:falseB1:false:trueC')
    s.set(['A', 'B'])
    await sleep()
    expect(document.body.innerHTML).toBe('A0:true:trueB')
    s.set(['A'])
    await sleep()
    expect(document.body.innerHTML).toBe('A')
    s.set([])
    await sleep()
    expect(document.body.innerHTML).toBe('')
    s.set(['A', 'B', 'C', 'D'])
    await sleep()
    expect(document.body.innerHTML).toBe('A0:true:falseB1:false:falseC2:false:trueD')
  });
  test("with literal", async () => {
    const clear = render(
      ForEach(
        ['a', 'b', 'c'],
        (item) => item
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('abc')
    clear()
    expect(document.body.innerHTML).toBe('')
  });
});
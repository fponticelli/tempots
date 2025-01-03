import { describe, expect, test } from "vitest";
import { Ensure, makeProp, runHeadless, TextNode } from "../src";
import { sleep } from "./helper";

describe("Ensure Headless", () => {
  test("using signal", async () => {
    const s = makeProp<string | null>(null)
    const { root } = runHeadless(
      () => Ensure(s, 
        v => v,
        () => 'x'
      )
    )
    expect(root.contentToHTML()).toStrictEqual('x')
    s.set('y')
    await sleep()
    expect(root.contentToHTML()).toStrictEqual('y')
  });
  test("using string literal", () => {
    const { root } = runHeadless(
      () => Ensure(
        'A' as string, 
        v => TextNode(v),
        () => 'x'
      )
    )
    expect(root.contentToHTML()).toStrictEqual('A')
  });
  test("using null literal", () => {
    const { root } = runHeadless(
      () => Ensure(
        null as string | null, 
        v => TextNode(v),
        () => 'x'
      )
    )
    expect(root.contentToHTML()).toStrictEqual('x')
  });
});
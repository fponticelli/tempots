import { beforeEach, describe, expect, test } from "vitest";
import { Ensure, makeProp, render, Signal, TextNode } from "../src";
import { sleep } from "./helper";

describe("Ensure", () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })
  test("using signal", async () => {
    const s = makeProp<string | null>(null)
    render(
      Ensure(s, 
        v => v,
        () => 'x'
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('x')
    s.set('y')
    await sleep()
    expect(document.body.innerHTML).toBe('y')
  });
  test("using string literal", () => {
    render(
      Ensure(
        'A' as string, 
        v => TextNode(v),
        () => 'x'
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('A')
  });
  test("using null literal", () => {
    render(
      Ensure(
        null as string | null, 
        v => TextNode(v),
        () => 'x'
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('x')
  });
});
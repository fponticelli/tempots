import { beforeEach, describe, expect, test } from "vitest";
import { Ensure, prop, render, TextNode } from "../src";
import { sleep } from "./helper";

describe("Ensure", () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })
  test("using signal", async () => {
    const s = prop<string | null>(null)
    render(
      Ensure(s,
        v => v,
        () => 'x'
      ),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('x')
    s.set('y')
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('y')
    s.set(null)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('x')
    s.set('z')
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('z')
  });
  test("using signal (start from not null)", async () => {
    const s = prop<string | null>('y')
    render(
      Ensure(s,
        v => v,
        () => 'x'
      ),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('y')
    s.set('z')
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('z')
    s.set(null)
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('x')
    s.set('z')
    await sleep()
    expect(document.body.innerHTML).toStrictEqual('z')
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
    expect(document.body.innerHTML).toStrictEqual('A')
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
    expect(document.body.innerHTML).toStrictEqual('x')
  });

  test("should handle null result from then function (lines 103-104)", () => {
    const s = prop<string | null>('test')
    render(
      Ensure(s,
        () => null, // then function returns null
        () => 'fallback'
      ),
      document.body
    )
    // When then function returns null, should render Empty (lines 103-104)
    expect(document.body.innerHTML).toStrictEqual('')
  });

  test("should handle undefined result from then function", () => {
    const s = prop<string | null>('test')
    render(
      Ensure(s,
        () => undefined, // then function returns undefined
        () => 'fallback'
      ),
      document.body
    )
    // When then function returns undefined, should render Empty
    expect(document.body.innerHTML).toStrictEqual('')
  });
});

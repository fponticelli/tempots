import { beforeEach, describe, expect, test } from "vitest";
import { EnsureAll, Fragment, prop, render, TextNode } from "../src";

describe("EnsureAll", () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })
  test("using null signals", async () => {
    const a = prop<string | null>(null)
    const b = prop<number | null>(null)
    const c = prop<boolean | null>(null)
    render(
      EnsureAll(a, b, c)((a, b, c) => Fragment(
        a,
        b.map(String),
        c.map(String)
      ), () => 'x'),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('x<!---->')
    a.set('a')
    expect(document.body.innerHTML).toStrictEqual('x<!---->')
    b.set(2)
    expect(document.body.innerHTML).toStrictEqual('x<!---->')
    c.set(true)
    expect(document.body.innerHTML).toStrictEqual('a2true<!---->')
    a.set(null)
    expect(document.body.innerHTML).toStrictEqual('x<!---->')
    a.set('b')
    expect(document.body.innerHTML).toStrictEqual('b2true<!---->')
    a.set('c')
    expect(document.body.innerHTML).toStrictEqual('c2true<!---->')
  });
  test("using non-null signals", async () => {
    const a = prop<string | null>('a')
    const b = prop<number | null>(2)
    const c = prop<boolean | null>(true)
    render(
      EnsureAll(a, b, c)((a, b, c) => Fragment(
        a,
        b.map(String),
        c.map(String)
      ), () => 'x'),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('a2true<!---->')
    a.set('a')
    expect(document.body.innerHTML).toStrictEqual('a2true<!---->')
    b.set(2)
    expect(document.body.innerHTML).toStrictEqual('a2true<!---->')
    c.set(true)
    expect(document.body.innerHTML).toStrictEqual('a2true<!---->')
    a.set(null)
    expect(document.body.innerHTML).toStrictEqual('x<!---->')
  });
  test("using string literal", () => {
    render(
      EnsureAll('A' as string)(
        v => TextNode(v),
        () => 'x'
      ),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('A<!---->')
  });
  test("using null literal", () => {
    render(
      EnsureAll(null as string | null)(
        v => TextNode(v),
        () => 'x'
      ),
      document.body
    )
    expect(document.body.innerHTML).toStrictEqual('x<!---->')
  });

  test("should properly dispose resources (lines 237-242)", () => {
    const a = prop<string | null>('a')
    const b = prop<number | null>(2)
    const c = prop<boolean | null>(true)

    const clear = render(
      EnsureAll(a, b, c)((a, b, c) => Fragment(
        a,
        b.map(String),
        c.map(String)
      ), () => 'x'),
      document.body
    )

    expect(document.body.innerHTML).toStrictEqual('a2true<!---->')

    // Test disposal with removeTree = true to cover lines 237-242
    clear(true)
    expect(document.body.innerHTML).toStrictEqual('')

    // Verify signals are no longer being observed
    a.set('changed')
    b.set(999)
    c.set(false)
    expect(document.body.innerHTML).toStrictEqual('')
  });
});

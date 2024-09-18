import { describe, expect, test, vi } from "vitest";
import { makeProp, render, html, OnElement, OneOfType } from "../src";
import { sleep } from "./helper";
const { div } = html

export interface A {
  type: 'A'
  text: string
}

export interface B {
  type: 'B'
  num: number
}

export type Letter = A | B

describe("oneof", () => {
  test("type", async () => {
    const p = makeProp<Letter>({ type: "A", text: "a" });
    const spyMountA = vi.fn()
    const spyMountB = vi.fn()
    render(
      OneOfType(
        p,
        {
          'A': (s) => div(
            OnElement(spyMountA),
            s.at('text')
          ),
          'B': (s) => div(
            OnElement(spyMountB),
            'num:', s.at('num').map(String)
          )
        }
      ),
      document.body
    );
    expect(spyMountA).toBeCalledTimes(1)
    expect(spyMountB).toBeCalledTimes(0)
    expect(document.body.innerHTML).toStrictEqual('<div>a</div>');
    p.set({ type: "A", text: "b" })
    await sleep()
    expect(spyMountA).toBeCalledTimes(1)
    expect(spyMountB).toBeCalledTimes(0)
    p.set({ type: "B", num: 1 })
    await sleep()
    expect(spyMountA).toBeCalledTimes(1)
    expect(spyMountB).toBeCalledTimes(1)
    expect(document.body.innerHTML).toStrictEqual('<div>num:1</div>');
    p.set({ type: "B", num: 2 })
    await sleep()
    expect(spyMountA).toBeCalledTimes(1)
    expect(spyMountB).toBeCalledTimes(1)
    expect(document.body.innerHTML).toStrictEqual('<div>num:2</div>');
    p.set({ type: "A", text: "c" })
    await sleep()
    expect(spyMountA).toBeCalledTimes(2)
    expect(spyMountB).toBeCalledTimes(1)
    expect(document.body.innerHTML).toStrictEqual('<div>c</div>');
  });
});

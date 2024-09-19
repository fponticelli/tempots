import { describe, expect, test, vi } from "vitest";
import { makeProp, runHeadless, html, OneOfType, OnCtx } from "../src";
import { sleep } from "./helper";
import { Letter } from "./oneof.spec";
const { div } = html

describe("OneOf Headless", () => {
  test("type", async () => {
    const p = makeProp<Letter>({ type: "A", text: "a" });
    const spyMountA = vi.fn()
    const spyMountB = vi.fn()
    const { root } = runHeadless(
      OneOfType(
        p,
        {
          'A': (s) => div(
            OnCtx(spyMountA),
            s.at('text')
          ),
          'B': (s) => div(
            OnCtx(spyMountB),
            'num:', s.at('num').map(String)
          )
        }
      ),
      'https://tempots.com'
    );
    expect(spyMountA).toBeCalledTimes(1)
    expect(spyMountB).toBeCalledTimes(0)
    expect(root.contentToHTML()).toStrictEqual('<div>a</div>');
    p.set({ type: "A", text: "b" })
    await sleep()
    expect(spyMountA).toBeCalledTimes(1)
    expect(spyMountB).toBeCalledTimes(0)
    p.set({ type: "B", num: 1 })
    await sleep()
    expect(spyMountA).toBeCalledTimes(1)
    expect(spyMountB).toBeCalledTimes(1)
    expect(root.contentToHTML()).toStrictEqual('<div>num:1</div>');
    p.set({ type: "B", num: 2 })
    await sleep()
    expect(spyMountA).toBeCalledTimes(1)
    expect(spyMountB).toBeCalledTimes(1)
    expect(root.contentToHTML()).toStrictEqual('<div>num:2</div>');
    p.set({ type: "A", text: "c" })
    await sleep()
    expect(spyMountA).toBeCalledTimes(2)
    expect(spyMountB).toBeCalledTimes(1)
    expect(root.contentToHTML()).toStrictEqual('<div>c</div>');
  });
});

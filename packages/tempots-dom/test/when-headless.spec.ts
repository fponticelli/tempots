import { describe, expect, test, vi } from "vitest";
import { makeProp, OnCtx, runHeadless, When } from "../src";
import { sleep } from "./helper";

describe("When Headless", () => {
  test("with signal", async () => {
    const bool = makeProp(false)
    const spyTrue = vi.fn()
    const spyFalse = vi.fn()
    runHeadless(
      () => When(
        bool,
        OnCtx(spyTrue),
        OnCtx(spyFalse)
      )
    )
    expect(spyTrue).toHaveBeenCalledTimes(0)
    expect(spyFalse).toHaveBeenCalledTimes(1)
    bool.set(true)
    await sleep()
    expect(spyTrue).toHaveBeenCalledTimes(1)
    expect(spyFalse).toHaveBeenCalledTimes(1)
  });
  test("with literal", async () => {
    const spyTrue = vi.fn()
    const spyFalse = vi.fn()
    runHeadless(
      () => When(
        true,
        OnCtx(spyTrue),
        OnCtx(spyFalse)
      )
    )
    expect(spyTrue).toHaveBeenCalledTimes(1)
    expect(spyFalse).toHaveBeenCalledTimes(0)
    
    runHeadless(
      () => When(
        false,
        OnCtx(spyTrue),
        OnCtx(spyFalse)
      )
    )
    expect(spyTrue).toHaveBeenCalledTimes(1)
    expect(spyFalse).toHaveBeenCalledTimes(1)
  });
});
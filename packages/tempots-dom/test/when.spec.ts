import { describe, expect, test, vi } from "vitest";
import { makeProp, OnElement, render, When } from "../src";
import { sleep } from "./helper";

describe("When", () => {
  test("with signal", async () => {
    const bool = makeProp(false)
    const spyTrue = vi.fn()
    const spyFalse = vi.fn()
    render(
      When(
        bool,
        OnElement(spyTrue),
        OnElement(spyFalse)
      ),
      document.body
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
    render(
      When(
        true,
        OnElement(spyTrue),
        OnElement(spyFalse)
      ),
      document.body
    )
    expect(spyTrue).toHaveBeenCalledTimes(1)
    expect(spyFalse).toHaveBeenCalledTimes(0)
    
    render(
      When(
        false,
        OnElement(spyTrue),
        OnElement(spyFalse)
      ),
      document.body
    )
    expect(spyTrue).toHaveBeenCalledTimes(1)
    expect(spyFalse).toHaveBeenCalledTimes(1)
  });
});
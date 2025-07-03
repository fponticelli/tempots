import { describe, expect, test, vi } from "vitest";
import { prop, WithElement, render, When, Unless } from "../src";
import { sleep } from "./helper";

describe("When", () => {
  test("with signal", async () => {
    const bool = prop(false)
    const spyTrue = vi.fn()
    const spyFalse = vi.fn()
    render(
      When(
        bool,
        () => WithElement(spyTrue),
        () => WithElement(spyFalse)
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
        () => WithElement(spyTrue),
        () => WithElement(spyFalse)
      ),
      document.body
    )
    expect(spyTrue).toHaveBeenCalledTimes(1)
    expect(spyFalse).toHaveBeenCalledTimes(0)

    render(
      When(
        false,
        () => WithElement(spyTrue),
        () => WithElement(spyFalse)
      ),
      document.body
    )
    expect(spyTrue).toHaveBeenCalledTimes(1)
    expect(spyFalse).toHaveBeenCalledTimes(1)
  });
});

describe("Unless", () => {
  test("with signal", async () => {
    const bool = prop(true)
    const spyTrue = vi.fn()
    const spyFalse = vi.fn()
    render(
      Unless(
        bool,
        () => WithElement(spyTrue),
        () => WithElement(spyFalse)
      ),
      document.body
    )
    expect(spyTrue).toHaveBeenCalledTimes(0)
    expect(spyFalse).toHaveBeenCalledTimes(1)
    bool.set(false)
    await sleep()
    expect(spyTrue).toHaveBeenCalledTimes(1)
    expect(spyFalse).toHaveBeenCalledTimes(1)
  });

  test("with literal", async () => {
    const spyTrue = vi.fn()
    const spyFalse = vi.fn()
    render(
      Unless(
        false,
        () => WithElement(spyTrue),
        () => WithElement(spyFalse)
      ),
      document.body
    )
    expect(spyTrue).toHaveBeenCalledTimes(1)
    expect(spyFalse).toHaveBeenCalledTimes(0)

    render(
      Unless(
        true,
        () => WithElement(spyTrue),
        () => WithElement(spyFalse)
      ),
      document.body
    )
    expect(spyTrue).toHaveBeenCalledTimes(1)
    expect(spyFalse).toHaveBeenCalledTimes(1)
  });

  test("without otherwise clause", async () => {
    const spyTrue = vi.fn()
    render(
      Unless(
        false,
        () => WithElement(spyTrue)
      ),
      document.body
    )
    expect(spyTrue).toHaveBeenCalledTimes(1)
  });
});

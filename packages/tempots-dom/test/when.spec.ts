import { describe, expect, test, vi, beforeEach } from "vitest";
import { prop, WithElement, render, When, Unless, html } from "../src";
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
    bool.set(false)
    await sleep()
    expect(spyTrue).toHaveBeenCalledTimes(1)
    expect(spyFalse).toHaveBeenCalledTimes(2)
  });
  test("with signal starting true", async () => {
    const bool = prop(true)
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
    expect(spyTrue).toHaveBeenCalledTimes(1)
    expect(spyFalse).toHaveBeenCalledTimes(0)
    bool.set(false)
    await sleep()
    expect(spyTrue).toHaveBeenCalledTimes(1)
    expect(spyFalse).toHaveBeenCalledTimes(1)
    bool.set(true)
    await sleep()
    expect(spyTrue).toHaveBeenCalledTimes(2)
    expect(spyFalse).toHaveBeenCalledTimes(1)
  });
  test("without otherwise clause", async () => {
    const bool = prop(false)
    const spyTrue = vi.fn()
    render(
      When(
        bool,
        () => WithElement(spyTrue)
      ),
      document.body
    )
    expect(spyTrue).toHaveBeenCalledTimes(0)
    bool.set(true)
    await sleep()
    expect(spyTrue).toHaveBeenCalledTimes(1)
    bool.set(false)
    await sleep()
    expect(spyTrue).toHaveBeenCalledTimes(1)
  });
  test("without otherwise clause starting true", async () => {
    const bool = prop(true)
    const spyTrue = vi.fn()
    render(
      When(
        bool,
        () => WithElement(spyTrue)
      ),
      document.body
    )
    expect(spyTrue).toHaveBeenCalledTimes(1)
    bool.set(false)
    await sleep()
    expect(spyTrue).toHaveBeenCalledTimes(1)
    bool.set(true)
    await sleep()
    expect(spyTrue).toHaveBeenCalledTimes(2)
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
  test("with literal and without otherwise clause", async () => {
    const spyTrue = vi.fn()
    render(
      When(
        true,
        () => WithElement(spyTrue)
      ),
      document.body
    )
    expect(spyTrue).toHaveBeenCalledTimes(1)
  });

  // DOM content tests
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test("with signal - DOM content", async () => {
    const bool = prop(false)
    render(
      When(
        bool,
        () => html.div("True content"),
        () => html.span("False content")
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('<span>False content</span>')

    bool.set(true)
    await sleep()
    expect(document.body.innerHTML).toBe('<div>True content</div>')

    bool.set(false)
    await sleep()
    expect(document.body.innerHTML).toBe('<span>False content</span>')
  });

  test("with signal starting true - DOM content", async () => {
    const bool = prop(true)
    render(
      When(
        bool,
        () => html.div("True content"),
        () => html.span("False content")
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('<div>True content</div>')

    bool.set(false)
    await sleep()
    expect(document.body.innerHTML).toBe('<span>False content</span>')

    bool.set(true)
    await sleep()
    expect(document.body.innerHTML).toBe('<div>True content</div>')
  });

  test("without otherwise clause - DOM content", async () => {
    const bool = prop(false)
    render(
      When(
        bool,
        () => html.div("True content")
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('')

    bool.set(true)
    await sleep()
    expect(document.body.innerHTML).toBe('<div>True content</div>')

    bool.set(false)
    await sleep()
    expect(document.body.innerHTML).toBe('')
  });

  test("without otherwise clause starting true - DOM content", async () => {
    const bool = prop(true)
    render(
      When(
        bool,
        () => html.div("True content")
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('<div>True content</div>')

    bool.set(false)
    await sleep()
    expect(document.body.innerHTML).toBe('')

    bool.set(true)
    await sleep()
    expect(document.body.innerHTML).toBe('<div>True content</div>')
  });

  test("with literal - DOM content", async () => {
    document.body.innerHTML = ''
    render(
      When(
        true,
        () => html.div("True content"),
        () => html.span("False content")
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('<div>True content</div>')

    document.body.innerHTML = ''
    render(
      When(
        false,
        () => html.div("True content"),
        () => html.span("False content")
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('<span>False content</span>')
  });

  test("with literal and without otherwise clause - DOM content", async () => {
    document.body.innerHTML = ''
    render(
      When(
        true,
        () => html.div("True content")
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('<div>True content</div>')

    document.body.innerHTML = ''
    render(
      When(
        false,
        () => html.div("True content")
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('')
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

  // DOM content tests for Unless
  test("with signal - DOM content", async () => {
    const bool = prop(true)
    render(
      Unless(
        bool,
        () => html.div("True content"),
        () => html.span("False content")
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('<span>False content</span>')

    bool.set(false)
    await sleep()
    expect(document.body.innerHTML).toBe('<div>True content</div>')

    bool.set(true)
    await sleep()
    expect(document.body.innerHTML).toBe('<span>False content</span>')
  });

  test("with literal - DOM content", async () => {
    document.body.innerHTML = ''
    render(
      Unless(
        false,
        () => html.div("True content"),
        () => html.span("False content")
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('<div>True content</div>')

    document.body.innerHTML = ''
    render(
      Unless(
        true,
        () => html.div("True content"),
        () => html.span("False content")
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('<span>False content</span>')
  });

  test("without otherwise clause - DOM content", async () => {
    document.body.innerHTML = ''
    render(
      Unless(
        false,
        () => html.div("True content")
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('<div>True content</div>')

    document.body.innerHTML = ''
    render(
      Unless(
        true,
        () => html.div("True content")
      ),
      document.body
    )
    expect(document.body.innerHTML).toBe('')
  });
});

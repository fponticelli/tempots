import { describe, expect, test, vi, beforeEach } from "vitest";
import {
  prop,
  WithElement,
  render,
  When,
  Unless,
  html,
  computed,
  effect,
} from '../src'
import type { Prop, Computed } from '../src'
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

describe('When/Unless - Automatic Signal Disposal', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('should dispose signals when switching from then to else branch', async () => {
    const condition = prop(true)
    let thenSignal: Prop<number> | null = null
    let elseSignal: Prop<number> | null = null

    const clear = render(
      When(
        condition,
        () => {
          thenSignal = prop(10)
          return html.div('Then')
        },
        () => {
          elseSignal = prop(20)
          return html.div('Else')
        }
      ),
      document.body
    )

    // Initially in then branch
    expect(thenSignal).not.toBeNull()
    expect(elseSignal).toBeNull()
    expect(thenSignal!.isDisposed()).toBe(false)

    // Switch to else branch
    condition.set(false)
    await sleep()

    // Then signal should be disposed, else signal should be created
    expect(thenSignal!.isDisposed()).toBe(true)
    expect(elseSignal).not.toBeNull()
    expect(elseSignal!.isDisposed()).toBe(false)

    // Clean up
    clear()
    expect(elseSignal!.isDisposed()).toBe(true)
  })

  test('should dispose signals when switching from else to then branch', async () => {
    const condition = prop(false)
    let thenSignal: Prop<number> | null = null
    let elseSignal: Prop<number> | null = null

    const clear = render(
      When(
        condition,
        () => {
          thenSignal = prop(10)
          return html.div('Then')
        },
        () => {
          elseSignal = prop(20)
          return html.div('Else')
        }
      ),
      document.body
    )

    // Initially in else branch
    expect(elseSignal).not.toBeNull()
    expect(thenSignal).toBeNull()
    expect(elseSignal!.isDisposed()).toBe(false)

    // Switch to then branch
    condition.set(true)
    await sleep()

    // Else signal should be disposed, then signal should be created
    expect(elseSignal!.isDisposed()).toBe(true)
    expect(thenSignal).not.toBeNull()
    expect(thenSignal!.isDisposed()).toBe(false)

    // Clean up
    clear()
    expect(thenSignal!.isDisposed()).toBe(true)
  })

  test('should dispose computed signals in branches', async () => {
    const condition = prop(true)
    let thenSource: Prop<number> | null = null
    let thenDerived: Computed<number> | null = null

    const clear = render(
      When(
        condition,
        () => {
          thenSource = prop(10)
          thenDerived = computed(() => thenSource!.value * 2, [thenSource])
          return html.div('Then')
        },
        () => html.div('Else')
      ),
      document.body
    )

    expect(thenSource).not.toBeNull()
    expect(thenDerived).not.toBeNull()
    expect(thenSource!.isDisposed()).toBe(false)
    expect(thenDerived!.isDisposed()).toBe(false)

    // Switch to else branch
    condition.set(false)
    await sleep()

    // Both signals should be disposed
    expect(thenSource!.isDisposed()).toBe(true)
    expect(thenDerived!.isDisposed()).toBe(true)

    clear()
  })

  test('should dispose effects in branches', async () => {
    const condition = prop(true)
    const source = prop(0)
    let thenCallCount = 0
    let elseCallCount = 0

    const clear = render(
      When(
        condition,
        () => {
          effect(() => {
            thenCallCount++
            source.value
          }, [source])
          return html.div('Then')
        },
        () => {
          effect(() => {
            elseCallCount++
            source.value
          }, [source])
          return html.div('Else')
        }
      ),
      document.body
    )

    await sleep()
    expect(thenCallCount).toBe(1)
    expect(elseCallCount).toBe(0)

    source.set(1)
    await sleep()
    expect(thenCallCount).toBe(2)
    expect(elseCallCount).toBe(0)

    // Switch to else branch
    condition.set(false)
    await sleep()
    expect(thenCallCount).toBe(2) // Then effect should be disposed
    expect(elseCallCount).toBe(1) // Else effect should start

    source.set(2)
    await sleep()
    expect(thenCallCount).toBe(2) // Then effect still disposed
    expect(elseCallCount).toBe(2) // Else effect should trigger

    clear()
    source.dispose()
  })

  test('should handle nested When with separate scopes', async () => {
    const outerCondition = prop(true)
    const innerCondition = prop(true)
    let outerSignal: Prop<number> | null = null
    let innerSignal: Prop<number> | null = null

    const clear = render(
      When(outerCondition, () => {
        outerSignal = prop(10)
        return When(innerCondition, () => {
          innerSignal = prop(20)
          return html.div('Inner')
        })
      }),
      document.body
    )

    expect(outerSignal).not.toBeNull()
    expect(innerSignal).not.toBeNull()
    expect(outerSignal!.isDisposed()).toBe(false)
    expect(innerSignal!.isDisposed()).toBe(false)

    // Toggle inner condition - should only dispose inner signal
    innerCondition.set(false)
    await sleep()
    expect(outerSignal!.isDisposed()).toBe(false)
    expect(innerSignal!.isDisposed()).toBe(true)

    // Toggle outer condition - should dispose outer signal
    outerCondition.set(false)
    await sleep()
    expect(outerSignal!.isDisposed()).toBe(true)

    clear()
  })
})

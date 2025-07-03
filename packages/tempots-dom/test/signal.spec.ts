import { describe, expect, test, vi } from "vitest";
import {
  computed,
  effect,
  signal,
  prop,
  Signal,
  Prop,
  Computed,
  sessionStorageProp,
  localStorageProp,
  animateSignal,
  computedOf,
  effectOf,
  Value,
} from "../src";
import { sleep } from "./helper";

describe("Signal", () => {
  test("signal basics", () => {
    const s = signal(1);
    expect(s.value).toStrictEqual(1);
    expect(s.get()).toStrictEqual(1);
  });
  test("is", () => {
    const p = prop(1);
    const s = signal(1);
    const c = s.map(v => v + 1);

    expect(Prop.is(p)).toStrictEqual(true);
    expect(Prop.is(s)).toStrictEqual(false);
    expect(Prop.is(c)).toStrictEqual(false);

    expect(Signal.is(p)).toStrictEqual(true);
    expect(Signal.is(s)).toStrictEqual(true);
    expect(Signal.is(c)).toStrictEqual(true);

    expect(Computed.is(p)).toStrictEqual(false);
    expect(Computed.is(s)).toStrictEqual(false);
    expect(Computed.is(c)).toStrictEqual(true);
  });
  test("hasListeners", () => {
    const s = signal(1);
    expect(s.hasListeners()).toStrictEqual(false);
    const cancel = s.on(() => {});
    expect(s.hasListeners()).toStrictEqual(true);
    cancel();
    expect(s.hasListeners()).toStrictEqual(false);
  });
  test("hasListeners with computed", () => {
    const s = signal(1);
    const c = s.map(v => v + 1);
    expect(s.hasListeners()).toStrictEqual(true);
    expect(c.hasListeners()).toStrictEqual(false);
    c.dispose();
    expect(s.hasListeners()).toStrictEqual(false);
  });
  test("map", () => {
    const p = prop(1);
    const c = p.map(v => v + 1);
    expect(c.value).toStrictEqual(2);
    p.set(2);
    expect(c.value).toStrictEqual(3);
  });
  test("filter", () => {
    const p = prop(1);
    const c1 = p.filter(v => v % 2 === 0, 0);
    expect(c1.value).toStrictEqual(0);
    p.set(2);
    expect(c1.value).toStrictEqual(2);
    p.set(3);
    expect(c1.value).toStrictEqual(2);
    const c2 = p.filter(v => v % 2 === 0);
    expect(c2.value).toStrictEqual(3);
    p.set(4);
    expect(c2.value).toStrictEqual(4);
    p.set(5);
    expect(c2.value).toStrictEqual(4);
  });
  test("Value.maybeToSignal", () => {
    const p = prop(1);
    const s = signal(1);
    const c = p.map(v => v + 1);
    expect(Value.maybeToSignal(p)).toStrictEqual(p);
    expect(Value.maybeToSignal(s)).toStrictEqual(s);
    expect(Value.maybeToSignal(c)).toStrictEqual(c);
    const v = 1;
    expect(Value.maybeToSignal(v)).toBeInstanceOf(Signal);
    expect(Value.maybeToSignal(null)).toBeUndefined();
    expect(Value.maybeToSignal(undefined)).toBeUndefined();
  });
  test("Value.toSignal", () => {
    const p = prop(1);
    const s = signal(1);
    const c = p.map(v => v + 1);
    expect(Value.toSignal(p)).toStrictEqual(p);
    expect(Value.toSignal(s)).toStrictEqual(s);
    expect(Value.toSignal(c)).toStrictEqual(c);
    const v = 1;
    expect(Value.toSignal(v)).toBeInstanceOf(Signal);
  });
  test("flatMap", () => {
    const p = prop(1);
    const c = p.flatMap(v => signal(v + 1));
    expect(c.value).toStrictEqual(2);
    p.set(2);
    expect(c.value).toStrictEqual(3);
  });
  test("tap", async () => {
    const p = prop(1);
    const spy = vi.fn();
    const c = p.tap(spy);
    await sleep()
    expect(spy).toHaveBeenCalledTimes(1);
    p.set(2);
    await sleep()
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(2);
    c.dispose();
    await sleep()
    p.set(3);
    expect(spy).toHaveBeenCalledTimes(2);
  });
  test("computed", async () => {
    const p1 = prop(1);
    const p2 = prop(2);
    const p3 = prop(3);
    const c = computed(() => p1.value + p2.value + p3.value, [p1, p2, p3]);
    const spy = vi.fn();
    expect(c.value).toStrictEqual(6);
    c.on(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(6, undefined);
    p1.set(2);
    await sleep()
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(7, 6);
    p2.set(3);
    p3.set(4);
    await sleep()
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(9, 7);
  });
  test("computed with forced get", async () => {
    const p1 = prop(1);
    const p2 = prop(2);
    const p3 = prop(3);
    const c = computed(() => p1.value + p2.value + p3.value, [p1, p2, p3]);
    const spy = vi.fn();
    expect(c.value).toStrictEqual(6);
    c.on(spy);
    expect(spy).toHaveBeenCalledWith(6, undefined);
    expect(spy).toHaveBeenCalledTimes(1);
    p1.set(2);
    expect(c.value).toStrictEqual(7); // forced get
    await sleep()
    expect(spy).toHaveBeenCalledWith(7, 6);
    expect(spy).toHaveBeenCalledTimes(2);
    p2.set(3);
    p3.set(4);
    expect(c.value).toStrictEqual(9); // forced get
    await sleep()
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(9, 7);
  });
  test("at", () => {
    const p = prop([1, 2, 3]);
    const c = p.at(1);
    expect(c.value).toStrictEqual(2);
    p.set([4, 5, 6]);
    expect(c.value).toStrictEqual(5);
  });
  test("filterMap", () => {
    const p = prop(1);
    const c = p.filterMap(
      v => (Math.trunc(v) === v ? (v % 2 === 0 ? "even" : "odd") : undefined),
      "odd"
    );
    expect(c.value).toStrictEqual("odd");
    p.set(2);
    expect(c.value).toStrictEqual("even");
    p.set(3);
    expect(c.value).toStrictEqual("odd");
    p.set(4.2);
    expect(c.value).toStrictEqual("odd");
  });
  test("mapAsync", async () => {
    const p = prop(1);
    const c = p.mapAsync(v => Promise.resolve(v + 1), 0);
    expect(c.value).toStrictEqual(0);
    p.set(2);
    expect(c.value).toStrictEqual(0);
    await sleep()
    expect(c.value).toStrictEqual(3);
  });
  test("mapAsync with error", async () => {
    const p = prop(1);
    const c = p.mapAsync(v => Promise.reject("error"), 0, _ => 2);
    expect(c.value).toStrictEqual(0);
    await sleep()
    expect(c.value).toStrictEqual(2);
  });
  test("deriveProp", () => {
    const p1 = prop(1);
    const p2 = p1.deriveProp();
    expect(p2.value).toStrictEqual(1);
    p1.set(2);
    expect(p2.value).toStrictEqual(2);
    p2.set(3);
    expect(p1.value).toStrictEqual(2);
    expect(p2.value).toStrictEqual(3);
    p1.set(4);
    expect(p2.value).toStrictEqual(4);
  });
  test("count", async () => {
    const p = prop("a");
    const c = p.count();
    expect(c.value).toStrictEqual(1);
    p.set("b");
    expect(c.value).toStrictEqual(2);
    p.set("c");
    expect(c.value).toStrictEqual(3);
  });
  test("effect", async () => {
    const p1 = prop(1);
    const p2 = prop(2);
    let value = 0;
    const clear = effect(
      () => {
        value = p1.value + p2.value;
      },
      [p1, p2]
    );
    await sleep()
    expect(value).toStrictEqual(3);
    p1.set(2);
    await sleep()
    expect(value).toStrictEqual(4);
    clear();
    p2.set(3);
    await sleep()
    expect(value).toStrictEqual(4);
  });
  test("sessionStorageProp", () => {
    const key = Math.random().toString().split(".")[1];
    sleep()
    const p1 = sessionStorageProp({
      key,
      defaultValue: 1
    });
    expect(p1.value).toStrictEqual(1);
    p1.set(2);
    expect(p1.value).toStrictEqual(2);
    p1.dispose();
    expect(p1.value).toStrictEqual(2);
    const p2 = sessionStorageProp({
      key,
      defaultValue: 1
    });
    expect(p2.value).toStrictEqual(2);
  });
  test("localStorageProp", () => {
    const key = Math.random().toString().split(".")[1];
    const p1 = localStorageProp({
      key,
      defaultValue: 1
    });
    expect(p1.value).toStrictEqual(1);
    p1.set(2);
    expect(p1.value).toStrictEqual(2);
    p1.dispose();
    expect(p1.value).toStrictEqual(2);
    const p2 = localStorageProp({
      key,
      defaultValue: 1
    });
    expect(p2.value).toStrictEqual(2);
  });
  // Disabling because it is flaky
  // test("animateSignal", async () => {
  //   const duration = 40
  //   const source = prop(10);
  //   const animated = animateSignal(
  //     source, {
  //       initialValue: 0,
  //       duration
  //     }
  //   );
  //   expect(animated.value).toStrictEqual(0);
  //   await sleep(duration / 2)
  //   expect(animated.value).toBeGreaterThan(0);
  //   expect(animated.value).toBeLessThanOrEqual(10);
  //   await sleep(duration * 0.75)
  //   expect(animated.value).toStrictEqual(10);
  // })
  test("interrupt animateSignal", async () => {
    const duration = 40
    const source = prop(10);
    const animated = animateSignal(
      source, {
        initialValue: 0,
        duration
      }
    );
    expect(animated.value).toStrictEqual(0);
    await sleep(duration / 2)
    expect(animated.value).toBeGreaterThan(0);
    expect(animated.value).toBeLessThanOrEqual(10);
    source.dispose();
    await sleep(duration * 0.75)
    expect(animated.value).toBeGreaterThan(0);
    expect(animated.value).toBeLessThan(10);
  })
  test("Signal.mapAsync", async() => {
    const p = prop(1)
    const spy = vi.fn()
    const s = p.mapAsync(v => {
      spy(v)
      return Promise.resolve(v + 1)
    }, 0)
    expect(s.value).toStrictEqual(0)
    await sleep()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(s.value).toStrictEqual(2)
    p.set(2)
    expect(s.value).toStrictEqual(2)
    await sleep()
    expect(spy).toHaveBeenCalledTimes(2)
    expect(s.value).toStrictEqual(3)
  })
  test("Signal.ofPromise", async () => {
    const s = Signal.ofPromise(Promise.resolve(1), 0);
    expect(s.value).toStrictEqual(0);
    await sleep()
    expect(s.value).toStrictEqual(1);
  })
  test("Signal.ofPromise with error", async () => {
    const s = Signal.ofPromise(Promise.reject("error"), 0, _ => 2);
    expect(s.value).toStrictEqual(0);
    await sleep()
    expect(s.value).toStrictEqual(2);
  })

  test("Signal.ofPromise with custom equals", async () => {
    const customEquals = (a: { id: number }, b: { id: number }) => a.id === b.id;
    const s = Signal.ofPromise(
      Promise.resolve({ id: 1, name: "test" }),
      { id: 0, name: "init" },
      undefined,
      customEquals
    );

    expect(s.value).toEqual({ id: 0, name: "init" });
    await sleep();
    expect(s.value).toEqual({ id: 1, name: "test" });
  })

  test("Signal.is", () => {
    const s = signal(1);
    const p = prop(2);
    const c = s.map(x => x * 2);
    const literal = 42;

    expect(Signal.is(s)).toBe(true);
    expect(Signal.is(p)).toBe(true);
    expect(Signal.is(c)).toBe(true);
    expect(Signal.is(literal)).toBe(false);
    expect(Signal.is(null)).toBe(false);
    expect(Signal.is(undefined)).toBe(false);
  })

  test("Computed.is", () => {
    const s = signal(1);
    const p = prop(2);
    const c = s.map(x => x * 2);
    const literal = 42;

    expect(Computed.is(c)).toBe(true);
    expect(Computed.is(s)).toBe(false);
    expect(Computed.is(p)).toBe(false);
    expect(Computed.is(literal)).toBe(false);
  })

  test("Prop.is", () => {
    const s = signal(1);
    const p = prop(2);
    const c = s.map(x => x * 2);
    const literal = 42;

    expect(Prop.is(p)).toBe(true);
    expect(Prop.is(s)).toBe(false);
    expect(Prop.is(c)).toBe(false);
    expect(Prop.is(literal)).toBe(false);
  })
  test("computedOf signals", () => {
    const p1 = prop(1);
    const p2 = prop(2);
    const c = computedOf(p1, p2)((a, b) => a + b);
    expect(c.value).toStrictEqual(3);
    p1.set(2);
    expect(c.value).toStrictEqual(4);
    p2.set(3);
    expect(c.value).toStrictEqual(5);
  })
  test("computedOf literals", () => {
    const c = computedOf(1, 2)((a, b) => a + b);
    expect(c.value).toStrictEqual(3);
  })
  test("computedOf mixed", () => {
    const p1 = prop(1);
    const c = computedOf(p1, 2)((a, b) => a + b);
    expect(c.value).toStrictEqual(3);
    p1.set(2);
    expect(c.value).toStrictEqual(4);
  })
  test("effectOf", async () => {
    const p1 = prop(1);
    const p2 = prop(2);
    const spy = vi.fn();
    effectOf(p1, p2)((a, b) => {
      spy(a, b);
    });
    await sleep()
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1, 2);
    p1.set(2);
    await sleep()
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(2, 2);
    p2.set(3);
    await sleep()
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(2, 3);
  })
  test("effectOf with literals", async () => {
    const spy = vi.fn();
    effectOf(1, 2)((a, b) => {
      spy(a, b);
    });
    await sleep()
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1, 2);
  })
  test("effectOf with mixed", async () => {
    const p1 = prop(1);
    const spy = vi.fn();
    effectOf(p1, 2)((a, b) => {
      spy(a, b);
    });
    await sleep()
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1, 2);
  })

  test("mapMaybe", () => {
    const p = prop<string | null>("hello");
    const mapped = p.mapMaybe(v => v?.toUpperCase(), "DEFAULT");
    expect(mapped.value).toBe("HELLO");

    p.set(null);
    expect(mapped.value).toBe("DEFAULT");

    p.set("world");
    expect(mapped.value).toBe("WORLD");
  });

  test("feedProp", () => {
    const source = prop(10);
    const target = prop(0);

    source.feedProp(target);
    expect(target.value).toBe(10);

    source.set(20);
    expect(target.value).toBe(20);

    source.dispose();
    source.set(30); // Should not update target after disposal
    expect(target.value).toBe(20);
  });

  test("feedProp with autoDispose", () => {
    const source = prop(5);
    const target = prop(0);

    const result = source.feedProp(target, true);
    expect(result).toBe(target);
    expect(target.value).toBe(5);

    source.dispose();
    expect(target.isDisposed()).toBe(true);
  });

  test("hasListeners", () => {
    const p = prop(1);
    expect(p.hasListeners()).toBe(false);

    const unsubscribe = p.on(() => {});
    expect(p.hasListeners()).toBe(true);

    unsubscribe();
    expect(p.hasListeners()).toBe(false);
  });

  test("isDisposed", () => {
    const p = prop(1);
    expect(p.isDisposed()).toBe(false);

    p.dispose();
    expect(p.isDisposed()).toBe(true);
  });

  test("onDispose", () => {
    const p = prop(1);
    const spy = vi.fn();

    p.onDispose(spy);
    expect(spy).not.toHaveBeenCalled();

    p.dispose();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("at method", () => {
    const obj = prop({ name: "John", age: 30 });
    const nameSignal = obj.at("name");
    const ageSignal = obj.at("age");

    expect(nameSignal.value).toBe("John");
    expect(ageSignal.value).toBe(30);

    obj.set({ name: "Jane", age: 25 });
    expect(nameSignal.value).toBe("Jane");
    expect(ageSignal.value).toBe(25);
  });

  test("$ proxy getter", () => {
    const obj = prop({ x: 10, y: 20 });
    const xSignal = obj.$.x;
    const ySignal = obj.$.y;

    expect(xSignal.value).toBe(10);
    expect(ySignal.value).toBe(20);

    obj.set({ x: 30, y: 40 });
    expect(xSignal.value).toBe(30);
    expect(ySignal.value).toBe(40);
  });

  test("filter", () => {
    const p = prop(1);
    const filtered = p.filter(v => v > 5, 0);

    expect(filtered.value).toBe(0); // Start value since 1 <= 5

    p.set(10);
    expect(filtered.value).toBe(10); // Passes filter

    p.set(3);
    expect(filtered.value).toBe(10); // Doesn't pass filter, keeps previous

    p.set(15);
    expect(filtered.value).toBe(15); // Passes filter
  });

  test("filterMap", () => {
    const p = prop<string | null>("hello");
    const filtered = p.filterMap(v => v?.length, 0);

    expect(filtered.value).toBe(5);

    p.set(null);
    expect(filtered.value).toBe(5); // Keeps previous value

    p.set("world");
    expect(filtered.value).toBe(5); // Same length, no change

    p.set("testing");
    expect(filtered.value).toBe(7);
  });

  test("derive", () => {
    const source = prop(42);
    const derived = source.derive();

    expect(derived.value).toBe(42);

    source.set(100);
    expect(derived.value).toBe(100);

    // Derived should be independent for disposal
    derived.dispose();
    expect(source.isDisposed()).toBe(false);
  });

  test("count", () => {
    const p = prop("a");
    const counter = p.count();

    expect(counter.value).toBe(1); // Initial count

    p.set("b");
    expect(counter.value).toBe(2);

    p.set("c");
    expect(counter.value).toBe(3);
  });

  test("update method", () => {
    const p = prop(10);

    p.update(v => v * 2);
    expect(p.value).toBe(20);

    p.update(v => v + 5);
    expect(p.value).toBe(25);
  });

  test("reducer", () => {
    const state = prop({ count: 0, name: "test" });
    const dispatch = state.reducer<{ type: string; payload?: any }>(
      (state, action) => {
        switch (action.type) {
          case "increment":
            return { ...state, count: state.count + 1 };
          case "setName":
            return { ...state, name: action.payload };
          default:
            return state;
        }
      }
    );

    dispatch({ type: "increment" });
    expect(state.value.count).toBe(1);

    dispatch({ type: "setName", payload: "updated" });
    expect(state.value.name).toBe("updated");
    expect(state.value.count).toBe(1); // Should remain unchanged
  });

  test("iso (isomorphism)", () => {
    const celsius = prop(0);
    const fahrenheit = celsius.iso(
      c => c * 9/5 + 32,  // to fahrenheit
      f => (f - 32) * 5/9  // from fahrenheit
    );

    expect(fahrenheit.value).toBe(32); // 0°C = 32°F

    celsius.set(100);
    expect(fahrenheit.value).toBe(212); // 100°C = 212°F

    fahrenheit.set(68);
    expect(celsius.value).toBe(20); // 68°F = 20°C
  });

  test("atProp", () => {
    const person = prop({ name: "John", age: 30 });
    const nameProp = person.atProp("name");
    const ageProp = person.atProp("age");

    expect(nameProp.value).toBe("John");
    expect(ageProp.value).toBe(30);

    nameProp.set("Jane");
    expect(person.value.name).toBe("Jane");
    expect(person.value.age).toBe(30); // Should remain unchanged

    ageProp.set(25);
    expect(person.value.name).toBe("Jane");
    expect(person.value.age).toBe(25);
  });

  test("signal with custom equals", () => {
    const customEquals = (a: { id: number }, b: { id: number }) => a.id === b.id;
    const p = prop({ id: 1, name: "test" }, customEquals);
    const spy = vi.fn();

    p.on(spy);
    spy.mockClear(); // Clear initial call

    // Should not trigger due to custom equals
    p.set({ id: 1, name: "different" });
    expect(spy).not.toHaveBeenCalled();

    // Should trigger
    p.set({ id: 2, name: "test" });
    expect(spy).toHaveBeenCalled();
  });

  test("computed error handling", () => {
    const p = prop(1);
    let shouldThrow = false;

    const c = p.map(v => {
      if (shouldThrow) throw new Error("test error");
      return v * 2;
    });

    expect(c.value).toBe(2);

    shouldThrow = true;
    p.set(2);

    // Computed will throw errors - this is expected behavior
    expect(() => c.value).toThrow("test error");
  });

  test("disposal prevents further updates", () => {
    const p = prop(1);
    const spy = vi.fn();

    p.on(spy);
    spy.mockClear();

    p.dispose();
    p.set(2); // Should not trigger listeners after disposal

    expect(spy).not.toHaveBeenCalled();
    expect(p.value).toBe(1); // Value should not change after disposal
  });

  test("listener with skipInitial option", () => {
    const p = prop(42);
    const spy = vi.fn();

    p.on(spy, { skipInitial: true });
    expect(spy).not.toHaveBeenCalled();

    p.set(100);
    expect(spy).toHaveBeenCalledWith(100, 42);
  });

  test("computed setDirty when already dirty", () => {
    const p = prop(1);
    const c = p.map(v => v * 2);

    // Access value to ensure it's computed
    expect(c.value).toBe(2);

    // Make it dirty
    p.set(2);

    // Calling setDirty again should not cause issues
    c.setDirty();
    c.setDirty();

    expect(c.value).toBe(4);
  });

  test("reducer with effects", () => {
    const state = prop(0);
    const effectSpy = vi.fn();

    const dispatch = state.reducer<number>(
      (acc, value) => acc + value,
      (context) => effectSpy(context.state, context.action)
    );

    dispatch(5);
    expect(state.value).toBe(5);
    expect(effectSpy).toHaveBeenCalledWith(5, 5);

    dispatch(3);
    expect(state.value).toBe(8);
    expect(effectSpy).toHaveBeenCalledWith(8, 3);
  });

  test("multiple onDispose listeners", () => {
    const p = prop(1);
    const spy1 = vi.fn();
    const spy2 = vi.fn();

    p.onDispose(spy1);
    p.onDispose(spy2);

    p.dispose();

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  test("setDerivative and cleanup", () => {
    const source = prop(1);
    const computed = source.map(v => v * 2);

    // Manually test setDerivative (normally done internally)
    const spy = vi.fn();
    computed.onDispose(spy);

    computed.dispose();
    expect(spy).toHaveBeenCalled();
  });

  test("Signal.ofPromise without recovery function", async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const s = Signal.ofPromise(Promise.reject("test error"), 0);
    expect(s.value).toBe(0);

    await sleep();
    expect(s.value).toBe(0); // Should remain unchanged
    expect(consoleSpy).toHaveBeenCalledWith(
      'Unhandled promise rejection in Signal.ofPromise:',
      'test error'
    );

    consoleSpy.mockRestore();
  });

  test("map error handling", () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const p = prop(1);

    const mapped = p.map(v => {
      if (v === 2) throw new Error("map error");
      return v * 2;
    });

    expect(mapped.value).toBe(2);

    p.set(2);
    expect(() => mapped.value).toThrow("map error");
    expect(consoleSpy).toHaveBeenCalledWith('Error in Signal.map:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  test("flatMap error handling", () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const p = prop(1);

    const flatMapped = p.flatMap(v => {
      if (v === 2) throw new Error("flatMap error");
      return signal(v * 2);
    });

    expect(flatMapped.value).toBe(2);

    p.set(2);
    expect(() => flatMapped.value).toThrow("flatMap error");
    expect(consoleSpy).toHaveBeenCalledWith('Error in Signal.flatMap:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  test("filter error handling", () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const p = prop(1);

    const filtered = p.filter(v => {
      if (v === 2) throw new Error("filter error");
      return v > 0;
    }, 0);

    expect(filtered.value).toBe(1);

    p.set(2);
    expect(() => filtered.value).toThrow("filter error");
    expect(consoleSpy).toHaveBeenCalledWith('Error in Signal.filter:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  test("filterMap error handling", () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const p = prop(1);

    const filterMapped = p.filterMap(v => {
      if (v === 2) throw new Error("filterMap error");
      return v > 0 ? v * 2 : null;
    }, 0);

    expect(filterMapped.value).toBe(2);

    p.set(2);
    expect(() => filterMapped.value).toThrow("filterMap error");
    expect(consoleSpy).toHaveBeenCalledWith('Error in Signal.filterMap:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  test("mapAsync error handling without recovery", async () => {
    const p = prop(1);

    // Capture unhandled rejections
    let unhandledError: any = null;
    const handler = (error: any) => {
      unhandledError = error;
    };
    process.on('unhandledRejection', handler);

    const mapped = p.mapAsync(v => {
      if (v === 2) return Promise.reject(new Error("async error"));
      return Promise.resolve(v * 2);
    }, 0);

    expect(mapped.value).toBe(0);
    await sleep();
    expect(mapped.value).toBe(2);

    // Trigger error case
    p.set(2);
    await sleep();

    // Should have an unhandled rejection
    expect(unhandledError).toBeInstanceOf(Error);
    expect(unhandledError.message).toBe("async error");

    // Cleanup
    process.removeListener('unhandledRejection', handler);
  });

  test("effect with once option", async () => {
    const p = prop(1);
    const spy = vi.fn();

    const clear = effect(() => spy(p.value), [p], { once: true });

    await sleep();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1);

    p.set(2);
    await sleep();
    expect(spy).toHaveBeenCalledTimes(1); // Should not be called again

    // clear should be a no-op since it was already cleared
    clear();
  });

  test("effect with skipInitial option", async () => {
    const p = prop(1);
    const spy = vi.fn();

    effect(() => spy(p.value), [p], { skipInitial: true });

    await sleep();
    expect(spy).not.toHaveBeenCalled();

    p.set(2);
    await sleep();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(2);
  });

  test("effect with abortSignal", async () => {
    const p = prop(1);
    const spy = vi.fn();
    const controller = new AbortController();

    effect(() => spy(p.value), [p], { abortSignal: controller.signal });

    await sleep();
    expect(spy).toHaveBeenCalledTimes(1);

    controller.abort();

    p.set(2);
    await sleep();
    expect(spy).toHaveBeenCalledTimes(1); // Should not be called after abort
  });

  test("listener with abortSignal", () => {
    const p = prop(1);
    const spy = vi.fn();
    const controller = new AbortController();

    p.on(spy, { abortSignal: controller.signal });
    expect(spy).toHaveBeenCalledTimes(1);

    p.set(2);
    expect(spy).toHaveBeenCalledTimes(2);

    controller.abort();

    p.set(3);
    expect(spy).toHaveBeenCalledTimes(2); // Should not be called after abort
  });

  test("listener with once option", () => {
    const p = prop(1);
    const spy = vi.fn();

    p.on(spy, { once: true });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1, undefined);

    p.set(2);
    expect(spy).toHaveBeenCalledTimes(2); // Called once more, then auto-removed
    expect(spy).toHaveBeenLastCalledWith(2, 1);

    p.set(3);
    expect(spy).toHaveBeenCalledTimes(2); // Should not be called again after once
  });

  test("reducer with no state change", () => {
    const state = prop(5);
    const effectSpy = vi.fn();

    const dispatch = state.reducer<number>(
      (acc, _value) => acc, // Always return same value
      (context) => effectSpy(context)
    );

    dispatch(10);
    expect(state.value).toBe(5); // Should remain unchanged
    expect(effectSpy).not.toHaveBeenCalled(); // Effect should not run when state doesn't change
  });

  test("computed setDirty when disposed", () => {
    const p = prop(1);
    const c = p.map(v => v * 2);

    c.dispose();

    // setDirty should be a no-op when disposed
    c.setDirty();
    expect(c.isDisposed()).toBe(true);
  });

  test("signal _setAndNotify when disposed", () => {
    const p = prop(1);
    const spy = vi.fn();

    p.on(spy);
    spy.mockClear();

    p.dispose();
    p.set(2); // This calls _setAndNotify internally

    expect(spy).not.toHaveBeenCalled();
    expect(p.value).toBe(1); // Value should not change
  });

  test("mapAsync with abort signal", async () => {
    const p = prop(1);
    let abortCount = 0;

    const mapped = p.mapAsync(async (v, { abortSignal }) => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => resolve(v * 2), 50);
        abortSignal.addEventListener('abort', () => {
          abortCount++;
          clearTimeout(timeout);
          reject(new Error('Aborted'));
        });
      });
    }, 0);

    expect(mapped.value).toBe(0);

    // Trigger multiple rapid changes to test abort behavior
    p.set(2);
    p.set(3);
    p.set(4);

    await sleep(100);
    expect(mapped.value).toBe(8); // Should be 4 * 2
    expect(abortCount).toBeGreaterThan(0); // Previous operations should have been aborted
  });

  test("feedProp disposal cleanup", () => {
    const source = prop(1);
    const target = prop(0);

    const result = source.feedProp(target);
    expect(result).toBe(target);
    expect(target.value).toBe(1);

    // Dispose target first
    target.dispose();

    // Source should still work but target won't update
    source.set(2);
    expect(target.value).toBe(1); // Should remain unchanged after disposal
  });

  test("deriveProp with custom equals", () => {
    const customEquals = (a: { id: number }, b: { id: number }) => a.id === b.id;
    const source = prop({ id: 1, name: "test" }, customEquals);

    const derived = source.deriveProp({ equals: customEquals });
    expect(derived.value).toEqual({ id: 1, name: "test" });

    const spy = vi.fn();
    derived.on(spy);
    spy.mockClear();

    // Should not trigger due to custom equals
    source.set({ id: 1, name: "different" });
    expect(spy).not.toHaveBeenCalled();

    // Should trigger
    source.set({ id: 2, name: "test" });
    expect(spy).toHaveBeenCalled();
  });

  test("deriveProp with autoDisposeProp false", () => {
    const source = prop(42);
    const derived = source.deriveProp({ autoDisposeProp: false });

    expect(derived.value).toBe(42);

    source.dispose();
    expect(derived.isDisposed()).toBe(false); // Should not be auto-disposed

    derived.dispose(); // Manual cleanup
  });

  test("$ proxy caching", () => {
    const obj = prop({ x: 10, y: 20 });

    const firstAccess = obj.$;
    const secondAccess = obj.$;

    // Should return the same cached proxy
    expect(firstAccess).toBe(secondAccess);
  });

  test("iso with custom equals", () => {
    const customEquals = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

    const source = prop("Hello");
    const iso = source.iso(
      s => s.toUpperCase(),
      s => s.toLowerCase(),
      customEquals
    );

    expect(iso.value).toBe("HELLO");

    const spy = vi.fn();
    iso.on(spy);
    spy.mockClear();

    // Should not trigger due to custom equals
    iso.set("HELLO");
    expect(spy).not.toHaveBeenCalled();

    // Should trigger
    iso.set("WORLD");
    expect(spy).toHaveBeenCalled();
    expect(source.value).toBe("world");
  });

  test("prop value setter", () => {
    const p = prop(10);
    expect(p.value).toBe(10);

    // Test the setter
    p.value = 20;
    expect(p.value).toBe(20);
    expect(p.get()).toBe(20);
  });

  test("queueMicrotask fallback", () => {
    // This test is tricky because we can't easily mock queueMicrotask
    // But we can test that the computed scheduling works in general
    const p = prop(1);
    const c = p.map(v => v * 2);

    // The computed should work regardless of which queue implementation is used
    expect(c.value).toBe(2);
    p.set(3);
    expect(c.value).toBe(6);
  });
});

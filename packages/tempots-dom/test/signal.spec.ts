import { describe, expect, test, vi } from "vitest";
import {
  makeComputed,
  makeEffect,
  makeSignal,
  makeProp,
  Signal,
  Prop,
  Computed,
  sessionStorageProp,
  localStorageProp,
  animateSignal,
  makeComputedOf,
  makeEffectOf,
} from "../src";
import { sleep } from "./helper";

describe("Signal", () => {
  test("signal basics", () => {
    const s = makeSignal(1);
    expect(s.value).toBe(1);
    expect(s.get()).toBe(1);
  });
  test("is", () => {
    const p = makeProp(1);
    const s = makeSignal(1);
    const c = s.map(v => v + 1);

    expect(Prop.is(p)).toBe(true);
    expect(Prop.is(s)).toBe(false);
    expect(Prop.is(c)).toBe(false);

    expect(Signal.is(p)).toBe(true);
    expect(Signal.is(s)).toBe(true);
    expect(Signal.is(c)).toBe(true);

    expect(Computed.is(p)).toBe(false);
    expect(Computed.is(s)).toBe(false);
    expect(Computed.is(c)).toBe(true);
  });
  test("hasListeners", () => {
    const s = makeSignal(1);
    expect(s.hasListeners()).toBe(false);
    const cancel = s.on(() => {});
    expect(s.hasListeners()).toBe(true);
    cancel();
    expect(s.hasListeners()).toBe(false);
  });
  test("hasListeners with computed", () => {
    const s = makeSignal(1);
    const c = s.map(v => v + 1);
    expect(s.hasListeners()).toBe(true);
    expect(c.hasListeners()).toBe(false);
    c.dispose();
    expect(s.hasListeners()).toBe(false);
  });
  test("map", () => {
    const p = makeProp(1);
    const c = p.map(v => v + 1);
    expect(c.value).toBe(2);
    p.set(2);
    expect(c.value).toBe(3);
  });
  test("filter", () => {
    const p = makeProp(1);
    const c1 = p.filter(v => v % 2 === 0, 0);
    expect(c1.value).toBe(0);
    p.set(2);
    expect(c1.value).toBe(2);
    p.set(3);
    expect(c1.value).toBe(2);
    const c2 = p.filter(v => v % 2 === 0);
    expect(c2.value).toBe(3);
    p.set(4);
    expect(c2.value).toBe(4);
    p.set(5);
    expect(c2.value).toBe(4);
  });
  test("maybeWrap", () => {
    const p = makeProp(1);
    const s = makeSignal(1);
    const c = p.map(v => v + 1);
    expect(Signal.maybeWrap(p)).toBe(p);
    expect(Signal.maybeWrap(s)).toBe(s);
    expect(Signal.maybeWrap(c)).toBe(c);
    const v = 1;
    expect(Signal.maybeWrap(v)).toBeInstanceOf(Signal);
    expect(Signal.maybeWrap(null)).toBeNull();
    expect(Signal.maybeWrap(undefined)).toBeUndefined();
  });
  test("wrap", () => {
    const p = makeProp(1);
    const s = makeSignal(1);
    const c = p.map(v => v + 1);
    expect(Signal.wrap(p)).toBe(p);
    expect(Signal.wrap(s)).toBe(s);
    expect(Signal.wrap(c)).toBe(c);
    const v = 1;
    expect(Signal.wrap(v)).toBeInstanceOf(Signal);
  });
  test("flatMap", () => {
    const p = makeProp(1);
    const c = p.flatMap(v => makeSignal(v + 1));
    expect(c.value).toBe(2);
    p.set(2);
    expect(c.value).toBe(3);
  });
  test("tap", async () => {
    const p = makeProp(1);
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
    const p1 = makeProp(1);
    const p2 = makeProp(2);
    const p3 = makeProp(3);
    const c = makeComputed(() => p1.value + p2.value + p3.value, [p1, p2, p3]);
    const spy = vi.fn();
    expect(c.value).toBe(6);
    c.on(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    p1.set(2);
    await sleep()
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(7);
    p2.set(3);
    p3.set(4);
    await sleep()
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(9);
  });
  test("computed with forced get", async () => {
    const p1 = makeProp(1);
    const p2 = makeProp(2);
    const p3 = makeProp(3);
    const c = makeComputed(() => p1.value + p2.value + p3.value, [p1, p2, p3]);
    const spy = vi.fn();
    expect(c.value).toBe(6);
    c.on(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    p1.set(2);
    expect(c.value).toBe(7); // forced get
    await sleep()
    expect(spy).toHaveBeenCalledWith(7);
    expect(spy).toHaveBeenCalledTimes(2);
    p2.set(3);
    p3.set(4);
    expect(c.value).toBe(9); // forced get
    await sleep()
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(9);
  });
  test("at", () => {
    const p = makeProp([1, 2, 3]);
    const c = p.at(1);
    expect(c.value).toBe(2);
    p.set([4, 5, 6]);
    expect(c.value).toBe(5);
  });
  test("filterMap", () => {
    const p = makeProp(1);
    const c = p.filterMap(
      v => (Math.trunc(v) === v ? (v % 2 === 0 ? "even" : "odd") : undefined),
      "odd"
    );
    expect(c.value).toBe("odd");
    p.set(2);
    expect(c.value).toBe("even");
    p.set(3);
    expect(c.value).toBe("odd");
    p.set(4.2);
    expect(c.value).toBe("odd");
  });
  test("mapAsync", async () => {
    const p = makeProp(1);
    const c = p.mapAsync(v => Promise.resolve(v + 1), 0);
    expect(c.value).toBe(0);
    p.set(2);
    expect(c.value).toBe(0);
    await sleep()
    expect(c.value).toBe(3);
  });
  test("mapAsync with error", async () => {
    const p = makeProp(1);
    const c = p.mapAsync(v => Promise.reject("error"), 0, _ => 2);
    expect(c.value).toBe(0);
    await sleep()
    expect(c.value).toBe(2);
  });
  test("deriveProp", () => {
    const p1 = makeProp(1);
    const p2 = p1.deriveProp();
    expect(p2.value).toBe(1);
    p1.set(2);
    expect(p2.value).toBe(2);
    p2.set(3);
    expect(p1.value).toBe(2);
    expect(p2.value).toBe(3);
    p1.set(4);
    expect(p2.value).toBe(4);
  });
  test("count", async () => {
    const p = makeProp("a");
    const c = p.count();
    expect(c.value).toBe(1);
    p.set("b");
    expect(c.value).toBe(2);
    p.set("c");
    expect(c.value).toBe(3);
  });
  test("effect", async () => {
    const p1 = makeProp(1);
    const p2 = makeProp(2);
    let value = 0;
    const clear = makeEffect(
      () => {
        value = p1.value + p2.value;
      },
      [p1, p2]
    );
    await sleep()
    expect(value).toBe(3);
    p1.set(2);
    await sleep()
    expect(value).toBe(4);
    clear();
    p2.set(3);
    await sleep()
    expect(value).toBe(4);
  });
  test("sessionStorageProp", () => {
    const key = Math.random().toString().split(".")[1];
    sleep()
    const p1 = sessionStorageProp({
      key,
      defaultValue: 1
    });
    expect(p1.value).toBe(1);
    p1.set(2);
    expect(p1.value).toBe(2);
    p1.dispose();
    expect(p1.value).toBe(2);
    const p2 = sessionStorageProp({
      key,
      defaultValue: 1
    });
    expect(p2.value).toBe(2);
  });
  test("localStorageProp", () => {
    const key = Math.random().toString().split(".")[1];
    const p1 = localStorageProp({
      key,
      defaultValue: 1
    });
    expect(p1.value).toBe(1);
    p1.set(2);
    expect(p1.value).toBe(2);
    p1.dispose();
    expect(p1.value).toBe(2);
    const p2 = localStorageProp({
      key,
      defaultValue: 1
    });
    expect(p2.value).toBe(2);
  });
  // Disabling because it is flaky
  // test("animateSignal", async () => {
  //   const duration = 40
  //   const source = makeProp(10);
  //   const animated = animateSignal(
  //     source, {
  //       initialValue: 0,
  //       duration
  //     }
  //   );
  //   expect(animated.value).toBe(0);
  //   await sleep(duration / 2)
  //   expect(animated.value).toBeGreaterThan(0);
  //   expect(animated.value).toBeLessThanOrEqual(10);
  //   await sleep(duration * 0.75)
  //   expect(animated.value).toBe(10);
  // })
  test("interrupt animateSignal", async () => {
    const duration = 40
    const source = makeProp(10);
    const animated = animateSignal(
      source, {
        initialValue: 0,
        duration
      }
    );
    expect(animated.value).toBe(0);
    await sleep(duration / 2)
    expect(animated.value).toBeGreaterThan(0);
    expect(animated.value).toBeLessThanOrEqual(10);
    source.dispose();
    await sleep(duration * 0.75)
    expect(animated.value).toBeGreaterThan(0);
    expect(animated.value).toBeLessThan(10);
  })
  test("Signal.mapAsync", async() => {
    const p = makeProp(1)
    const spy = vi.fn()
    const s = p.mapAsync(v => {
      spy(v)
      return Promise.resolve(v + 1)
    }, 0)
    expect(s.value).toBe(0)
    await sleep()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(s.value).toBe(2)
    p.set(2)
    expect(s.value).toBe(2)
    await sleep()
    expect(spy).toHaveBeenCalledTimes(2)
    expect(s.value).toBe(3)
  })
  test("Signal.ofPromise", async () => {
    const s = Signal.ofPromise(Promise.resolve(1), 0);
    expect(s.value).toBe(0);
    await sleep()
    expect(s.value).toBe(1);
  })
  test("Signal.ofPromise with error", async () => {
    const s = Signal.ofPromise(Promise.reject("error"), 0, _ => 2);
    expect(s.value).toBe(0);
    await sleep()
    expect(s.value).toBe(2);
  })
  test("makeComputedOf signals", () => {
    const p1 = makeProp(1);
    const p2 = makeProp(2);
    const c = makeComputedOf(p1, p2)((a, b) => a + b);
    expect(c.value).toBe(3);
    p1.set(2);
    expect(c.value).toBe(4);
    p2.set(3);
    expect(c.value).toBe(5);
  })
  test("makeComputedOf literals", () => {
    const c = makeComputedOf(1, 2)((a, b) => a + b);
    expect(c.value).toBe(3);
  })
  test("makeComputedOf mixed", () => {
    const p1 = makeProp(1);
    const c = makeComputedOf(p1, 2)((a, b) => a + b);
    expect(c.value).toBe(3);
    p1.set(2);
    expect(c.value).toBe(4);
  })
  test("makeEffectOf", async () => {
    const p1 = makeProp(1);
    const p2 = makeProp(2);
    const spy = vi.fn();
    makeEffectOf(p1, p2)((a, b) => {
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
  test("makeEffectOf with literals", async () => {
    const spy = vi.fn();
    makeEffectOf(1, 2)((a, b) => {
      spy(a, b);
    });
    await sleep()
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1, 2);
  })
  test("makeEffectOf with mixed", async () => {
    const p1 = makeProp(1);
    const spy = vi.fn();
    makeEffectOf(p1, 2)((a, b) => {
      spy(a, b);
    });
    await sleep()
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1, 2);
  })
});

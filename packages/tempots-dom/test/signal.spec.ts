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
  Value,
} from "../src";
import { sleep } from "./helper";

describe("Signal", () => {
  test("signal basics", () => {
    const s = makeSignal(1);
    expect(s.value).toStrictEqual(1);
    expect(s.get()).toStrictEqual(1);
  });
  test("is", () => {
    const p = makeProp(1);
    const s = makeSignal(1);
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
    const s = makeSignal(1);
    expect(s.hasListeners()).toStrictEqual(false);
    const cancel = s.on(() => {});
    expect(s.hasListeners()).toStrictEqual(true);
    cancel();
    expect(s.hasListeners()).toStrictEqual(false);
  });
  test("hasListeners with computed", () => {
    const s = makeSignal(1);
    const c = s.map(v => v + 1);
    expect(s.hasListeners()).toStrictEqual(true);
    expect(c.hasListeners()).toStrictEqual(false);
    c.dispose();
    expect(s.hasListeners()).toStrictEqual(false);
  });
  test("map", () => {
    const p = makeProp(1);
    const c = p.map(v => v + 1);
    expect(c.value).toStrictEqual(2);
    p.set(2);
    expect(c.value).toStrictEqual(3);
  });
  test("filter", () => {
    const p = makeProp(1);
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
    const p = makeProp(1);
    const s = makeSignal(1);
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
    const p = makeProp(1);
    const s = makeSignal(1);
    const c = p.map(v => v + 1);
    expect(Value.toSignal(p)).toStrictEqual(p);
    expect(Value.toSignal(s)).toStrictEqual(s);
    expect(Value.toSignal(c)).toStrictEqual(c);
    const v = 1;
    expect(Value.toSignal(v)).toBeInstanceOf(Signal);
  });
  test("flatMap", () => {
    const p = makeProp(1);
    const c = p.flatMap(v => makeSignal(v + 1));
    expect(c.value).toStrictEqual(2);
    p.set(2);
    expect(c.value).toStrictEqual(3);
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
    const p1 = makeProp(1);
    const p2 = makeProp(2);
    const p3 = makeProp(3);
    const c = makeComputed(() => p1.value + p2.value + p3.value, [p1, p2, p3]);
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
    const p = makeProp([1, 2, 3]);
    const c = p.at(1);
    expect(c.value).toStrictEqual(2);
    p.set([4, 5, 6]);
    expect(c.value).toStrictEqual(5);
  });
  test("filterMap", () => {
    const p = makeProp(1);
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
    const p = makeProp(1);
    const c = p.mapAsync(v => Promise.resolve(v + 1), 0);
    expect(c.value).toStrictEqual(0);
    p.set(2);
    expect(c.value).toStrictEqual(0);
    await sleep()
    expect(c.value).toStrictEqual(3);
  });
  test("mapAsync with error", async () => {
    const p = makeProp(1);
    const c = p.mapAsync(v => Promise.reject("error"), 0, _ => 2);
    expect(c.value).toStrictEqual(0);
    await sleep()
    expect(c.value).toStrictEqual(2);
  });
  test("deriveProp", () => {
    const p1 = makeProp(1);
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
    const p = makeProp("a");
    const c = p.count();
    expect(c.value).toStrictEqual(1);
    p.set("b");
    expect(c.value).toStrictEqual(2);
    p.set("c");
    expect(c.value).toStrictEqual(3);
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
  //   const source = makeProp(10);
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
    const source = makeProp(10);
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
    const p = makeProp(1)
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
  test("makeComputedOf signals", () => {
    const p1 = makeProp(1);
    const p2 = makeProp(2);
    const c = makeComputedOf(p1, p2)((a, b) => a + b);
    expect(c.value).toStrictEqual(3);
    p1.set(2);
    expect(c.value).toStrictEqual(4);
    p2.set(3);
    expect(c.value).toStrictEqual(5);
  })
  test("makeComputedOf literals", () => {
    const c = makeComputedOf(1, 2)((a, b) => a + b);
    expect(c.value).toStrictEqual(3);
  })
  test("makeComputedOf mixed", () => {
    const p1 = makeProp(1);
    const c = makeComputedOf(p1, 2)((a, b) => a + b);
    expect(c.value).toStrictEqual(3);
    p1.set(2);
    expect(c.value).toStrictEqual(4);
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

import { describe, expect, test, vi } from "vitest";
import { makeProp } from "../src";

describe("Prop", () => {
  test("should get and set value", () => {
    const p = makeProp(1);
    expect(p.get()).toStrictEqual(1);
    expect(p.value).toStrictEqual(1);
    p.set(2);
    expect(p.value).toStrictEqual(2);
    p.value = 3;
    expect(p.value).toStrictEqual(3);
  });
  test("Should call listeners and cancel correctly", () => {
    const p = makeProp(1);
    const spy = vi.fn();
    const cancel = p.on(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1);
    p.set(2);
    expect(spy).toHaveBeenCalledWith(2);
    expect(spy).toHaveBeenCalledTimes(2);
    cancel();
    p.set(3);
    expect(spy).toHaveBeenCalledTimes(2);
  });
  test('update will set value and call listeners', () => {
    const p = makeProp(1);
    const spy = vi.fn();
    p.on(spy);
    p.update(v => v + 1);
    expect(spy).toHaveBeenCalledWith(2);
    expect(p.value).toStrictEqual(2);
  });
  test('reducer will set value and call listeners', () => {
    const p = makeProp(1);
    const spy = vi.fn();
    p.on(spy);
    const reduce = p.reducer((v: number, a: number) => v + a);
    reduce(2);
    expect(spy).toHaveBeenCalledWith(3);
    expect(p.value).toStrictEqual(3);
  });
  test('atProp should return a prop with the value at the given index', () => {
    const p = makeProp([1, 2, 3]);
    const at = p.atProp(1);
    expect(at.value).toStrictEqual(2);
    at.set(4);
    expect(p.value[1]).toStrictEqual(4);
  });
});

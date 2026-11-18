import { describe, expect, test, vi } from "vitest";
import { prop } from "../src";

describe("Prop", () => {
  test("should get and set value", () => {
    const p = prop(1);
    expect(p.get()).toStrictEqual(1);
    expect(p.value).toStrictEqual(1);
    p.set(2);
    expect(p.value).toStrictEqual(2);
    p.value = 3;
    expect(p.value).toStrictEqual(3);
  });
  test("Should call listeners and cancel correctly", () => {
    const p = prop(1);
    const spy = vi.fn();
    const cancel = p.on(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1, undefined);
    p.set(2);
    expect(spy).toHaveBeenCalledWith(2, 1);
    expect(spy).toHaveBeenCalledTimes(2);
    cancel();
    p.set(3);
    expect(spy).toHaveBeenCalledTimes(2);
  });
  test('update will set value and call listeners', () => {
    const p = prop(1);
    const spy = vi.fn();
    p.on(spy);
    p.update(v => v + 1);
    expect(spy).toHaveBeenCalledWith(2, 1);
    expect(p.value).toStrictEqual(2);
  });
  test('a once listener can remove itself without skipping the next listener', () => {
    const p = prop(0);
    const once = vi.fn();
    const following = vi.fn();
    p.onChange(once, { once: true });
    p.onChange(following);

    p.set(1);
    p.set(2);

    expect(once.mock.calls).toEqual([[1, 0]]);
    expect(following.mock.calls).toEqual([[1, 0], [2, 1]]);
  });
  test('changes to subscriptions during dispatch take effect without skipping active listeners', () => {
    const p = prop(0);
    const removed = vi.fn();
    const following = vi.fn();
    const added = vi.fn();
    const clear = p.onChange(() => {
      clear();
      clearRemoved();
      p.onChange(added);
    });
    const clearRemoved = p.onChange(removed);
    p.onChange(following);

    p.set(1);
    expect(removed).not.toHaveBeenCalled();
    expect(added).not.toHaveBeenCalled();
    p.set(2);

    expect(following.mock.calls).toEqual([[1, 0], [2, 1]]);
    expect(added.mock.calls).toEqual([[2, 1]]);
  });
  test('each registration of the same listener has its own idempotent disposer', () => {
    const p = prop(0);
    const listener = vi.fn();
    const clear = p.onChange(listener);
    p.onChange(listener);
    clear();
    clear();

    p.set(1);

    expect(listener.mock.calls).toEqual([[1, 0]]);
  });
  test('reducer will set value and call listeners', () => {
    const p = prop(1);
    const spy = vi.fn();
    p.on(spy);
    const reduce = p.reducer((v: number, a: number) => v + a);
    reduce(2);
    expect(spy).toHaveBeenCalledWith(3, 1);
    expect(p.value).toStrictEqual(3);
  });
  test('atProp should return a prop with the value at the given index', () => {
    const p = prop([1, 2, 3]);
    const at = p.atProp(1);
    expect(at.value).toStrictEqual(2);
    at.set(4);
    expect(p.value[1]).toStrictEqual(4);
  });
});

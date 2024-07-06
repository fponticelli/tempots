import { describe, expect, test } from "vitest";
import { guessInterpolate } from "../src";

describe("Interpolate", () => {
  test("number", () => {
    const i = guessInterpolate(0);
    expect(i(0, 1, 0.5)).toBe(0.5);
  });
  test("string", () => {
    const i = guessInterpolate("a");
    expect(i("ab", "cd", 0.5)).toBe("bc");
    expect(i("aa", "ccc", 0.5)).toBe("bbb");
    expect(i("aaa", "cc", 0.5)).toBe("bba");
  });
  test("date", () => {
    const start = new Date(0);
    const end = new Date(1000);
    const i = guessInterpolate(start);
    expect(i(start, end, 0.5).getTime()).toBe(500);
  })
  test("end", () => {
    const i = guessInterpolate({});
    expect(i(0, 1, 0.5)).toBe(1);
  });
});

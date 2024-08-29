import { describe, expect, test } from "vitest";
import { guessInterpolate } from "../src";

describe("Interpolate", () => {
  test("number", () => {
    const i = guessInterpolate(0);
    expect(i(0, 1, 0.5)).toStrictEqual(0.5);
  });
  test("string", () => {
    const i = guessInterpolate("a");
    expect(i("ab", "cd", 0.5)).toStrictEqual("bc");
    expect(i("aa", "ccc", 0.5)).toStrictEqual("bbb");
    expect(i("aaa", "cc", 0.5)).toStrictEqual("bba");
  });
  test("date", () => {
    const start = new Date(0);
    const end = new Date(1000);
    const i = guessInterpolate(start);
    expect(i(start, end, 0.5).getTime()).toStrictEqual(500);
  })
  test("end", () => {
    const i = guessInterpolate({});
    expect(i(0, 1, 0.5)).toStrictEqual(1);
  });
});

import { describe, expect, test } from "vitest";
import { ElementPosition } from "../src";

describe("ElementPosition", () => {
  test("isFirst", () => {
    const pos = new ElementPosition(0, 3);
    expect(pos.isFirst).toBe(true);
  })
  test("isLast", () => {
    const pos = new ElementPosition(2, 3);
    expect(pos.isLast).toBe(true);
  })
  test("isEven", () => {
    const pos = new ElementPosition(2, 3);
    expect(pos.isEven).toBe(true);
  })
  test("isOdd", () => {
    const pos = new ElementPosition(2, 3);
    expect(pos.isOdd).toBe(false);
  })
})

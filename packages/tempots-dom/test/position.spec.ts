import { describe, expect, test } from "vitest";
import { Position } from "../src";

describe("Position", () => {
  test("isFirst", () => {
    const pos = new Position(0, 3);
    expect(pos.isFirst).toBe(true);
  })
  test("isLast", () => {
    const pos = new Position(2, 3);
    expect(pos.isLast).toBe(true);
  })
  test("isEven", () => {
    const pos = new Position(2, 3);
    expect(pos.isEven).toBe(true);
  })
  test("isOdd", () => {
    const pos = new Position(2, 3);
    expect(pos.isOdd).toBe(false);
  })
})
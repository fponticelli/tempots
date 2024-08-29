import { describe, expect, test } from "vitest";
import { ElementPosition, makeProp, makeSignal } from "../src";
import { sleep } from "./helper";

describe("ElementPosition", () => {
  test("isFirst", () => {
    const pos = new ElementPosition(0, makeSignal(3));
    expect(pos.isFirst).toStrictEqual(true);
  })
  test("isLast", async() => {
    const total = makeProp(3);
    const pos = new ElementPosition(2, total);
    expect(pos.isLast.value).toStrictEqual(true);
    await sleep();
    total.value = 4;
    expect(pos.isLast.value).toStrictEqual(false);
  })
  test("even/odd", () => {
    let pos = new ElementPosition(0, makeSignal(3));
    expect(pos.isEven).toStrictEqual(false);
    expect(pos.isOdd).toStrictEqual(true);

    pos = new ElementPosition(1, makeSignal(3));
    expect(pos.isEven).toStrictEqual(true);
    expect(pos.isOdd).toStrictEqual(false);
  })
})

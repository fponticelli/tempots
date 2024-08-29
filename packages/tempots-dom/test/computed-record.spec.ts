import { describe, expect, test } from "vitest";
import { GetValueType, makeComputedRecord, makeProp } from "../src";
import { sleep } from "./helper";

describe("computedRecord", () => {
  test("literals only", () => {
    const s = makeComputedRecord({
      a: "A",
      n: 1
    }, ({ a, n }) => `${a}:${n * 2}`);
    expect(s.value).toStrictEqual("A:2");
  });
  test("signls only", async () => {
    const a = makeProp("A")
    const n = makeProp(1)
    const s = makeComputedRecord(
      { a, n },
      ({ a, n }) => `${a}:${n * 2}`
    );
    expect(s.value).toStrictEqual("A:2");

    a.set("B")
    await sleep()
    expect(s.value).toStrictEqual("B:2")

    n.set(2)
    await sleep()
    expect(s.value).toStrictEqual("B:4")
  });
  test("mixes", async () => {
    const a = makeProp("A")
    const s = makeComputedRecord(
      { a, n: 1 },
      ({ a, n }) => `${a}:${n * 2}`
    );
    expect(s.value).toStrictEqual("A:2");

    a.set("B")
    await sleep()
    expect(s.value).toStrictEqual("B:2")
  });
})

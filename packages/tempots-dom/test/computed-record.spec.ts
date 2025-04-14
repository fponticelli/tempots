import { describe, expect, test } from "vitest";
import { computedRecord, prop } from "../src";
import { sleep } from "./helper";

describe("computedRecord", () => {
  test("literals only", () => {
    const s = computedRecord({
      a: "A",
      n: 1
    }, ({ a, n }) => `${a}:${n * 2}`);
    expect(s.value).toStrictEqual("A:2");
  });
  test("signls only", async () => {
    const a = prop("A")
    const n = prop(1)
    const s = computedRecord(
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
    const a = prop("A")
    const s = computedRecord(
      { a, n: 1 },
      ({ a, n }) => `${a}:${n * 2}`
    );
    expect(s.value).toStrictEqual("A:2");

    a.set("B")
    await sleep()
    expect(s.value).toStrictEqual("B:2")
  });
})

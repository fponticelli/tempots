import { describe, expect, test } from "vitest";
import { GetValueType, computedRecord, useProp } from "../src";
import { sleep } from "./helper";

describe("computedRecord", () => {
  test("literals only", () => {
    const s = computedRecord({
      a: "A",
      n: 1
    }, ({ a, n }) => `${a}:${n * 2}`);
    expect(s.value).toBe("A:2");
  });
  test("signls only", async () => {
    const a = useProp("A")
    const n = useProp(1)
    const s = computedRecord(
      { a, n },
      ({ a, n }) => `${a}:${n * 2}`
    );
    expect(s.value).toBe("A:2");

    a.set("B")
    await sleep()
    expect(s.value).toBe("B:2")

    n.set(2)
    await sleep()
    expect(s.value).toBe("B:4")
  });
  test("mixes", async () => {
    const a = useProp("A")
    const s = computedRecord(
      { a, n: 1 },
      ({ a, n }) => `${a}:${n * 2}`
    );
    expect(s.value).toBe("A:2");

    a.set("B")
    await sleep()
    expect(s.value).toBe("B:2")
  });
})

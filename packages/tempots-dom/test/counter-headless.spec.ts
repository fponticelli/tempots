import { beforeEach, describe, expect, test } from "vitest";
import { html, runHeadless } from "../src";
import { sleep } from "./helper";
import { counter } from "./counter.spec";

describe("Counter Headless", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  test("increment/decrement", async () => {
    const { node, count } = counter();
    const { root, clear } = runHeadless(node, 'https://tempots.com/');
    expect(root.contentToHTML()).toStrictEqual(
      '<div id="counter"><div class="even">Count: 0</div><div><button id="decrement">Decrement</button><button id="increment">Increment</button></div></div>'
    );
    const decrement = root.getById("decrement")!;
    const increment = root.getById("increment")!;
    increment.click();
    expect(count.value).toStrictEqual(1);
    await sleep();
    expect(root.contentToHTML()).toStrictEqual(
      '<div id="counter"><div class="odd">Count: 1</div><div><button id="decrement">Decrement</button><button id="increment">Increment</button></div></div>'
    );
    decrement.click();
    expect(count.value).toStrictEqual(0);
    await sleep();
    expect(root.contentToHTML()).toStrictEqual(
      '<div id="counter"><div class="even">Count: 0</div><div><button id="decrement">Decrement</button><button id="increment">Increment</button></div></div>'
    );
    clear();
    expect(root.contentToHTML()).toStrictEqual("");
  });
});

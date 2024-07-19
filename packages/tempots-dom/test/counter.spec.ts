import { beforeEach, describe, expect, test } from "vitest";
import { html, on, attr, useProp, render } from "../src";
import { sleep } from "./helper";
const { div, button } = html;

function counter() {
  const count = useProp(0);
  const oddOrEven = count.map(
    (count): string => (count % 2 === 0 ? "even" : "odd")
  );
  const node = div(
    attr.id("counter"),
    div(attr.class(oddOrEven), "Count: ", count.map(String)),
    div(
      button(on.click(() => count.value--), "Decrement"),
      button(on.click(() => count.value++), "Increment"),
    )
  );
  return { node, count };
}

describe("Counter", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  test("increment/decrement", async () => {
    const body = document.body;
    const { node, count } = counter();
    const clear = render(node, body);
    expect(body.innerHTML).toBe(
      '<div id="counter"><div class="even">Count: 0</div><div><button>Decrement</button><button>Increment</button></div></div>'
    );
    const decrement = body.querySelector("button")!;
    const increment = decrement.nextElementSibling! as HTMLElement;
    increment.click();
    expect(count.value).toBe(1);
    await sleep();
    expect(body.innerHTML).toBe(
      '<div id="counter"><div class="odd">Count: 1</div><div><button>Decrement</button><button>Increment</button></div></div>'
    );
    decrement.click();
    expect(count.value).toBe(0);
    await sleep();
    expect(body.innerHTML).toBe(
      '<div id="counter"><div class="even">Count: 0</div><div><button>Decrement</button><button>Increment</button></div></div>'
    );
    clear();
    expect(body.innerHTML).toBe("");
  });
});

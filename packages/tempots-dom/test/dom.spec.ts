import { beforeEach, describe, expect, test, vi } from "vitest";
import { attr, html, style, render, prop, OnDispose, Ensure, OnMount } from "../src";
const { div } = html;

describe("render", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  test("div base attributes", () => {
    const node = div(attr.id("test"), attr.class("test"), style.color("red"));
    render(node, document.body);
    expect(document.body.innerHTML).toBe(
      '<div id="test" class="test" style="color: red;"></div>'
    );
  });

  test("div reactive", () => {
    const cls = prop("test");
    const node = div(attr.class(cls));
    const clear = render(node, document.body);
    expect(document.body.innerHTML).toBe('<div class="test"></div>');
    cls.value = "test2";
    expect(document.body.innerHTML).toBe('<div class="test2"></div>');
    clear();
    cls.value = "test3";
    expect(document.body.innerHTML).toBe("");
  });

  test("onDispose", () => {
    const spy = vi.fn();
    const clear = render(div(div(OnDispose(spy))), document.body);
    expect(spy).toHaveBeenCalledTimes(0);
    clear();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("add text", () => {
    render(div("test"), document.body);
    expect(document.body.innerText).toBe("test");
  });

  test("add signal text", () => {
    const txt = prop("test");
    const clear = render(div(txt), document.body);
    expect(document.body.innerText).toBe("test");
    txt.value = "test2";
    expect(document.body.innerText).toBe("test2");
    clear();
    txt.value = "test3";
    expect(document.body.innerText).toBe("");
  });

  test("add child", () => {
    render(div(div()), document.body);
    expect(document.body.innerHTML).toBe("<div><div></div></div>");
  });

  test("when", () => {
    const cls = prop("test" as string | null);
    const spyMount = vi.fn();
    const spyDispose = vi.fn();
    render(
      div(
        Ensure(cls, s => attr.class(s)),
        Ensure(cls, s =>
          div(s, OnMount(spyMount), OnDispose(spyDispose))
        )
      ),
      document.body
    );
    expect(spyMount).toHaveBeenCalledTimes(1);
    expect(spyDispose).toHaveBeenCalledTimes(0);
    expect(document.body.innerHTML).toBe(
      '<div class="test"><div>test</div></div>'
    );
    cls.value = "test2";
    expect(spyMount).toHaveBeenCalledTimes(1);
    expect(spyDispose).toHaveBeenCalledTimes(0);
    expect(document.body.innerHTML).toBe(
      '<div class="test2"><div>test2</div></div>'
    );
    cls.value = null;
    expect(spyMount).toHaveBeenCalledTimes(1);
    expect(spyDispose).toHaveBeenCalledTimes(1);
    expect(document.body.innerHTML).toBe('<div class=""></div>');
    cls.value = "test3";
    expect(spyMount).toHaveBeenCalledTimes(2);
    expect(spyDispose).toHaveBeenCalledTimes(1);
    expect(document.body.innerHTML).toBe(
      '<div class="test3"><div>test3</div></div>'
    );
  });
});

import { beforeEach, describe, expect, test, vi } from "vitest";
import { attr, html, style, render, makeProp, OnDispose, Ensure, OnElement, OnCtx, OnBrowserCtx, OnHeadlessCtx } from "../src";
const { div } = html;

describe("DOM", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  test("div base attributes", () => {
    const node = div(attr.id("test"), attr.class("test"), style.color("red"));
    render(node, document.body);
    expect(document.body.innerHTML).toStrictEqual(
      '<div id="test" class="test" style="color: red;"></div>'
    );
  });

  test("div reactive", () => {
    const cls = makeProp("test");
    const node = div(attr.class(cls));
    const clear = render(node, document.body);
    expect(document.body.innerHTML).toStrictEqual('<div class="test"></div>');
    cls.value = "test2";
    expect(document.body.innerHTML).toStrictEqual('<div class="test2"></div>');
    clear();
    cls.value = "test3";
    expect(document.body.innerHTML).toStrictEqual("");
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
    expect(document.body.innerText).toStrictEqual("test");
  });

  test("add signal text", () => {
    const txt = makeProp("test");
    const clear = render(div(txt), document.body);
    expect(document.body.innerText).toStrictEqual("test");
    txt.value = "test2";
    expect(document.body.innerText).toStrictEqual("test2");
    clear();
    txt.value = "test3";
    expect(document.body.innerText).toStrictEqual("");
  });

  test("add child", () => {
    render(div(div()), document.body);
    expect(document.body.innerHTML).toStrictEqual("<div><div></div></div>");
  });

  test("when", () => {
    const cls = makeProp("test" as string | null);
    const spyElement = vi.fn();
    const spyCtxMount = vi.fn();
    const spyBrowserCtx = vi.fn();
    const spyHeadlessCtx = vi.fn();
    const spyDispose = vi.fn();
    render(
      div(
        Ensure(cls, s => attr.class(s)),
        Ensure(cls, s =>
          div(
            s,
            OnElement(spyElement),
            OnCtx(spyCtxMount),
            OnBrowserCtx(spyBrowserCtx),
            OnHeadlessCtx(spyHeadlessCtx),
            OnDispose(spyDispose)
          )
        )
      ),
      document.body
    );
    expect(spyElement).toHaveBeenCalledTimes(1);
    expect(spyCtxMount).toHaveBeenCalledTimes(1);
    expect(spyBrowserCtx).toHaveBeenCalledTimes(1);
    expect(spyHeadlessCtx).toHaveBeenCalledTimes(0);
    expect(spyDispose).toHaveBeenCalledTimes(0);
    expect(document.body.innerHTML).toStrictEqual(
      '<div class="test"><div>test</div></div>'
    );
    cls.value = "test2";
    expect(spyElement).toHaveBeenCalledTimes(1);
    expect(spyCtxMount).toHaveBeenCalledTimes(1);
    expect(spyBrowserCtx).toHaveBeenCalledTimes(1);
    expect(spyHeadlessCtx).toHaveBeenCalledTimes(0);
    expect(spyDispose).toHaveBeenCalledTimes(0);
    expect(document.body.innerHTML).toStrictEqual(
      '<div class="test2"><div>test2</div></div>'
    );
    cls.value = null;
    expect(spyElement).toHaveBeenCalledTimes(1);
    expect(spyCtxMount).toHaveBeenCalledTimes(1);
    expect(spyBrowserCtx).toHaveBeenCalledTimes(1);
    expect(spyHeadlessCtx).toHaveBeenCalledTimes(0);
    expect(spyDispose).toHaveBeenCalledTimes(1);
    expect(document.body.innerHTML).toStrictEqual('<div class=""></div>');
    cls.value = "test3";
    expect(spyElement).toHaveBeenCalledTimes(2);
    expect(spyCtxMount).toHaveBeenCalledTimes(2);
    expect(spyBrowserCtx).toHaveBeenCalledTimes(2);
    expect(spyHeadlessCtx).toHaveBeenCalledTimes(0);
    expect(spyDispose).toHaveBeenCalledTimes(1);
    expect(document.body.innerHTML).toStrictEqual(
      '<div class="test3"><div>test3</div></div>'
    );
  });
});

import { describe, expect, test, vi } from "vitest";
import { attr, html, style, makeProp, OnDispose, Ensure, OnElement, runHeadless, OnCtx, OnBrowserCtx, OnHeadlessCtx } from "../src";
const { div } = html;

describe("DOM Headless", () => {
  test("div base attributes", () => {
    const node = div(attr.id("test"), attr.class("test"), style.color("red"));
    const { root } = runHeadless(node, 'https://tempots.com/');
    expect(root.contentToHTML()).toStrictEqual(
      '<div id="test" class="test" style="color: red;"></div>'
    );
  });

  test("div reactive", () => {
    const cls = makeProp("test");
    const node = div(attr.class(cls));
    const { root, clear } = runHeadless(node, 'https://tempots.com/');
    expect(root.contentToHTML()).toStrictEqual('<div class="test"></div>');
    cls.value = "test2";
    expect(root.contentToHTML()).toStrictEqual('<div class="test2"></div>');
    clear();
    cls.value = "test3";
    expect(root.contentToHTML()).toStrictEqual("");
  });

  test("onDispose", () => {
    const spy = vi.fn();
    const { clear } = runHeadless(div(div(OnDispose(spy))), 'https://tempots.com/');
    expect(spy).toHaveBeenCalledTimes(0);
    clear();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("add text", () => {
    const { root } = runHeadless(div("test"), 'https://tempots.com/');
    expect(root.getText()).toStrictEqual("test");
  });

  test("add signal text", () => {
    const txt = makeProp("test");
    const { root, clear } = runHeadless(div(txt), 'https://tempots.com/');
    expect(root.getText()).toStrictEqual("test");
    txt.value = "test2";
    expect(root.getText()).toStrictEqual("test2");
    clear();
    txt.value = "test3";
    expect(root.getText()).toStrictEqual("");
  });

  test("add child", () => {
    const { root } = runHeadless(div(div()), 'https://tempots.com/');
    expect(root.contentToHTML()).toStrictEqual("<div><div></div></div>");
  });

  test("when", () => {
    const cls = makeProp("test" as string | null);
    const spyElement = vi.fn();
    const spyCtxMount = vi.fn();
    const spyBrowserCtx = vi.fn();
    const spyHeadlessCtx = vi.fn();
    const spyDispose = vi.fn();
    const { root } = runHeadless(
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
      'https://tempots.com/'
    );
    expect(spyElement).toHaveBeenCalledTimes(0);
    expect(spyCtxMount).toHaveBeenCalledTimes(1);
    expect(spyBrowserCtx).toHaveBeenCalledTimes(0);
    expect(spyHeadlessCtx).toHaveBeenCalledTimes(1);
    expect(spyDispose).toHaveBeenCalledTimes(0);
    expect(root.contentToHTML()).toStrictEqual(
      '<div class="test"><div>test</div></div>'
    );
    cls.value = "test2";
    expect(spyElement).toHaveBeenCalledTimes(0);
    expect(spyCtxMount).toHaveBeenCalledTimes(1);
    expect(spyBrowserCtx).toHaveBeenCalledTimes(0);
    expect(spyHeadlessCtx).toHaveBeenCalledTimes(1);
    expect(spyDispose).toHaveBeenCalledTimes(0);
    expect(root.contentToHTML()).toStrictEqual(
      '<div class="test2"><div>test2</div></div>'
    );
    cls.value = null;
    expect(spyElement).toHaveBeenCalledTimes(0);
    expect(spyCtxMount).toHaveBeenCalledTimes(1);
    expect(spyBrowserCtx).toHaveBeenCalledTimes(0);
    expect(spyHeadlessCtx).toHaveBeenCalledTimes(1);
    expect(spyDispose).toHaveBeenCalledTimes(1);
    expect(root.contentToHTML()).toStrictEqual('<div></div>');
    cls.value = "test3";
    expect(spyElement).toHaveBeenCalledTimes(0);
    expect(spyCtxMount).toHaveBeenCalledTimes(2);
    expect(spyBrowserCtx).toHaveBeenCalledTimes(0);
    expect(spyHeadlessCtx).toHaveBeenCalledTimes(2);
    expect(spyDispose).toHaveBeenCalledTimes(1);
    expect(root.contentToHTML()).toStrictEqual(
      '<div class="test3"><div>test3</div></div>'
    );
  });
});

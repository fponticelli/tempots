import { describe, expect, test } from "vitest";
import { attr, html, runHeadless } from "../src";
const { div } = html;

describe("Inner Headless", () => {
  test("innerHTML", () => {
    const node = div(attr.innerHTML("<b>hello</b>"));
    const { root } = runHeadless(node, 'https://tempots.com');
    expect(root.contentToHTML()).toStrictEqual("<div><b>hello</b></div>");
  });

  test("innerText", () => {
    const node = div(attr.innerText("<b>hello</b>"));
    const { root } = runHeadless(node, 'https://tempots.com');
    expect(root.getText()).toStrictEqual("<b>hello</b>");
  });
});

import { beforeEach, describe, expect, test } from "vitest";
import { attr, html, render } from "../src";
const { div } = html;

describe("Inner", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  test("innerHTML", () => {
    const node = div(attr.innerHTML("<b>hello</b>"));
    render(node, document.body);
    expect(document.body.innerHTML).toStrictEqual("<div><b>hello</b></div>");
  });

  test("innerText", () => {
    const node = div(attr.innerText("<b>hello</b>"));
    render(node, document.body);
    expect(document.body.innerText).toStrictEqual("<b>hello</b>");
  });
});

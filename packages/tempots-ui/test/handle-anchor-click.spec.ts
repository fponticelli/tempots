import { _getExtension, _checkExtensionCondition } from "../src/dom/handle-anchor-click"
import { describe, expect, test } from "vitest"

describe("handle anchor click and helpers", () => {
  test("_getExtension", async () => {
    expect(_getExtension("/path/to/file.html")).toBe(".html")
    expect(_getExtension("/path/to/file.js")).toBe(".js")
    expect(_getExtension("/path/to/file.css")).toBe(".css")
    expect(_getExtension("/path/to/file")).toBeUndefined()
    expect(_getExtension(".dotfile")).toBeUndefined()
  })

  test("_checkExtensionCondition", async () => {
    expect(_checkExtensionCondition([], "/path/to/file.html")).toBe(true)
    expect(_checkExtensionCondition([], "/path/to/file.js")).toBe(true)
    expect(_checkExtensionCondition([], "/path/to/file.css")).toBe(true)
    expect(_checkExtensionCondition([], "/path/to/file")).toBe(false)
    expect(_checkExtensionCondition([], ".dotfile")).toBe(false)
    expect(_checkExtensionCondition(['.html'], "/path/to/file.html")).toBe(false)
    expect(_checkExtensionCondition(['.html'], "/path/to/file.js")).toBe(true)
  })
})
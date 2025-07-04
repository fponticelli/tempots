import { _getExtension, _checkExtensionCondition, handleAnchorClick } from "../src/dom/handle-anchor-click"
import { describe, expect, test, vi, beforeEach } from "vitest"

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

  describe("handleAnchorClick", () => {
    let mockCallback: ReturnType<typeof vi.fn>
    let mockEvent: Partial<MouseEvent>
    let anchor: HTMLAnchorElement

    beforeEach(() => {
      mockCallback = vi.fn()
      // Create a real anchor element
      anchor = document.createElement('a')
      anchor.href = '/test'
      anchor.target = ''

      mockEvent = {
        target: anchor,
        button: 0,
        ctrlKey: false,
        metaKey: false,
        preventDefault: vi.fn()
      }
    })

    test("should call callback and prevent default when conditions are met", () => {
      mockCallback.mockReturnValue(true)
      // Use ignoreUrlWithExtension: false to bypass extension checking
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).toHaveBeenCalled()
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    test("should not prevent default when callback returns false", () => {
      mockCallback.mockReturnValue(false)
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).toHaveBeenCalled()
      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
    })

    test("should not call callback when target is not an anchor", () => {
      mockEvent.target = document.createElement('div')
      const handler = handleAnchorClick(mockCallback)

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
    })

    test("should not call callback when target is nested inside non-anchor", () => {
      const div = document.createElement('div')
      const span = document.createElement('span')
      div.appendChild(span)
      mockEvent.target = span
      const handler = handleAnchorClick(mockCallback)

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should find anchor when target is nested inside anchor", () => {
      const span = document.createElement('span')
      anchor.appendChild(span)

      mockEvent.target = span
      mockCallback.mockReturnValue(true)
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).toHaveBeenCalled()
    })

    test("should not call callback when non-left button is clicked", () => {
      mockEvent.button = 1 // middle button
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should not call callback when ctrl key is pressed", () => {
      mockEvent.ctrlKey = true
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should not call callback when meta key is pressed", () => {
      mockEvent.metaKey = true
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should not call callback when target is not _self or empty", () => {
      anchor.target = '_blank'
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should call callback when target is _self", () => {
      anchor.target = '_self'
      mockCallback.mockReturnValue(true)
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).toHaveBeenCalled()
    })

    test("should not call callback when download attribute is present", () => {
      anchor.setAttribute('download', 'file.pdf')
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should not call callback for external URLs when ignoreExternalUrl is true", () => {
      anchor.href = 'https://external.com/test?param=value#section'

      const handler = handleAnchorClick(mockCallback, {
        ignoreExternalUrl: true,
        ignoreUrlWithExtension: false
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should call callback for hash-only URLs even when ignoreExternalUrl is true", () => {
      anchor.href = '#section'
      mockCallback.mockReturnValue(true)

      const handler = handleAnchorClick(mockCallback, {
        ignoreExternalUrl: true,
        ignoreUrlWithExtension: false
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).toHaveBeenCalled()
    })

    test("should normalize extensions by adding dots", () => {
      // Use a path without extension so it passes the extension check
      anchor.href = '/test'
      mockCallback.mockReturnValue(true)
      const handler = handleAnchorClick(mockCallback, {
        ignoreUrlWithExtension: true,
        allowedExtensions: ['html', '.js'] // mix of with and without dots
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).toHaveBeenCalled()
    })

    test("should handle relative URLs correctly when ignoreExternalUrl is true", () => {
      // Set up anchor with pathname, search, and hash
      anchor.pathname = '/test/path'
      anchor.search = '?param=value'
      anchor.hash = '#section'
      anchor.href = '/test/path?param=value#section'
      mockCallback.mockReturnValue(true)

      const handler = handleAnchorClick(mockCallback, {
        ignoreExternalUrl: true,
        ignoreUrlWithExtension: false
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).toHaveBeenCalled()
    })

    test("should not call callback when ignoreUrlWithExtension is true and URL has extension", () => {
      anchor.href = '/test/file.pdf'
      anchor.pathname = '/test/file.pdf'

      const handler = handleAnchorClick(mockCallback, {
        ignoreUrlWithExtension: true,
        allowedExtensions: []
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should call callback when ignoreUrlWithExtension is true and URL has allowed extension", () => {
      anchor.href = '/test/file.html'
      anchor.pathname = '/test/file.html'
      mockCallback.mockReturnValue(true)

      const handler = handleAnchorClick(mockCallback, {
        ignoreUrlWithExtension: true,
        allowedExtensions: ['html'], // Without dot, will be normalized
        ignoreExternalUrl: false
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).toHaveBeenCalled()
    })

    test("should handle options with undefined values", () => {
      anchor.href = '/test'
      mockCallback.mockReturnValue(true)

      const handler = handleAnchorClick(mockCallback, {
        ignoreUrlWithExtension: undefined,
        ignoreExternalUrl: undefined
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).toHaveBeenCalled()
    })

    test("should handle allowedExtensions that are not an array", () => {
      anchor.href = '/test'
      mockCallback.mockReturnValue(true)

      const handler = handleAnchorClick(mockCallback, {
        ignoreUrlWithExtension: true,
        allowedExtensions: null as any
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).toHaveBeenCalled()
    })

    test("should handle ignoreUrlWithExtension false with no extension", () => {
      anchor.href = '/test/path'
      anchor.pathname = '/test/path'
      anchor.search = ''
      anchor.hash = ''
      mockCallback.mockReturnValue(true)

      const handler = handleAnchorClick(mockCallback, {
        ignoreUrlWithExtension: false,
        ignoreExternalUrl: false
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).toHaveBeenCalled()
    })
  })
})

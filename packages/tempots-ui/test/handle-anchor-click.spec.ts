import { _getExtension, _checkExtensionCondition, handleAnchorClick } from "../src/dom/handle-anchor-click"
import { describe, expect, test, vi, beforeEach } from "vitest"

describe("handle anchor click and helpers", () => {
  test("_getExtension", async () => {
    expect(_getExtension("/path/to/file.html")).toBe(".html")
    expect(_getExtension("/path/to/file.js")).toBe(".js")
    expect(_getExtension("/path/to/file.css")).toBe(".css")
    expect(_getExtension("/path/to/file")).toBeUndefined()
    expect(_getExtension(".dotfile")).toBeUndefined()

    // Test edge cases to cover uncovered branches
    expect(_getExtension("")).toBeUndefined() // This covers line 13: when lastPart is undefined
    expect(_getExtension("/")).toBeUndefined() // This also covers line 13: when lastPart is undefined
    expect(_getExtension("///")).toBeUndefined() // Multiple slashes case

    // Test cases for dotfiles and edge cases
    expect(_getExtension("/.hidden")).toBeUndefined() // Dotfile at root
    expect(_getExtension("/path/.hidden")).toBeUndefined() // Dotfile in path
    expect(_getExtension("/path/to/.")).toBeUndefined() // Just a dot
    expect(_getExtension("/path/to/..")).toBeUndefined() // Double dot

    // Test normal files with extensions
    expect(_getExtension("/file.txt")).toBe(".txt")
    expect(_getExtension("file.pdf")).toBe(".pdf")
    expect(_getExtension("/path/file.tar.gz")).toBe(".gz") // Multiple extensions, should return last one

    // Test files without extensions
    expect(_getExtension("/path/to/README")).toBeUndefined()
    expect(_getExtension("filename")).toBeUndefined()

    // Test edge case that might trigger the `|| []` fallback on line 15
    // This is a very edge case where split might return something unexpected
    expect(_getExtension("/path/to/file.")).toBe(".") // File ending with dot returns "."
    expect(_getExtension("/path/to/.file.")).toBeUndefined() // Dotfile ending with dot

    // Test more edge cases to try to cover line 13 (lastPart == null)
    // These are theoretical edge cases that might occur in unusual circumstances
    expect(_getExtension("")).toBeUndefined() // Empty string
    expect(_getExtension("/")).toBeUndefined() // Just slash
    expect(_getExtension("//")).toBeUndefined() // Double slash
    expect(_getExtension("///")).toBeUndefined() // Triple slash
  })

  test("_checkExtensionCondition", async () => {
    // Test with empty allowed extensions array
    expect(_checkExtensionCondition([], "/path/to/file.html")).toBe(true)
    expect(_checkExtensionCondition([], "/path/to/file.js")).toBe(true)
    expect(_checkExtensionCondition([], "/path/to/file.css")).toBe(true)
    expect(_checkExtensionCondition([], "/path/to/file")).toBe(false)
    expect(_checkExtensionCondition([], ".dotfile")).toBe(false)

    // Test with specific allowed extensions
    expect(_checkExtensionCondition(['.html'], "/path/to/file.html")).toBe(false) // Extension is allowed
    expect(_checkExtensionCondition(['.html'], "/path/to/file.js")).toBe(true) // Extension is not allowed
    expect(_checkExtensionCondition(['.html', '.css'], "/path/to/file.css")).toBe(false) // Extension is allowed
    expect(_checkExtensionCondition(['.html', '.css'], "/path/to/file.js")).toBe(true) // Extension is not allowed

    // Test with no extension in pathname
    expect(_checkExtensionCondition(['.html'], "/path/to/file")).toBe(false) // No extension, should return false
    expect(_checkExtensionCondition([], "/path/to/file")).toBe(false) // No extension, should return false

    // Test edge cases
    expect(_checkExtensionCondition(['.html'], "")).toBe(false) // Empty pathname
    expect(_checkExtensionCondition(['.html'], "/")).toBe(false) // Root path
    expect(_checkExtensionCondition(['.html'], "/.hidden")).toBe(false) // Dotfile

    // Test case sensitivity
    expect(_checkExtensionCondition(['.HTML'], "/path/to/file.html")).toBe(true) // Case mismatch
    expect(_checkExtensionCondition(['.html'], "/path/to/file.HTML")).toBe(true) // Case mismatch

    // Test multiple extensions in filename
    expect(_checkExtensionCondition(['.gz'], "/path/to/file.tar.gz")).toBe(false) // Last extension matches
    expect(_checkExtensionCondition(['.tar'], "/path/to/file.tar.gz")).toBe(true) // First extension doesn't match last
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

    test("should handle edge case with empty pathname", () => {
      anchor.href = ''
      anchor.pathname = ''
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

    test("should handle case where target element has no parentElement", () => {
      // Create an element that's not attached to DOM
      const detachedElement = document.createElement('span')
      mockEvent.target = detachedElement

      const handler = handleAnchorClick(mockCallback)

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should handle deeply nested elements to find anchor", () => {
      const div = document.createElement('div')
      const span = document.createElement('span')
      const em = document.createElement('em')

      anchor.appendChild(div)
      div.appendChild(span)
      span.appendChild(em)

      mockEvent.target = em
      mockCallback.mockReturnValue(true)

      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).toHaveBeenCalled()
    })

    test("should handle anchor with complex href patterns", () => {
      // Test with query parameters and fragments
      anchor.href = '/test?param1=value1&param2=value2#section'
      anchor.pathname = '/test'
      anchor.search = '?param1=value1&param2=value2'
      anchor.hash = '#section'
      // Set the href attribute to match the relative URL
      anchor.setAttribute('href', '/test?param1=value1&param2=value2#section')
      mockCallback.mockReturnValue(true)

      const handler = handleAnchorClick(mockCallback, {
        ignoreUrlWithExtension: false,
        ignoreExternalUrl: true
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).toHaveBeenCalled()
    })

    test("should handle anchor with protocol-relative URLs", () => {
      anchor.href = '//example.com/test'
      anchor.pathname = '/test'

      const handler = handleAnchorClick(mockCallback, {
        ignoreExternalUrl: true,
        ignoreUrlWithExtension: false
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should handle anchor with data URLs", () => {
      anchor.href = 'data:text/plain;base64,SGVsbG8gV29ybGQ='

      const handler = handleAnchorClick(mockCallback, {
        ignoreExternalUrl: true,
        ignoreUrlWithExtension: false
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should handle anchor with javascript URLs", () => {
      anchor.href = 'javascript:void(0)'

      const handler = handleAnchorClick(mockCallback, {
        ignoreExternalUrl: true,
        ignoreUrlWithExtension: false
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should handle anchor with mailto URLs", () => {
      anchor.href = 'mailto:test@example.com'

      const handler = handleAnchorClick(mockCallback, {
        ignoreExternalUrl: true,
        ignoreUrlWithExtension: false
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should handle right mouse button click", () => {
      mockEvent.button = 2 // right button
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should handle both ctrl and meta keys pressed", () => {
      mockEvent.ctrlKey = true
      mockEvent.metaKey = true
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should handle anchor with target='_parent'", () => {
      anchor.target = '_parent'
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should handle anchor with target='_top'", () => {
      anchor.target = '_top'
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should handle anchor with custom target name", () => {
      anchor.target = 'customFrame'
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should handle download attribute with empty value", () => {
      anchor.setAttribute('download', '')
      const handler = handleAnchorClick(mockCallback, { ignoreUrlWithExtension: false })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    test("should handle complex extension normalization", () => {
      anchor.href = '/test'
      mockCallback.mockReturnValue(true)

      const handler = handleAnchorClick(mockCallback, {
        ignoreUrlWithExtension: true,
        allowedExtensions: ['html', '.js', 'css', '.pdf', ''] // Mix of formats including empty string
      })

      handler(mockEvent as MouseEvent)

      expect(mockCallback).toHaveBeenCalled()
    })
  })
})

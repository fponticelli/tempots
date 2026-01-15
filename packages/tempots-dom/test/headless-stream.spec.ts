import { describe, expect, test } from 'vitest'
import {
  HeadlessElement,
  HeadlessPortal,
  HeadlessText,
  HeadlessContext,
} from '../src/dom/headless-context'
import { prop } from '@tempots/core'

describe('HeadlessElement toHTMLStream', () => {
  describe('basic streaming', () => {
    test('should stream simple element', async () => {
      const element = new HeadlessElement('div', undefined, undefined)
      const container = { currentURL: prop('https://example.com') }
      const ctx = new HeadlessContext(element, undefined, container, {})

      ctx.makeChildText('Hello, World!')

      const chunks: string[] = []
      for await (const chunk of element.toHTMLStream()) {
        chunks.push(chunk)
      }

      expect(chunks.join('')).toBe('<div>Hello, World!</div>')
    })

    test('should stream nested elements', async () => {
      const element = new HeadlessElement('div', undefined, undefined)
      const container = { currentURL: prop('https://example.com') }
      const ctx = new HeadlessContext(element, undefined, container, {})

      const spanCtx = ctx.makeChildElement('span', undefined) as HeadlessContext
      spanCtx.makeChildText('Nested content')

      const chunks: string[] = []
      for await (const chunk of element.toHTMLStream()) {
        chunks.push(chunk)
      }

      expect(chunks.join('')).toBe('<div><span>Nested content</span></div>')
    })

    test('should stream with attributes', async () => {
      const element = new HeadlessElement('div', undefined, undefined)
      const container = { currentURL: prop('https://example.com') }
      const ctx = new HeadlessContext(element, undefined, container, {})

      const { set: setId } = ctx.makeAccessors('id')
      setId('test-id')
      ctx.addClasses(['test-class'])
      ctx.makeChildText('Content')

      const chunks: string[] = []
      for await (const chunk of element.toHTMLStream()) {
        chunks.push(chunk)
      }

      const result = chunks.join('')
      expect(result).toContain('id="test-id"')
      expect(result).toContain('class="test-class"')
      expect(result).toContain('Content')
    })

    test('should stream with styles', async () => {
      const element = new HeadlessElement('div', undefined, undefined)
      const container = { currentURL: prop('https://example.com') }
      const ctx = new HeadlessContext(element, undefined, container, {})

      ctx.setStyle('color', 'red')
      ctx.setStyle('font-size', '14px')
      ctx.makeChildText('Styled')

      const chunks: string[] = []
      for await (const chunk of element.toHTMLStream()) {
        chunks.push(chunk)
      }

      const result = chunks.join('')
      expect(result).toContain('style=')
      expect(result).toContain('color: red')
    })

    test('should stream self-closing tags', async () => {
      const element = new HeadlessElement('img', undefined, undefined)
      const container = { currentURL: prop('https://example.com') }
      const ctx = new HeadlessContext(element, undefined, container, {})

      const { set: setSrc } = ctx.makeAccessors('src')
      setSrc('test.jpg')

      const chunks: string[] = []
      for await (const chunk of element.toHTMLStream()) {
        chunks.push(chunk)
      }

      expect(chunks.join('')).toBe('<img src="test.jpg" />')
    })

    test('should stream with innerHTML', async () => {
      const element = new HeadlessElement('div', undefined, undefined)
      const container = { currentURL: prop('https://example.com') }
      const ctx = new HeadlessContext(element, undefined, container, {})

      const { set: setInnerHTML } = ctx.makeAccessors('innerHTML')
      setInnerHTML('<p>Inner HTML content</p>')

      const chunks: string[] = []
      for await (const chunk of element.toHTMLStream()) {
        chunks.push(chunk)
      }

      expect(chunks.join('')).toBe('<div><p>Inner HTML content</p></div>')
    })
  })

  describe('streaming with placeholders', () => {
    test('should include placeholders when option is set', async () => {
      const element = new HeadlessElement('div', undefined, undefined)
      const container = { currentURL: prop('https://example.com') }
      const ctx = new HeadlessContext(element, undefined, container, {})

      ctx.makeChildText('Content')

      const chunks: string[] = []
      for await (const chunk of element.toHTMLStream({ generatePlaceholders: true })) {
        chunks.push(chunk)
      }

      const result = chunks.join('')
      expect(result).toContain('data-tts-node')
      expect(result).toContain('data-tempo-id')
    })

    test('should not include placeholders when option is false', async () => {
      const element = new HeadlessElement('div', undefined, undefined)
      const container = { currentURL: prop('https://example.com') }
      const ctx = new HeadlessContext(element, undefined, container, {})

      ctx.makeChildText('Content')

      const chunks: string[] = []
      for await (const chunk of element.toHTMLStream({ generatePlaceholders: false })) {
        chunks.push(chunk)
      }

      expect(chunks.join('')).not.toContain('data-tts-node')
    })
  })

  describe('chunk ordering', () => {
    test('should yield opening tag first', async () => {
      const element = new HeadlessElement('div', undefined, undefined)
      const container = { currentURL: prop('https://example.com') }
      const ctx = new HeadlessContext(element, undefined, container, {})

      ctx.makeChildText('Content')

      const chunks: string[] = []
      for await (const chunk of element.toHTMLStream()) {
        chunks.push(chunk)
      }

      expect(chunks[0]).toBe('<div>')
      expect(chunks[chunks.length - 1]).toBe('</div>')
    })

    test('should yield multiple chunks for nested content', async () => {
      const element = new HeadlessElement('div', undefined, undefined)
      const container = { currentURL: prop('https://example.com') }
      const ctx = new HeadlessContext(element, undefined, container, {})

      ctx.makeChildText('First')
      const span = ctx.makeChildElement('span', undefined) as HeadlessContext
      span.makeChildText('Second')
      ctx.makeChildText('Third')

      const chunks: string[] = []
      for await (const chunk of element.toHTMLStream()) {
        chunks.push(chunk)
      }

      // Should have: <div>, First, <span>, Second, </span>, Third, </div>
      expect(chunks.length).toBeGreaterThan(3)
      expect(chunks.join('')).toBe('<div>First<span>Second</span>Third</div>')
    })
  })
})

describe('HeadlessPortal toHTMLStream', () => {
  test('should yield nothing for inline portal', async () => {
    const portal = new HeadlessPortal('#target', undefined)
    const container = { currentURL: prop('https://example.com') }
    const ctx = new HeadlessContext(portal, undefined, container, {})

    ctx.makeChildText('Portal content')

    const chunks: string[] = []
    for await (const chunk of portal.toHTMLStream()) {
      chunks.push(chunk)
    }

    // Portal's toHTMLStream yields nothing (content is at target)
    expect(chunks.join('')).toBe('')
  })

  test('should stream content via contentToHTMLStream', async () => {
    const portal = new HeadlessPortal('#target', undefined)
    const container = { currentURL: prop('https://example.com') }
    const ctx = new HeadlessContext(portal, undefined, container, {})

    ctx.makeChildText('Portal content')

    const chunks: string[] = []
    for await (const chunk of portal.contentToHTMLStream()) {
      chunks.push(chunk)
    }

    expect(chunks.join('')).toBe('Portal content')
  })

  test('should stream complex portal content', async () => {
    const portal = new HeadlessPortal('#target', undefined)
    const container = { currentURL: prop('https://example.com') }
    const ctx = new HeadlessContext(portal, undefined, container, {})

    const divCtx = ctx.makeChildElement('div', undefined) as HeadlessContext
    divCtx.addClasses(['modal'])
    divCtx.makeChildText('Modal content')

    const chunks: string[] = []
    for await (const chunk of portal.contentToHTMLStream()) {
      chunks.push(chunk)
    }

    const result = chunks.join('')
    expect(result).toContain('<div class="modal">')
    expect(result).toContain('Modal content')
    expect(result).toContain('</div>')
  })
})

describe('HeadlessText toHTMLStream', () => {
  test('should yield text as single chunk', async () => {
    const text = new HeadlessText('Hello, World!')

    const chunks: string[] = []
    for await (const chunk of text.toHTMLStream()) {
      chunks.push(chunk)
    }

    expect(chunks).toHaveLength(1)
    expect(chunks[0]).toBe('Hello, World!')
  })

  test('should handle empty text', async () => {
    const text = new HeadlessText('')

    const chunks: string[] = []
    for await (const chunk of text.toHTMLStream()) {
      chunks.push(chunk)
    }

    expect(chunks).toHaveLength(1)
    expect(chunks[0]).toBe('')
  })

  test('should handle special characters', async () => {
    const text = new HeadlessText('Special <>&"\'')

    const chunks: string[] = []
    for await (const chunk of text.toHTMLStream()) {
      chunks.push(chunk)
    }

    expect(chunks[0]).toBe('Special <>&"\'')
  })
})

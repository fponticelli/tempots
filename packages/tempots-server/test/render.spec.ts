import { describe, expect, test, vi } from 'vitest'
import { renderToStream, renderToString, renderToStaticMarkup, createRenderer } from '../src/index'
import { html, attr, prop, ForEach, When, TextNode, Fragment, Renderable } from '@tempots/dom'

describe('renderToString', () => {
  describe('basic rendering', () => {
    test('should render simple element', async () => {
      const App = () => html.div('Hello, World!')

      const result = await renderToString(App())

      expect(result).toBe('<div>Hello, World!</div>')
    })

    test('should render nested elements', async () => {
      const App = () =>
        html.div(
          html.h1('Title'),
          html.p('Paragraph content')
        )

      const result = await renderToString(App())

      expect(result).toContain('<h1>Title</h1>')
      expect(result).toContain('<p>Paragraph content</p>')
    })

    test('should render with attributes', async () => {
      const App = () =>
        html.div(
          attr.id('test-id'),
          attr.class('test-class'),
          'Content'
        )

      const result = await renderToString(App())

      expect(result).toContain('id="test-id"')
      expect(result).toContain('class="test-class"')
    })

    test('should render with styles', async () => {
      const App = () =>
        html.div(
          attr.style('color: red; font-size: 14px'),
          'Styled content'
        )

      const result = await renderToString(App())

      expect(result).toContain('style=')
      expect(result).toContain('color')
    })

    test('should render self-closing tags', async () => {
      const App = () =>
        html.div(
          html.img(attr.src('test.jpg'), attr.alt('Test image')),
          html.br(),
          html.input(attr.type('text'))
        )

      const result = await renderToString(App())

      expect(result).toContain('<img')
      expect(result).toContain('<br')
      expect(result).toContain('<input')
    })
  })

  describe('reactive content', () => {
    test('should render with props', async () => {
      const App = () => {
        const message = prop('Hello from prop!')
        return html.div(message)
      }

      const result = await renderToString(App())

      expect(result).toContain('Hello from prop!')
    })

    test('should render ForEach loops', async () => {
      const App = () => {
        const items = prop(['Item 1', 'Item 2', 'Item 3'])
        return html.ul(
          ForEach(items, item => html.li(item))
        )
      }

      const result = await renderToString(App())

      expect(result).toContain('<li>Item 1</li>')
      expect(result).toContain('<li>Item 2</li>')
      expect(result).toContain('<li>Item 3</li>')
    })

    test('should render When conditionals (true)', async () => {
      const App = () => {
        const showContent = prop(true)
        return html.div(
          When(showContent, () => html.span('Visible'))
        )
      }

      const result = await renderToString(App())

      expect(result).toContain('<span>Visible</span>')
    })

    test('should render When conditionals (false)', async () => {
      const App = () => {
        const showContent = prop(false)
        return html.div(
          When(showContent, () => html.span('Visible'))
        )
      }

      const result = await renderToString(App())

      expect(result).not.toContain('<span>Visible</span>')
    })
  })

  describe('options', () => {
    test('should use custom selector', async () => {
      const App = () => html.div('Content')

      const result = await renderToString(App(), {
        selector: 'body',
      })

      expect(result).toContain('Content')
    })

    test('should generate placeholders when requested', async () => {
      const App = () => html.div('Content')

      const result = await renderToString(App(), {
        generatePlaceholders: true,
      })

      expect(result).toContain('data-tts-node')
    })

    test('should call onError on render failure', async () => {
      const onError = vi.fn()

      // Create a renderable that throws during render
      const brokenRenderable = {
        render: () => {
          throw new Error('Render error')
        },
      }

      await expect(
        renderToString(brokenRenderable, { onError })
      ).rejects.toThrow('Render error')

      expect(onError).toHaveBeenCalled()
    })
  })
})

describe('renderToStaticMarkup', () => {
  test('should render without hydration markers', async () => {
    const App = () => html.div('Static content')

    const result = await renderToStaticMarkup(App())

    expect(result).not.toContain('data-tts-')
    expect(result).toContain('Static content')
  })

  test('should render complex content', async () => {
    const App = () =>
      html.div(
        html.h1('Welcome'),
        html.p('This is static markup for emails.')
      )

    const result = await renderToStaticMarkup(App())

    expect(result).toContain('<h1>Welcome</h1>')
    expect(result).toContain('<p>This is static markup for emails.</p>')
  })
})

describe('renderToStream', () => {
  test('should return a readable stream', async () => {
    const App = () => html.div('Streaming content')

    const stream = renderToStream(App())

    expect(stream).toBeDefined()
    expect(stream.readable).toBe(true)
  })

  test('should stream content in chunks', async () => {
    const App = () =>
      html.div(
        html.h1('Header'),
        html.p('Paragraph 1'),
        html.p('Paragraph 2')
      )

    const stream = renderToStream(App())
    const chunks: string[] = []

    for await (const chunk of stream) {
      chunks.push(chunk.toString())
    }

    const result = chunks.join('')
    expect(result).toContain('<h1>Header</h1>')
    expect(result).toContain('<p>Paragraph 1</p>')
    expect(result).toContain('<p>Paragraph 2</p>')
  })

  test('should call lifecycle callbacks', async () => {
    const onShellReady = vi.fn()
    const onAllReady = vi.fn()

    const App = () => html.div('Content')

    const stream = renderToStream(App(), {
      onShellReady,
      onAllReady,
    })

    // Consume the stream
    const chunks: string[] = []
    for await (const chunk of stream) {
      chunks.push(chunk.toString())
    }

    expect(onShellReady).toHaveBeenCalled()
    expect(onAllReady).toHaveBeenCalled()
  })

  test('should call onError on stream failure', async () => {
    const onError = vi.fn()

    // Create a renderable that throws during render
    const brokenRenderable = {
      render: () => {
        throw new Error('Stream error')
      },
    }

    const stream = renderToStream(brokenRenderable, { onError })

    const chunks: string[] = []
    try {
      for await (const chunk of stream) {
        chunks.push(chunk.toString())
      }
    } catch {
      // Expected to fail
    }

    expect(onError).toHaveBeenCalled()
  })

  test('should stream with placeholders', async () => {
    const App = () => html.div('Content')

    const stream = renderToStream(App(), {
      generatePlaceholders: true,
    })

    const chunks: string[] = []
    for await (const chunk of stream) {
      chunks.push(chunk.toString())
    }

    const result = chunks.join('')
    expect(result).toContain('data-tts-node')
  })
})

describe('createRenderer', () => {
  interface AppOptions {
    title?: string
    timestamp?: string
  }

  const App = (options: AppOptions = {}): Renderable =>
    html.div(
      html.h1(options.title ?? 'Default Title'),
      options.timestamp ? html.span(`Time: ${options.timestamp}`) : null
    )

  test('should create render function', async () => {
    const { render } = createRenderer(App)

    const result = await render('/')

    expect(result).toContain('<div')
    expect(result).toContain('Default Title')
  })

  test('should create renderStream function', async () => {
    const { renderStream } = createRenderer(App)

    const stream = renderStream('/')

    expect(stream).toBeDefined()
    expect(stream.readable).toBe(true)

    // Consume the stream
    const chunks: string[] = []
    for await (const chunk of stream) {
      chunks.push(chunk.toString())
    }

    const result = chunks.join('')
    expect(result).toContain('Default Title')
  })

  test('should pass getData result to App', async () => {
    const { render } = createRenderer(App, {
      getData: () => ({
        title: 'Custom Title',
        timestamp: '2024-01-15T12:00:00Z',
      }),
    })

    const result = await render('/')

    expect(result).toContain('Custom Title')
    expect(result).toContain('Time: 2024-01-15T12:00:00Z')
  })

  test('should pass url to getData', async () => {
    const getData = vi.fn().mockReturnValue({ title: 'Test' })

    const { render } = createRenderer(App, { getData })

    await render('/test-page')

    expect(getData).toHaveBeenCalledWith('/test-page')
  })

  test('should support async getData', async () => {
    const { render } = createRenderer(App, {
      getData: async (url) => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return { title: `Page: ${url}` }
      },
    })

    const result = await render('/async-page')

    expect(result).toContain('Page: /async-page')
  })

  test('should generate hydration placeholders by default', async () => {
    const { render } = createRenderer(App)

    const result = await render('/')

    expect(result).toContain('data-tts-node')
  })

  test('should not generate placeholders when hydrate is false', async () => {
    const { render } = createRenderer(App, { hydrate: false })

    const result = await render('/')

    expect(result).not.toContain('data-tts-node')
  })

  test('should stream with getData', async () => {
    const { renderStream } = createRenderer(App, {
      getData: () => ({ title: 'Streamed Title' }),
    })

    const stream = renderStream('/')

    const chunks: string[] = []
    for await (const chunk of stream) {
      chunks.push(chunk.toString())
    }

    const result = chunks.join('')
    expect(result).toContain('Streamed Title')
  })

  test('should stream with async getData', async () => {
    const { renderStream } = createRenderer(App, {
      getData: async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return { title: 'Async Streamed Title' }
      },
    })

    const stream = renderStream('/')

    const chunks: string[] = []
    for await (const chunk of stream) {
      chunks.push(chunk.toString())
    }

    const result = chunks.join('')
    expect(result).toContain('Async Streamed Title')
  })

  test('should work without getData', async () => {
    const { render, renderStream } = createRenderer(App)

    const stringResult = await render('/')
    expect(stringResult).toContain('Default Title')

    const stream = renderStream('/')
    const chunks: string[] = []
    for await (const chunk of stream) {
      chunks.push(chunk.toString())
    }
    expect(chunks.join('')).toContain('Default Title')
  })
})

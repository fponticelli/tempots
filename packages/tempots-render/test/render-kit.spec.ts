import { describe, it, expect, vi } from 'vitest'
import {
  createRenderable,
  makeProviderMark,
  ElementPosition,
  prop,
  signal,
  Signal,
  Value,
} from '@tempots/core'
import type { Clear, ProviderMark, Renderable } from '@tempots/core'
import type { BaseRenderContext, Providers } from '../src/index'
import { createRenderKit, ProviderNotFoundError } from '../src/index'

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 0))

// --- Mock context implementation ---

interface MockNode {
  type: 'text' | 'ref'
  text: string
  parent: MockElement | null
}

interface MockElement {
  children: MockNode[]
}

class MockContext implements BaseRenderContext {
  constructor(
    readonly element: MockElement,
    readonly reference: MockNode | undefined,
    readonly providers: Providers
  ) {}

  readonly makeRef = (): this => {
    const ref: MockNode = { type: 'ref', text: '', parent: this.element }
    this._insertNode(ref)
    return new MockContext(
      this.element,
      ref,
      this.providers
    ) as this
  }

  readonly makeMarker = (): BaseRenderContext => {
    return this.makeRef()
  }

  readonly moveRangeBefore = (
    startRef: BaseRenderContext,
    endRef: BaseRenderContext,
    targetRef: BaseRenderContext
  ): void => {
    const start = (startRef as MockContext).reference!
    const end = (endRef as MockContext).reference!
    const target = (targetRef as MockContext).reference!
    const children = this.element.children
    const startIdx = children.indexOf(start)
    const endIdx = children.indexOf(end)
    const targetIdx = children.indexOf(target)
    if (startIdx < 0 || endIdx < 0 || targetIdx < 0) return
    const range = children.splice(startIdx, endIdx - startIdx + 1)
    const insertIdx = children.indexOf(target)
    children.splice(insertIdx, 0, ...range)
  }

  readonly removeRange = (
    startRef: BaseRenderContext,
    endRef: BaseRenderContext
  ): void => {
    const start = (startRef as MockContext).reference!
    const end = (endRef as MockContext).reference!
    const children = this.element.children
    const startIdx = children.indexOf(start)
    const endIdx = children.indexOf(end)
    if (startIdx < 0 || endIdx < 0) return
    children.splice(startIdx, endIdx - startIdx + 1)
  }

  readonly clear = (removeTree: boolean): void => {
    if (removeTree) {
      if (this.reference) {
        const idx = this.element.children.indexOf(this.reference)
        if (idx >= 0) this.element.children.splice(idx, 1)
      }
    }
  }

  readonly makeChildText = (text: string): BaseRenderContext => {
    const node: MockNode = { type: 'text', text, parent: this.element }
    this._insertNode(node)
    return new MockContext(this.element, node, this.providers)
  }

  readonly setText = (text: string): void => {
    if (this.reference) {
      this.reference.text = text
    }
  }

  readonly getText = (): string => {
    return this.reference?.text ?? ''
  }

  readonly getProvider = <T>(
    mark: ProviderMark<T>
  ): { value: T; onUse?: () => void } => {
    if (this.providers[mark] === undefined) {
      throw new ProviderNotFoundError(mark)
    }
    const [value, onUse] = this.providers[mark]! as [
      T,
      undefined | (() => void),
    ]
    return { value, onUse }
  }

  readonly setProvider = <T>(
    mark: ProviderMark<T>,
    value: T,
    onUse: undefined | (() => void)
  ): BaseRenderContext => {
    return new MockContext(this.element, this.reference, {
      ...this.providers,
      [mark]: [value, onUse],
    })
  }

  private readonly _insertNode = (node: MockNode): void => {
    if (this.reference) {
      const idx = this.element.children.indexOf(this.reference)
      if (idx >= 0) {
        this.element.children.splice(idx, 0, node)
        return
      }
    }
    this.element.children.push(node)
  }
}

// --- Test setup ---

const MOCK_TYPE = Symbol('MOCK_RENDERABLE')

function mockRenderable(
  renderFn: (ctx: MockContext) => Clear
): Renderable<MockContext, typeof MOCK_TYPE> {
  return createRenderable(MOCK_TYPE, renderFn)
}

const kit = createRenderKit<MockContext, typeof MOCK_TYPE>({
  type: MOCK_TYPE,
  create: mockRenderable,
})

function createRoot(): { ctx: MockContext; element: MockElement } {
  const element: MockElement = { children: [] }
  const ctx = new MockContext(element, undefined, {} as Providers)
  return { ctx, element }
}

function getTexts(element: MockElement): string[] {
  return element.children
    .filter(n => n.type === 'text' && n.text !== '')
    .map(n => n.text)
}

// --- Tests ---

describe('createRenderKit', () => {
  describe('Empty', () => {
    it('renders nothing', () => {
      const { ctx, element } = createRoot()
      const clear = kit.Empty.render(ctx)
      expect(element.children.length).toBe(0)
      clear(true)
    })
  })

  describe('Fragment', () => {
    it('renders multiple children', () => {
      const { ctx, element } = createRoot()
      const clear = kit.Fragment('hello', ' ', 'world').render(ctx)
      expect(getTexts(element)).toEqual(['hello', ' ', 'world'])
      clear(true)
    })
  })

  describe('When', () => {
    it('renders then branch for true literal', () => {
      const { ctx, element } = createRoot()
      const clear = kit
        .When(
          true,
          () => 'yes',
          () => 'no'
        )
        .render(ctx)
      expect(getTexts(element)).toEqual(['yes'])
      clear(true)
    })

    it('renders otherwise branch for false literal', () => {
      const { ctx, element } = createRoot()
      const clear = kit
        .When(
          false,
          () => 'yes',
          () => 'no'
        )
        .render(ctx)
      expect(getTexts(element)).toEqual(['no'])
      clear(true)
    })

    it('reacts to signal changes', () => {
      const { ctx, element } = createRoot()
      const cond = prop(true)
      const clear = kit
        .When(
          cond,
          () => 'yes',
          () => 'no'
        )
        .render(ctx)
      expect(getTexts(element)).toEqual(['yes'])

      cond.value = false
      expect(getTexts(element)).toEqual(['no'])

      cond.value = true
      expect(getTexts(element)).toEqual(['yes'])

      clear(true)
      cond.dispose()
    })
  })

  describe('Unless', () => {
    it('renders then branch for false literal', () => {
      const { ctx, element } = createRoot()
      const clear = kit
        .Unless(
          false,
          () => 'shown'
        )
        .render(ctx)
      expect(getTexts(element)).toEqual(['shown'])
      clear(true)
    })
  })

  describe('Repeat', () => {
    it('repeats static count', () => {
      const { ctx, element } = createRoot()
      const clear = kit
        .Repeat(3, pos => `item-${pos.index}`)
        .render(ctx)
      expect(getTexts(element)).toEqual(['item-0', 'item-1', 'item-2'])
      clear(true)
    })

    it('reacts to signal count', async () => {
      const { ctx, element } = createRoot()
      const count = prop(2)
      const clear = kit
        .Repeat(count, pos => `item-${pos.index}`)
        .render(ctx)
      expect(getTexts(element)).toEqual(['item-0', 'item-1'])

      count.value = 3
      await waitForUpdate()
      expect(getTexts(element)).toEqual(['item-0', 'item-1', 'item-2'])

      count.value = 1
      await waitForUpdate()
      expect(getTexts(element)).toEqual(['item-0'])

      clear(true)
      count.dispose()
    })
  })

  describe('ForEach', () => {
    it('renders items from array signal', async () => {
      const { ctx, element } = createRoot()
      const items = prop(['a', 'b', 'c'])
      const clear = kit
        .ForEach(items, itemSignal => itemSignal)
        .render(ctx)
      expect(getTexts(element)).toEqual(['a', 'b', 'c'])

      items.value = ['x', 'y']
      await waitForUpdate()
      expect(getTexts(element)).toEqual(['x', 'y'])

      clear(true)
      items.dispose()
    })
  })

  describe('MapSignal', () => {
    it('maps static value', () => {
      const { ctx, element } = createRoot()
      const clear = kit
        .MapSignal(42, v => `value: ${v}`)
        .render(ctx)
      expect(getTexts(element)).toEqual(['value: 42'])
      clear(true)
    })

    it('maps signal value', async () => {
      const { ctx, element } = createRoot()
      const val = prop(1)
      const clear = kit
        .MapSignal(val, v => `value: ${v}`)
        .render(ctx)
      expect(getTexts(element)).toEqual(['value: 1'])

      val.value = 2
      await waitForUpdate()
      expect(getTexts(element)).toEqual(['value: 2'])

      clear(true)
      val.dispose()
    })
  })

  describe('Ensure', () => {
    it('renders then for non-null literal', () => {
      const { ctx, element } = createRoot()
      const clear = kit
        .Ensure('hello', v => kit.MapSignal(v, t => `got: ${t}`))
        .render(ctx)
      expect(getTexts(element)).toEqual(['got: hello'])
      clear(true)
    })

    it('renders otherwise for null literal', () => {
      const { ctx, element } = createRoot()
      const clear = kit
        .Ensure(
          null as string | null,
          v => kit.MapSignal(v, t => `got: ${t}`),
          () => 'nothing'
        )
        .render(ctx)
      expect(getTexts(element)).toEqual(['nothing'])
      clear(true)
    })

    it('reacts to signal changes', () => {
      const { ctx, element } = createRoot()
      const val = prop<string | null>('hello')
      const clear = kit
        .Ensure(
          val,
          v => kit.MapSignal(v, t => `got: ${t}`),
          () => 'nothing'
        )
        .render(ctx)
      expect(getTexts(element)).toEqual(['got: hello'])

      val.value = null
      expect(getTexts(element)).toEqual(['nothing'])

      val.value = 'world'
      expect(getTexts(element)).toEqual(['got: world'])

      clear(true)
      val.dispose()
    })
  })

  describe('OneOfValue', () => {
    it('matches literal value', () => {
      const { ctx, element } = createRoot()
      const clear = kit
        .OneOfValue('b' as 'a' | 'b' | 'c', {
          a: () => 'alpha',
          b: () => 'beta',
          c: () => 'gamma',
        })
        .render(ctx)
      expect(getTexts(element)).toEqual(['beta'])
      clear(true)
    })

    it('reacts to signal changes', async () => {
      const { ctx, element } = createRoot()
      const val = prop<'a' | 'b'>('a')
      const clear = kit
        .OneOfValue(val, {
          a: () => 'alpha',
          b: () => 'beta',
        })
        .render(ctx)
      expect(getTexts(element)).toEqual(['alpha'])

      val.value = 'b'
      await waitForUpdate()
      expect(getTexts(element)).toEqual(['beta'])

      clear(true)
      val.dispose()
    })
  })

  describe('Task', () => {
    it('renders pending then resolved', async () => {
      const { ctx, element } = createRoot()
      let resolvePromise!: (v: string) => void
      const promise = new Promise<string>(r => {
        resolvePromise = r
      })
      const clear = kit
        .Task(() => promise, {
          pending: () => 'loading...',
          then: v => `done: ${v}`,
        })
        .render(ctx)
      expect(getTexts(element)).toEqual(['loading...'])

      resolvePromise('result')
      await promise
      // Allow microtask to flush
      await new Promise(r => setTimeout(r, 0))

      expect(getTexts(element)).toEqual(['done: result'])
      clear(true)
    })

    it('renders error state', async () => {
      const { ctx, element } = createRoot()
      const err = new Error('fail')
      const promise = Promise.reject(err)
      // Suppress unhandled rejection warning
      promise.catch(() => {})
      const clear = kit
        .Task(() => promise, {
          pending: () => 'loading...',
          then: () => 'done',
          error: e => `error: ${(e as Error).message}`,
        })
        .render(ctx)

      // Wait for rejection to be handled
      await new Promise(r => setTimeout(r, 10))

      expect(getTexts(element)).toEqual(['error: fail'])
      clear(true)
    })
  })

  describe('Async', () => {
    it('wraps a promise', async () => {
      const { ctx, element } = createRoot()
      const clear = kit
        .Async(Promise.resolve('data'), v => `got: ${v}`)
        .render(ctx)

      await new Promise(r => setTimeout(r, 10))
      expect(getTexts(element)).toEqual(['got: data'])
      clear(true)
    })
  })

  describe('OnDispose', () => {
    it('calls callback on dispose', () => {
      const { ctx } = createRoot()
      const fn = vi.fn()
      const clear = kit.OnDispose(fn).render(ctx)
      clear(true)
      expect(fn).toHaveBeenCalledWith(true, ctx)
    })

    it('calls object dispose on dispose', () => {
      const { ctx } = createRoot()
      const disposeFn = vi.fn()
      const clear = kit.OnDispose({ dispose: disposeFn }).render(ctx)
      clear(false)
      expect(disposeFn).toHaveBeenCalledWith(false, ctx)
    })
  })

  describe('WithScope', () => {
    it('provides a scope and disposes it on clear', () => {
      const { ctx, element } = createRoot()
      let capturedScope: unknown = null
      const clear = kit
        .WithScope(scope => {
          capturedScope = scope
          return 'scoped content'
        })
        .render(ctx)
      expect(capturedScope).not.toBeNull()
      expect(getTexts(element)).toEqual(['scoped content'])
      clear(true)
    })
  })

  describe('Provider', () => {
    it('provides and uses values', () => {
      const { ctx, element } = createRoot()
      const THEME = makeProviderMark<string>('theme')
      const ThemeProvider = {
        mark: THEME,
        create: () => ({
          value: 'dark',
          dispose: () => {},
        }),
      }

      const clear = kit
        .Provide(ThemeProvider, undefined, () =>
          kit.Use(ThemeProvider, theme => `theme: ${theme}`)
        )
        .render(ctx)
      expect(getTexts(element)).toEqual(['theme: dark'])
      clear(true)
    })

    it('UseMany consumes multiple providers', () => {
      const { ctx, element } = createRoot()
      const A_MARK = makeProviderMark<string>('a')
      const B_MARK = makeProviderMark<number>('b')
      const AProvider = {
        mark: A_MARK,
        create: () => ({ value: 'alpha', dispose: () => {} }),
      }
      const BProvider = {
        mark: B_MARK,
        create: () => ({ value: 42, dispose: () => {} }),
      }

      const clear = kit
        .WithProvider(({ set }) => {
          set(AProvider)
          set(BProvider)
          return kit.UseMany(AProvider, BProvider)((a, b) => `${a}-${b}`)
        })
        .render(ctx)
      expect(getTexts(element)).toEqual(['alpha-42'])
      clear(true)
    })
  })

  describe('NotEmpty', () => {
    it('renders display when non-empty', () => {
      const { ctx, element } = createRoot()
      const items = prop([1, 2, 3])
      const clear = kit
        .NotEmpty(
          items,
          v => kit.MapSignal(v, arr => `count: ${arr.length}`),
          () => kit.Fragment('empty')
        )
        .render(ctx)
      expect(getTexts(element)).toEqual(['count: 3'])
      clear(true)
      items.dispose()
    })

    it('renders whenEmpty for empty array', () => {
      const { ctx, element } = createRoot()
      const clear = kit
        .NotEmpty(
          [] as number[],
          () => kit.Fragment('has items'),
          () => kit.Fragment('empty')
        )
        .render(ctx)
      expect(getTexts(element)).toEqual(['empty'])
      clear(true)
    })
  })

  describe('renderableOfTNode', () => {
    it('handles null', () => {
      const { ctx, element } = createRoot()
      const clear = kit.renderableOfTNode(null).render(ctx)
      expect(element.children.length).toBe(0)
      clear(true)
    })

    it('handles undefined', () => {
      const { ctx, element } = createRoot()
      const clear = kit.renderableOfTNode(undefined).render(ctx)
      expect(element.children.length).toBe(0)
      clear(true)
    })

    it('handles string', () => {
      const { ctx, element } = createRoot()
      const clear = kit.renderableOfTNode('hello').render(ctx)
      expect(getTexts(element)).toEqual(['hello'])
      clear(true)
    })

    it('handles signal string', () => {
      const { ctx, element } = createRoot()
      const s = prop('initial')
      const clear = kit.renderableOfTNode(s).render(ctx)
      expect(getTexts(element)).toEqual(['initial'])

      s.value = 'updated'
      expect(getTexts(element)).toEqual(['updated'])

      clear(true)
      s.dispose()
    })

    it('handles signal with initial undefined value as empty text', () => {
      const { ctx, element } = createRoot()
      const s = prop<string | undefined>(undefined)
      const clear = kit.renderableOfTNode(s).render(ctx)
      expect(element.children.filter(n => n.type === 'text')).toHaveLength(1)
      expect(element.children[0].text).toBe('')

      s.value = 'hello'
      expect(getTexts(element)).toEqual(['hello'])

      s.value = undefined
      expect(element.children[0].text).toBe('')

      clear(true)
      s.dispose()
    })

    it('handles signal with initial null value as empty text', () => {
      const { ctx, element } = createRoot()
      const s = prop<string | null>(null)
      const clear = kit.renderableOfTNode(s).render(ctx)
      expect(element.children.filter(n => n.type === 'text')).toHaveLength(1)
      expect(element.children[0].text).toBe('')

      s.value = 'world'
      expect(getTexts(element)).toEqual(['world'])

      s.value = null
      expect(element.children[0].text).toBe('')

      clear(true)
      s.dispose()
    })

    it('handles signal toggling between value and null/undefined', () => {
      const { ctx, element } = createRoot()
      const s = prop<number | null | undefined>(42)
      const clear = kit.renderableOfTNode(s).render(ctx)
      // MockContext stores raw primitives; in real DOM these become strings
      expect(element.children[0].text).toBe(42)

      s.value = null
      expect(element.children[0].text).toBe('')

      s.value = 0
      expect(element.children[0].text).toBe(0)

      s.value = undefined
      expect(element.children[0].text).toBe('')

      s.value = 100
      expect(element.children[0].text).toBe(100)

      clear(true)
      s.dispose()
    })

    it('handles array', () => {
      const { ctx, element } = createRoot()
      const clear = kit.renderableOfTNode(['a', 'b']).render(ctx)
      expect(getTexts(element)).toEqual(['a', 'b'])
      clear(true)
    })

    it('handles renderable', () => {
      const { ctx, element } = createRoot()
      const renderable = kit.Fragment('wrapped')
      const clear = kit.renderableOfTNode(renderable).render(ctx)
      expect(getTexts(element)).toEqual(['wrapped'])
      clear(true)
    })

    it('throws for unknown types', () => {
      const badValue = { notARenderable: true } as unknown as string
      expect(() => kit.renderableOfTNode(badValue)).toThrow('Unknown type')
    })
  })

  describe('handleValueOrSignal', () => {
    it('calls onStatic for literal', () => {
      const result = kit.handleValueOrSignal(
        42,
        () => 'signal',
        v => `static: ${v}`
      )
      expect(result).toBe('static: 42')
    })

    it('calls onSignal for signal', () => {
      const s = signal(42)
      const result = kit.handleValueOrSignal(
        s,
        sig => `signal: ${sig.value}`,
        () => 'static'
      )
      expect(result).toBe('signal: 42')
    })
  })

  describe('Conjunction', () => {
    it('creates separators based on position', () => {
      const { ctx, element } = createRoot()
      const total = prop(3)
      const pos = prop(new ElementPosition(0, total))
      const sep = kit.Conjunction(() => ', ')
      const clear = sep(pos).render(ctx)
      // First position should render the default separator
      const texts = getTexts(element)
      expect(texts).toEqual([', '])
      clear(true)
      total.dispose()
      pos.dispose()
    })
  })
})

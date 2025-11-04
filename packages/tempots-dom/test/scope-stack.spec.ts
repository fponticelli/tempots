import { describe, test, expect, beforeEach } from 'vitest'
import { DisposalScope } from '../src/std/disposal-scope'
import { prop } from '../src/std/signal'
import {
  scopeStack,
  pushScope,
  popScope,
  getCurrentScope,
  getScopeStack,
  getParentScope,
  withScope,
  scoped,
  untracked,
} from '../src/std/scope-stack'

describe('scope-stack', () => {
  // Clear the stack before each test
  beforeEach(() => {
    scopeStack.length = 0
  })

  describe('getCurrentScope()', () => {
    test('returns null when stack is empty', () => {
      expect(getCurrentScope()).toBe(null)
    })

    test('returns the last pushed scope', () => {
      const scope1 = new DisposalScope()
      const scope2 = new DisposalScope()

      pushScope(scope1)
      expect(getCurrentScope()).toBe(scope1)

      pushScope(scope2)
      expect(getCurrentScope()).toBe(scope2)
    })
  })

  describe('pushScope()', () => {
    test('adds scope to stack', () => {
      const scope = new DisposalScope()

      pushScope(scope)

      expect(scopeStack.length).toBe(1)
      expect(scopeStack[0]).toBe(scope)
    })

    test('multiple pushes maintain order', () => {
      const scope1 = new DisposalScope()
      const scope2 = new DisposalScope()
      const scope3 = new DisposalScope()

      pushScope(scope1)
      pushScope(scope2)
      pushScope(scope3)

      expect(scopeStack.length).toBe(3)
      expect(scopeStack[0]).toBe(scope1)
      expect(scopeStack[1]).toBe(scope2)
      expect(scopeStack[2]).toBe(scope3)
    })
  })

  describe('popScope()', () => {
    test('removes the last scope', () => {
      const scope1 = new DisposalScope()
      const scope2 = new DisposalScope()

      pushScope(scope1)
      pushScope(scope2)

      popScope()

      expect(scopeStack.length).toBe(1)
      expect(scopeStack[0]).toBe(scope1)
    })

    test('throws error on empty stack', () => {
      expect(() => popScope()).toThrow()
    })

    test('nested push/pop operations maintain correct order', () => {
      const scope1 = new DisposalScope()
      const scope2 = new DisposalScope()
      const scope3 = new DisposalScope()

      pushScope(scope1)
      pushScope(scope2)
      expect(getCurrentScope()).toBe(scope2)

      pushScope(scope3)
      expect(getCurrentScope()).toBe(scope3)

      popScope()
      expect(getCurrentScope()).toBe(scope2)

      popScope()
      expect(getCurrentScope()).toBe(scope1)

      popScope()
      expect(getCurrentScope()).toBe(null)
    })
  })

  describe('getScopeStack()', () => {
    test('returns read-only array', () => {
      const scope1 = new DisposalScope()
      const scope2 = new DisposalScope()

      pushScope(scope1)
      pushScope(scope2)

      const stack = getScopeStack()

      expect(stack.length).toBe(2)
      expect(stack[0]).toBe(scope1)
      expect(stack[1]).toBe(scope2)

      // Should be read-only (TypeScript enforces this at compile time)
      // At runtime, it's just a regular array, but we return a copy or readonly view
    })

    test('returns empty array when stack is empty', () => {
      const stack = getScopeStack()
      expect(stack.length).toBe(0)
    })
  })

  describe('getParentScope()', () => {
    test('returns null when stack is empty', () => {
      expect(getParentScope()).toBe(null)
    })

    test('returns null when only one scope exists', () => {
      const scope = new DisposalScope()
      pushScope(scope)

      expect(getParentScope()).toBe(null)
    })

    test('returns parent scope when multiple scopes exist', () => {
      const scope1 = new DisposalScope()
      const scope2 = new DisposalScope()
      const scope3 = new DisposalScope()

      pushScope(scope1)
      pushScope(scope2)
      pushScope(scope3)

      expect(getParentScope()).toBe(scope2)
    })
  })

  describe('withScope()', () => {
    test('pushes scope before calling function', () => {
      const scope = new DisposalScope()

      withScope(scope, () => {
        expect(getCurrentScope()).toBe(scope)
      })
    })

    test('pops scope after function completes', () => {
      const scope = new DisposalScope()

      withScope(scope, () => {
        expect(getCurrentScope()).toBe(scope)
      })

      expect(getCurrentScope()).toBe(null)
    })

    test('pops scope even if function throws', () => {
      const scope = new DisposalScope()

      expect(() => {
        withScope(scope, () => {
          throw new Error('Test error')
        })
      }).toThrow('Test error')

      expect(getCurrentScope()).toBe(null)
    })

    test('returns function result', () => {
      const scope = new DisposalScope()

      const result = withScope(scope, () => {
        return 42
      })

      expect(result).toBe(42)
    })

    test('does NOT dispose the scope', () => {
      const scope = new DisposalScope()

      withScope(scope, () => {
        // Do nothing
      })

      expect(scope.disposed).toBe(false)
    })

    test('nested withScope calls maintain correct stack', () => {
      const scope1 = new DisposalScope()
      const scope2 = new DisposalScope()

      withScope(scope1, () => {
        expect(getCurrentScope()).toBe(scope1)

        withScope(scope2, () => {
          expect(getCurrentScope()).toBe(scope2)
        })

        expect(getCurrentScope()).toBe(scope1)
      })

      expect(getCurrentScope()).toBe(null)
    })
  })

  describe('scoped()', () => {
    test('creates a new scope', () => {
      let capturedScope: DisposalScope | null = null

      scoped(scope => {
        capturedScope = scope
        expect(scope).toBeInstanceOf(DisposalScope)
      })

      expect(capturedScope).not.toBe(null)
    })

    test('pushes and pops scope', () => {
      scoped(scope => {
        expect(getCurrentScope()).toBe(scope)
      })

      expect(getCurrentScope()).toBe(null)
    })

    test('disposes scope after function completes', () => {
      let capturedScope: DisposalScope | null = null

      scoped(scope => {
        capturedScope = scope
      })

      expect(capturedScope!.disposed).toBe(true)
    })

    test('disposes scope even if function throws', () => {
      let capturedScope: DisposalScope | null = null

      expect(() => {
        scoped(scope => {
          capturedScope = scope
          throw new Error('Test error')
        })
      }).toThrow('Test error')

      expect(capturedScope!.disposed).toBe(true)
    })

    test('returns function result', () => {
      const result = scoped(() => {
        return 42
      })

      expect(result).toBe(42)
    })

    test('signals created in scoped() are disposed', () => {
      let signal: ReturnType<typeof prop> | null = null

      scoped(() => {
        signal = prop(0)
      })

      expect(signal!.isDisposed()).toBe(true)
    })
  })

  describe('untracked()', () => {
    test('saves current scope stack', () => {
      const scope = new DisposalScope()
      pushScope(scope)

      untracked(() => {
        expect(getCurrentScope()).toBe(null)
      })

      expect(getCurrentScope()).toBe(scope)
      popScope()
    })

    test('clears scope stack during execution', () => {
      const scope1 = new DisposalScope()
      const scope2 = new DisposalScope()
      pushScope(scope1)
      pushScope(scope2)

      untracked(() => {
        expect(getCurrentScope()).toBe(null)
        expect(getScopeStack().length).toBe(0)
      })

      expect(getCurrentScope()).toBe(scope2)
      popScope()
      popScope()
    })

    test('restores scope stack after execution', () => {
      const scope1 = new DisposalScope()
      const scope2 = new DisposalScope()
      pushScope(scope1)
      pushScope(scope2)

      untracked(() => {
        // Stack should be empty here
      })

      expect(scopeStack.length).toBe(2)
      expect(getCurrentScope()).toBe(scope2)
      popScope()
      popScope()
    })

    test('restores scope stack even if function throws', () => {
      const scope = new DisposalScope()
      pushScope(scope)

      expect(() => {
        untracked(() => {
          throw new Error('Test error')
        })
      }).toThrow('Test error')

      expect(getCurrentScope()).toBe(scope)
      popScope()
    })

    test('signals created in untracked() are NOT tracked', () => {
      let signal: ReturnType<typeof prop> | null = null

      scoped(scope => {
        signal = untracked(() => prop(0))
      })

      // Signal should NOT be disposed because it wasn't tracked
      expect(signal!.isDisposed()).toBe(false)

      // Clean up
      signal!.dispose()
    })

    test('nested untracked() calls work correctly', () => {
      const scope = new DisposalScope()
      pushScope(scope)

      untracked(() => {
        expect(getCurrentScope()).toBe(null)

        untracked(() => {
          expect(getCurrentScope()).toBe(null)
        })

        expect(getCurrentScope()).toBe(null)
      })

      expect(getCurrentScope()).toBe(scope)
      popScope()
    })
  })
})

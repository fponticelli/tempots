# Testing Guidelines for Tempo-ts

This document provides comprehensive guidelines for writing effective tests in the Tempo-ts monorepo.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Structure](#test-structure)
- [Testing Patterns](#testing-patterns)
- [DOM Testing](#dom-testing)
- [Signal Testing](#signal-testing)
- [Async Testing](#async-testing)
- [Mocking](#mocking)
- [Coverage Guidelines](#coverage-guidelines)
- [Best Practices](#best-practices)

## Testing Philosophy

### Core Principles
1. **Test behavior, not implementation**: Focus on what the code does, not how it does it
2. **Write tests first**: Consider TDD for new features
3. **Keep tests simple**: Each test should verify one specific behavior
4. **Make tests readable**: Tests serve as documentation
5. **Ensure tests are reliable**: Avoid flaky tests that pass/fail randomly

### Test Categories
- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test interactions between components
- **End-to-End Tests**: Test complete user workflows (when applicable)

## Test Structure

### File Organization
```
packages/
├── tempots-std/
│   ├── src/
│   │   └── array.ts
│   └── test/
│       └── array.spec.ts
├── tempots-dom/
│   ├── src/
│   │   └── renderable/
│   │       └── portal.ts
│   └── test/
│       └── portal.spec.ts
└── tempots-ui/
    ├── src/
    │   └── renderables/
    │       └── pop-over.ts
    └── test/
        └── pop-over.spec.ts
```

### Test File Naming
- Use `.spec.ts` suffix for test files
- Match the source file name: `array.ts` → `array.spec.ts`
- Place tests in the `test/` directory

### Test Structure Template
```typescript
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@tempots/dom'
import { ComponentUnderTest } from '../src/component'

describe('ComponentUnderTest', () => {
  beforeEach(() => {
    // Setup before each test
  })

  afterEach(() => {
    // Cleanup after each test
  })

  test('should do something specific', () => {
    // Arrange
    const input = 'test input'

    // Act
    const result = ComponentUnderTest(input)

    // Assert
    expect(result).toBe('expected output')
  })
})
```

## Testing Patterns

### Arrange-Act-Assert (AAA)
Structure tests with clear sections:
```typescript
test('should update prop value', () => {
  // Arrange
  const initialValue = 'initial'
  const newValue = 'updated'
  const testSignal = prop(initialValue)

  // Act
  testSignal.value = newValue

  // Assert
  expect(testSignal.value).toBe(newValue)
})
```

### Test Naming Conventions
- Use descriptive names that explain the scenario
- Follow pattern: `should [expected behavior] when [condition]`
- Examples:
  - `should render loading state when promise is pending`
  - `should call handler when Enter key is pressed`
  - `should cleanup event listeners on disposal`

## DOM Testing

### Basic DOM Testing
```typescript
import { render, html } from '@tempots/dom'

test('should render element with correct content', () => {
  const container = document.createElement('div')
  const clear = render(html.div('Hello World'), container)

  expect(container.textContent).toBe('Hello World')
  expect(container.querySelector('div')).toBeTruthy()

  clear() // Always cleanup
})
```

### Testing Event Handlers
```typescript
test('should call handler on click', () => {
  const handler = vi.fn()
  const container = document.createElement('div')

  const clear = render(
    html.button(on.click(handler), 'Click me'),
    container
  )

  const button = container.querySelector('button')
  button?.click()

  expect(handler).toHaveBeenCalledTimes(1)
  clear()
})
```

### Testing Keyboard Events
```typescript
test('should handle keyboard events', () => {
  const handler = vi.fn()
  const container = document.createElement('div')

  const clear = render(
    html.input(OnEnterKey(handler)),
    container
  )

  const input = container.querySelector('input')
  const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
  input?.dispatchEvent(enterEvent)

  expect(handler).toHaveBeenCalledWith(enterEvent)
  clear()
})
```

## Signal Testing

### Basic Signal Testing
```typescript
import { signal, computed } from '@tempots/dom'

test('should update computed signal when dependency changes', () => {
  const source = signal(10)
  const doubled = computed(() => source.value * 2)

  expect(doubled.value).toBe(20)

  source.value = 15
  expect(doubled.value).toBe(30)
})
```

### Testing Signal Reactivity in DOM
```typescript
test('should update DOM when signal changes', () => {
  const textSignal = signal('initial')
  const container = document.createElement('div')

  const clear = render(html.div(textSignal), container)

  expect(container.textContent).toBe('initial')

  textSignal.value = 'updated'
  expect(container.textContent).toBe('updated')

  clear()
})
```

## Async Testing

### Testing Promises
```typescript
test('should handle async operations', async () => {
  const promise = Promise.resolve('success')
  const container = document.createElement('div')

  const clear = render(
    Async(promise, {
      pending: () => 'Loading...',
      then: (value) => `Result: ${value}`,
      error: (err) => `Error: ${err}`
    }),
    container
  )

  expect(container.textContent).toBe('Loading...')

  await promise
  // Wait for next tick to allow DOM updates
  await new Promise(resolve => setTimeout(resolve, 0))

  expect(container.textContent).toBe('Result: success')
  clear()
})
```

### Testing Timers
```typescript
test('should handle timer operations', async () => {
  vi.useFakeTimers()

  const callback = vi.fn()
  setTimeout(callback, 1000)

  expect(callback).not.toHaveBeenCalled()

  vi.advanceTimersByTime(1000)
  expect(callback).toHaveBeenCalledTimes(1)

  vi.useRealTimers()
})
```

## Mocking

### Mocking Functions
```typescript
test('should call external function', () => {
  const mockFn = vi.fn().mockReturnValue('mocked result')

  const result = componentThatCallsFunction(mockFn)

  expect(mockFn).toHaveBeenCalledWith('expected argument')
  expect(result).toBe('mocked result')
})
```

### Mocking Browser APIs
```typescript
test('should interact with localStorage', () => {
  const mockGetItem = vi.fn().mockReturnValue('stored value')
  const mockSetItem = vi.fn()

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: mockGetItem,
      setItem: mockSetItem,
    },
    writable: true,
  })

  // Test code that uses localStorage

  expect(mockGetItem).toHaveBeenCalledWith('key')
  expect(mockSetItem).toHaveBeenCalledWith('key', 'value')
})
```

## Coverage Guidelines

### Coverage Targets
- **Statements**: 80% minimum
- **Branches**: 75% minimum
- **Functions**: 80% minimum
- **Lines**: 80% minimum

### What to Test
1. **Happy paths**: Normal usage scenarios
2. **Edge cases**: Boundary conditions and unusual inputs
3. **Error conditions**: How code handles failures
4. **Async operations**: Promise resolution/rejection
5. **Event handling**: User interactions and system events
6. **Cleanup**: Resource disposal and memory management

### Coverage Exclusions
Use coverage exclusions sparingly and only for:
- Development-only code
- Unreachable error conditions
- Type guards that TypeScript guarantees

```typescript
/* c8 ignore next 3 */
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info')
}
```

## Best Practices

### Do's
- ✅ Write descriptive test names
- ✅ Test one thing per test
- ✅ Use AAA pattern (Arrange-Act-Assert)
- ✅ Clean up resources (call `clear()` functions)
- ✅ Mock external dependencies
- ✅ Test error conditions
- ✅ Use `beforeEach`/`afterEach` for common setup/teardown
- ✅ Test async operations properly
- ✅ Verify event listener cleanup

### Don'ts
- ❌ Don't test implementation details
- ❌ Don't write overly complex tests
- ❌ Don't ignore flaky tests
- ❌ Don't forget to clean up DOM elements
- ❌ Don't test multiple behaviors in one test
- ❌ Don't use real timers for time-dependent tests
- ❌ Don't mock everything (test real integrations when possible)

### Performance Tips
- Use `vi.useFakeTimers()` for time-dependent tests
- Clean up DOM elements to prevent memory leaks
- Use `beforeEach`/`afterEach` for efficient setup/teardown
- Mock heavy operations and external APIs

### Debugging Tests
- Use `test.only()` to run single tests
- Add `console.log()` statements for debugging
- Use browser dev tools with `--inspect` flag
- Check coverage reports to find untested code paths

## Examples

See the existing test files for examples:
- `packages/tempots-std/test/` - Utility function testing
- `packages/tempots-dom/test/` - DOM component testing
- `packages/tempots-ui/test/` - UI component testing

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

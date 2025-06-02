# Tempo Standard Library (@tempots/std)

A comprehensive standard library for TypeScript that provides utility functions and types commonly used in web applications. This package serves as a natural complement to the Tempo libraries but can be used independently in any TypeScript project.

## Overview

The Tempo Standard Library fills the gaps in JavaScript's standard library with a collection of well-tested, type-safe utility functions. It follows functional programming principles and provides consistent APIs across all modules.

## Key Features

- **Zero Dependencies**: Lightweight with no external dependencies
- **Type Safe**: Full TypeScript support with comprehensive type definitions
- **Functional**: Immutable operations and functional programming patterns
- **Modular**: Import only what you need for optimal bundle size
- **Well Tested**: Comprehensive test coverage for reliability
- **Consistent APIs**: Uniform naming and parameter conventions

## Module Categories

### Data Manipulation
- **array**: Array operations (map, filter, reduce, unique, etc.)
- **object**: Object manipulation and transformation utilities
- **string**: String processing and formatting functions

### Async Operations
- **promise**: Promise utilities and helpers
- **deferred**: Promise deferral and cancellation
- **async-result**: Asynchronous result handling with error management

### Type Safety
- **result**: Result type for error handling without exceptions
- **validation**: Data validation and type checking utilities
- **domain**: Common domain types and type guards

### Utilities
- **function**: Function composition and manipulation
- **timer**: Timing utilities and delays
- **equal**: Deep equality comparison functions
- **json**: JSON parsing and serialization helpers

### Numeric Operations
- **number**: Number utilities and mathematical operations
- **bigint**: BigInt manipulation functions

## Design Principles

### Functional Programming
All functions are pure and side-effect free where possible:
```typescript
// Pure function - doesn't modify input
const doubled = mapArray([1, 2, 3], x => x * 2) // [2, 4, 6]

// Immutable operations
const filtered = filterArray(numbers, x => x > 5)
```

### Type Safety
Comprehensive TypeScript support with generic types:
```typescript
// Type-safe array operations
const strings: string[] = ['a', 'b', 'c']
const lengths: number[] = mapArray(strings, s => s.length)

// Result type for error handling
const result: Result<number, string> = parseNumber('42')
```

### Consistent APIs
Uniform parameter ordering and naming conventions:
```typescript
// Data first, function second pattern
mapArray(array, fn)
filterArray(array, predicate)
foldLeftArray(array, reducer, initial)
```

## Usage Patterns

### Error Handling with Result Type
```typescript
import { Result, success, failure } from '@tempots/std/result'

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return failure('Division by zero')
  }
  return success(a / b)
}

const result = divide(10, 2)
result.match({
  success: value => console.log(`Result: ${value}`),
  failure: error => console.error(`Error: ${error}`)
})
```

### Array Processing
```typescript
import { mapArray, filterArray, foldLeftArray } from '@tempots/std/array'

const numbers = [1, 2, 3, 4, 5]
const evenSquares = mapArray(
  filterArray(numbers, n => n % 2 === 0),
  n => n * n
) // [4, 16]

const sum = foldLeftArray(numbers, (acc, n) => acc + n, 0) // 15
```

### Async Operations
```typescript
import { deferred } from '@tempots/std/deferred'
import { delayed } from '@tempots/std/timer'

// Create a deferred promise
const { promise, resolve, reject } = deferred<string>()

// Delay execution
const cancel = delayed(() => resolve('Done!'), 1000)

// Use the promise
promise.then(value => console.log(value))
```

## Integration with Tempo

While @tempots/std can be used independently, it integrates seamlessly with Tempo:

```typescript
import { prop, computed } from '@tempots/dom'
import { mapArray, filterArray } from '@tempots/std'

const items = prop([1, 2, 3, 4, 5])
const evenItems = computed(() =>
  filterArray(items.value, n => n % 2 === 0)
)
const doubled = computed(() =>
  mapArray(evenItems.value, n => n * 2)
)
```

## Performance Considerations

- **Tree Shaking**: Import specific functions to minimize bundle size
- **Immutability**: Functions create new objects rather than mutating inputs
- **Lazy Evaluation**: Some operations support lazy evaluation patterns
- **Memory Efficiency**: Optimized algorithms for common operations

## Best Practices

1. **Import Specifically**: Import only the functions you need
   ```typescript
   import { mapArray } from '@tempots/std/array'
   // Instead of: import { mapArray } from '@tempots/std'
   ```

2. **Use Result Types**: Prefer Result types over throwing exceptions
   ```typescript
   // Good
   function parseNumber(str: string): Result<number, string>

   // Avoid
   function parseNumber(str: string): number // throws on error
   ```

3. **Compose Functions**: Build complex operations from simple functions
   ```typescript
   const processData = (data: string[]) =>
     mapArray(
       filterArray(data, s => s.length > 0),
       s => s.toUpperCase()
     )
   ```

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## Documentation

For detailed API documentation, see the [Tempo Documentation Site](https://tempo-ts.com/library/tempots-std.html).

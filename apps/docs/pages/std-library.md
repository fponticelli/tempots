---
title: Standard Library
order: 70
description: The @tempots/std library provides a set of utility functions and types commonly used in web applications.
---
# Standard Library (@tempots/std)

The `@tempots/std` package is a comprehensive standard library for TypeScript that provides utility functions and types commonly used in web applications. This package serves as a natural complement to the Tempo libraries but can be used independently in any TypeScript project.

## Installation

```bash
# npm
npm install @tempots/std

# yarn
yarn add @tempots/std

# pnpm
pnpm add @tempots/std
```

## Features

The library provides utility functions organized into several modules:

### Array Operations

```typescript
import { filterMapArray, uniqueByPrimitive, range, chunk, partition, groupBy } from '@tempots/std'

// Filter and map in one pass
const numbers = [1, 2, 3, 4, 5]
const evenDoubled = filterMapArray(numbers, n => n % 2 === 0 ? n * 2 : undefined) // [4, 8]

// Generate a range of numbers
const oneToFive = range(5, 1) // [1, 2, 3, 4, 5]

// Get unique values by a key extractor
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 1, name: 'Clone' }]
const uniqueUsers = uniqueByPrimitive(users, user => user.id) // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]

// Chunk an array into groups
const chunked = chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]

// Partition by predicate
const [evens, odds] = partition(numbers, n => n % 2 === 0) // [[2, 4], [1, 3, 5]]
```

### String Utilities

```typescript
import { capitalizeWords, ellipsis } from '@tempots/std'
// or
import { capitalizeWords, ellipsis } from '@tempots/std/string'

// Capitalize words
const capitalized = capitalizeWords('hello world') // 'Hello World'

// Truncate text with ellipsis (uses unicode ellipsis character)
const truncated = ellipsis('This is a long text', 10) // 'This is a…'
```

### Result Type

The `Result` type provides a way to handle operations that might fail:

```typescript
import { Result } from '@tempots/std'
// or
import { Result } from '@tempots/std/result'

// Create a success result
const success = Result.success(42)

// Create a failure result
const failure = Result.failure(new Error('Something went wrong'))

// Match on a result
const value = Result.match(
  success,
  value => `Success: ${value}`,
  error => `Error: ${error.message}`
) // 'Success: 42'
```

### AsyncResult Type

Similar to `Result`, but for asynchronous operations with loading states:

```typescript
import { AsyncResult } from '@tempots/std'

// Create from a promise
const asyncResult = await AsyncResult.ofPromise(
  fetch('https://api.example.com/data').then(r => r.json())
)

// Handle the result with pattern matching
AsyncResult.match(asyncResult, {
  success: data => console.log('Data:', data),
  failure: error => console.error('Error:', error),
  loading: () => console.log('Loading...'),
  notAsked: () => console.log('Not started')
})
```

## Available Modules

The library is organized into the following modules:

- `array` - Array manipulation utilities (filterMapArray, uniqueByPrimitive, range, chunk, partition, groupBy, etc.)
- `async-result` - Asynchronous result handling with loading states
- `bigint` - BigInt utilities
- `boolean` - Boolean utilities
- `date` - Date manipulation utilities
- `deferred` - Promise deferral utilities
- `domain` - Domain-specific types (Maybe, Nothing, Compare, etc.)
- `equal` - Deep equality comparison
- `function` - Function composition and manipulation
- `iterator` - Iterator utilities (take, skip, filter, map, reduce, find, etc.)
- `json` - JSON utilities
- `map` - Map utilities (mapFromEntries, mapFilter, mapMerge, mapGroupBy, etc.)
- `number` - Number utilities
- `object` - Object manipulation
- `promise` - Promise utilities
- `random` - Random value generation
- `regexp` - Regular expression utilities
- `result` - Result type for error handling
- `set` - Set utilities (setUnion, setIntersection, setDifference, etc.)
- `string` - String manipulation utilities (80+ functions)
- `timer` - Timing utilities (delayed, interval, throttle, debounce)
- `union` - Union type utilities
- `url` - URL/path utilities (parseUrl, buildUrl, joinPaths, etc.)
- `validation` - Data validation utilities

## Next Steps

- [Learn more about the UI components library](/page/ui-components.html)
- [Learn more about render](/page/render.html)

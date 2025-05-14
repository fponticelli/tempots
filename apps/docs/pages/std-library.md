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
import { filterArray, mapArray, uniquePrimitives } from '@tempots/std'
// or
import { filterArray, mapArray, uniquePrimitives } from '@tempots/std/array'

// Filter an array
const numbers = [1, 2, 3, 4, 5]
const evenNumbers = filterArray(numbers, n => n % 2 === 0) // [2, 4]

// Map an array
const doubled = mapArray(numbers, n => n * 2) // [2, 4, 6, 8, 10]

// Get unique values
const withDuplicates = [1, 2, 2, 3, 3, 3]
const unique = uniquePrimitives(withDuplicates) // [1, 2, 3]
```

### String Utilities

```typescript
import { capitalizeWords, ellipsis } from '@tempots/std'
// or
import { capitalizeWords, ellipsis } from '@tempots/std/string'

// Capitalize words
const capitalized = capitalizeWords('hello world') // 'Hello World'

// Truncate text with ellipsis
const truncated = ellipsis('This is a long text', 10) // 'This is a...'
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

Similar to `Result`, but for asynchronous operations:

```typescript
import { AsyncResult } from '@tempots/std'
// or
import { AsyncResult } from '@tempots/std/async-result'

// Create from a promise
const asyncResult = AsyncResult.fromPromise(
  fetch('https://api.example.com/data').then(r => r.json())
)

// Handle the result
asyncResult.match(
  data => console.log('Data:', data),
  error => console.error('Error:', error)
)
```

## Available Modules

The library is organized into the following modules:

- `array` - Array manipulation utilities
- `async-result` - Asynchronous result handling
- `bigint` - BigInt utilities
- `boolean` - Boolean utilities
- `deferred` - Promise deferral utilities
- `domain` - Domain-specific types
- `equal` - Deep equality comparison
- `error` - Error handling utilities
- `function` - Function composition and manipulation
- `json` - JSON utilities
- `number` - Number utilities
- `object` - Object manipulation
- `promise` - Promise utilities
- `regexp` - Regular expression utilities
- `result` - Result type for error handling
- `string` - String manipulation utilities
- `timer` - Timing utilities
- `validation` - Data validation utilities

## Next Steps

- [Learn more about the UI components library](/page/ui-components.html)
- [Learn more about render](/page/render.html)

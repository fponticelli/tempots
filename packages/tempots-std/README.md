# Tempo Standard Library (@tempots/std)

A comprehensive standard library for TypeScript that provides utility functions and types commonly used in web applications. This package serves as a natural complement to the Tempo libraries but can be used independently in any TypeScript project.

[![npm version](https://img.shields.io/npm/v/@tempots/std.svg)](https://www.npmjs.com/package/@tempots/std)
[![license](https://img.shields.io/npm/l/@tempots/std.svg)](https://github.com/fponticelli/tempots/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/fponticelli/tempots/branch/main/graph/badge.svg)](https://codecov.io/gh/fponticelli/tempots)
[![CI](https://github.com/fponticelli/tempots/workflows/CI/badge.svg)](https://github.com/fponticelli/tempots/actions)

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

The library provides utility functions for working with:

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

// Truncate with ellipsis
const truncated = ellipsis('This is a very long text', 10) // 'This is a...'
```

### Async Utilities

```typescript
import { deferred } from '@tempots/std'
// or
import { deferred } from '@tempots/std/deferred'

// Create a deferred promise
const { promise, resolve, reject } = deferred<number>()

// Use the promise
promise.then(value => console.log(value))

// Resolve it later
setTimeout(() => resolve(42), 1000)
```

### Timer Functions

```typescript
import { delayed, interval } from '@tempots/std'
// or
import { delayed, interval } from '@tempots/std/timer'

// Delay execution
const cancelDelay = delayed(() => {
  console.log('Executed after 1 second')
}, 1000)

// Set up an interval
const cancelInterval = interval(() => {
  console.log('Executed every 2 seconds')
}, 2000)

// Cancel if needed
cancelDelay() // Cancel the delayed execution
cancelInterval() // Stop the interval
```

### Result and Validation

```typescript
import { Result, success, failure } from '@tempots/std'
// or
import { Result, success, failure } from '@tempots/std/result'

// Create success or failure results
const successResult = success(42)
const failureResult = failure('Something went wrong')

// Handle results
successResult.match({
  success: value => console.log(`Success: ${value}`),
  failure: error => console.error(`Error: ${error}`)
})
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

## Documentation

For comprehensive documentation, visit the [Tempo Documentation Site](https://tempo-ts.com/library/tempots-std.html).

## License

This package is licensed under the Apache License 2.0.

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
import {
  filterMapArray,
  uniqueByPrimitive,
  range,
  chunk,
  partition,
  groupBy,
} from '@tempots/std'

// Filter and map in one pass
const numbers = [1, 2, 3, 4, 5]
const evenDoubled = filterMapArray(numbers, n =>
  n % 2 === 0 ? n * 2 : undefined
) // [4, 8]

// Generate a range of numbers
const oneToFive = range(5, 1) // [1, 2, 3, 4, 5]

// Get unique values by a key extractor
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Clone' },
]
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
  notAsked: () => console.log('Not started'),
})
```

### Validation Type

The `Validation` type is useful for form validation and data checking. It represents either a valid state or an invalid state with an error:

```typescript
import { Validation } from '@tempots/std'

// Define validation rules
const validateEmail = (email: string): Validation<string> => {
  if (!email.includes('@')) {
    return Validation.invalid('Email must contain @')
  }
  if (email.length < 5) {
    return Validation.invalid('Email too short')
  }
  return Validation.valid
}

const validateAge = (age: number): Validation<string> => {
  if (age < 0) return Validation.invalid('Age cannot be negative')
  if (age > 150) return Validation.invalid('Age seems unrealistic')
  return Validation.valid
}

// Use validation
const emailResult = validateEmail('user@example.com')

// Pattern matching
Validation.match(
  emailResult,
  () => console.log('Email is valid!'),
  error => console.log('Invalid:', error)
)

// Type guards
if (Validation.isValid(emailResult)) {
  console.log('Proceed with valid email')
}

if (Validation.isInvalid(emailResult)) {
  console.log('Error:', emailResult.error)
}

// Execute side effects conditionally
Validation.whenValid(emailResult, () => {
  submitForm()
})

Validation.whenInvalid(emailResult, error => {
  showError(error)
})

// Convert to Result type for further processing
const result = Validation.toResult(emailResult, 'user@example.com')
```

**Form Validation Example with Tempo:**

```typescript
import { html, prop } from '@tempots/dom'
import { Validation } from '@tempots/std'

const email = prop('')
const emailError = email.map(value => {
  const validation = validateEmail(value)
  return Validation.isInvalid(validation) ? validation.error : null
})

html.form(
  html.input(
    attr.type('email'),
    attr.value(email),
    on.input(emitValue(email.set)) // Use prop.set directly
  ),
  Ensure(emailError, error => html.span(attr.class('error'), error))
)
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

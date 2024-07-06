/*
Copyright 2019 Google LLC
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { describe, expect, test } from 'vitest'
import { applyOperations, DiffOperations, diffOperations } from '../src/arrays'
import { map, head, tail, numbersRange, fill, makeCompare } from '../src/arrays'
import { compare as compareString } from '../src/strings'

describe('arrays:map', () => {
  test('should work with empty arrays', () => {
    expect(map([], a => a)).toEqual([])
  })

  test('should work with any array', () => {
    expect(map([1, 2, 3], a => a + 1)).toEqual([2, 3, 4])
  })
})

describe('arrays:head', () => {
  test('should return nothing if the array is empy', () => {
    expect(head([])).not.toBeDefined()
  })

  test('should return the first element', () => {
    expect(head([1])).toEqual(1)
    expect(head([1, 2])).toEqual(1)
    expect(head([1, 2, 3])).toEqual(1)
  })
})

describe('arrays:tail', () => {
  test('should return nothing if the array is empy', () => {
    expect(tail([])).toEqual([])
  })

  test('should return all the elements except for the first', () => {
    expect(tail([1])).toEqual([])
    expect(tail([1, 2])).toEqual([2])
    expect(tail([1, 2, 3])).toEqual([2, 3])
  })
})

describe('arrays', () => {
  test('numberRange', () => {
    expect(numbersRange(4)).toEqual([0, 1, 2, 3])
    expect(numbersRange(4, 1)).toEqual([1, 2, 3, 4])
  })

  test('fill', () => {
    expect(fill(4, 'x')).toEqual(['x', 'x', 'x', 'x'])
  })
})

describe('arrays:makeCompare', () => {
  test('should compare arrays of the same length', () => {
    const tests = [
      { a: ['a'], b: ['b'], r: -1 },
      { a: ['b'], b: ['a'], r: 1 },
      { a: ['a'], b: ['a'], r: 0 },
      { a: ['a', 'b'], b: ['a', 'b'], r: 0 }
    ]

    const compare = makeCompare(compareString, true)
    tests.forEach(test => {
      expect(compare(test.a, test.b)).toBe(test.r)
    })
  })

  test('should compare arrays with different lengths', () => {
    const tests = [
      { a: [], b: ['a'], r: -1 },
      { a: ['a'], b: [], r: 1 },
      { a: ['a'], b: ['a', 'b'], r: -1 },
      { a: ['b'], b: ['a', 'b'], r: -1 },
      { a: ['b', 'b'], b: ['a', 'b', 'c'], r: -1 }
    ]

    let compare = makeCompare(compareString, true)
    tests.forEach(test => {
      expect(compare(test.a, test.b)).toBe(test.r)
    })

    compare = makeCompare(compareString, false)
    tests.forEach(test => {
      expect(compare(test.a, test.b)).toBe(test.r * -1)
    })
  })
})

const cases: Array<{
  a: string[]
  b: string[]
  operations: DiffOperations<string>
}> = [
  {
    a: [],
    b: [],
    operations: {
      removals: [],
      swaps: [],
      inserts: []
    }
  },
  {
    a: ['a'],
    b: ['a'],
    operations: {
      removals: [],
      swaps: [],
      inserts: []
    }
  },
  {
    a: ['a'],
    b: ['b'],
    operations: {
      removals: [{ at: 0, qt: 1 }],
      swaps: [],
      inserts: [{ at: 0, values: ['b'] }]
    }
  },
  {
    a: ['a', 'b', 'c'],
    b: ['b'],
    operations: {
      removals: [
        { at: 2, qt: 1 },
        { at: 0, qt: 1 }
      ],
      swaps: [],
      inserts: []
    }
  },
  {
    a: ['a', 'b', 'c'],
    b: ['d'],
    operations: {
      removals: [{ at: 0, qt: 3 }],
      swaps: [],
      inserts: [{ at: 0, values: ['d'] }]
    }
  },
  {
    a: ['a', 'b', 'c', 'd'],
    b: ['a', 'd'],
    operations: {
      removals: [{ at: 1, qt: 2 }],
      swaps: [],
      inserts: []
    }
  },
  {
    a: ['a', 'b', 'c', 'd'],
    b: ['x', 'd'],
    operations: {
      removals: [{ at: 0, qt: 3 }],
      swaps: [],
      inserts: [{ at: 0, values: ['x'] }]
    }
  },
  {
    a: ['a', 'b', 'c', 'd'],
    b: ['x', 'b', 'y', 'd'],
    operations: {
      removals: [
        { at: 2, qt: 1 },
        { at: 0, qt: 1 }
      ],
      swaps: [],
      inserts: [
        { at: 0, values: ['x'] },
        { at: 2, values: ['y'] }
      ]
    }
  },
  {
    a: ['b'],
    b: ['a', 'b', 'c'],
    operations: {
      removals: [],
      swaps: [],
      inserts: [
        { at: 0, values: ['a'] },
        { at: 2, values: ['c'] }
      ]
    }
  },
  {
    a: ['d'],
    b: ['a', 'b', 'c'],
    operations: {
      removals: [{ at: 0, qt: 1 }],
      swaps: [],
      inserts: [{ at: 0, values: ['a', 'b', 'c'] }]
    }
  },
  {
    a: ['a', 'd'],
    b: ['a', 'b', 'c', 'd'],
    operations: {
      removals: [],
      swaps: [],
      inserts: [{ at: 1, values: ['b', 'c'] }]
    }
  },
  {
    a: ['x', 'd'],
    b: ['a', 'b', 'c', 'd'],
    operations: {
      removals: [{ at: 0, qt: 1 }],
      swaps: [],
      inserts: [{ at: 0, values: ['a', 'b', 'c'] }]
    }
  },
  {
    a: ['a', 'b', 'c', 'd', 'e'],
    b: ['b', 'x', 'd'],
    operations: {
      removals: [
        { at: 4, qt: 1 },
        { at: 2, qt: 1 },
        { at: 0, qt: 1 }
      ],
      swaps: [],
      inserts: [{ at: 1, values: ['x'] }]
    }
  },
  {
    a: ['b', 'x', 'd'],
    b: ['a', 'b', 'c', 'd', 'e'],
    operations: {
      removals: [{ at: 1, qt: 1 }],
      swaps: [],
      inserts: [
        { at: 0, values: ['a'] },
        { at: 2, values: ['c'] },
        { at: 4, values: ['e'] }
      ]
    }
  },
  {
    a: ['a', 'b', 'c'],
    b: ['c', 'b', 'a'],
    operations: {
      removals: [],
      swaps: [{ from: 0, to: 2 }],
      inserts: []
    }
  },
  {
    a: ['a', 'b', 'c'],
    b: ['c', 'x', 'b', 'a'],
    operations: {
      removals: [],
      swaps: [{ from: 0, to: 2 }],
      inserts: [{ at: 1, values: ['x'] }]
    }
  },
  {
    a: ['c', 'x', 'b', 'a'],
    b: ['a', 'b', 'c'],
    operations: {
      removals: [{ at: 1, qt: 1 }],
      swaps: [{ from: 0, to: 2 }],
      inserts: []
    }
  },
  {
    a: ['a', 'b', 'c', 'x'],
    b: ['c', 'x', 'y', 'z', 'a', 'b'],
    operations: {
      removals: [],
      swaps: [
        { from: 0, to: 2 },
        { from: 1, to: 3 }
      ],
      inserts: [{ at: 2, values: ['y', 'z'] }]
    }
  },
  {
    a: ['c', 'x', 'y', 'z', 'a', 'b'],
    b: ['a', 'b', 'c', 'x'],
    operations: {
      removals: [{ at: 2, qt: 2 }],
      swaps: [
        { from: 0, to: 2 },
        { from: 1, to: 3 }
      ],
      inserts: []
    }
  }
]

const js = JSON.stringify

describe('array helpers', () => {
  test(`diffOperations`, () => {
    for (const { a, b, operations } of cases) {
      const res = diffOperations(a, b, v => v)
      try {
        expect(res).toEqual(operations)
      } catch {
        throw new Error(
          `Expected ${js(a)} and ${js(b)} to produce\n${js(
            operations
          )}\nbut got\n${js(res)} instead`
        )
      }
    }
  })

  test(`applyOperations`, () => {
    for (const { a, b, operations } of cases) {
      const res = applyOperations(operations, a)
      try {
        expect(res).toEqual(b)
      } catch {
        throw new Error(
          `Expected ${js(operations)} applied to ${js(a)} to produce\n${js(
            b
          )}\nbut got\n${js(res)} instead`
        )
      }
    }
  })

  const roundtrips: [string[], string[]][] = [
    [[], []],
    [['a'], ['b']],
    [['a', 'b'], ['b']],
    [['a', 'b'], ['x']],
    [['a', 'b', 'c'], ['b']],
    [['a', 'b', 'c'], ['c']],
    [['a', 'b', 'c'], ['x']],
    [['a', 'b', 'c'], ['a']],
    [
      ['a', 'b', 'c'],
      ['c', 'b']
    ],
    [
      ['a', 'b', 'c'],
      ['c', 'a']
    ],
    [
      ['a', 'b', 'c'],
      ['a', 'b']
    ],
    [
      ['a', 'b', 'c'],
      ['a', 'b', 'c']
    ],
    [
      ['a', 'b', 'c'],
      ['c', 'b', 'a']
    ],
    [
      ['a', 'b', 'c'],
      ['a', 'c', 'b']
    ],
    [
      ['a', 'b', 'c'],
      ['b', 'c', 'a']
    ],
    [
      ['a', 'b', 'c'],
      ['a', 'b', 'c', 'd', 'e', 'f']
    ],
    [
      ['c', 'a', 'b'],
      ['a', 'b', 'c']
    ]
  ]

  test(`diffOperations and applyOperations roundtrips`, () => {
    for (const [a, b] of roundtrips) {
      const ops = diffOperations(a, b, v => v)
      const res = applyOperations(ops, a)
      try {
        expect(res).toEqual(b)
      } catch {
        throw new Error(
          `${js(a)} and ${js(b)} produced ${js(ops)} but generated ${js(res)}`
        )
      }
    }

    for (const [b, a] of roundtrips) {
      const ops = diffOperations(a, b, v => v)
      const res = applyOperations(ops, a)
      try {
        expect(res).toEqual(b)
      } catch {
        throw new Error(
          `Swapped ${js(a)} and ${js(b)} produced ${js(ops)} but generated ${js(
            res
          )}`
        )
      }
    }
  })
})

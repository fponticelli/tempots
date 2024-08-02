import { describe, expect, test } from "vitest";
import { anyElement, applyArrayDiffOperations, areArraysEqual, arrayDiffOperations, ArrayDiffOperations, arrayHasValues, arrayHead, arrayOfIterableIterator, arrayTail, compareArrays, concatArrays, createFilledArray, filterArray, filterMapArray, filterNullsFromArray, flatMapArray, flattenArray, foldLeftArray, forEachElement, generateSequenceArray, isArrayEmpty, joinArrayWithConjunction, mapArray, rankArray, removeOneFromArray, removeOneFromArrayByPredicate, sortArray, uniqueByPrimitive, uniquePrimitives } from "../src/array";
import { compareStrings } from "../src/string";

describe('arrays:mapArray', () => {
  test('should work with empty arrays', () => {
    expect(mapArray([], a => a)).toEqual([])
  })

  test('should work with any array', () => {
    expect(mapArray([1, 2, 3], a => a + 1)).toEqual([2, 3, 4])
  })
})

describe('arrays:filterMapArray', () => {
  test('should work with empty arrays', () => {
    expect(filterMapArray([], a => a)).toEqual([])
  })
  test('should work with any array', () => {
    expect(filterMapArray([1, 2, 3], a => a + 1)).toEqual([2, 3, 4])
  })
  test('should work with null values', () => {
    expect(filterMapArray([1, 2, 3], a => a === 2 ? null : a + 1)).toEqual([2, 4])
  })
})

describe('arrays:flatMapArray', () => {
  test('should work with empty arrays', () => {
    expect(flatMapArray([], a => a)).toEqual([])
  })
  test('should work with any array', () => {
    expect(flatMapArray([1, 2, 3], a => [a, a + 1])).toEqual([1, 2, 2, 3, 3, 4])
  })
})

describe('arrays:areArraysEqual', () => {
  test('should work with empty arrays', () => {
    expect(areArraysEqual([], [], (a, b) => a === b)).toBe(true)
  })
  test('should work with any array', () => {
    expect(areArraysEqual([1, 2, 3], [1, 2], (a, b) => a === b)).toBe(false)
    expect(areArraysEqual([1, 2, 3], [1, 2, 3], (a, b) => a === b)).toBe(true)
    expect(areArraysEqual([1, 2, 3], [1, 2, 4], (a, b) => a === b)).toBe(false)
  })
})

describe('arrays:isArrayEmpty', () => {
  test('should work with empty arrays', () => {
    expect(isArrayEmpty([])).toBe(true)
  })
  test('should work with any array', () => {
    expect(isArrayEmpty([1, 2, 3])).toBe(false)
  })
})

describe('arrays:arrayHasValues', () => {
  test('should work with empty arrays', () => {
    expect(arrayHasValues([])).toBe(false)
  })
  test('should work with any array', () => {
    expect(arrayHasValues([1, 2, 3])).toBe(true)
  })
})

describe('arrays:filterArray', () => {
  test('should work with empty arrays', () => {
    expect(filterArray([], a => a != 1)).toEqual([])
  })
  test('should work with any array', () => {
    expect(filterArray([1, 2, 3], a => a != 1)).toEqual([2, 3])
  })
})

describe('arrays:filterNullsFromArray', () => {
  test('should work with empty arrays', () => {
    expect(filterNullsFromArray([])).toEqual([])
  })
  test('should work with any array', () => {
    expect(filterNullsFromArray([1, 2, 3])).toEqual([1, 2, 3])
    expect(filterNullsFromArray([1, null, 3])).toEqual([1, 3])
  })
})

describe('arrays:flattenArray', () => {
  test('should work with empty arrays', () => {
    expect(flattenArray([])).toEqual([])
    expect(flattenArray([[], []])).toEqual([])
  })
  test('should work with any array', () => {
    expect(flattenArray([[1, 2], [3]])).toEqual([1, 2, 3])
    expect(flattenArray([[1], [2, 3]])).toEqual([1, 2, 3])
  })
})

describe('arrays:arrayHead', () => {
  test('should return nothing if the array is empy', () => {
    expect(arrayHead([])).not.toBeDefined()
  })

  test('should return the first element', () => {
    expect(arrayHead([1])).toEqual(1)
    expect(arrayHead([1, 2])).toEqual(1)
    expect(arrayHead([1, 2, 3])).toEqual(1)
  })
})

describe('arrays:arrayTail', () => {
  test('should return nothing if the array is empy', () => {
    expect(arrayTail([])).toEqual([])
  })

  test('should return all the elements except for the first', () => {
    expect(arrayTail([1])).toEqual([])
    expect(arrayTail([1, 2])).toEqual([2])
    expect(arrayTail([1, 2, 3])).toEqual([2, 3])
  })
})

describe('arrays', () => {
  test('generateSequenceArray', () => {
    expect(generateSequenceArray(4)).toEqual([0, 1, 2, 3])
    expect(generateSequenceArray(4, 1)).toEqual([1, 2, 3, 4])
  })

  test('createFilledArray', () => {
    expect(createFilledArray(4, 'x')).toEqual(['x', 'x', 'x', 'x'])
  })
})

describe('arrays:joinArrayWithConjunction', () => {
  test('should work with empty arrays', () => {
    expect(joinArrayWithConjunction([], 'and')).toEqual('')
  })
  test('should work with arrays with one element', () => {
    expect(joinArrayWithConjunction(['a'])).toEqual('a')
  })
  test('should work with arrays with two elements', () => {
    expect(joinArrayWithConjunction(['a', 'b'])).toEqual('a and b')
  })
  test('should work with arrays with more than two elements', () => {
    expect(joinArrayWithConjunction(['a', 'b', 'c'])).toEqual('a, b and c')
  })

  test('should work with arrays with one element (or)', () => {
    expect(joinArrayWithConjunction(['a'], ' or ')).toEqual('a')
  })
  test('should work with arrays with two elements (or)', () => {
    expect(joinArrayWithConjunction(['a', 'b'], ' or ')).toEqual('a or b')
  })
  test('should work with arrays with more than two elements (or)', () => {
    expect(joinArrayWithConjunction(['a', 'b', 'c'], ' or ')).toEqual('a, b or c')
  })
})

describe('arrays:removeOneFromArray', () => {
  test('should work with empty arrays', () => {
    const arr: number[] = []
    expect(removeOneFromArray(arr, 1)).toEqual(false)
    expect(arr).toEqual([])
  })
  test('should work with any array', () => {
    const arr = [1, 2, 3]
    expect(removeOneFromArray(arr, 1)).toEqual(true)
    expect(arr).toEqual([2, 3])
  })
  test('should work with any array (not found)', () => {
    const arr = [1, 2, 3]
    expect(removeOneFromArray(arr, 4)).toEqual(false)
    expect(arr).toEqual([1, 2, 3])
  })
  test('should work with any array (multiple)', () => {
    const arr = [1, 2, 3, 2]
    expect(removeOneFromArray(arr, 2)).toEqual(true)
    expect(arr).toEqual([1, 3, 2])
  })
})

describe('arrays:removeOneFromArrayByPredicate', () => {
  test('should work with empty arrays', () => {
    const arr: number[] = []
    expect(removeOneFromArrayByPredicate(arr, a => a == 1)).toEqual(false)
    expect(arr).toEqual([])
  })
  test('should work with any array', () => {
    const arr = [1, 2, 3]
    expect(removeOneFromArrayByPredicate(arr, a => a == 1)).toEqual(true)
    expect(arr).toEqual([2, 3])
  })
  test('should work with any array (not found)', () => {
    const arr = [1, 2, 3]
    expect(removeOneFromArrayByPredicate(arr, a => a == 4)).toEqual(false)
    expect(arr).toEqual([1, 2, 3])
  })
  test('should work with any array (multiple)', () => {
    const arr = [1, 2, 3, 2]
    expect(removeOneFromArrayByPredicate(arr, a => a == 2)).toEqual(true)
    expect(arr).toEqual([1, 3, 2])
  })
})

describe('arrays:compareArrays', () => {
  test('should compare arrays of the same length', () => {
    const tests = [
      { a: ['a'], b: ['b'], r: -1 },
      { a: ['b'], b: ['a'], r: 1 },
      { a: ['a'], b: ['a'], r: 0 },
      { a: ['a', 'b'], b: ['a', 'b'], r: 0 }
    ]

    tests.forEach(test => {
      expect(compareArrays(test.a, test.b, compareStrings)).toBe(test.r)
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

    tests.forEach(test => {
      expect(compareArrays(test.a, test.b, compareStrings, true)).toBe(test.r)
    })

    tests.forEach(test => {
      expect(compareArrays(test.a, test.b, compareStrings, false)).toBe(test.r * -1)
    })
  })

  test('should compare arrays with different lengths (empty)', () => {
    const tests = [
      { a: [], b: [], r: 0 },
      { a: [], b: ['a'], r: -1 },
      { a: ['a'], b: [], r: 1 }
    ]

    tests.forEach(test => {
      expect(compareArrays(test.a, test.b, compareStrings)).toBe(test.r)
    })
  })
})

describe('arrays:sort', () => {
  test('should sort arrays', () => {
    expect(sortArray(["3", "2", "1"], compareStrings)).toEqual(["1", "2", "3"])
  })
})

describe('arrays:uniquePrimitives', () => {
  test('should work with empty arrays', () => {
    expect(uniquePrimitives([])).toEqual([])
  })
  test('should work with any array', () => {
    expect(uniquePrimitives([1, 2, 3, 2])).toEqual([1, 2, 3])
  })
})

describe('arrays:uniqueByPrimitive', () => {
  test('should work with empty arrays', () => {
    expect(uniqueByPrimitive([], a => a)).toEqual([])
  })
  test('should work with any array', () => {
    expect(uniqueByPrimitive([1, 2, 3, 2], String)).toEqual([1, 2, 3])
  })
})

describe('arrays:arrayOfIterableIterator', () => {
  test('should work with empty arrays', () => {
    expect(arrayOfIterableIterator(new Set().entries())).toEqual([])
  })
  test('should work with any array', () => {
    expect(arrayOfIterableIterator(new Set([1, 2, 3]).entries())).toEqual([[1, 1], [2, 2], [3, 3]])
  })
})

describe('arrays:foldLeftArray', () => {
  test('should work with empty arrays', () => {
    expect(foldLeftArray([], (a, b) => a + b, 0)).toBe(0)
  })
  test('should work with any array', () => {
    expect(foldLeftArray([1, 2, 3], (a, b) => a + b, 0)).toBe(6)
  })
})

describe('arrays:anyElement', () => {
  test('should work with empty arrays', () => {
    expect(anyElement([], a => a == 1)).toBe(false)
  })
  test('should work with any array', () => {
    expect(anyElement([1, 2, 3], a => a == 1)).toBe(true)
  })
  test('should work with any array (not found)', () => {
    expect(anyElement([1, 2, 3], a => a == 4)).toBe(false)
  })
})

describe('arrays:forEachElement', () => {
  test('should work with empty arrays', () => {
    const arr: number[] = []
    forEachElement(arr, a => a + 1)
    expect(arr).toEqual([])
  })
  test('should work with any array', () => {
    const arr = [1, 2, 3]
    forEachElement(arr, a => a + 1)
    expect(arr).toEqual([1, 2, 3])
  })
})

describe('arrays:concatArrays', () => {
  test('should work with empty arrays', () => {
    expect(concatArrays([], [])).toEqual([])
  })
  test('should work with any array', () => {
    expect(concatArrays([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6])
  })
})

const cases: Array<{
  a: string[]
  b: string[]
  operations: ArrayDiffOperations<string>
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
  test('arrayDiffOperations', () => {
    for (const { a, b, operations } of cases) {
      const res = arrayDiffOperations(a, b, v => v)
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

  test('applyArrayDiffOperations', () => {
    for (const { a, b, operations } of cases) {
      const res = applyArrayDiffOperations(operations, a)
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

  const roundtrips: Array<[string[], string[]]> = [
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

  test('arrayDiffOperations and applyArrayDiffOperations roundtrips', () => {
    for (const [a, b] of roundtrips) {
      const ops = arrayDiffOperations(a, b, v => v)
      const res = applyArrayDiffOperations(ops, a)
      try {
        expect(res).toEqual(b)
      } catch {
        throw new Error(
          `${js(a)} and ${js(b)} produced ${js(ops)} but generated ${js(res)}`
        )
      }
    }

    for (const [b, a] of roundtrips) {
      const ops = arrayDiffOperations(a, b, v => v)
      const res = applyArrayDiffOperations(ops, a)
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

  test('rankArray', () => {
    const a = ['c', 'a', 'b']
    const ranked = rankArray(a, (a, b) => a > b ? 1 : a < b ? -1 : 0)
    expect(ranked).toEqual([2, 0, 1])
  })
})

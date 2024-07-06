import { describe, expect, test } from "vitest";
import { applyOperations, type DiffOperations, diffOperations, map, head, isEmpty, tail, numbersRange, fill, makeCompare, mapNotNull, flatMap, equals, makeEquals, hasValues, filter, filterNulls, flatten, joinWithConjunction, remove, removeByPredicate, foldLeft, any, each, concat, sort, distinctPrimitive, distinctByPredicate, ofIterableIterator, rank } from '../src/array'
import { compare as compareString } from '../src/string'

describe('arrays:map', () => {
  test('should work with empty arrays', () => {
    expect(map([], a => a)).toEqual([])
  })

  test('should work with any array', () => {
    expect(map([1, 2, 3], a => a + 1)).toEqual([2, 3, 4])
  })
})

describe('arrays:mapNotNull', () => {
  test('should work with empty arrays', () => {
    expect(mapNotNull([], a => a)).toEqual([])
  })
  test('should work with any array', () => {
    expect(mapNotNull([1, 2, 3], a => a + 1)).toEqual([2, 3, 4])
  })
  test('should work with null values', () => {
    expect(mapNotNull([1, 2, 3], a => a === 2 ? null : a + 1)).toEqual([2, 4])
  })
})

describe('arrays:flatMap', () => {
  test('should work with empty arrays', () => {
    expect(flatMap([], a => a)).toEqual([])
  })
  test('should work with any array', () => {
    expect(flatMap([1, 2, 3], a => [a, a + 1])).toEqual([1, 2, 2, 3, 3, 4])
  })
})

describe('arrays:equals', () => {
  test('should work with empty arrays', () => {
    expect(equals([], [], (a, b) => a === b)).toBe(true)
  })
  test('should work with any array', () => {
    expect(equals([1, 2, 3], [1, 2], (a, b) => a === b)).toBe(false)
    expect(equals([1, 2, 3], [1, 2, 3], (a, b) => a === b)).toBe(true)
    expect(equals([1, 2, 3], [1, 2, 4], (a, b) => a === b)).toBe(false)
  })
})

describe('arrays:makeEquals', () => {
  test('should work with empty arrays', () => {
    expect(makeEquals((a, b) => a === b)([], [])).toBe(true)
  })
  test('should work with any array', () => {
    expect(makeEquals((a, b) => a === b)([1, 2, 3], [1, 2])).toBe(false)
    expect(makeEquals((a, b) => a === b)([1, 2, 3], [1, 2, 3])).toBe(true)
    expect(makeEquals((a, b) => a === b)([1, 2, 3], [1, 2, 4])).toBe(false)
  })
})

describe('arrays:isEmpty', () => {
  test('should work with empty arrays', () => {
    expect(isEmpty([])).toBe(true)
  })
  test('should work with any array', () => {
    expect(isEmpty([1, 2, 3])).toBe(false)
  })
})

describe('arrays:hasValues', () => {
  test('should work with empty arrays', () => {
    expect(hasValues([])).toBe(false)
  })
  test('should work with any array', () => {
    expect(hasValues([1, 2, 3])).toBe(true)
  })
})

describe('arrays:filter', () => {
  test('should work with empty arrays', () => {
    expect(filter([], a => a != 1)).toEqual([])
  })
  test('should work with any array', () => {
    expect(filter([1, 2, 3], a => a != 1)).toEqual([2, 3])
  })
})

describe('arrays:filterNulls', () => {
  test('should work with empty arrays', () => {
    expect(filterNulls([])).toEqual([])
  })
  test('should work with any array', () => {
    expect(filterNulls([1, 2, 3])).toEqual([1, 2, 3])
    expect(filterNulls([1, null, 3])).toEqual([1, 3])
  })
})

describe('arrays:flatten', () => {
  test('should work with empty arrays', () => {
    expect(flatten([])).toEqual([])
    expect(flatten([[], []])).toEqual([])
  })
  test('should work with any array', () => {
    expect(flatten([[1, 2], [3]])).toEqual([1, 2, 3])
    expect(flatten([[1], [2, 3]])).toEqual([1, 2, 3])
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

describe('arrays:joinWithConjuction', () => {
  test('should work with empty arrays', () => {
    expect(joinWithConjunction([], 'and')).toEqual('')
  })
  test('should work with arrays with one element', () => {
    expect(joinWithConjunction(['a'])).toEqual('a')
  })
  test('should work with arrays with two elements', () => {
    expect(joinWithConjunction(['a', 'b'])).toEqual('a and b')
  })
  test('should work with arrays with more than two elements', () => {
    expect(joinWithConjunction(['a', 'b', 'c'])).toEqual('a, b and c')
  })

  test('should work with arrays with one element (or)', () => {
    expect(joinWithConjunction(['a'], ' or ')).toEqual('a')
  })
  test('should work with arrays with two elements (or)', () => {
    expect(joinWithConjunction(['a', 'b'], ' or ')).toEqual('a or b')
  })
  test('should work with arrays with more than two elements (or)', () => {
    expect(joinWithConjunction(['a', 'b', 'c'], ' or ')).toEqual('a, b or c')
  })
})

describe('arrays:remove', () => {
  test('should work with empty arrays', () => {
    const arr: number[] = []
    expect(remove(arr, 1)).toEqual(false)
    expect(arr).toEqual([])
  })
  test('should work with any array', () => {
    const arr = [1, 2, 3]
    expect(remove(arr, 1)).toEqual(true)
    expect(arr).toEqual([2, 3])
  })
  test('should work with any array (not found)', () => {
    const arr = [1, 2, 3]
    expect(remove(arr, 4)).toEqual(false)
    expect(arr).toEqual([1, 2, 3])
  })
  test('should work with any array (multiple)', () => {
    const arr = [1, 2, 3, 2]
    expect(remove(arr, 2)).toEqual(true)
    expect(arr).toEqual([1, 3, 2])
  })
})

describe('arrays:removeByPredicate', () => {
  test('should work with empty arrays', () => {
    const arr: number[] = []
    expect(removeByPredicate(arr, a => a == 1)).toEqual(false)
    expect(arr).toEqual([])
  })
  test('should work with any array', () => {
    const arr = [1, 2, 3]
    expect(removeByPredicate(arr, a => a == 1)).toEqual(true)
    expect(arr).toEqual([2, 3])
  })
  test('should work with any array (not found)', () => {
    const arr = [1, 2, 3]
    expect(removeByPredicate(arr, a => a == 4)).toEqual(false)
    expect(arr).toEqual([1, 2, 3])
  })
  test('should work with any array (multiple)', () => {
    const arr = [1, 2, 3, 2]
    expect(removeByPredicate(arr, a => a == 2)).toEqual(true)
    expect(arr).toEqual([1, 3, 2])
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

  test('should compare arrays with different lengths (empty)', () => {
    const tests = [
      { a: [], b: [], r: 0 },
      { a: [], b: ['a'], r: 1 },
      { a: ['a'], b: [], r: -1 }
    ]

    let compare = makeCompare(compareString, false)
    tests.forEach(test => {
      expect(compare(test.a, test.b)).toBe(test.r)
    })
  })
})

describe('arrays:sort', () => {
  test('should sort arrays', () => {
    expect(sort(compareString, ["3", "2", "1"])).toEqual(["1", "2", "3"])
  })
})

describe('arrays:distinctPrimitive', () => {
  test('should work with empty arrays', () => {
    expect(distinctPrimitive([])).toEqual([])
  })
  test('should work with any array', () => {
    expect(distinctPrimitive([1, 2, 3, 2])).toEqual([1, 2, 3])
  })
})

describe('arrays:distinctByPredicate', () => {
  test('should work with empty arrays', () => {
    expect(distinctByPredicate([], a => a)).toEqual([])
  })
  test('should work with any array', () => {
    expect(distinctByPredicate([1, 2, 3, 2], String)).toEqual([1, 2, 3])
  })
})

describe('arrays:ofIterableIterator', () => {
  test('should work with empty arrays', () => {
    expect(ofIterableIterator(new Set().entries())).toEqual([])
  })
  test('should work with any array', () => {
    expect(ofIterableIterator(new Set([1, 2, 3]).entries())).toEqual([[1, 1], [2, 2], [3, 3]])
  })
})

describe('arrays:foldLeft', () => {
  test('should work with empty arrays', () => {
    expect(foldLeft([], (a, b) => a + b, 0)).toBe(0)
  })
  test('should work with any array', () => {
    expect(foldLeft([1, 2, 3], (a, b) => a + b, 0)).toBe(6)
  })
})

describe('arrays:any', () => {
  test('should work with empty arrays', () => {
    expect(any([], a => a == 1)).toBe(false)
  })
  test('should work with any array', () => {
    expect(any([1, 2, 3], a => a == 1)).toBe(true)
  })
  test('should work with any array (not found)', () => {
    expect(any([1, 2, 3], a => a == 4)).toBe(false)
  })
})

describe('arrays:each', () => {
  test('should work with empty arrays', () => {
    const arr: number[] = []
    each(arr, a => a + 1)
    expect(arr).toEqual([])
  })
  test('should work with any array', () => {
    const arr = [1, 2, 3]
    each(arr, a => a + 1)
    expect(arr).toEqual([1, 2, 3])
  })
})

describe('arrays:concat', () => {
  test('should work with empty arrays', () => {
    expect(concat([], [])).toEqual([])
  })
  test('should work with any array', () => {
    expect(concat([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6])
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
  test('diffOperations', () => {
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

  test('applyOperations', () => {
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

  test('diffOperations and applyOperations roundtrips', () => {
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

  test('rank', () => {
    const a = ['c', 'a', 'b']
    const ranked = rank(a, (a, b) => a > b ? 1 : a < b ? -1 : 0)
    expect(ranked).toEqual([2, 0, 1])
  })
})

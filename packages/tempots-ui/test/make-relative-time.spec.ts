import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  nowSignal,
  timeDiffToString,
  relativeTimeMillisSignal,
  relativeTimeSignal,
  relativeTime
} from '../src/utils/make-relative-time'
import { prop, Signal } from '@tempots/dom'
import { sleep } from '@tempots/std'

describe('make-relative-time.ts', () => {
  let originalDateNow: typeof Date.now

  beforeEach(() => {
    vi.clearAllMocks()
    originalDateNow = Date.now
  })

  afterEach(() => {
    Date.now = originalDateNow
  })

  describe('nowSignal', () => {
    it('should be a function', () => {
      expect(typeof nowSignal).toBe('function')
    })

    it('should create a signal with current date', () => {
      const now = nowSignal(100)
      expect(now.value).toBeInstanceOf(Date)
      expect(now.value.getTime()).toBeCloseTo(Date.now(), -2) // Within 100ms

      now.dispose()
    })

    it('should update at specified frequency', async () => {
      const mockNow = vi.fn()
        .mockReturnValueOnce(1000000)
        .mockReturnValueOnce(1001000)
        .mockReturnValueOnce(1002000)

      Date.now = mockNow

      const now = nowSignal(50) // 50ms frequency
      const initialTime = now.value.getTime()

      await sleep(60) // Wait longer than frequency

      expect(now.value.getTime()).toBeGreaterThan(initialTime)

      now.dispose()
    })

    it('should use default frequency of 1000ms', () => {
      const now = nowSignal()
      expect(now.value).toBeInstanceOf(Date)
      now.dispose()
    })

    it('should clean up interval on dispose', async () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

      const now = nowSignal(100)
      now.dispose()

      // Wait a bit to ensure no more updates happen
      await sleep(150)

      expect(clearIntervalSpy).toHaveBeenCalled()
      clearIntervalSpy.mockRestore()
    })
  })

  describe('timeDiffToString', () => {
    it('should be a function', () => {
      expect(typeof timeDiffToString).toBe('function')
    })

    describe('very recent times (< 1 minute)', () => {
      it('should return "just now" for past times', () => {
        expect(timeDiffToString(-30000)).toBe('just now') // 30 seconds ago
        expect(timeDiffToString(-1000)).toBe('just now')   // 1 second ago
        expect(timeDiffToString(-59999)).toBe('just now')  // 59.999 seconds ago
      })

      it('should return "in a moment" for future times', () => {
        expect(timeDiffToString(30000)).toBe('in a moment') // 30 seconds from now
        expect(timeDiffToString(1000)).toBe('in a moment')   // 1 second from now
        expect(timeDiffToString(59999)).toBe('in a moment')  // 59.999 seconds from now
      })

      it('should handle zero difference', () => {
        expect(timeDiffToString(0)).toBe('in a moment')
      })
    })

    describe('minutes', () => {
      const MINUTE = 60 * 1000

      it('should handle singular past minute', () => {
        expect(timeDiffToString(-MINUTE)).toBe('a minute ago')
        expect(timeDiffToString(-MINUTE * 1.4)).toBe('a minute ago') // Rounds to 1
      })

      it('should handle plural past minutes', () => {
        expect(timeDiffToString(-MINUTE * 2)).toBe('2 minutes ago')
        expect(timeDiffToString(-MINUTE * 5)).toBe('5 minutes ago')
        expect(timeDiffToString(-MINUTE * 89)).toBe('89 minutes ago')
      })

      it('should handle singular future minute', () => {
        expect(timeDiffToString(MINUTE)).toBe('in a minute')
        expect(timeDiffToString(MINUTE * 1.4)).toBe('in a minute')
      })

      it('should handle plural future minutes', () => {
        expect(timeDiffToString(MINUTE * 2)).toBe('in 2 minutes')
        expect(timeDiffToString(MINUTE * 5)).toBe('in 5 minutes')
        expect(timeDiffToString(MINUTE * 89)).toBe('in 89 minutes')
      })
    })

    describe('hours', () => {
      const HOUR = 60 * 60 * 1000

      it('should handle hours when >= 90 minutes', () => {
        // Test values that actually trigger hours unit and round correctly
        expect(timeDiffToString(-HOUR * 2)).toBe('2 hours ago')
        expect(timeDiffToString(-HOUR * 3)).toBe('3 hours ago')
        expect(timeDiffToString(-HOUR * 12)).toBe('12 hours ago')
        expect(timeDiffToString(-HOUR * 35)).toBe('35 hours ago')
      })

      it('should handle future hours', () => {
        expect(timeDiffToString(HOUR * 2)).toBe('in 2 hours')
        expect(timeDiffToString(HOUR * 3)).toBe('in 3 hours')
        expect(timeDiffToString(HOUR * 12)).toBe('in 12 hours')
        expect(timeDiffToString(HOUR * 35)).toBe('in 35 hours')
      })

      it('should handle edge case where 1 hour shows as minutes', () => {
        // 1 hour (60 minutes) is less than the 90-minute threshold, so shows as minutes
        expect(timeDiffToString(-HOUR)).toBe('60 minutes ago')
        expect(timeDiffToString(HOUR)).toBe('in 60 minutes')
      })
    })

    describe('days', () => {
      const DAY = 24 * 60 * 60 * 1000

      it('should handle days when >= 36 hours', () => {
        // Test values that actually trigger days unit
        expect(timeDiffToString(-DAY * 2)).toBe('2 days ago')
        expect(timeDiffToString(-DAY * 3)).toBe('3 days ago')
        expect(timeDiffToString(-DAY * 5)).toBe('5 days ago')
        expect(timeDiffToString(-DAY * 9)).toBe('9 days ago')
      })

      it('should handle future days', () => {
        expect(timeDiffToString(DAY * 2)).toBe('in 2 days')
        expect(timeDiffToString(DAY * 3)).toBe('in 3 days')
        expect(timeDiffToString(DAY * 5)).toBe('in 5 days')
        expect(timeDiffToString(DAY * 9)).toBe('in 9 days')
      })

      it('should handle edge case where 1 day shows as hours', () => {
        // 1 day (24 hours) is less than the 36-hour threshold, so shows as hours
        expect(timeDiffToString(-DAY)).toBe('24 hours ago')
        expect(timeDiffToString(DAY)).toBe('in 24 hours')
      })
    })

    describe('weeks', () => {
      const WEEK = 7 * 24 * 60 * 60 * 1000

      it('should handle weeks when >= 10 days', () => {
        // Test values that actually trigger weeks unit
        expect(timeDiffToString(-WEEK * 2)).toBe('2 weeks ago')
        expect(timeDiffToString(-WEEK * 3)).toBe('3 weeks ago')
        expect(timeDiffToString(-WEEK * 4)).toBe('4 weeks ago')
        expect(timeDiffToString(-WEEK * 5)).toBe('5 weeks ago')
      })

      it('should handle future weeks', () => {
        expect(timeDiffToString(WEEK * 2)).toBe('in 2 weeks')
        expect(timeDiffToString(WEEK * 3)).toBe('in 3 weeks')
        expect(timeDiffToString(WEEK * 4)).toBe('in 4 weeks')
        expect(timeDiffToString(WEEK * 5)).toBe('in 5 weeks')
      })

      it('should handle edge case where 1 week shows as days', () => {
        // 1 week (7 days) is less than the 10-day threshold, so shows as days
        expect(timeDiffToString(-WEEK)).toBe('7 days ago')
        expect(timeDiffToString(WEEK)).toBe('in 7 days')
      })
    })

    describe('months', () => {
      const MONTH = 30 * 24 * 60 * 60 * 1000

      it('should handle months when >= 6 weeks', () => {
        // Test values that actually trigger months unit
        expect(timeDiffToString(-MONTH * 2)).toBe('2 months ago')
        expect(timeDiffToString(-MONTH * 3)).toBe('3 months ago')
        expect(timeDiffToString(-MONTH * 6)).toBe('6 months ago')
        expect(timeDiffToString(-MONTH * 17)).toBe('17 months ago')
      })

      it('should handle future months', () => {
        expect(timeDiffToString(MONTH * 2)).toBe('in 2 months')
        expect(timeDiffToString(MONTH * 3)).toBe('in 3 months')
        expect(timeDiffToString(MONTH * 6)).toBe('in 6 months')
        expect(timeDiffToString(MONTH * 17)).toBe('in 17 months')
      })

      it('should handle edge case where 1 month shows as weeks', () => {
        // 1 month (30 days = ~4.3 weeks) is less than the 6-week threshold, so shows as weeks
        expect(timeDiffToString(-MONTH)).toBe('4 weeks ago')
        expect(timeDiffToString(MONTH)).toBe('in 4 weeks')
      })
    })

    describe('years', () => {
      const YEAR = 365 * 24 * 60 * 60 * 1000

      it('should handle years when >= 18 months', () => {
        // Test values that actually trigger years unit
        expect(timeDiffToString(-YEAR * 2)).toBe('2 years ago')
        expect(timeDiffToString(-YEAR * 3)).toBe('3 years ago')
        expect(timeDiffToString(-YEAR * 10)).toBe('10 years ago')
        expect(timeDiffToString(-YEAR * 100)).toBe('100 years ago')
      })

      it('should handle future years', () => {
        expect(timeDiffToString(YEAR * 2)).toBe('in 2 years')
        expect(timeDiffToString(YEAR * 3)).toBe('in 3 years')
        expect(timeDiffToString(YEAR * 10)).toBe('in 10 years')
        expect(timeDiffToString(YEAR * 100)).toBe('in 100 years')
      })

      it('should handle edge case where 1 year shows as months', () => {
        // 1 year (365 days = 12 months) is less than the 18-month threshold, so shows as months
        expect(timeDiffToString(-YEAR)).toBe('12 months ago')
        expect(timeDiffToString(YEAR)).toBe('in 12 months')
      })
    })

    describe('number formatting', () => {
      it('should format large numbers with locale string', () => {
        const YEAR = 365 * 24 * 60 * 60 * 1000
        expect(timeDiffToString(-YEAR * 1000)).toBe('1,000 years ago')
        expect(timeDiffToString(-YEAR * 1234)).toBe('1,234 years ago')
      })

      it('should handle rounding correctly', () => {
        const MINUTE = 60 * 1000
        expect(timeDiffToString(-MINUTE * 1.4)).toBe('a minute ago') // Rounds to 1
        expect(timeDiffToString(-MINUTE * 1.6)).toBe('2 minutes ago') // Rounds to 2
      })
    })
  })

  describe('relativeTimeMillisSignal', () => {
    it('should be a function', () => {
      expect(typeof relativeTimeMillisSignal).toBe('function')
    })

    it('should compute time difference between date and now', () => {
      const fixedNow = new Date('2023-01-01T12:00:00Z')
      const targetDate = new Date('2023-01-01T12:05:00Z') // 5 minutes later

      const dateSignal = prop(targetDate)
      const nowSignal = prop(fixedNow)

      const diff = relativeTimeMillisSignal(dateSignal, { now: nowSignal })

      expect(diff.value).toBe(5 * 60 * 1000) // 5 minutes in milliseconds

      diff.dispose()
    })

    it('should handle past dates (negative differences)', () => {
      const fixedNow = new Date('2023-01-01T12:00:00Z')
      const targetDate = new Date('2023-01-01T11:55:00Z') // 5 minutes earlier

      const dateSignal = prop(targetDate)
      const nowSignal = prop(fixedNow)

      const diff = relativeTimeMillisSignal(dateSignal, { now: nowSignal })

      expect(diff.value).toBe(-5 * 60 * 1000) // -5 minutes in milliseconds

      diff.dispose()
    })

    it('should update when date changes', () => {
      const fixedNow = new Date('2023-01-01T12:00:00Z')
      const initialDate = new Date('2023-01-01T12:05:00Z')
      const newDate = new Date('2023-01-01T12:10:00Z')

      const dateSignal = prop(initialDate)
      const nowSignal = prop(fixedNow)

      const diff = relativeTimeMillisSignal(dateSignal, { now: nowSignal })

      expect(diff.value).toBe(5 * 60 * 1000)

      dateSignal.set(newDate)
      expect(diff.value).toBe(10 * 60 * 1000)

      diff.dispose()
    })

    it('should update when now changes', () => {
      const initialNow = new Date('2023-01-01T12:00:00Z')
      const newNow = new Date('2023-01-01T12:02:00Z')
      const targetDate = new Date('2023-01-01T12:05:00Z')

      const dateSignal = prop(targetDate)
      const nowSignal = prop(initialNow)

      const diff = relativeTimeMillisSignal(dateSignal, { now: nowSignal })

      expect(diff.value).toBe(5 * 60 * 1000)

      nowSignal.set(newNow)
      expect(diff.value).toBe(3 * 60 * 1000) // Now 3 minutes difference

      diff.dispose()
    })

    it('should use default nowSignal when no now option provided', () => {
      const targetDate = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
      const dateSignal = prop(targetDate)

      const diff = relativeTimeMillisSignal(dateSignal)

      expect(diff.value).toBeCloseTo(5 * 60 * 1000, -3) // Within 1 second

      diff.dispose()
    })

    it('should handle static Date values for now option', () => {
      const fixedNow = new Date('2023-01-01T12:00:00Z')
      const targetDate = new Date('2023-01-01T12:05:00Z')

      const dateSignal = prop(targetDate)

      const diff = relativeTimeMillisSignal(dateSignal, { now: fixedNow })

      expect(diff.value).toBe(5 * 60 * 1000)

      diff.dispose()
    })

    it('should use custom frequency for default nowSignal', async () => {
      const targetDate = new Date(Date.now() + 1000)
      const dateSignal = prop(targetDate)

      const diff = relativeTimeMillisSignal(dateSignal, { frequency: 100 })

      expect(diff.value).toBeCloseTo(1000, -2)

      diff.dispose()
    })

    it('should clean up resources on dispose', () => {
      const dateSignal = prop(new Date())
      const nowSignal = prop(new Date())

      const diff = relativeTimeMillisSignal(dateSignal, { now: nowSignal })

      expect(() => diff.dispose()).not.toThrow()
    })
  })

  describe('relativeTimeSignal', () => {
    it('should be a function', () => {
      expect(typeof relativeTimeSignal).toBe('function')
    })

    it('should return human-readable relative time strings', () => {
      const fixedNow = new Date('2023-01-01T12:00:00Z')
      const targetDate = new Date('2023-01-01T12:05:00Z') // 5 minutes later

      const dateSignal = prop(targetDate)
      const nowSignal = prop(fixedNow)

      const relTime = relativeTimeSignal(dateSignal, { now: nowSignal })

      expect(relTime.value).toBe('in 5 minutes')

      relTime.dispose()
    })

    it('should update when underlying time difference changes', () => {
      const fixedNow = new Date('2023-01-01T12:00:00Z')
      const initialDate = new Date('2023-01-01T11:55:00Z') // 5 minutes ago
      const newDate = new Date('2023-01-01T10:00:00Z') // 2 hours ago

      const dateSignal = prop(initialDate)
      const nowSignal = prop(fixedNow)

      const relTime = relativeTimeSignal(dateSignal, { now: nowSignal })

      expect(relTime.value).toBe('5 minutes ago')

      dateSignal.set(newDate)
      expect(relTime.value).toBe('2 hours ago')

      relTime.dispose()
    })

    it('should handle various time ranges correctly', () => {
      const fixedNow = new Date('2023-01-01T12:00:00Z')
      const nowSignal = prop(fixedNow)

      const testCases = [
        { date: new Date('2023-01-01T11:59:30Z'), expected: 'just now' },
        { date: new Date('2023-01-01T11:55:00Z'), expected: '5 minutes ago' },
        { date: new Date('2023-01-01T10:00:00Z'), expected: '2 hours ago' }, // 2 hours ago
        { date: new Date('2022-12-30T12:00:00Z'), expected: '2 days ago' }, // 2 days ago
        { date: new Date('2022-12-18T12:00:00Z'), expected: '2 weeks ago' }, // 2 weeks ago
        { date: new Date('2022-11-01T12:00:00Z'), expected: '2 months ago' }, // 2 months ago
        { date: new Date('2021-01-01T12:00:00Z'), expected: '2 years ago' }, // 2 years ago
      ]

      for (const testCase of testCases) {
        const dateSignal = prop(testCase.date)
        const relTime = relativeTimeSignal(dateSignal, { now: nowSignal })

        expect(relTime.value).toBe(testCase.expected)

        relTime.dispose()
      }
    })

    it('should clean up resources on dispose', () => {
      const dateSignal = prop(new Date())
      const relTime = relativeTimeSignal(dateSignal)

      expect(() => relTime.dispose()).not.toThrow()
    })
  })

  describe('relativeTime (deprecated)', () => {
    it('should be a function', () => {
      expect(typeof relativeTime).toBe('function')
    })

    it('should work as alias for relativeTimeSignal', () => {
      const fixedNow = new Date('2023-01-01T12:00:00Z')
      const targetDate = new Date('2023-01-01T12:05:00Z')

      const dateSignal = prop(targetDate)
      const nowSignal = prop(fixedNow)

      const relTime = relativeTime(dateSignal, { now: nowSignal })

      expect(relTime.value).toBe('in 5 minutes')

      relTime.dispose()
    })
  })
})

import { describe, test, expect } from 'vitest'
import {
  addDays,
  addHours,
  addMinutes,
  diffInDays,
  diffInHours,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  isValidDate,
  isSameDay,
  isWeekend,
  isSameYear,
  isSameMonth,
  isSameWeek,
  isSameHour,
  isSameMinute,
  isSameSecond,
  compareDates
} from '../src/date'

describe('Date utilities', () => {
  describe('addDays', () => {
    test('adds positive days', () => {
      const date = new Date(2023, 0, 15) // January 15, 2023
      const result = addDays(date, 7)

      expect(result.getDate()).toBe(22)
      expect(result.getMonth()).toBe(0) // January
      expect(result.getFullYear()).toBe(2023)
    })

    test('subtracts days with negative input', () => {
      const date = new Date(2023, 0, 15) // January 15, 2023
      const result = addDays(date, -3)

      expect(result.getDate()).toBe(12)
      expect(result.getMonth()).toBe(0) // January
    })

    test('handles month boundaries', () => {
      const date = new Date(2023, 0, 30) // January 30, 2023
      const result = addDays(date, 5)

      expect(result.getDate()).toBe(4)
      expect(result.getMonth()).toBe(1) // February
    })

    test('does not mutate original date', () => {
      const original = new Date(2023, 0, 15) // January 15, 2023
      const originalTime = original.getTime()
      addDays(original, 7)

      expect(original.getTime()).toBe(originalTime)
    })
  })

  describe('addHours', () => {
    test('adds positive hours', () => {
      const date = new Date(2023, 0, 15, 10, 0, 0) // January 15, 2023 10:00:00
      const result = addHours(date, 5)

      expect(result.getHours()).toBe(15)
      expect(result.getDate()).toBe(15)
    })

    test('subtracts hours with negative input', () => {
      const date = new Date(2023, 0, 15, 10, 0, 0) // January 15, 2023 10:00:00
      const result = addHours(date, -2)

      expect(result.getHours()).toBe(8)
    })

    test('handles day boundaries', () => {
      const date = new Date(2023, 0, 15, 22, 0, 0) // January 15, 2023 22:00:00
      const result = addHours(date, 5)

      expect(result.getHours()).toBe(3)
      expect(result.getDate()).toBe(16)
    })
  })

  describe('addMinutes', () => {
    test('adds positive minutes', () => {
      const date = new Date(2023, 0, 15, 10, 30, 0) // January 15, 2023 10:30:00
      const result = addMinutes(date, 45)

      expect(result.getMinutes()).toBe(15)
      expect(result.getHours()).toBe(11)
    })

    test('subtracts minutes with negative input', () => {
      const date = new Date(2023, 0, 15, 10, 30, 0) // January 15, 2023 10:30:00
      const result = addMinutes(date, -15)

      expect(result.getMinutes()).toBe(15)
      expect(result.getHours()).toBe(10)
    })
  })

  describe('diffInDays', () => {
    test('calculates positive difference', () => {
      const dateA = new Date(2023, 0, 15) // January 15, 2023
      const dateB = new Date(2023, 0, 20) // January 20, 2023

      expect(diffInDays(dateA, dateB)).toBe(5)
    })

    test('calculates negative difference', () => {
      const dateA = new Date(2023, 0, 20) // January 20, 2023
      const dateB = new Date(2023, 0, 15) // January 15, 2023

      expect(diffInDays(dateA, dateB)).toBe(-5)
    })

    test('returns 0 for same day', () => {
      const dateA = new Date(2023, 0, 15, 10, 0, 0) // January 15, 2023 10:00:00
      const dateB = new Date(2023, 0, 15, 18, 0, 0) // January 15, 2023 18:00:00

      expect(diffInDays(dateA, dateB)).toBe(0)
    })

    test('handles month boundaries', () => {
      const dateA = new Date(2023, 0, 30) // January 30, 2023
      const dateB = new Date(2023, 1, 2) // February 2, 2023

      expect(diffInDays(dateA, dateB)).toBe(3)
    })
  })

  describe('diffInHours', () => {
    test('calculates positive difference', () => {
      const dateA = new Date(2023, 0, 15, 10, 0, 0) // January 15, 2023 10:00:00
      const dateB = new Date(2023, 0, 15, 15, 30, 0) // January 15, 2023 15:30:00

      expect(diffInHours(dateA, dateB)).toBe(5.5)
    })

    test('calculates negative difference', () => {
      const dateA = new Date(2023, 0, 15, 15, 0, 0) // January 15, 2023 15:00:00
      const dateB = new Date(2023, 0, 15, 10, 0, 0) // January 15, 2023 10:00:00

      expect(diffInHours(dateA, dateB)).toBe(-5)
    })
  })

  describe('startOfDay', () => {
    test('sets time to start of day', () => {
      const date = new Date(2023, 0, 15, 14, 30, 45, 123) // January 15, 2023 14:30:45.123
      const result = startOfDay(date)

      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
      expect(result.getSeconds()).toBe(0)
      expect(result.getMilliseconds()).toBe(0)
      expect(result.getDate()).toBe(15)
    })

    test('does not mutate original date', () => {
      const original = new Date(2023, 0, 15, 14, 30, 45) // January 15, 2023 14:30:45
      const originalTime = original.getTime()
      startOfDay(original)

      expect(original.getTime()).toBe(originalTime)
    })
  })

  describe('endOfDay', () => {
    test('sets time to end of day', () => {
      const date = new Date(2023, 0, 15, 14, 30, 45, 123) // January 15, 2023 14:30:45.123
      const result = endOfDay(date)

      expect(result.getHours()).toBe(23)
      expect(result.getMinutes()).toBe(59)
      expect(result.getSeconds()).toBe(59)
      expect(result.getMilliseconds()).toBe(999)
      expect(result.getDate()).toBe(15)
    })
  })

  describe('startOfWeek', () => {
    test('returns Monday for Wednesday', () => {
      const wednesday = new Date(2023, 0, 18) // January 18, 2023 (Wednesday)
      const result = startOfWeek(wednesday)

      expect(result.getDay()).toBe(1) // Monday
      expect(result.getDate()).toBe(16)
      expect(result.getHours()).toBe(0)
    })

    test('returns same day for Monday', () => {
      const monday = new Date(2023, 0, 16) // January 16, 2023 (Monday)
      const result = startOfWeek(monday)

      expect(result.getDay()).toBe(1) // Monday
      expect(result.getDate()).toBe(16)
    })

    test('handles Sunday correctly', () => {
      const sunday = new Date(2023, 0, 22) // January 22, 2023 (Sunday)
      const result = startOfWeek(sunday)

      expect(result.getDay()).toBe(1) // Monday
      expect(result.getDate()).toBe(16) // Previous Monday
    })
  })

  describe('endOfWeek', () => {
    test('returns Sunday for Wednesday', () => {
      const wednesday = new Date(2023, 0, 18) // January 18, 2023 (Wednesday)
      const result = endOfWeek(wednesday)

      expect(result.getDay()).toBe(0) // Sunday
      expect(result.getDate()).toBe(22)
      expect(result.getHours()).toBe(23)
      expect(result.getMinutes()).toBe(59)
    })

    test('returns same day for Sunday', () => {
      const sunday = new Date(2023, 0, 22) // January 22, 2023 (Sunday)
      const result = endOfWeek(sunday)

      expect(result.getDay()).toBe(0) // Sunday
      expect(result.getDate()).toBe(22)
    })
  })

  describe('isValidDate', () => {
    test('returns true for valid Date objects', () => {
      expect(isValidDate(new Date())).toBe(true)
      expect(isValidDate(new Date('2023-01-15'))).toBe(true)
      expect(isValidDate(new Date(2023, 0, 15))).toBe(true)
    })

    test('returns false for invalid Date objects', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false)
      expect(isValidDate(new Date('not-a-date'))).toBe(false)
    })

    test('returns false for non-Date values', () => {
      expect(isValidDate('2023-01-15')).toBe(false)
      expect(isValidDate(1673740800000)).toBe(false)
      expect(isValidDate(null)).toBe(false)
      expect(isValidDate(undefined)).toBe(false)
      expect(isValidDate({})).toBe(false)
    })
  })

  describe('isSameDay', () => {
    test('returns true for same calendar day with different times', () => {
      const date1 = new Date(2023, 0, 15, 10, 30, 0) // January 15, 2023 10:30:00
      const date2 = new Date(2023, 0, 15, 18, 45, 0) // January 15, 2023 18:45:00

      expect(isSameDay(date1, date2)).toBe(true)
    })

    test('returns false for different calendar days', () => {
      const date1 = new Date(2023, 0, 15, 23, 59, 59) // January 15, 2023 23:59:59
      const date2 = new Date(2023, 0, 16, 0, 0, 1) // January 16, 2023 00:00:01

      expect(isSameDay(date1, date2)).toBe(false)
    })

    test('returns true for identical dates', () => {
      const date1 = new Date(2023, 0, 15, 12, 0, 0) // January 15, 2023 12:00:00
      const date2 = new Date(2023, 0, 15, 12, 0, 0) // January 15, 2023 12:00:00

      expect(isSameDay(date1, date2)).toBe(true)
    })
  })

  describe('isWeekend', () => {
    test('returns true for Saturday', () => {
      const saturday = new Date(2023, 0, 14) // January 14, 2023 (Saturday)
      expect(isWeekend(saturday)).toBe(true)
    })

    test('returns true for Sunday', () => {
      const sunday = new Date(2023, 0, 15) // January 15, 2023 (Sunday)
      expect(isWeekend(sunday)).toBe(true)
    })

    test('returns false for weekdays', () => {
      const monday = new Date(2023, 0, 16) // January 16, 2023 (Monday)
      const wednesday = new Date(2023, 0, 18) // January 18, 2023 (Wednesday)
      const friday = new Date(2023, 0, 20) // January 20, 2023 (Friday)

      expect(isWeekend(monday)).toBe(false)
      expect(isWeekend(wednesday)).toBe(false)
      expect(isWeekend(friday)).toBe(false)
    })
  })

  describe('isSameYear', () => {
    test('returns true for dates in same year', () => {
      const date1 = new Date(2023, 0, 15) // January 15, 2023
      const date2 = new Date(2023, 11, 31) // December 31, 2023

      expect(isSameYear(date1, date2)).toBe(true)
    })

    test('returns false for dates in different years', () => {
      const date1 = new Date(2023, 11, 31) // December 31, 2023
      const date2 = new Date(2024, 0, 1) // January 1, 2024

      expect(isSameYear(date1, date2)).toBe(false)
    })

    test('ignores time components', () => {
      const date1 = new Date(2023, 0, 1, 0, 0, 0) // January 1, 2023 00:00:00
      const date2 = new Date(2023, 11, 31, 23, 59, 59) // December 31, 2023 23:59:59

      expect(isSameYear(date1, date2)).toBe(true)
    })
  })

  describe('isSameMonth', () => {
    test('returns true for dates in same month and year', () => {
      const date1 = new Date(2023, 0, 1) // January 1, 2023
      const date2 = new Date(2023, 0, 31) // January 31, 2023

      expect(isSameMonth(date1, date2)).toBe(true)
    })

    test('returns false for dates in different months', () => {
      const date1 = new Date(2023, 0, 31) // January 31, 2023
      const date2 = new Date(2023, 1, 1) // February 1, 2023

      expect(isSameMonth(date1, date2)).toBe(false)
    })

    test('returns false for same month but different year', () => {
      const date1 = new Date(2023, 0, 15) // January 15, 2023
      const date2 = new Date(2024, 0, 15) // January 15, 2024

      expect(isSameMonth(date1, date2)).toBe(false)
    })

    test('ignores time components', () => {
      const date1 = new Date(2023, 0, 1, 0, 0, 0) // January 1, 2023 00:00:00
      const date2 = new Date(2023, 0, 31, 23, 59, 59) // January 31, 2023 23:59:59

      expect(isSameMonth(date1, date2)).toBe(true)
    })
  })

  describe('isSameWeek', () => {
    test('returns true for dates in same week', () => {
      const monday = new Date(2023, 0, 16) // January 16, 2023 (Monday)
      const friday = new Date(2023, 0, 20) // January 20, 2023 (Friday same week)

      expect(isSameWeek(monday, friday)).toBe(true)
    })

    test('returns false for dates in different weeks', () => {
      const sunday = new Date(2023, 0, 15) // January 15, 2023 (Sunday)
      const monday = new Date(2023, 0, 16) // January 16, 2023 (Monday next week)

      expect(isSameWeek(sunday, monday)).toBe(false)
    })

    test('handles week boundaries correctly', () => {
      const saturday = new Date(2023, 0, 21) // January 21, 2023 (Saturday)
      const sunday = new Date(2023, 0, 22) // January 22, 2023 (Sunday same week)

      expect(isSameWeek(saturday, sunday)).toBe(true)
    })

    test('handles different weeks correctly', () => {
      const sunday = new Date(2023, 0, 22) // January 22, 2023 (Sunday end of week)
      const monday = new Date(2023, 0, 23) // January 23, 2023 (Monday start of next week)

      expect(isSameWeek(sunday, monday)).toBe(false)
    })
  })

  describe('isSameHour', () => {
    test('returns true for dates in same hour', () => {
      const date1 = new Date(2023, 0, 15, 10, 0, 0) // January 15, 2023 10:00:00
      const date2 = new Date(2023, 0, 15, 10, 59, 59) // January 15, 2023 10:59:59

      expect(isSameHour(date1, date2)).toBe(true)
    })

    test('returns false for dates in different hours', () => {
      const date1 = new Date(2023, 0, 15, 10, 59, 59) // January 15, 2023 10:59:59
      const date2 = new Date(2023, 0, 15, 11, 0, 0) // January 15, 2023 11:00:00

      expect(isSameHour(date1, date2)).toBe(false)
    })

    test('returns false for same hour but different day', () => {
      const date1 = new Date(2023, 0, 15, 10, 30, 0) // January 15, 2023 10:30:00
      const date2 = new Date(2023, 0, 16, 10, 30, 0) // January 16, 2023 10:30:00

      expect(isSameHour(date1, date2)).toBe(false)
    })
  })

  describe('isSameMinute', () => {
    test('returns true for dates in same minute', () => {
      const date1 = new Date(2023, 0, 15, 10, 30, 0) // January 15, 2023 10:30:00
      const date2 = new Date(2023, 0, 15, 10, 30, 59) // January 15, 2023 10:30:59

      expect(isSameMinute(date1, date2)).toBe(true)
    })

    test('returns false for dates in different minutes', () => {
      const date1 = new Date(2023, 0, 15, 10, 30, 59) // January 15, 2023 10:30:59
      const date2 = new Date(2023, 0, 15, 10, 31, 0) // January 15, 2023 10:31:00

      expect(isSameMinute(date1, date2)).toBe(false)
    })

    test('returns false for same minute but different hour', () => {
      const date1 = new Date(2023, 0, 15, 10, 30, 0) // January 15, 2023 10:30:00
      const date2 = new Date(2023, 0, 15, 11, 30, 0) // January 15, 2023 11:30:00

      expect(isSameMinute(date1, date2)).toBe(false)
    })
  })

  describe('isSameSecond', () => {
    test('returns true for dates in same second', () => {
      const date1 = new Date(2023, 0, 15, 10, 30, 45, 0) // January 15, 2023 10:30:45.000
      const date2 = new Date(2023, 0, 15, 10, 30, 45, 999) // January 15, 2023 10:30:45.999

      expect(isSameSecond(date1, date2)).toBe(true)
    })

    test('returns false for dates in different seconds', () => {
      const date1 = new Date(2023, 0, 15, 10, 30, 45, 999) // January 15, 2023 10:30:45.999
      const date2 = new Date(2023, 0, 15, 10, 30, 46, 0) // January 15, 2023 10:30:46.000

      expect(isSameSecond(date1, date2)).toBe(false)
    })

    test('returns false for same second but different minute', () => {
      const date1 = new Date(2023, 0, 15, 10, 30, 45) // January 15, 2023 10:30:45
      const date2 = new Date(2023, 0, 15, 10, 31, 45) // January 15, 2023 10:31:45

      expect(isSameSecond(date1, date2)).toBe(false)
    })
  })

  describe('compareDates', () => {
    test('returns negative number when first date is earlier', () => {
      const earlier = new Date(2023, 0, 15) // January 15, 2023
      const later = new Date(2023, 0, 16) // January 16, 2023

      expect(compareDates(earlier, later)).toBeLessThan(0)
    })

    test('returns positive number when first date is later', () => {
      const earlier = new Date(2023, 0, 15) // January 15, 2023
      const later = new Date(2023, 0, 16) // January 16, 2023

      expect(compareDates(later, earlier)).toBeGreaterThan(0)
    })

    test('returns zero when dates are equal', () => {
      const date1 = new Date(2023, 0, 15, 10, 30, 45, 123) // January 15, 2023 10:30:45.123
      const date2 = new Date(2023, 0, 15, 10, 30, 45, 123) // January 15, 2023 10:30:45.123

      expect(compareDates(date1, date2)).toBe(0)
    })

    test('compares with millisecond precision', () => {
      const date1 = new Date(2023, 0, 15, 10, 30, 45, 123) // January 15, 2023 10:30:45.123
      const date2 = new Date(2023, 0, 15, 10, 30, 45, 124) // January 15, 2023 10:30:45.124

      expect(compareDates(date1, date2)).toBeLessThan(0)
      expect(compareDates(date2, date1)).toBeGreaterThan(0)
    })
  })
})

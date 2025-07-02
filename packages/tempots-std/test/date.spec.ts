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
      const date = new Date('2023-01-15')
      const result = addDays(date, 7)

      expect(result.getDate()).toBe(22)
      expect(result.getMonth()).toBe(0) // January
      expect(result.getFullYear()).toBe(2023)
    })

    test('subtracts days with negative input', () => {
      const date = new Date('2023-01-15')
      const result = addDays(date, -3)

      expect(result.getDate()).toBe(12)
      expect(result.getMonth()).toBe(0) // January
    })

    test('handles month boundaries', () => {
      const date = new Date('2023-01-30')
      const result = addDays(date, 5)

      expect(result.getDate()).toBe(4)
      expect(result.getMonth()).toBe(1) // February
    })

    test('does not mutate original date', () => {
      const original = new Date('2023-01-15')
      const originalTime = original.getTime()
      addDays(original, 7)

      expect(original.getTime()).toBe(originalTime)
    })
  })

  describe('addHours', () => {
    test('adds positive hours', () => {
      const date = new Date('2023-01-15T10:00:00')
      const result = addHours(date, 5)

      expect(result.getHours()).toBe(15)
      expect(result.getDate()).toBe(15)
    })

    test('subtracts hours with negative input', () => {
      const date = new Date('2023-01-15T10:00:00')
      const result = addHours(date, -2)

      expect(result.getHours()).toBe(8)
    })

    test('handles day boundaries', () => {
      const date = new Date('2023-01-15T22:00:00')
      const result = addHours(date, 5)

      expect(result.getHours()).toBe(3)
      expect(result.getDate()).toBe(16)
    })
  })

  describe('addMinutes', () => {
    test('adds positive minutes', () => {
      const date = new Date('2023-01-15T10:30:00')
      const result = addMinutes(date, 45)

      expect(result.getMinutes()).toBe(15)
      expect(result.getHours()).toBe(11)
    })

    test('subtracts minutes with negative input', () => {
      const date = new Date('2023-01-15T10:30:00')
      const result = addMinutes(date, -15)

      expect(result.getMinutes()).toBe(15)
      expect(result.getHours()).toBe(10)
    })
  })

  describe('diffInDays', () => {
    test('calculates positive difference', () => {
      const dateA = new Date('2023-01-15')
      const dateB = new Date('2023-01-20')

      expect(diffInDays(dateA, dateB)).toBe(5)
    })

    test('calculates negative difference', () => {
      const dateA = new Date('2023-01-20')
      const dateB = new Date('2023-01-15')

      expect(diffInDays(dateA, dateB)).toBe(-5)
    })

    test('returns 0 for same day', () => {
      const dateA = new Date('2023-01-15T10:00:00')
      const dateB = new Date('2023-01-15T18:00:00')

      expect(diffInDays(dateA, dateB)).toBe(0)
    })

    test('handles month boundaries', () => {
      const dateA = new Date('2023-01-30')
      const dateB = new Date('2023-02-02')

      expect(diffInDays(dateA, dateB)).toBe(3)
    })
  })

  describe('diffInHours', () => {
    test('calculates positive difference', () => {
      const dateA = new Date('2023-01-15T10:00:00')
      const dateB = new Date('2023-01-15T15:30:00')

      expect(diffInHours(dateA, dateB)).toBe(5.5)
    })

    test('calculates negative difference', () => {
      const dateA = new Date('2023-01-15T15:00:00')
      const dateB = new Date('2023-01-15T10:00:00')

      expect(diffInHours(dateA, dateB)).toBe(-5)
    })
  })

  describe('startOfDay', () => {
    test('sets time to start of day', () => {
      const date = new Date('2023-01-15T14:30:45.123')
      const result = startOfDay(date)

      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
      expect(result.getSeconds()).toBe(0)
      expect(result.getMilliseconds()).toBe(0)
      expect(result.getDate()).toBe(15)
    })

    test('does not mutate original date', () => {
      const original = new Date('2023-01-15T14:30:45')
      const originalTime = original.getTime()
      startOfDay(original)

      expect(original.getTime()).toBe(originalTime)
    })
  })

  describe('endOfDay', () => {
    test('sets time to end of day', () => {
      const date = new Date('2023-01-15T14:30:45.123')
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
      const wednesday = new Date('2023-01-18') // Wednesday
      const result = startOfWeek(wednesday)

      expect(result.getDay()).toBe(1) // Monday
      expect(result.getDate()).toBe(16)
      expect(result.getHours()).toBe(0)
    })

    test('returns same day for Monday', () => {
      const monday = new Date('2023-01-16') // Monday
      const result = startOfWeek(monday)

      expect(result.getDay()).toBe(1) // Monday
      expect(result.getDate()).toBe(16)
    })

    test('handles Sunday correctly', () => {
      const sunday = new Date('2023-01-22') // Sunday
      const result = startOfWeek(sunday)

      expect(result.getDay()).toBe(1) // Monday
      expect(result.getDate()).toBe(16) // Previous Monday
    })
  })

  describe('endOfWeek', () => {
    test('returns Sunday for Wednesday', () => {
      const wednesday = new Date('2023-01-18') // Wednesday
      const result = endOfWeek(wednesday)

      expect(result.getDay()).toBe(0) // Sunday
      expect(result.getDate()).toBe(22)
      expect(result.getHours()).toBe(23)
      expect(result.getMinutes()).toBe(59)
    })

    test('returns same day for Sunday', () => {
      const sunday = new Date('2023-01-22') // Sunday
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
      const date1 = new Date('2023-01-15T10:30:00')
      const date2 = new Date('2023-01-15T18:45:00')

      expect(isSameDay(date1, date2)).toBe(true)
    })

    test('returns false for different calendar days', () => {
      const date1 = new Date('2023-01-15T23:59:59')
      const date2 = new Date('2023-01-16T00:00:01')

      expect(isSameDay(date1, date2)).toBe(false)
    })

    test('returns true for identical dates', () => {
      const date1 = new Date('2023-01-15T12:00:00')
      const date2 = new Date('2023-01-15T12:00:00')

      expect(isSameDay(date1, date2)).toBe(true)
    })
  })

  describe('isWeekend', () => {
    test('returns true for Saturday', () => {
      const saturday = new Date('2023-01-14') // Saturday
      expect(isWeekend(saturday)).toBe(true)
    })

    test('returns true for Sunday', () => {
      const sunday = new Date('2023-01-15') // Sunday
      expect(isWeekend(sunday)).toBe(true)
    })

    test('returns false for weekdays', () => {
      const monday = new Date('2023-01-16') // Monday
      const wednesday = new Date('2023-01-18') // Wednesday
      const friday = new Date('2023-01-20') // Friday

      expect(isWeekend(monday)).toBe(false)
      expect(isWeekend(wednesday)).toBe(false)
      expect(isWeekend(friday)).toBe(false)
    })
  })

  describe('isSameYear', () => {
    test('returns true for dates in same year', () => {
      const date1 = new Date('2023-01-15')
      const date2 = new Date('2023-12-31')

      expect(isSameYear(date1, date2)).toBe(true)
    })

    test('returns false for dates in different years', () => {
      const date1 = new Date('2023-12-31')
      const date2 = new Date('2024-01-01')

      expect(isSameYear(date1, date2)).toBe(false)
    })

    test('ignores time components', () => {
      const date1 = new Date('2023-01-01T00:00:00')
      const date2 = new Date('2023-12-31T23:59:59')

      expect(isSameYear(date1, date2)).toBe(true)
    })
  })

  describe('isSameMonth', () => {
    test('returns true for dates in same month and year', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-31')

      expect(isSameMonth(date1, date2)).toBe(true)
    })

    test('returns false for dates in different months', () => {
      const date1 = new Date('2023-01-31')
      const date2 = new Date('2023-02-01')

      expect(isSameMonth(date1, date2)).toBe(false)
    })

    test('returns false for same month but different year', () => {
      const date1 = new Date('2023-01-15')
      const date2 = new Date('2024-01-15')

      expect(isSameMonth(date1, date2)).toBe(false)
    })

    test('ignores time components', () => {
      const date1 = new Date('2023-01-01T00:00:00')
      const date2 = new Date('2023-01-31T23:59:59')

      expect(isSameMonth(date1, date2)).toBe(true)
    })
  })

  describe('isSameWeek', () => {
    test('returns true for dates in same week', () => {
      const monday = new Date('2023-01-16') // Monday
      const friday = new Date('2023-01-20') // Friday same week

      expect(isSameWeek(monday, friday)).toBe(true)
    })

    test('returns false for dates in different weeks', () => {
      const sunday = new Date('2023-01-15') // Sunday
      const monday = new Date('2023-01-16') // Monday next week

      expect(isSameWeek(sunday, monday)).toBe(false)
    })

    test('handles week boundaries correctly', () => {
      const saturday = new Date('2023-01-21') // Saturday
      const sunday = new Date('2023-01-22') // Sunday same week (weeks start Monday)

      expect(isSameWeek(saturday, sunday)).toBe(true)
    })

    test('handles different weeks correctly', () => {
      const sunday = new Date('2023-01-22') // Sunday end of week
      const monday = new Date('2023-01-23') // Monday start of next week

      expect(isSameWeek(sunday, monday)).toBe(false)
    })
  })

  describe('isSameHour', () => {
    test('returns true for dates in same hour', () => {
      const date1 = new Date('2023-01-15T10:00:00')
      const date2 = new Date('2023-01-15T10:59:59')

      expect(isSameHour(date1, date2)).toBe(true)
    })

    test('returns false for dates in different hours', () => {
      const date1 = new Date('2023-01-15T10:59:59')
      const date2 = new Date('2023-01-15T11:00:00')

      expect(isSameHour(date1, date2)).toBe(false)
    })

    test('returns false for same hour but different day', () => {
      const date1 = new Date('2023-01-15T10:30:00')
      const date2 = new Date('2023-01-16T10:30:00')

      expect(isSameHour(date1, date2)).toBe(false)
    })
  })

  describe('isSameMinute', () => {
    test('returns true for dates in same minute', () => {
      const date1 = new Date('2023-01-15T10:30:00')
      const date2 = new Date('2023-01-15T10:30:59')

      expect(isSameMinute(date1, date2)).toBe(true)
    })

    test('returns false for dates in different minutes', () => {
      const date1 = new Date('2023-01-15T10:30:59')
      const date2 = new Date('2023-01-15T10:31:00')

      expect(isSameMinute(date1, date2)).toBe(false)
    })

    test('returns false for same minute but different hour', () => {
      const date1 = new Date('2023-01-15T10:30:00')
      const date2 = new Date('2023-01-15T11:30:00')

      expect(isSameMinute(date1, date2)).toBe(false)
    })
  })

  describe('isSameSecond', () => {
    test('returns true for dates in same second', () => {
      const date1 = new Date('2023-01-15T10:30:45.000')
      const date2 = new Date('2023-01-15T10:30:45.999')

      expect(isSameSecond(date1, date2)).toBe(true)
    })

    test('returns false for dates in different seconds', () => {
      const date1 = new Date('2023-01-15T10:30:45.999')
      const date2 = new Date('2023-01-15T10:30:46.000')

      expect(isSameSecond(date1, date2)).toBe(false)
    })

    test('returns false for same second but different minute', () => {
      const date1 = new Date('2023-01-15T10:30:45')
      const date2 = new Date('2023-01-15T10:31:45')

      expect(isSameSecond(date1, date2)).toBe(false)
    })
  })

  describe('compareDates', () => {
    test('returns negative number when first date is earlier', () => {
      const earlier = new Date('2023-01-15')
      const later = new Date('2023-01-16')

      expect(compareDates(earlier, later)).toBeLessThan(0)
    })

    test('returns positive number when first date is later', () => {
      const earlier = new Date('2023-01-15')
      const later = new Date('2023-01-16')

      expect(compareDates(later, earlier)).toBeGreaterThan(0)
    })

    test('returns zero when dates are equal', () => {
      const date1 = new Date('2023-01-15T10:30:45.123')
      const date2 = new Date('2023-01-15T10:30:45.123')

      expect(compareDates(date1, date2)).toBe(0)
    })

    test('compares with millisecond precision', () => {
      const date1 = new Date('2023-01-15T10:30:45.123')
      const date2 = new Date('2023-01-15T10:30:45.124')

      expect(compareDates(date1, date2)).toBeLessThan(0)
      expect(compareDates(date2, date1)).toBeGreaterThan(0)
    })
  })
})

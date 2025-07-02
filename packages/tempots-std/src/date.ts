/**
 * Utilities for working with Date objects.
 *
 * This module provides comprehensive date manipulation, comparison, and
 * formatting utilities. All functions return new Date objects and do not
 * mutate the input dates, following functional programming principles.
 *
 * @public
 */

/**
 * Adds the specified number of days to a date.
 *
 * This function creates a new Date object with the specified number of days
 * added. Negative values subtract days.
 *
 * @example
 * ```typescript
 * const date = new Date('2023-01-15')
 * const future = addDays(date, 7)
 * // Result: 2023-01-22
 *
 * const past = addDays(date, -3)
 * // Result: 2023-01-12
 * ```
 *
 * @param date - The base date
 * @param days - Number of days to add (can be negative)
 * @returns A new Date object with days added
 * @public
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Adds the specified number of hours to a date.
 *
 * This function creates a new Date object with the specified number of hours
 * added. Negative values subtract hours.
 *
 * @example
 * ```typescript
 * const date = new Date('2023-01-15T10:00:00')
 * const future = addHours(date, 5)
 * // Result: 2023-01-15T15:00:00
 *
 * const past = addHours(date, -2)
 * // Result: 2023-01-15T08:00:00
 * ```
 *
 * @param date - The base date
 * @param hours - Number of hours to add (can be negative)
 * @returns A new Date object with hours added
 * @public
 */
export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

/**
 * Adds the specified number of minutes to a date.
 *
 * This function creates a new Date object with the specified number of minutes
 * added. Negative values subtract minutes.
 *
 * @example
 * ```typescript
 * const date = new Date('2023-01-15T10:30:00')
 * const future = addMinutes(date, 45)
 * // Result: 2023-01-15T11:15:00
 *
 * const past = addMinutes(date, -15)
 * // Result: 2023-01-15T10:15:00
 * ```
 *
 * @param date - The base date
 * @param minutes - Number of minutes to add (can be negative)
 * @returns A new Date object with minutes added
 * @public
 */
export const addMinutes = (date: Date, minutes: number): Date => {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() + minutes)
  return result
}

/**
 * Calculates the difference in days between two dates.
 *
 * Returns a positive number if dateB is after dateA, negative if before.
 * The calculation ignores time components and focuses on calendar days.
 *
 * @example
 * ```typescript
 * const dateA = new Date('2023-01-15')
 * const dateB = new Date('2023-01-20')
 * const diff = diffInDays(dateA, dateB)
 * // Result: 5
 *
 * const diffReverse = diffInDays(dateB, dateA)
 * // Result: -5
 * ```
 *
 * @param dateA - The first date
 * @param dateB - The second date
 * @returns The difference in days (dateB - dateA)
 * @public
 */
export const diffInDays = (dateA: Date, dateB: Date): number => {
  const msPerDay = 24 * 60 * 60 * 1000
  const utcA = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate())
  const utcB = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate())
  return Math.floor((utcB - utcA) / msPerDay)
}

/**
 * Calculates the difference in hours between two dates.
 *
 * Returns a positive number if dateB is after dateA, negative if before.
 * The result includes fractional hours for precise calculations.
 *
 * @example
 * ```typescript
 * const dateA = new Date('2023-01-15T10:00:00')
 * const dateB = new Date('2023-01-15T15:30:00')
 * const diff = diffInHours(dateA, dateB)
 * // Result: 5.5
 * ```
 *
 * @param dateA - The first date
 * @param dateB - The second date
 * @returns The difference in hours (dateB - dateA)
 * @public
 */
export const diffInHours = (dateA: Date, dateB: Date): number => {
  const msPerHour = 60 * 60 * 1000
  return (dateB.getTime() - dateA.getTime()) / msPerHour
}

/**
 * Returns a new Date representing the start of the day (00:00:00.000).
 *
 * This is useful for date comparisons and range queries where you need
 * to normalize dates to the beginning of the day.
 *
 * @example
 * ```typescript
 * const date = new Date('2023-01-15T14:30:45.123')
 * const start = startOfDay(date)
 * // Result: 2023-01-15T00:00:00.000
 * ```
 *
 * @param date - The input date
 * @returns A new Date set to the start of the day
 * @public
 */
export const startOfDay = (date: Date): Date => {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Returns a new Date representing the end of the day (23:59:59.999).
 *
 * This is useful for date range queries where you need the last
 * millisecond of a given day.
 *
 * @example
 * ```typescript
 * const date = new Date('2023-01-15T14:30:45.123')
 * const end = endOfDay(date)
 * // Result: 2023-01-15T23:59:59.999
 * ```
 *
 * @param date - The input date
 * @returns A new Date set to the end of the day
 * @public
 */
export const endOfDay = (date: Date): Date => {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Returns a new Date representing the start of the week (Monday 00:00:00.000).
 *
 * This follows the ISO 8601 standard where Monday is the first day of the week.
 * Useful for weekly reports and date grouping.
 *
 * @example
 * ```typescript
 * const date = new Date('2023-01-18') // Wednesday
 * const start = startOfWeek(date)
 * // Result: 2023-01-16T00:00:00.000 (Monday)
 * ```
 *
 * @param date - The input date
 * @returns A new Date set to the start of the week
 * @public
 */
export const startOfWeek = (date: Date): Date => {
  const result = new Date(date)
  const day = result.getDay()
  const diff = result.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
  result.setDate(diff)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Returns a new Date representing the end of the week (Sunday 23:59:59.999).
 *
 * This follows the ISO 8601 standard where Sunday is the last day of the week.
 * Useful for weekly reports and date grouping.
 *
 * @example
 * ```typescript
 * const date = new Date('2023-01-18') // Wednesday
 * const end = endOfWeek(date)
 * // Result: 2023-01-22T23:59:59.999 (Sunday)
 * ```
 *
 * @param date - The input date
 * @returns A new Date set to the end of the week
 * @public
 */
export const endOfWeek = (date: Date): Date => {
  const result = new Date(date)
  const day = result.getDay()
  const diff = result.getDate() - day + (day === 0 ? 0 : 7) // Adjust for Sunday end
  result.setDate(diff)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Checks if a value is a valid Date object.
 *
 * This function checks both that the value is a Date instance and that
 * it represents a valid date (not NaN).
 *
 * @example
 * ```typescript
 * isValidDate(new Date()) // true
 * isValidDate(new Date('2023-01-15')) // true
 * isValidDate(new Date('invalid')) // false
 * isValidDate('2023-01-15') // false
 * isValidDate(null) // false
 * ```
 *
 * @param date - The value to check
 * @returns true if the value is a valid Date, false otherwise
 * @public
 */
export const isValidDate = (date: unknown): date is Date =>
  date instanceof Date && !isNaN(date.getTime())

/**
 * Checks if two dates represent the same calendar year.
 *
 * This comparison ignores the month and day components and only compares the year part.
 * Useful for yearly reports and date grouping.
 *
 * @example
 * ```typescript
 * const date1 = new Date('2023-01-15') // January
 * const date2 = new Date('2023-02-15') // February
 * const date3 = new Date('2024-01-15') // January of next year
 *
 * isSameYear(date1, date2) // true
 * isSameYear(date1, date3) // false
 * ```
 *
 * @param dateA - The first date
 * @param dateB - The second date
 * @returns true if both dates represent the same calendar year
 * @public
 */
export const isSameYear = (dateA: Date, dateB: Date): boolean =>
  dateA.getFullYear() === dateB.getFullYear()

/**
 * Checks if two dates represent the same calendar month.
 *
 * This comparison ignores the day and time components and only compares the month and year parts.
 * Useful for monthly reports and date grouping.
 *
 * @example
 * ```typescript
 * const date1 = new Date('2023-01-15') // January
 * const date2 = new Date('2023-02-15') // February
 * const date3 = new Date('2024-01-15') // January of next year
 *
 * isSameMonth(date1, date2) // false
 * isSameMonth(date1, date3) // true
 * ```
 *
 * @param dateA - The first date
 * @param dateB - The second date
 * @returns true if both dates represent the same calendar month
 * @public
 */
export const isSameMonth = (dateA: Date, dateB: Date): boolean =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth()

/**
 * Checks if two dates represent the same calendar week.
 *
 * This comparison uses the ISO 8601 week definition, where weeks start on Monday.
 * Useful for weekly reports and date grouping.
 *
 * @example
 * ```typescript
 * const date1 = new Date('2023-01-15') // Monday
 * const date2 = new Date('2023-01-16') // Tuesday
 * const date3 = new Date('2023-01-22') // Monday of next week
 *
 * isSameWeek(date1, date2) // true
 * isSameWeek(date1, date3) // false
 * ```
 *
 * @param dateA - The first date
 * @param dateB - The second date
 * @returns true if both dates represent the same calendar week
 * @public
 */
export const isSameWeek = (dateA: Date, dateB: Date): boolean =>
  startOfWeek(dateA).getTime() === startOfWeek(dateB).getTime()

/**
 * Checks if two dates represent the same calendar day.
 *
 * This comparison ignores time components and only compares the date parts.
 * Useful for date-based filtering and grouping.
 *
 * @example
 * ```typescript
 * const date1 = new Date('2023-01-15T10:30:00')
 * const date2 = new Date('2023-01-15T18:45:00')
 * const date3 = new Date('2023-01-16T10:30:00')
 *
 * isSameDay(date1, date2) // true
 * isSameDay(date1, date3) // false
 * ```
 *
 * @param dateA - The first date
 * @param dateB - The second date
 * @returns true if both dates represent the same calendar day
 * @public
 */
export const isSameDay = (dateA: Date, dateB: Date): boolean =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate()

/**
 * Checks if two dates represent the same hour.
 *
 * This comparison ignores date and minute components and only compares the hour parts.
 * Useful for time-based filtering and grouping.
 *
 * @example
 * ```typescript
 * const date1 = new Date('2023-01-15T10:30:00')
 * const date2 = new Date('2023-01-15T10:45:00')
 * const date3 = new Date('2023-01-16T10:30:00')
 *
 * isSameHour(date1, date2) // true
 * isSameHour(date1, date3) // false
 * ```
 *
 * @param dateA - The first date
 * @param dateB - The second date
 * @returns true if both dates represent the same hour
 * @public
 */
export const isSameHour = (dateA: Date, dateB: Date): boolean =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate() &&
  dateA.getHours() === dateB.getHours()

/**
 * Checks if two dates represent the same minute.
 *
 * This comparison ignores date, hour, and second components and only compares the minute parts.
 * Useful for time-based filtering and grouping.
 *
 * @example
 * ```typescript
 * const date1 = new Date('2023-01-15T10:30:00')
 * const date2 = new Date('2023-01-15T10:30:45')
 * const date3 = new Date('2023-01-16T10:30:00')
 *
 * isSameMinute(date1, date2) // true
 * isSameMinute(date1, date3) // false
 * ```
 *
 * @param dateA - The first date
 * @param dateB - The second date
 * @returns true if both dates represent the same minute
 * @public
 */
export const isSameMinute = (dateA: Date, dateB: Date): boolean =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate() &&
  dateA.getHours() === dateB.getHours() &&
  dateA.getMinutes() === dateB.getMinutes()

/**
 * Checks if two dates represent the same second.
 *
 * This comparison ignores date, hour, and minute components and only compares the second parts.
 * Useful for time-based filtering and grouping.
 *
 * @example
 * ```typescript
 * const date1 = new Date('2023-01-15T10:30:00')
 * const date2 = new Date('2023-01-15T10:30:00')
 * const date3 = new Date('2023-01-16T10:30:00')
 *
 * isSameSecond(date1, date2) // true
 * isSameSecond(date1, date3) // false
 * ```
 *
 * @param dateA - The first date
 * @param dateB - The second date
 * @returns true if both dates represent the same second
 * @public
 */
export const isSameSecond = (dateA: Date, dateB: Date): boolean =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate() &&
  dateA.getHours() === dateB.getHours() &&
  dateA.getMinutes() === dateB.getMinutes() &&
  dateA.getSeconds() === dateB.getSeconds()

/**
 * Checks if a date falls on a weekend (Saturday or Sunday).
 *
 * This is useful for business logic that needs to handle weekends differently,
 * such as scheduling or date calculations.
 *
 * @example
 * ```typescript
 * const saturday = new Date('2023-01-14') // Saturday
 * const monday = new Date('2023-01-16') // Monday
 *
 * isWeekend(saturday) // true
 * isWeekend(monday) // false
 * ```
 *
 * @param date - The date to check
 * @returns true if the date is a Saturday or Sunday
 * @public
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday = 0, Saturday = 6
}

/**
 * Compares two dates.
 *
 * @param a - The first date
 * @param b - The second date
 * @returns A negative number if `a` is less than `b`, zero if they are equal, or a positive number if `a` is greater than `b`.
 * @public
 */
export const compareDates = (a: Date, b: Date): number => {
  return a.getTime() - b.getTime()
}

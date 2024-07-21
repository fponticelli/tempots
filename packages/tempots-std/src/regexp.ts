/**
 * Utility module to manipulate `RegExp` instances.
 */

/**
 * Map the function `f` on each occurance matched by the pattern.
 * @param f - The function to apply to each match.
 * @param pattern - The pattern to match.
 * @param subject - The string to search.
 * @public
 */
export const mapRegExp = (
  subject: string,
  pattern: RegExp,
  f: (...s: string[]) => string
): string => {
  const buff = [] as string[]
  let pos = 0
  let result: RegExpExecArray | null
  if (pattern.global) {
    pattern.lastIndex = 0
    while ((result = pattern.exec(subject)) !== null) {
      buff.push(subject.substring(pos, result.index))
      buff.push(f(...result))
      pos = result.index + result[0].length
    }
  } else {
    while ((result = pattern.exec(subject.substring(pos))) !== null) {
      buff.push(subject.substring(pos, pos + result.index))
      buff.push(f(...result))
      pos += result.index + result[0].length
    }
  }
  buff.push(subject.substring(pos))
  return buff.join('')
}

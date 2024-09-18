const boolProperties = new Set(['checked', 'disabled', 'hidden', 'selected'])
const numberProperties = new Set([
  'rowSpan',
  'colSpan',
  'tabIndex',
  'valueAsNumber',
])
const dateProperties = new Set(['valueAsDate'])
const stringProperties = new Set([
  'value',
  'textContent',
  'innerText',
  'innerHTML',
  'outerHTML',
  'className',
  'classList',
])

/**
 * Creates a setter function for an element attribute based on the attribute's type.
 *
 * The returned setter function will set the attribute value on the given element
 * using the appropriate method (e.g. `setAttribute()`, `setProperty()`) based
 * on the attribute's type.
 *
 * @param attributeName - The name of the attribute to create a setter for.
 * @returns A function that sets the attribute value on an element.
 * @internal
 */
export const _makeSetter = (attributeName: string, element: Element) => {
  if (boolProperties.has(attributeName)) {
    return (value: unknown) => {
      if (value == null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(element as any)[attributeName] = null
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(element as any)[attributeName] = Boolean(value)
      }
    }
  } else if (numberProperties.has(attributeName)) {
    return (value: unknown) => {
      if (value == null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(element as any)[attributeName] = null
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(element as any)[attributeName] = Number(value)
      }
    }
  } else if (dateProperties.has(attributeName)) {
    return (value: unknown) => {
      if (value == null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(element as any)[attributeName] = null
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(element as any)[attributeName] = value
      }
    }
  } else if (stringProperties.has(attributeName)) {
    return (value: unknown) => {
      if (value == null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(element as any)[attributeName] = null
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(element as any)[attributeName] = String(value)
      }
    }
  } else {
    return (value: unknown) => {
      if (value == null) {
        element.removeAttribute(attributeName)
      } else {
        element.setAttribute(attributeName, value as string)
      }
    }
  }
}

/**
 * Creates a getter function for a specific HTML element attribute.
 *
 * The returned getter function takes an `Element` and returns the value of the
 * specified attribute. The function handles different attribute types (boolean,
 * number, date, string) and returns the appropriate type.
 *
 * @param attributeName - The name of the HTML element attribute to get.
 * @returns A function that takes an `Element` and returns the value of the
 * specified attribute.
 * @internal
 */
export const _makeGetter = (attributeName: string, element: Element) => {
  if (boolProperties.has(attributeName)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => Boolean((element as any)[attributeName])
  } else if (numberProperties.has(attributeName)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => Number((element as any)[attributeName])
  } else if (dateProperties.has(attributeName)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => (element as any)[attributeName]
  } else if (stringProperties.has(attributeName)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => String((element as any)[attributeName])
  } else {
    return () => element.getAttribute(attributeName)
  }
}

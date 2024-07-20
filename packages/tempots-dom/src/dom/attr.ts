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

const cache = new Map<string, (element: Element, value: unknown) => void>()

const getOrCreate = (
  attributeName: string,
  make: (attributeName: string) => (element: Element, value: unknown) => void
): ((element: Element, value: unknown) => void) => {
  if (cache.has(attributeName)) {
    return cache.get(attributeName)!
  } else {
    const f = make(attributeName)
    cache.set(attributeName, f)
    return f
  }
}

/**
 * Sets a boolean property on an HTML element.
 *
 * If the `value` is `null`, the property is set to `null`. Otherwise, the
 * property is set to the boolean value of `value`.
 *
 * @param attributeName - The name of the boolean property to set.
 * @returns A function that takes an `Element` and a `value` and sets the
 * boolean property on the element.
 * @public
 */
export const setBooleanProperty =
  (attributeName: string) => (element: Element, value: unknown) => {
    if (value == null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(element as any)[attributeName] = null
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(element as any)[attributeName] = Boolean(value)
    }
  }

/**
 * Sets a numeric property on an HTML element.
 *
 * If the provided `value` is `null`, the property will be set to `null`.
 * Otherwise, the property will be set to the numeric value of the provided `value`.
 *
 * @param attributeName - The name of the property to set on the element.
 * @returns A function that takes an `Element` and a `value` and sets the property.
 * @public
 */
export const setNumberProperty =
  (attributeName: string) => (element: Element, value: unknown) => {
    if (value == null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(element as any)[attributeName] = null
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(element as any)[attributeName] = Number(value)
    }
  }

/**
 * Sets a date property on an element.
 *
 * If the `value` is `null`, the date property is set to `null`. Otherwise, the
 * date property is set to the provided `value`.
 *
 * @param attributeName - The name of the date property to set on the element.
 * @returns A function that takes an element and a value, and sets the date
 * property on the element.
 * @public
 */
export const setDateProperty =
  (attributeName: string) => (element: Element, value: unknown) => {
    if (value == null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(element as any)[attributeName] = null
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(element as any)[attributeName] = value
    }
  }

/**
 * Sets a string property on an `Element` object.
 *
 * If the provided `value` is `null`, the property will be set to `null`.
 * Otherwise, the `value` will be converted to a string and set as the property.
 *
 * @param attributeName - The name of the property to set on the `Element`.
 * @returns A function that takes an `Element` and a `value` and sets the property.
 * @public
 */
export const setStringProperty =
  (attributeName: string) => (element: Element, value: unknown) => {
    if (value == null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(element as any)[attributeName] = null
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(element as any)[attributeName] = String(value)
    }
  }

/**
 * Sets the specified attribute on the given element to the provided value.
 * If the value is `null`, the attribute will be removed from the element.
 *
 * @param attributeName - The name of the attribute to set.
 * @returns A function that takes an element and a value, and sets the attribute on the element.
 * @public
 */
export const setAttribute =
  (attributeName: string) => (element: Element, value: unknown) => {
    if (value == null) {
      element.removeAttribute(attributeName)
    } else {
      element.setAttribute(attributeName, value as string)
    }
  }

/**
 * Creates a setter function for an element attribute based on the attribute's type.
 *
 * The returned setter function will set the attribute value on the given element
 * using the appropriate method (e.g. `setAttribute()`, `setProperty()`) based
 * on the attribute's type.
 *
 * @param attributeName - The name of the attribute to create a setter for.
 * @returns A function that sets the attribute value on an element.
 * @public
 */
export const makeSetter = (
  attributeName: string
): ((element: Element, value: unknown) => void) => {
  if (boolProperties.has(attributeName)) {
    return getOrCreate(attributeName, setBooleanProperty)
  } else if (numberProperties.has(attributeName)) {
    return getOrCreate(attributeName, setNumberProperty)
  } else if (dateProperties.has(attributeName)) {
    return getOrCreate(attributeName, setDateProperty)
  } else if (stringProperties.has(attributeName)) {
    return getOrCreate(attributeName, setStringProperty)
  } else {
    return getOrCreate(attributeName, setAttribute)
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
 * @public
 */
export const makeGetter =
  <T>(attributeName: string): ((element: Element) => T) =>
  (element: Element) => {
    if (boolProperties.has(attributeName)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Boolean((element as any)[attributeName])
    } else if (numberProperties.has(attributeName)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Number((element as any)[attributeName])
    } else if (dateProperties.has(attributeName)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (element as any)[attributeName]
    } else if (stringProperties.has(attributeName)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return String((element as any)[attributeName])
    } else {
      return element.getAttribute(attributeName)
    }
  }

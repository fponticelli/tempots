const boolProperties = new Set([
  'checked',
  'disabled',
  'hidden',
  'multiple',
  'readonly',
  'required',
  'autofocus',
])
const boolAttributes = new Set(['selected'])

const numberProperties = new Set([
  'rowSpan',
  'colSpan',
  'tabIndex',
  'valueAsNumber',
])
const dateProperties = new Set(['valueAsDate'])
const propertyAliases: Record<string, string> = {
  readonly: 'readOnly',
}

/**
 * String properties that are set directly on the DOM element.
 *
 * **Security Note:** `innerHTML` and `outerHTML` are included here but should be used
 * with caution. Never pass untrusted user input to these properties as it can lead
 * to XSS (Cross-Site Scripting) attacks. Use `textContent` or `innerText` for safe
 * text content insertion.
 */
const stringProperties = new Set([
  'value',
  'textContent',
  'innerText',
  // ⚠️ XSS Warning: innerHTML and outerHTML can execute arbitrary scripts if set with untrusted input
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
  if (boolAttributes.has(attributeName)) {
    return (value: unknown) => {
      if (value == null || value !== true) {
        element.removeAttribute(attributeName)
      } else {
        element.setAttribute(attributeName, '')
      }
    }
  } else if (boolProperties.has(attributeName)) {
    const propName = propertyAliases[attributeName] || attributeName
    return (value: unknown) => {
      if (value == null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(element as any)[propName] = null
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(element as any)[propName] = Boolean(value)
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
  if (boolAttributes.has(attributeName)) {
    return () => element.hasAttribute(attributeName)
  } else if (boolProperties.has(attributeName)) {
    return () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Boolean((element as any)[propertyAliases[attributeName] || attributeName])
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

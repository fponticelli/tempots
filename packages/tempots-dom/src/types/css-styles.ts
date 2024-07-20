/**
 * Represents a set of properties or values that are excluded from the CSSStyleDeclaration interface.
 *
 * @public
 */
export type ExcludeFromStyle =
  | 'getPropertyPriority'
  | 'getPropertyValue'
  | 'item'
  | 'removeProperty'
  | 'setProperty'
  | 'parentRule'
  | 'length'
  | 'name'
  | number

/**
 * Represents a subset of CSS styles.
 * It is a type that excludes certain properties from the `CSSStyleDeclaration` type.
 *
 * @public
 */
export type CSSStyles = Omit<CSSStyleDeclaration, ExcludeFromStyle>

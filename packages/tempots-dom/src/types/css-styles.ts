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

export type CSSStyles = Omit<CSSStyleDeclaration, ExcludeFromStyle>

/**
 * Style properties for native views (flexbox, sizing, spacing, position, visual).
 * @public
 */
export interface ViewStyle {
  // Flexbox
  flex?: number
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  flexGrow?: number
  flexShrink?: number
  flexBasis?: number | string
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  alignSelf?:
    | 'auto'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'stretch'
    | 'baseline'
  alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'stretch'
    | 'space-between'
    | 'space-around'
  /** Gap between flex children (shorthand for rowGap + columnGap). */
  gap?: number
  /** Gap between rows in a flex container. */
  rowGap?: number
  /** Gap between columns in a flex container. */
  columnGap?: number

  // Sizing
  width?: number | string
  height?: number | string
  minWidth?: number | string
  minHeight?: number | string
  maxWidth?: number | string
  maxHeight?: number | string
  /** Aspect ratio of the view (width / height). */
  aspectRatio?: number

  // Spacing
  margin?: number | string
  marginTop?: number | string
  marginRight?: number | string
  marginBottom?: number | string
  marginLeft?: number | string
  marginHorizontal?: number | string
  marginVertical?: number | string
  padding?: number | string
  paddingTop?: number | string
  paddingRight?: number | string
  paddingBottom?: number | string
  paddingLeft?: number | string
  paddingHorizontal?: number | string
  paddingVertical?: number | string

  // Position
  position?: 'relative' | 'absolute'
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
  zIndex?: number

  // Visual
  backgroundColor?: string
  opacity?: number
  overflow?: 'visible' | 'hidden' | 'scroll'
  display?: 'flex' | 'none'
  /** Whether the back face is visible when rotated (for flip animations). */
  backfaceVisibility?: 'visible' | 'hidden'

  // Borders
  borderWidth?: number
  borderTopWidth?: number
  borderRightWidth?: number
  borderBottomWidth?: number
  borderLeftWidth?: number
  borderColor?: string
  borderTopColor?: string
  borderRightColor?: string
  borderBottomColor?: string
  borderLeftColor?: string
  borderRadius?: number
  borderTopLeftRadius?: number
  borderTopRightRadius?: number
  borderBottomLeftRadius?: number
  borderBottomRightRadius?: number
  borderStyle?: 'solid' | 'dotted' | 'dashed'

  // Shadows
  shadowColor?: string
  shadowOffset?: { width: number; height: number }
  shadowOpacity?: number
  shadowRadius?: number
  /** Android shadow elevation. */
  elevation?: number

  // Transforms
  transform?: Array<
    | { translateX: number }
    | { translateY: number }
    | { scale: number }
    | { scaleX: number }
    | { scaleY: number }
    | { rotate: string }
    | { rotateX: string }
    | { rotateY: string }
    | { rotateZ: string }
    | { skewX: string }
    | { skewY: string }
  >
}

/**
 * Style properties for text views.
 * @public
 */
export interface TextStyle extends ViewStyle {
  color?: string
  fontSize?: number
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
  fontFamily?: string
  fontStyle?: 'normal' | 'italic'
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify'
  textDecorationLine?:
    | 'none'
    | 'underline'
    | 'line-through'
    | 'underline line-through'
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  letterSpacing?: number
  lineHeight?: number
  textShadowColor?: string
  textShadowOffset?: { width: number; height: number }
  textShadowRadius?: number
}

/**
 * Style properties for image views.
 * @public
 */
export interface ImageStyle extends ViewStyle {
  /** How the image should be resized to fit its container. */
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center'
  /** Tint color applied to the image (iOS: tintColor, Android: colorFilter). */
  tintColor?: string
  /** Overlay color drawn on top of the image (Android only). */
  overlayColor?: string
}

/**
 * Image source types.
 * @public
 */
export type ImageSource =
  | { uri: string; width?: number; height?: number }
  | number // require('...') asset ID

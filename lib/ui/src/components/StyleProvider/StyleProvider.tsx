import { css, CSSObject } from '@emotion/css'
import {
  JSX,
  Portal,
  Prop,
  OnRemove,
  Provider,
  makeProviderMark,
  Signal,
  When
} from '@tempots/dom'
import { resetCss } from '../../styles/reset'
import { getRadiusSize, getSize, Size } from '../../styles/size'
import { defaultDarkStyles, defaultLightStyles, UIStyles } from '../../styles/ui-styles'
import { Sx } from '../styling/Sx'

export interface Styles {
  components: UIComponentStyles
  styles: UIStyles
}

export interface UITheme {
  styles: Signal<Styles>,
  isLight: Prop<boolean>
}

export interface StyleProviderProps {
  children?: JSX.Element
}

export const StyleMarker = makeProviderMark<UITheme>()

const counter = Prop.of(0)

export const StyleProvider = (
  { children }: StyleProviderProps
) => {
  const isLight = Prop.of(true)
  const styles = isLight.map(v => {
    if (v) {
      return {
        components: defaultComponentStyle(defaultLightStyles),
        styles: defaultLightStyles
      }
    } else {
      return {
        components: defaultComponentStyle(defaultDarkStyles),
        styles: defaultDarkStyles
      }
    }
  })

  counter.update(v => v + 1)

  return (
    <Provider value={{ styles, isLight }} mark={StyleMarker}>
      <Sx sx={{ backgroundColor: styles.map(v => v.styles.background.color as any) }} />
      <When is={counter.map(v => v > 0)}>
        <Portal selector="head">
          <style>{resetCss}</style>
        </Portal>
      </When>
      {children}
      <OnRemove clear={() => counter.update(v => v - 1)} />
    </Provider>
  )
}

export type ComponentClasses<T> = (options: T) => string

export interface UIComponentStyles {
  button: {
    root: ComponentClasses<ButtonStyles>
    content: ComponentClasses<ButtonStyles>
  }
  control: {
    root: ComponentClasses<ControlStyles>
  }
}


export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger'

export interface ButtonStyles {
  size: Size | number
  compact: boolean
  // isLight: boolean
  // active: boolean
  variant: ButtonVariant
  // color?: Color
}

export interface ControlStyles {
  size: Size
  spacing: Size
}

export const defaultComponentStyle = ({
  font,
  border,
  spacing,
  background,
  control
}: UIStyles): UIComponentStyles => {
  return {
    button: {
      root: ({ size, variant, compact }) => {
        const obj: CSSObject = {
          alignContent: 'center',
          display: 'inline-flex',
          alignItems: 'center',
          fontWeight: 500,
          fontSize: getSize(size, 'md', font.size),
          borderRadius: getRadiusSize('md', 'sm', border.radius),
          border: `1px solid ${control.borderColor}`,
          backgroundColor: background.color,
          color: font.color,
          padding: `0 ${spacing.md / (compact ? 2 : 1)}px`,
          textShadow: control.accentTextShadow,
          boxShadow: control.shadow,
          // minWidth: getSize(size, 'md', control.height),
          height: getSize(size, 'md', control.height),
          cursor: 'pointer',
          fontFamily: font.family.control
        }
        obj[':hover:not([disabled])'] = {
          backgroundColor: background.inverseColor,
          color: font.inverseColor,
        }
        obj[':focus'] = {
          outline: `2px solid ${control.focusColor}`,
          outlineOffset: 0.5
        }

        obj[':active:not([disabled])'] = {
          transform: 'translateY(2px)'
        }

        obj[':disabled'] = {
          cursor: 'not-allowed',
          backgroundColor: background.mutedColor,
          color: font.mutedColor
        }
        return css(obj)
      },
      content: ({ size, variant, compact }) => {
        return css({
          minWidth: '1.25em',
          margin: '0 auto',
        })
      }
    },
    control: {
      root: ({ size, spacing: sp }) => {
        const obj: CSSObject = {
          display: 'inline-flex',
          alignItems: 'center',
          flexDirection: 'row',
          gap: getSize(sp, 'md', spacing),
          overflow: 'hidden',
          lineHeight: getSize(size, 'md', control.height),
          height: getSize(size, 'md', control.height),
          fontWeight: 500,
          padding: `0 2px`,
          fontSize: getSize(size, 'md', font.size),
          fontFamily: font.family.control,
          borderRadius: getRadiusSize('md', 'sm', border.radius),
          border: `1px solid ${control.borderColor}`,
          backgroundColor: background.color,
          color: font.color,
          ':focus-within': {
            outline: `2px solid ${control.focusColor}`,
            outlineOffset: 0.5
          }
        }
        return css(obj)
      }
    }
  }
}

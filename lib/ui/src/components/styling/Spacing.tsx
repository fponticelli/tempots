import { Signal, ClassName, Consumer, JSX } from '@tempots/dom'
import { Size, getSizeOrNull } from '../../styles/size'
import {
  CSSObjectOfProperties,
  objectOfPropertiesToSignalOfObject,
  sxToClassProp
} from '../../styles/sx'
import { StyleMarker, UITheme } from '../StyleProvider/StyleProvider'

export type Space = JSX.VValue<Size> | JSX.VValue<number>

export interface SpacingProps {
  m?: Space
  mt?: Space
  mr?: Space
  mb?: Space
  ml?: Space
  mh?: Space
  mv?: Space
  ms?: Space
  me?: Space
  mis?: Space
  mie?: Space
  p?: Space
  pt?: Space
  pr?: Space
  pb?: Space
  pl?: Space
  ph?: Space
  pv?: Space
  ps?: Space
  pe?: Space
  pis?: Space
  pie?: Space
}

const map: Record<keyof SpacingProps, string[]> = {
  m: ['margin'],
  mt: ['marginTop'],
  mr: ['marginRight'],
  mb: ['marginBottom'],
  ml: ['marginLeft'],
  ms: ['marginBlockStart'],
  me: ['marginBlockEnd'],
  mis: ['marginInlineStart'],
  mie: ['marginInlineEnd'],
  p: ['padding'],
  pt: ['paddingTop'],
  pr: ['paddingRight'],
  pb: ['paddingBottom'],
  pl: ['paddingLeft'],
  ps: ['paddingBlockStart'],
  pe: ['paddingBlockEnd'],
  pis: ['paddingInlineStart'],
  pie: ['paddingInlineEnd'],
  mh: ['marginStart', 'marginEnd'],
  mv: ['marginTop', 'marginBottom'],
  ph: ['paddingStart', 'paddingEnd'],
  pv: ['paddingTop', 'paddingBottom']
}

export const Spacing = (
  props: SpacingProps
) => {
  return (
    <Consumer mark={StyleMarker}>
      {(theme: UITheme) => {
        const keys = Object.keys(props).filter(
          k => k !== 'children'
        ) as (keyof SpacingProps)[]

        if (keys.length === 0) return null

        const sx = keys.reduce((acc, k) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const s = Signal.wrap(props[k] as any).combine(theme.styles, (s, { styles: { spacing } }) => [s, spacing])
          for (const kk of map[k]) {
            if (acc[kk] == null) {
              continue
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            acc[kk] = s.map(([v, spacing]) => getSizeOrNull(v, spacing)) as any
          }
          return acc
        }, {} as CSSObjectOfProperties)
        return <ClassName value={sxToClassProp(objectOfPropertiesToSignalOfObject(sx))} />
      }}
    </Consumer>
  )
}

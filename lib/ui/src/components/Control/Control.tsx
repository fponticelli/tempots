import { Consumer, JSX, Signal } from "@tempots/dom"
import { Size } from "../../styles/size"
import { StyleMarker, Styles, UITheme } from "../StyleProvider/StyleProvider"

export interface ControlProps {
  size?: Signal<Size>
  spacing?: Signal<Size>
  children?: JSX.DOMNode
}

export const Control = (props: ControlProps) => {
  const { children, size, spacing } = props
  return (
    <Consumer mark={StyleMarker}>
      {({ styles }: UITheme) => {
        const cls = Signal.combine(
          [
            styles,
            size ?? Signal.of<Size>('md'),
            spacing ?? Signal.of<Size>('md')
          ],
          (styles: Styles, size: Size, spacing: Size) => {
            return styles.components.control.root({ size, spacing })
          }
        )
        return (
          <div className={cls}>
            {children}
          </div>
        )
      }}
    </Consumer>
  )
}

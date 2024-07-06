import { Consumer, JSX, Signal, ClassName } from '@tempots/dom'
import { Size } from '../../styles/size'
import { ButtonVariant, StyleMarker, Styles, UITheme } from '../StyleProvider/StyleProvider'

export interface ButtonProps {
  children?: JSX.DOMNode
  disabled?: Signal<boolean>
  onClick?: () => void
  size?: Signal<Size>
  variant?: Signal<ButtonVariant>
  compact?: Signal<boolean>
}

export function Button(
  { children, size, disabled, onClick, variant, compact }: ButtonProps
) {
  return (
    <Consumer mark={StyleMarker}>
      {(theme: UITheme) => {
        const cls = Signal.combine(
          [
            theme.styles,
            size ?? Signal.of<Size>('md'),
            variant ?? Signal.of<ButtonVariant>('primary'),
            compact ?? Signal.of(false)
          ],
          ({ components: { button: { root, content } } }: Styles, size: Size, variant: ButtonVariant, compact: boolean) => {
            return [
              root({ size, variant, compact }),
              content({ size, variant, compact })
            ]
          }
        )

        return <button disabled={disabled} type="button" onClick={onClick}>
          <ClassName value={cls.at(0)} />
          <span>
            <ClassName value={cls.at(1)} />
            {children}
          </span>
        </button>
      }}
    </Consumer>
  )
}

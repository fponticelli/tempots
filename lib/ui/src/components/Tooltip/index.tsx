import { Consumer, JSX, Signal, Attribute } from "@tempots/dom";
import { UnstyledPopover, Placement } from "../Popover";
import { onTargetOverMount } from "../Popover/UnstyledPopover";
import { StyleMarker, UITheme } from "../StyleProvider/StyleProvider";
import { Sx } from "../styling/Sx";

export interface TooltipProps {
  children?: JSX.DOMNode
}

const ARROW_SIZE = 8;

export function Tooltip({ children }: TooltipProps) {
  return (
    <>
      <Consumer mark={StyleMarker}>
        {({ styles }: UITheme) => {
          const at = styles.at('styles').at
          return (
            <UnstyledPopover
              onTargetMount={onTargetOverMount}
              placement={Signal.of('top' as Placement)}
              arrow={
                <div>
                  <Sx sx={{
                    backgroundColor: at('background').at('inverseColor') as Signal<any>,
                    boxShadow: at('shadow').at('md') as Signal<any>,
                    marginTop: -ARROW_SIZE / 2,
                    transform: `rotate(45deg)`,
                    width: ARROW_SIZE,
                    height: ARROW_SIZE
                  }} />
                </div>}
            >
              <Attribute name="role" value={Signal.of("tooltip")} />
              <Sx sx={{
                maxWidth: '200px',
                height: 'auto',
                lineHeight: '1em',
                textAlign: 'center',
                whiteSpace: 'normal',
                backgroundColor: at('background').at('inverseColor') as Signal<any>,
                color: at('font').at('inverseColor') as Signal<any>,
                padding: at('spacing').map(v => `${v.xs}px ${v.md}px`) as Signal<any>,
                borderRadius: at('border').at('radius').at('sm') as Signal<any>,
                boxShadow: at('shadow').at('md') as Signal<any>,
              }} />
              {children}
            </UnstyledPopover>)
        }}
      </Consumer>
    </>
  )
}

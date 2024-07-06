import { Consumer, JSX, Signal, Attribute, Prop } from "@tempots/dom";
import { UnstyledPopover, Placement } from "../Popover";
import { onTargetClickMount, onTargetOverMount } from "../Popover/UnstyledPopover";
import { StyleMarker, UITheme } from "../StyleProvider/StyleProvider";
import { Sx } from "../styling/Sx";

export type OpenStrategy = 'click' | 'hover';

export interface PopoverProps {
  children?: JSX.DOMNode
  openStrategy?: OpenStrategy
  maxWidth?: Signal<number>
  opened?: Prop<boolean>
}

const ARROW_SIZE = 8;

export function Popover({ children, openStrategy, maxWidth, opened }: PopoverProps) {
  return (
    <>
      <Consumer mark={StyleMarker}>
        {({ styles }: UITheme) => {
          const at = styles.at('styles').at
          return (
            <UnstyledPopover
              opened={opened}
              arrowOver={true}
              onTargetMount={openStrategy === 'hover' ? onTargetOverMount : onTargetClickMount}
              placement={Signal.of('bottom' as Placement)}
              offset={Signal.of(ARROW_SIZE)}
              arrow={
                <div>
                  <Sx sx={{
                    backgroundColor: at('background').at('color') as Signal<any>,
                    // boxShadow: at('shadow').at('md') as Signal<any>,
                    border: at('control').map(v => `1px solid ${v.borderColor}`) as Signal<any>,
                    borderRight: 'none',
                    borderBottom: 'none',
                    marginTop: -ARROW_SIZE / 2,
                    transform: `rotate(45deg)`,
                    width: ARROW_SIZE,
                    height: ARROW_SIZE
                  }} />
                </div>}
            >
              <Attribute name="role" value={Signal.of("dialog")} />
              <Sx sx={{
                maxWidth: (maxWidth ?? Signal.of(240)) as Signal<any>,
                height: 'auto',
                lineHeight: '1em',
                textAlign: 'center',
                whiteSpace: 'normal',
                backgroundColor: at('background').at('color') as Signal<any>,
                color: at('font').at('color') as Signal<any>,
                padding: at('spacing').map(v => `${v.xs}px ${v.md}px`) as Signal<any>,
                border: at('control').map(v => `1px solid ${v.borderColor}`) as Signal<any>,
                borderRadius: at('border').at('radius').at('md') as Signal<any>,
                boxShadow: at('shadow').at('md') as Signal<any>,
              }} />
              {children}
            </UnstyledPopover>)
        }}
      </Consumer>
    </>
  )
}

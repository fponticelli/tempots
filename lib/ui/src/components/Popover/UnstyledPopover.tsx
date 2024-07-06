import { If, Lifecycle, JSX, Signal, Prop, Tween, When } from "@tempots/dom";
import { computePosition, flip, shift, offset, arrow } from "@floating-ui/dom";
import { Sx } from "../styling/Sx";

export type Alignment = 'start' | 'end';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type AlignedPlacement = `${Side}-${Alignment}`;
export type Placement = Side | AlignedPlacement;

export interface UnstyledPopoverProps {
  children?: JSX.DOMNode
  placement?: Signal<Placement>
  shiftPadding?: Signal<number>
  offset?: Signal<number>
  arrow?: JSX.DOMNode
  arrowOver?: boolean
  arrowPadding?: Signal<number>
  onTargetMount?: (el: HTMLElement, open: () => void, close: () => void) => () => void
  opened?: Prop<boolean>
}

export function onTargetOverMount(el: HTMLElement, open: () => void, close: () => void): () => void {
  el.addEventListener('mouseenter', open)
  el.addEventListener('mouseleave', close)
  el.addEventListener('focus', open)
  el.addEventListener('blur', close)
  return () => {
    el.removeEventListener('mouseenter', open)
    el.removeEventListener('mouseleave', close)
    el.removeEventListener('focus', open)
    el.removeEventListener('blur', close)
  }
}

export function onTargetClickMount(el: HTMLElement, open: () => void, close: () => void): () => void {
  el.addEventListener('click', open)
  function clickOutside(e: MouseEvent) {
    if (!el.contains(e.target as Node)) {
      close()
    }
  }
  document.addEventListener('click', clickOutside)
  return () => {
    el.removeEventListener('click', open)
    document.removeEventListener('click', clickOutside)
  }
}

export function UnstyledPopover({
  children,
  placement: maybePlacement,
  shiftPadding: maybeShiftPadding,
  offset: maybeOffset,
  arrow: maybeArrow,
  arrowOver,
  arrowPadding: maybeArrowPadding,
  onTargetMount,
  opened: passedOpened
}: UnstyledPopoverProps) {
  let target: HTMLElement | null = null;
  let dropdown: HTMLElement | null = null;
  let arrowElement: HTMLElement | null = null;
  const placement = maybePlacement ?? Signal.of('bottom')
  const shiftPadding = maybeShiftPadding ?? Signal.of(5)
  const offsetValue = maybeOffset ?? Signal.of(5)
  const arrowPadding = maybeArrowPadding ?? Signal.of(0)
  const opened = passedOpened ?? Prop.of(false)
  const placementTop = Prop.of(false)

  function open() { opened.set(true) }
  function close() { opened.set(false) }

  function execute() {
    if (!target || !dropdown) return;
    const middleware = []

    if (maybeArrow == null) {
      middleware.push(flip())
    }

    middleware.push(
      shift({ padding: shiftPadding.get() }),
      offset(offsetValue.get())
    );

    if (arrowElement != null) {
      middleware.push(arrow({
        element: arrowElement,
        padding: arrowPadding.get()
      }));
    }

    computePosition(target, dropdown, {
      placement: placement.get(),
      middleware
    }).then(({ x, y, middlewareData, placement }) => {
      if (!dropdown) return;
      placementTop.set(placement.includes('top'))
      dropdown.style.top = `${y}px`;
      dropdown.style.left = `${x}px`;
      if (arrowElement != null && middlewareData.arrow != null) {
        const { x, y } = middlewareData.arrow;
        arrowElement.style.top = y != null ? `${y}px` : '';
        arrowElement.style.left = x != null ? `${x}px` : '';
      }
    });
  }

  let unmountTarget: (() => void) | undefined = undefined;
  function onMountTarget(element: HTMLElement) {
    target = element;
    unmountTarget = onTargetMount?.(element, open, close)
  }

  function onUnmountTarget() {
    target = null;
    unmountTarget?.();
  }

  function onMountArrow(element: HTMLElement) {
    arrowElement = element;
  }

  function onUnmountArrow() {
    arrowElement = null;
  }

  function onMountDropdown(element: HTMLElement) {
    dropdown = element;
    window.addEventListener('resize', execute);
    execute()
  }

  function onUnmountDropdown() {
    dropdown = null;
    window.removeEventListener('resize', execute);
  }

  return (
    <>
      <When is={opened}>
        <div>
          <Tween
            enter={[
              { style: { opacity: 1, translateY: 0 }, duration: 250 }
            ]}
            exit={[
              { style: { opacity: 0, translateY: 12 }, duration: 1000 }
            ]}
            style={{ opacity: 0, translateY: 12 }}
          />
          <Sx sx={{ position: 'absolute' }} />
          <When is={placementTop.map(v => !v && maybeArrow != null)}>
            <div>
              <Sx sx={{ position: 'absolute', zIndex: arrowOver ? 1 : 0 }} />
              <Lifecycle onMount={onMountArrow} onUnmount={onUnmountArrow} />
              {maybeArrow}
            </div>
          </When>
          <div>
            <Sx sx={{ zIndex: arrowOver ? 0 : 1, position: 'relative' }} />
            {children}
          </div>
          <When is={placementTop.map(v => v && maybeArrow != null)}>
            <div>
              <Sx sx={{ position: 'absolute', zIndex: arrowOver ? 1 : 0 }} />
              <Lifecycle onMount={onMountArrow} onUnmount={onUnmountArrow} />
              {maybeArrow}
            </div>
          </When>
          <Lifecycle onMount={onMountDropdown} onUnmount={onUnmountDropdown} />
        </div>
      </When>
      <Lifecycle onMount={onMountTarget} onUnmount={onUnmountTarget} />
    </>
  );
}

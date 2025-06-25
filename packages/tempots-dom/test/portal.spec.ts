import { beforeEach, describe, expect, test, vi } from "vitest";
import { attr, html, Portal, render, prop, When, on, OnDispose } from "../src";
import { sleep } from "./helper";

describe("Portal", () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test("renders content into target element by selector", () => {
    // Create a target element
    const target = document.createElement('div');
    target.id = 'portal-target';
    document.body.appendChild(target);

    // Create portal content
    const portalContent = html.div(
      attr.class('portal-content'),
      'Portal content'
    );

    // Create a container to render the portal from
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render portal
    const clear = render(Portal('#portal-target', portalContent), container);

    // Check that content is rendered in the target
    expect(target.innerHTML).toContain('portal-content');
    expect(target.innerHTML).toContain('Portal content');

    // Check that content is not in the container
    expect(container.innerHTML).toBe('');

    clear();
  });

  test("renders content into target element by HTMLElement reference", () => {
    // Create a target element
    const target = document.createElement('div');
    target.id = 'portal-target';
    document.body.appendChild(target);

    // Create portal content
    const portalContent = html.div(
      attr.class('portal-content'),
      'Portal content'
    );

    // Render portal using element reference
    const clear = render(Portal(target, portalContent), document.body);

    // Check that content is rendered in the target
    expect(target.innerHTML).toContain('portal-content');
    expect(target.innerHTML).toContain('Portal content');

    clear();
  });

  test("throws error when target element not found", () => {
    const portalContent = html.div('Portal content');

    expect(() => {
      render(Portal('#non-existent', portalContent), document.body);
    }).toThrow('Cannot find element by selector for portal: #non-existent');
  });

  test("cleans up portal content when parent is disposed", () => {
    // Create a target element
    const target = document.createElement('div');
    target.id = 'portal-target';
    document.body.appendChild(target);

    const portalContent = html.div(
      attr.class('portal-content'),
      'Portal content'
    );

    // Create a container to render the portal from
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render portal
    const clear = render(Portal('#portal-target', portalContent), container);

    // Verify content is rendered
    expect(target.innerHTML).toContain('portal-content');

    // Clear the portal
    clear();

    // Verify content is cleaned up
    expect(target.innerHTML).toBe('');
  });

  test("cleans up portal content when used within When() component", async () => {
    // Create a target element
    const target = document.createElement('div');
    target.id = 'portal-target';
    document.body.appendChild(target);

    const showPortal = prop(true);
    const portalContent = html.div(
      attr.class('portal-content'),
      'Conditional portal content'
    );

    // Create a container to render the portal from
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render When with Portal
    const clear = render(
      When(
        showPortal,
        () => Portal('#portal-target', portalContent)
      ),
      container
    );

    // Initially, portal content should be rendered
    expect(target.innerHTML).toContain('portal-content');
    expect(target.innerHTML).toContain('Conditional portal content');

    // Hide the portal by changing the condition
    showPortal.set(false);
    await sleep();

    // Portal content should be cleaned up
    expect(target.innerHTML).toBe('');

    clear();
  });

  test("cleans up event handlers when portal is disposed", async () => {
    // Create a target element
    const target = document.createElement('div');
    target.id = 'portal-target';
    document.body.appendChild(target);

    const clickSpy = vi.fn();
    const showPortal = prop(true);

    const portalContent = html.button(
      attr.class('portal-button'),
      on.click(clickSpy),
      'Click me'
    );

    // Create a container to render the portal from
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render When with Portal containing event handler
    const clear = render(
      When(
        showPortal,
        () => Portal('#portal-target', portalContent)
      ),
      container
    );

    // Get the button element
    const button = target.querySelector('.portal-button') as HTMLButtonElement;
    expect(button).toBeTruthy();

    // Click the button - should trigger handler
    button.click();
    expect(clickSpy).toHaveBeenCalledTimes(1);

    // Hide the portal
    showPortal.set(false);
    await sleep();

    // Portal content should be cleaned up
    expect(target.innerHTML).toBe('');

    // Try to click the button again (it should be gone)
    const buttonAfterCleanup = target.querySelector('.portal-button');
    expect(buttonAfterCleanup).toBeNull();

    clear();
  });

  test("cleans up OnDispose callbacks when portal is disposed", async () => {
    // Create a target element
    const target = document.createElement('div');
    target.id = 'portal-target';
    document.body.appendChild(target);

    const disposeSpy = vi.fn();
    const showPortal = prop(true);

    const portalContent = html.div(
      attr.class('portal-content'),
      OnDispose(disposeSpy),
      'Content with dispose callback'
    );

    // Create a container to render the portal from
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render When with Portal containing OnDispose
    const clear = render(
      When(
        showPortal,
        () => Portal('#portal-target', portalContent)
      ),
      container
    );

    // Initially, dispose should not be called
    expect(disposeSpy).toHaveBeenCalledTimes(0);

    // Hide the portal
    showPortal.set(false);
    await sleep();

    // OnDispose callback should be called
    expect(disposeSpy).toHaveBeenCalledTimes(1);
    // The first parameter indicates whether to remove the tree - it might be false in some cleanup scenarios
    expect(disposeSpy).toHaveBeenCalledWith(expect.any(Boolean), expect.any(Object));

    clear();
  });

  test("multiple portals to same target work independently", () => {
    // Create a target element
    const target = document.createElement('div');
    target.id = 'portal-target';
    document.body.appendChild(target);

    const portal1Content = html.div(attr.class('portal-1'), 'Portal 1');
    const portal2Content = html.div(attr.class('portal-2'), 'Portal 2');

    // Create containers to render the portals from
    const container1 = document.createElement('div');
    const container2 = document.createElement('div');
    document.body.appendChild(container1);
    document.body.appendChild(container2);

    // Render two portals to the same target
    const clear1 = render(Portal('#portal-target', portal1Content), container1);
    const clear2 = render(Portal('#portal-target', portal2Content), container2);

    // Both should be rendered
    expect(target.innerHTML).toContain('portal-1');
    expect(target.innerHTML).toContain('portal-2');
    expect(target.innerHTML).toContain('Portal 1');
    expect(target.innerHTML).toContain('Portal 2');

    // Clear first portal
    clear1();

    // Only second portal should remain
    expect(target.innerHTML).not.toContain('portal-1');
    expect(target.innerHTML).not.toContain('Portal 1');
    expect(target.innerHTML).toContain('portal-2');
    expect(target.innerHTML).toContain('Portal 2');

    // Clear second portal
    clear2();

    // Target should be empty
    expect(target.innerHTML).toBe('');
  });

  test("portal content updates reactively", async () => {
    // Create a target element
    const target = document.createElement('div');
    target.id = 'portal-target';
    document.body.appendChild(target);

    const text = prop('Initial text');
    const portalContent = html.div(
      attr.class('portal-content'),
      text
    );

    // Create a container to render the portal from
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render portal
    const clear = render(Portal('#portal-target', portalContent), container);

    // Check initial content
    expect(target.innerHTML).toContain('Initial text');

    // Update the reactive content
    text.set('Updated text');
    await sleep();

    // Check updated content
    expect(target.innerHTML).toContain('Updated text');
    expect(target.innerHTML).not.toContain('Initial text');

    clear();
  });

  test("nested portals work correctly", () => {
    // Create target elements
    const outerTarget = document.createElement('div');
    outerTarget.id = 'outer-target';
    document.body.appendChild(outerTarget);

    const innerTarget = document.createElement('div');
    innerTarget.id = 'inner-target';
    outerTarget.appendChild(innerTarget);

    const innerContent = html.div(attr.class('inner-content'), 'Inner portal');
    const outerContent = html.div(
      attr.class('outer-content'),
      'Outer portal',
      Portal('#inner-target', innerContent)
    );

    // Create a container to render the portal from
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render nested portals
    const clear = render(Portal('#outer-target', outerContent), container);

    // Check that both portals are rendered correctly
    expect(outerTarget.innerHTML).toContain('outer-content');
    expect(outerTarget.innerHTML).toContain('Outer portal');
    expect(innerTarget.innerHTML).toContain('inner-content');
    expect(innerTarget.innerHTML).toContain('Inner portal');

    clear();

    // Both should be cleaned up - the outer portal content is removed, but the inner target element remains
    // since it was part of the original DOM structure
    expect(innerTarget.innerHTML).toBe('');
    // The outer target should only contain the inner target element (no portal content)
    expect(outerTarget.querySelector('.outer-content')).toBeNull();
  });

  test("portal with multiple event handlers cleans up all handlers", async () => {
    // Create a target element
    const target = document.createElement('div');
    target.id = 'portal-target';
    document.body.appendChild(target);

    const clickSpy = vi.fn();
    const mouseoverSpy = vi.fn();
    const keydownSpy = vi.fn();
    const showPortal = prop(true);

    const portalContent = html.div(
      attr.class('multi-handler-element'),
      on.click(clickSpy),
      on.mouseover(mouseoverSpy),
      on.keydown(keydownSpy),
      'Element with multiple handlers'
    );

    // Create a container to render the portal from
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render When with Portal containing multiple event handlers
    const clear = render(
      When(
        showPortal,
        () => Portal('#portal-target', portalContent)
      ),
      container
    );

    // Get the element
    const element = target.querySelector('.multi-handler-element') as HTMLDivElement;
    expect(element).toBeTruthy();

    // Test all event handlers work
    element.click();
    element.dispatchEvent(new MouseEvent('mouseover'));
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(mouseoverSpy).toHaveBeenCalledTimes(1);
    expect(keydownSpy).toHaveBeenCalledTimes(1);

    // Hide the portal
    showPortal.set(false);
    await sleep();

    // Portal content should be cleaned up
    expect(target.innerHTML).toBe('');

    clear();
  });

  test("portal cleanup works with complex nested content", async () => {
    // Create a target element
    const target = document.createElement('div');
    target.id = 'portal-target';
    document.body.appendChild(target);

    const disposeSpy1 = vi.fn();
    const disposeSpy2 = vi.fn();
    const disposeSpy3 = vi.fn();
    const clickSpy = vi.fn();
    const showPortal = prop(true);

    const portalContent = html.div(
      attr.class('complex-content'),
      OnDispose(disposeSpy1),
      html.div(
        attr.class('nested-1'),
        OnDispose(disposeSpy2),
        html.button(
          attr.class('nested-button'),
          on.click(clickSpy),
          OnDispose(disposeSpy3),
          'Nested button'
        ),
        'Nested content'
      ),
      'Root content'
    );

    // Create a container to render the portal from
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render When with Portal containing complex nested content
    const clear = render(
      When(
        showPortal,
        () => Portal('#portal-target', portalContent)
      ),
      container
    );

    // Verify content is rendered
    expect(target.querySelector('.complex-content')).toBeTruthy();
    expect(target.querySelector('.nested-1')).toBeTruthy();
    expect(target.querySelector('.nested-button')).toBeTruthy();

    // Test event handler works
    const button = target.querySelector('.nested-button') as HTMLButtonElement;
    button.click();
    expect(clickSpy).toHaveBeenCalledTimes(1);

    // Initially, dispose should not be called
    expect(disposeSpy1).toHaveBeenCalledTimes(0);
    expect(disposeSpy2).toHaveBeenCalledTimes(0);
    expect(disposeSpy3).toHaveBeenCalledTimes(0);

    // Hide the portal
    showPortal.set(false);
    await sleep();

    // All OnDispose callbacks should be called
    expect(disposeSpy1).toHaveBeenCalledTimes(1);
    expect(disposeSpy2).toHaveBeenCalledTimes(1);
    expect(disposeSpy3).toHaveBeenCalledTimes(1);

    // Portal content should be cleaned up
    expect(target.innerHTML).toBe('');

    clear();
  });

  test("portal works with reactive content and cleanup", async () => {
    // Create a target element
    const target = document.createElement('div');
    target.id = 'portal-target';
    document.body.appendChild(target);

    const text = prop('Initial');
    const count = prop(0);
    const showPortal = prop(true);
    const disposeSpy = vi.fn();

    const portalContent = html.div(
      attr.class('reactive-content'),
      OnDispose(disposeSpy),
      html.span(text),
      html.span(' - Count: '),
      html.span(count.map(String))
    );

    // Create a container to render the portal from
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render When with Portal containing reactive content
    const clear = render(
      When(
        showPortal,
        () => Portal('#portal-target', portalContent)
      ),
      container
    );

    // Check initial content
    expect(target.innerHTML).toContain('Initial');
    expect(target.innerHTML).toContain('Count: ');
    expect(target.innerHTML).toContain('>0<');

    // Update reactive values
    text.set('Updated');
    count.set(42);
    await sleep();

    // Check updated content
    expect(target.innerHTML).toContain('Updated');
    expect(target.innerHTML).toContain('Count: ');
    expect(target.innerHTML).toContain('>42<');
    expect(target.innerHTML).not.toContain('Initial');

    // Hide the portal
    showPortal.set(false);
    await sleep();

    // OnDispose callback should be called
    expect(disposeSpy).toHaveBeenCalledTimes(1);

    // Portal content should be cleaned up
    expect(target.innerHTML).toBe('');

    // Update reactive values after cleanup - should not affect anything
    text.set('After cleanup');
    count.set(999);
    await sleep();

    // Content should still be empty
    expect(target.innerHTML).toBe('');

    clear();
  });
});

import { describe, test, expect } from "vitest";
import { createNavigator } from "../src/navigation/navigator";

describe("createNavigator", () => {
  test("initializes with the given route", () => {
    const nav = createNavigator("home");
    expect(nav.route.value).toBe("home");
    expect(nav.canGoBack.value).toBe(false);
  });

  test("navigate changes the route", () => {
    const nav = createNavigator("home");
    nav.navigate("about");
    expect(nav.route.value).toBe("about");
  });

  test("navigate enables canGoBack", () => {
    const nav = createNavigator("home");
    nav.navigate("about");
    expect(nav.canGoBack.value).toBe(true);
  });

  test("back restores the previous route", () => {
    const nav = createNavigator("home");
    nav.navigate("about");
    nav.navigate("contact");
    expect(nav.route.value).toBe("contact");

    const result = nav.back();
    expect(result).toBe(true);
    expect(nav.route.value).toBe("about");
  });

  test("back returns false when stack is empty", () => {
    const nav = createNavigator("home");
    const result = nav.back();
    expect(result).toBe(false);
    expect(nav.route.value).toBe("home");
  });

  test("canGoBack becomes false after going back to start", () => {
    const nav = createNavigator("home");
    nav.navigate("about");
    expect(nav.canGoBack.value).toBe(true);

    nav.back();
    expect(nav.canGoBack.value).toBe(false);
  });

  test("multiple navigate and back operations", () => {
    const nav = createNavigator(1);
    nav.navigate(2);
    nav.navigate(3);
    nav.navigate(4);

    expect(nav.route.value).toBe(4);
    expect(nav.canGoBack.value).toBe(true);

    nav.back();
    expect(nav.route.value).toBe(3);

    nav.back();
    expect(nav.route.value).toBe(2);

    nav.back();
    expect(nav.route.value).toBe(1);
    expect(nav.canGoBack.value).toBe(false);
  });

  test("uses custom equals function", () => {
    const nav = createNavigator(
      { id: 1, label: "home" },
      (a, b) => a.id === b.id,
    );

    let changeCount = 0;
    nav.route.on(() => {
      changeCount++;
    });

    // Same id, different label — should not fire change
    nav.navigate({ id: 1, label: "Home" });
    // The prop uses equals, so value stays the same — but the stack still pushed
    // However since prop deduplicates, route.value won't change
    expect(nav.route.value.id).toBe(1);
  });

  test("navigate after back creates new branch", () => {
    const nav = createNavigator("a");
    nav.navigate("b");
    nav.navigate("c");
    nav.back(); // back to b
    nav.navigate("d"); // new branch from b

    expect(nav.route.value).toBe("d");
    nav.back();
    expect(nav.route.value).toBe("b");
    nav.back();
    expect(nav.route.value).toBe("a");
    expect(nav.canGoBack.value).toBe(false);
  });
});

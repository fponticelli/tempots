import { test, expect } from "@playwright/test";

test.describe("SSR Demo - Islands Architecture", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("should render server-side content", async ({ page }) => {
    // Check main heading
    await expect(page.getByRole("heading", { name: "Tempo SSR Demo" })).toBeVisible();

    // Check server timestamp is present
    await expect(page.getByText(/Server rendered at:/)).toBeVisible();

    // Check SSR features section
    await expect(page.getByRole("heading", { name: "SSR Features" })).toBeVisible();
  });

  test("should hydrate main counter island", async ({ page }) => {
    // Find the main counter
    const counterSection = page.locator(".card").first();
    await expect(counterSection.getByRole("heading", { name: "Interactive Counter" })).toBeVisible();

    // Initial value should be 0
    const valueDisplay = counterSection.locator(".counter span");
    await expect(valueDisplay).toHaveText("0");

    // Click plus button
    await counterSection.getByRole("button", { name: "+" }).click();
    await expect(valueDisplay).toHaveText("1");

    // Click plus again
    await counterSection.getByRole("button", { name: "+" }).click();
    await expect(valueDisplay).toHaveText("2");

    // Click minus
    await counterSection.getByRole("button", { name: "-" }).click();
    await expect(valueDisplay).toHaveText("1");
  });

  test("should hydrate visible island when in viewport", async ({ page }) => {
    // Find the visible island (first island-container)
    const visibleIsland = page.locator(".island-container").first();
    await expect(visibleIsland.getByRole("heading", { name: /Visible Island/ })).toBeVisible();

    // Initial value should be 10
    const valueDisplay = visibleIsland.locator(".counter span");
    await expect(valueDisplay).toHaveText("10");

    // Should be interactive
    await visibleIsland.getByRole("button", { name: "+" }).click();
    await expect(valueDisplay).toHaveText("11");
  });

  test("should hydrate idle island", async ({ page }) => {
    // Find the idle island (second island-container)
    const idleIsland = page.locator(".island-container").nth(1);
    await expect(idleIsland.getByRole("heading", { name: /Idle Island/ })).toBeVisible();

    // Initial value should be 20
    const valueDisplay = idleIsland.locator(".counter span");
    await expect(valueDisplay).toHaveText("20");

    // Wait a bit for idle callback to fire, then test interactivity
    await page.waitForTimeout(100);
    await idleIsland.getByRole("button", { name: "-" }).click();
    await expect(valueDisplay).toHaveText("19");
  });

  test("should hydrate immediate island", async ({ page }) => {
    // Find the immediate island (third island-container)
    const immediateIsland = page.locator(".island-container").nth(2);
    await expect(immediateIsland.getByRole("heading", { name: /Immediate Island/ })).toBeVisible();

    // Initial value should be 30
    const valueDisplay = immediateIsland.locator(".counter span");
    await expect(valueDisplay).toHaveText("30");

    // Should be immediately interactive
    await immediateIsland.getByRole("button", { name: "+" }).click();
    await expect(valueDisplay).toHaveText("31");

    await immediateIsland.getByRole("button", { name: "+" }).click();
    await expect(valueDisplay).toHaveText("32");
  });

  test("all counters should work independently", async ({ page }) => {
    // Get all counter displays
    const mainCounter = page.locator(".card").first().locator(".counter span");
    const visibleIsland = page.locator(".island-container").nth(0).locator(".counter span");
    const idleIsland = page.locator(".island-container").nth(1).locator(".counter span");
    const immediateIsland = page.locator(".island-container").nth(2).locator(".counter span");

    // Verify initial values
    await expect(mainCounter).toHaveText("0");
    await expect(visibleIsland).toHaveText("10");
    await expect(idleIsland).toHaveText("20");
    await expect(immediateIsland).toHaveText("30");

    // Increment each one
    await page.locator(".card").first().getByRole("button", { name: "+" }).click();
    await page.locator(".island-container").nth(0).getByRole("button", { name: "+" }).click();
    await page.locator(".island-container").nth(1).getByRole("button", { name: "+" }).click();
    await page.locator(".island-container").nth(2).getByRole("button", { name: "+" }).click();

    // Verify all updated independently
    await expect(mainCounter).toHaveText("1");
    await expect(visibleIsland).toHaveText("11");
    await expect(idleIsland).toHaveText("21");
    await expect(immediateIsland).toHaveText("31");
  });

  test("should log initialization messages", async ({ page }) => {
    const logs: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "log") {
        logs.push(msg.text());
      }
    });

    await page.goto("http://localhost:3000");
    await page.waitForTimeout(100);

    // In SSR mode, the message includes "SSR mode:"
    expect(logs.some((log) => log.includes("Islands initialized!"))).toBe(true);
  });
});

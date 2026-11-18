import { defineConfig, devices } from "@playwright/test";

const demoPort = process.env.SSR_DEMO_TEST_PORT ?? "4301";
const baseURL = `http://127.0.0.1:${demoPort}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "line" : "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev:ssr",
    url: baseURL,
    env: { PORT: demoPort, HOST: "127.0.0.1" },
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
});

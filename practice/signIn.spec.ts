import { test, expect } from "@playwright/test";

test("Open qaauto", async ({ page }) => {
  await page.goto("/");
});
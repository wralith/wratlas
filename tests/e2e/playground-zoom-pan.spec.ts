import { expect, test } from "@playwright/test"
import { PlaygroundPage } from "./pages/playground-page"

const MOD_KEY = process.platform === "darwin" ? "Meta" : "Control"

test.beforeEach(async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.resetBrowserStorage()
})

test("zoom in with keyboard shortcut changes zoom level", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  const zoomPercent = playground.getZoomPercentValue()
  await expect.poll(async () => zoomPercent).toBe("100")

  await page.keyboard.press(`${MOD_KEY}+=`)

  await expect.poll(async () => playground.getZoomPercentValue()).not.toBe("100")
})

test("zoom out with keyboard shortcut changes zoom level", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await page.keyboard.press(`${MOD_KEY}+-`)

  await expect.poll(async () => playground.getZoomPercentValue()).not.toBe("100")
})

test("reset viewport with keyboard shortcut restores default zoom", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await page.keyboard.press(`${MOD_KEY}+=`)
  await expect.poll(async () => playground.getZoomPercentValue()).not.toBe("100")

  await page.keyboard.press(`${MOD_KEY}+0`)
  await expect.poll(async () => playground.getZoomPercentValue()).toBe("100")
})

test("zoom panel number input accepts manual zoom value", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  const zoomInput = page.locator('[aria-label="Zoom percent"]')
  await zoomInput.fill("150")
  await page.keyboard.press("Enter")

  await expect.poll(async () => playground.getZoomPercentValue()).toBe("150")
})

import path from "node:path"
import { fileURLToPath } from "node:url"
import { expect, test } from "@playwright/test"
import { PlaygroundPage } from "./pages/playground-page"

const MOD_KEY = process.platform === "darwin" ? "Meta" : "Control"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const sampleImagePath = path.resolve(__dirname, "./fixtures/sample-image.svg")

test.beforeEach(async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.resetBrowserStorage()
  await playground.resetAssetsStorage()
})

test("switch between multiple canvases preserves objects per canvas", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await playground.addImage(sampleImagePath)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await playground.createCanvas("Canvas B")
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(0)

  await playground.addImage(sampleImagePath)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await playground.switchCanvas("Default Canvas")
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await playground.switchCanvas("Canvas B")
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)
})

test("save image object to assets via context menu", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await playground.addImage(sampleImagePath)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await playground.openContextMenuOnFirstObject()
  await page.getByRole("menuitem", { name: "Save to Assets" }).click()

  await expect.poll(async () => playground.hasAssetsStorage()).toBe(true)
})

test("context menu shows order submenu for objects", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await playground.addImage(sampleImagePath)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  const point = await playground.getFirstObjectPosition()
  expect(point).not.toBeNull()
  if (!point) return

  await playground.openContextMenuAtCanvasPoint(point.left + 24, point.top + 24)

  const menu = page.getByRole("menu", { name: "Canvas menu" })
  await expect(menu).toBeVisible()
  await expect(page.getByRole("menuitem", { name: "Order" })).toBeVisible()

  await page.getByRole("menuitem", { name: "Order" }).hover()

  await expect(page.getByRole("menuitem", { name: "Bring forward" })).toBeVisible()
  await expect(page.getByRole("menuitem", { name: "Bring to front" })).toBeVisible()
  await expect(page.getByRole("menuitem", { name: "Send backward" })).toBeVisible()
  await expect(page.getByRole("menuitem", { name: "Send to back" })).toBeVisible()
})

test("copy object via context menu does not duplicate", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await playground.addImage(sampleImagePath)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await playground.openContextMenuOnFirstObject()
  await page.getByRole("menuitem", { name: "Copy object" }).click()

  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)
})

test("reset view from context menu after zoom", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await page.keyboard.press(`${MOD_KEY}+=`)
  await expect.poll(async () => playground.getZoomPercentValue()).not.toBe("100")

  await playground.openContextMenuOnEmptyCanvas()

  const resetView = page.getByRole("menuitem", { name: "Reset view" })
  await expect(resetView).toBeVisible()
  await expect(resetView).not.toBeDisabled()
  await resetView.click()

  await expect.poll(async () => playground.getZoomPercentValue()).toBe("100")
})

test("canvas combobox actions: create, switch, rename, delete cycle", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await playground.createCanvas("Temporary Canvas")
  await expect(page.getByRole("button", { name: "Select canvas" })).toContainText("Temporary Canvas")

  await playground.renameActiveCanvas("Renamed Canvas")
  await expect(page.getByRole("button", { name: "Select canvas" })).toContainText("Renamed Canvas")

  await playground.createCanvas("Another Canvas")

  await playground.switchCanvas("Default Canvas")
  await expect(page.getByRole("button", { name: "Select canvas" })).toContainText("Default Canvas")

  await playground.switchCanvas("Another Canvas")
  await expect(page.getByRole("button", { name: "Select canvas" })).toContainText("Another Canvas")

  await playground.deleteActiveCanvas()
  await expect(page.getByRole("button", { name: "Select canvas" })).toContainText("Renamed Canvas")
})

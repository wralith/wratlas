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
})

test("add, delete, undo and redo image object", async ({ page }) => {
  const playground = new PlaygroundPage(page)

  await playground.goto()
  await playground.addImage(sampleImagePath)

  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await playground.deleteSelectedObject()
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(0)

  await page.keyboard.press(`${MOD_KEY}+z`)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await page.keyboard.press(`${MOD_KEY}+Shift+z`)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(0)
})

test("create, rename and delete a canvas", async ({ page }) => {
  const playground = new PlaygroundPage(page)

  await playground.goto()

  await playground.createCanvas("Roadmap Canvas")
  await expect(page.getByRole("button", { name: "Select canvas" })).toContainText("Roadmap Canvas")

  await playground.renameActiveCanvas("Roadmap v2")
  await expect(page.getByRole("button", { name: "Select canvas" })).toContainText("Roadmap v2")

  await playground.deleteActiveCanvas()

  await expect(page.getByRole("button", { name: "Select canvas" })).toContainText("Default Canvas")
  await expect.poll(async () => (await playground.getStorage()).canvases.length).toBe(1)
})

test("open shortcuts modal and keep objects after reload", async ({ page }) => {
  const playground = new PlaygroundPage(page)

  await playground.goto()
  await playground.addImage(sampleImagePath)

  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await playground.openShortcuts()
  await expect(page.getByRole("heading", { name: "Keyboard Shortcuts" })).toBeVisible()
  await playground.closeShortcuts()
  await expect(page.getByRole("heading", { name: "Keyboard Shortcuts" })).not.toBeVisible()

  await page.reload()
  await expect(playground.lowerCanvas).toBeVisible()
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)
})

test("move object updates stored position", async ({ page }) => {
  const playground = new PlaygroundPage(page)

  await playground.goto()
  await playground.addImage(sampleImagePath)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  const before = await playground.getFirstObjectPosition()
  expect(before).not.toBeNull()
  if (!before) {
    throw new Error("Expected first object position to exist")
  }

  await playground.dragObjectFromCanvasPoint(before, 140, 90)

  await expect
    .poll(async () => {
      const after = await playground.getFirstObjectPosition()
      if (!after || !before) return false

      const movedX = Math.abs(after.left - before.left) > 30
      const movedY = Math.abs(after.top - before.top) > 30
      return movedX || movedY
    })
    .toBe(true)
})

test("copy shortcut does not duplicate object", async ({ page }) => {
  const playground = new PlaygroundPage(page)

  await playground.goto()
  await playground.addImage(sampleImagePath)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await page.keyboard.press(`${MOD_KEY}+c`)

  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)
})

test("deleting the only canvas is disabled", async ({ page }) => {
  const playground = new PlaygroundPage(page)

  await playground.goto()
  await playground.openCanvasMenu()

  const deleteButton = page.getByRole("button", { name: "Delete Canvas" })
  await expect(deleteButton).toBeDisabled()
})

test("right click on image opens image context menu", async ({ page }) => {
  const playground = new PlaygroundPage(page)

  await playground.goto()
  await playground.addImage(sampleImagePath)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await playground.openContextMenuOnFirstObject()

  const menu = page.getByRole("menu", { name: "Canvas menu" })
  await expect(menu).toBeVisible()
  await expect(page.getByRole("menuitem", { name: "Copy object" })).toBeVisible()
  await expect(page.getByRole("menuitem", { name: "Delete object" })).toBeVisible()
  await expect(page.getByRole("menuitem", { name: "Add image" })).not.toBeVisible()

  await page.getByRole("menuitem", { name: "Delete object" }).click()
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(0)
})

test("right click on empty canvas opens canvas context menu", async ({ page }) => {
  const playground = new PlaygroundPage(page)

  await playground.goto()
  await playground.openContextMenuOnEmptyCanvas()

  const menu = page.getByRole("menu", { name: "Canvas menu" })
  await expect(menu).toBeVisible()
  await expect(page.getByRole("menuitem", { name: "Add image" })).toBeVisible()
  await expect(page.getByRole("menuitem", { name: "Reset view" })).toBeVisible()
  await expect(page.getByRole("menuitem", { name: "Reset view" })).toBeDisabled()

  const fileChooserPromise = page.waitForEvent("filechooser")
  await page.getByRole("menuitem", { name: "Add image" }).click()
  const fileChooser = await fileChooserPromise
  await fileChooser.setFiles(sampleImagePath)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)
})

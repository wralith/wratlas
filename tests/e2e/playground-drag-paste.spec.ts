import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { expect, test } from "@playwright/test"
import { PlaygroundPage } from "./pages/playground-page"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const sampleImagePath = path.resolve(__dirname, "./fixtures/sample-image.svg")

test.beforeEach(async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.resetBrowserStorage()
})

test("drag and drop image onto canvas creates object", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(0)

  const svgContent = await readFile(sampleImagePath, "utf-8")

  await page.evaluate(
    async ({ svg }) => {
      const canvas = document.querySelector('canvas[data-fabric="main"]')
      if (!canvas) return
      const wrapper = canvas.parentElement
      if (!wrapper) return

      const blob = new Blob([svg], { type: "image/svg+xml" })
      const file = new File([blob], "dropped.svg", { type: "image/svg+xml" })

      const dt = new DataTransfer()
      dt.items.add(file)

      const event = new DragEvent("drop", {
        dataTransfer: dt,
        bubbles: true,
        cancelable: true,
      })

      wrapper.dispatchEvent(event)
    },
    { svg: svgContent },
  )

  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)
})

test("paste image from clipboard creates object", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(0)

  const svgContent = await readFile(sampleImagePath, "utf-8")

  await page.evaluate(
    async ({ svg }) => {
      const blob = new Blob([svg], { type: "image/svg+xml" })
      const file = new File([blob], "pasted.svg", { type: "image/svg+xml" })

      const dt = new DataTransfer()
      dt.items.add(file)

      const event = new ClipboardEvent("paste", {
        clipboardData: dt,
        bubbles: true,
        cancelable: true,
      })

      document.dispatchEvent(event)
    },
    { svg: svgContent },
  )

  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)
})

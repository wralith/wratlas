import path from "node:path"
import { fileURLToPath } from "node:url"
import { expect, test } from "@playwright/test"
import { PlaygroundPage } from "./pages/playground-page"

const MOD_KEY = process.platform === "darwin" ? "Meta" : "Control"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const sampleImagePath = path.resolve(__dirname, "./fixtures/sample-image.svg")

const dragRect = async (p: PlaygroundPage, x: number, y: number, w: number, h: number) => {
  await p.page.getByRole("button", { name: "Rectangle" }).click()
  await p.page.waitForTimeout(100)
  const box = await p.upperCanvas.boundingBox()
  if (!box) throw new Error("Canvas bounding box not available")
  await p.page.mouse.move(box.x + x, box.y + y)
  await p.page.mouse.down()
  await p.page.mouse.move(box.x + x + w, box.y + y + h)
  await p.page.mouse.up()
  await p.page.waitForTimeout(200)
}

const pressCopy = async (page: import("@playwright/test").Page) => {
  await page.keyboard.press(`${MOD_KEY}+c`)
  await page.waitForTimeout(500)
}

const pressPaste = async (page: import("@playwright/test").Page) => {
  await page.keyboard.press(`${MOD_KEY}+v`)
}

const addRectViaEval = async (p: PlaygroundPage) => {
  await p.page.waitForFunction(() => !!(window as any).__fabric_canvas)
  await p.page.evaluate(() => {
    const canvas = (window as any).__fabric_canvas
    const rect = new (window as any).__fabric_Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 80,
      fill: "#444444",
    })
    canvas.add(rect)
    canvas.requestRenderAll()
  })
}

const addTextViaEval = async (p: PlaygroundPage) => {
  await p.page.waitForFunction(() => !!(window as any).__fabric_canvas)
  await p.page.evaluate(() => {
    const canvas = (window as any).__fabric_canvas
    const text = new (window as any).__fabric_IText("Hello", {
      left: 300,
      top: 100,
      fontSize: 24,
      fontFamily: "JetBrains Mono",
      fill: "#cdd6f4",
    })
    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.requestRenderAll()
  })
}

test.beforeEach(async ({ context, page }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  const playground = new PlaygroundPage(page)
  await playground.resetBrowserStorage()
})

test("copy and paste a single rect keeps type as rect", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await dragRect(playground, 200, 150, 150, 100)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)
  await expect.poll(async () => playground.getActiveCanvasObjectTypes()).toEqual(["Rect"])

  await pressCopy(page)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await pressPaste(page)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(2)
  await expect.poll(async () => playground.getActiveCanvasObjectTypes()).toEqual(["Rect", "Rect"])
})

test("copy and paste a single text keeps type as IText", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await addTextViaEval(playground)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)
  await expect.poll(async () => playground.getActiveCanvasObjectTypes()).toEqual(["IText"])

  await pressCopy(page)
  await pressPaste(page)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(2)
  await expect.poll(async () => playground.getActiveCanvasObjectTypes()).toEqual(["IText", "IText"])
})

test("copy and paste a single image keeps type as image", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await playground.addImage(sampleImagePath)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)
  await expect.poll(async () => playground.getActiveCanvasObjectTypes()).toEqual(["Image"])

  await pressCopy(page)
  await pressPaste(page)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(2)
  await expect.poll(async () => playground.getActiveCanvasObjectTypes()).toEqual(["Image", "Image"])
})

test("copy and paste multiple objects preserves each type", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await addRectViaEval(playground)
  await addTextViaEval(playground)

  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(2)
  await expect.poll(async () => playground.getActiveCanvasObjectTypes()).toEqual(["Rect", "IText"])

  await playground.upperCanvas.click()
  await page.evaluate(() => {
    const canvas = (window as any).__fabric_canvas
    if (!canvas) return
    canvas.discardActiveObject()
    const sel = new (window as any).__fabric_ActiveSelection(canvas.getObjects(), { canvas })
    canvas.setActiveObject(sel)
    canvas.requestRenderAll()
  })
  await pressCopy(page)

  await pressPaste(page)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(4)
  await expect.poll(async () => playground.getActiveCanvasObjectTypes()).toEqual(["Rect", "IText", "Rect", "IText"])
})

test("copy and paste image and object together keeps both as separate types", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await playground.addImage(sampleImagePath)
  await addRectViaEval(playground)

  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(2)
  await expect.poll(async () => playground.getActiveCanvasObjectTypes()).toEqual(["Image", "Rect"])

  await page.evaluate(() => {
    const canvas = (window as any).__fabric_canvas
    if (!canvas) return
    canvas.discardActiveObject()
    const sel = new (window as any).__fabric_ActiveSelection(canvas.getObjects(), { canvas })
    canvas.setActiveObject(sel)
    canvas.requestRenderAll()
  })
  await pressCopy(page)

  await pressPaste(page)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(4)
  await expect.poll(async () => playground.getActiveCanvasObjectTypes()).toEqual(["Image", "Rect", "Image", "Rect"])
})

test("copy paste does not duplicate original objects", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await dragRect(playground, 200, 150, 150, 100)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await pressCopy(page)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await pressPaste(page)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(2)

  await pressPaste(page)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(3)
})

test("copy and paste preserves object count after multiple pastes", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  await dragRect(playground, 200, 150, 150, 100)
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await pressCopy(page)
  await pressPaste(page)
  await pressPaste(page)
  await pressPaste(page)

  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(4)
  await expect.poll(async () => playground.getActiveCanvasObjectTypes()).toEqual(["Rect", "Rect", "Rect", "Rect"])
})

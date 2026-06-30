import path from "node:path"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { expect, test } from "@playwright/test"
import JSZip from "jszip"
import { PlaygroundPage } from "./pages/playground-page"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const sampleImagePath = path.resolve(__dirname, "./fixtures/sample-image.svg")

test.beforeEach(async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.resetBrowserStorage()
})

test("export canvas and import it back as a new canvas", async ({ page }, testInfo) => {
  const playground = new PlaygroundPage(page)

  await playground.goto()
  await playground.createCanvas("Export Source")
  await playground.addImage(sampleImagePath)

  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)

  await expect
    .poll(async () => {
      const storage = await playground.getStorage()
      return storage.activeCanvasId.length > 0 && storage.canvases.length === 2
    })
    .toBe(true)

  const beforeExport = await playground.getStorage()
  const sourceCanvas = beforeExport.canvases.find(canvas => canvas.id === beforeExport.activeCanvasId)
  expect(sourceCanvas).toBeTruthy()
  const sourceImage = sourceCanvas?.objects.find(object => object.type.toLowerCase() === "image")
  expect(sourceImage).toBeTruthy()

  const sourceImageId = sourceImage?._image_id
  expect(typeof sourceImageId).toBe("string")
  if (typeof sourceImageId !== "string") {
    throw new Error("Expected source image id")
  }

  const download = await playground.exportCanvas()
  const exportedPath = await download.path()
  expect(exportedPath).toBeTruthy()
  if (!exportedPath) {
    throw new Error("Expected export download path")
  }

  await testInfo.attach("exported-canvas.zip", {
    path: exportedPath,
    contentType: "application/zip",
  })

  const zip = await JSZip.loadAsync(await readFile(exportedPath))
  const canvasJsonText = await zip.file("canvas.json")?.async("text")
  expect(canvasJsonText).toBeTruthy()
  if (!canvasJsonText) {
    throw new Error("Expected canvas.json in exported zip")
  }

  const exportedCanvas = JSON.parse(canvasJsonText) as {
    objects: Array<{ type: string; _image_id?: string }>
  }
  const exportedImageIds = exportedCanvas.objects
    .filter(object => object.type.toLowerCase() === "image" && object._image_id)
    .map(object => object._image_id as string)

  expect(exportedImageIds).toContain(sourceImageId)

  const exportedAsset = zip.file(new RegExp(`^assets/${sourceImageId}(\\.[^/]+)?$`))
  expect(exportedAsset.length).toBeGreaterThan(0)

  await playground.importCanvas(exportedPath, "canvas.zip")

  await expect.poll(async () => (await playground.getStorage()).canvases.length).toBe(3)

  const afterImport = await playground.getStorage()
  expect(afterImport.activeCanvasId).not.toBe(beforeExport.activeCanvasId)

  const importedCanvas = afterImport.canvases.find(canvas => canvas.id === afterImport.activeCanvasId)
  expect(importedCanvas).toBeTruthy()
  if (!importedCanvas || !sourceCanvas) {
    throw new Error("Expected source and imported canvas")
  }

  expect(importedCanvas.name).toBe(sourceCanvas.name)
  expect(importedCanvas.id).not.toBe(sourceCanvas.id)
  expect(importedCanvas.objects.length).toBe(sourceCanvas.objects.length)

  const importedImage = importedCanvas.objects.find(object => object.type.toLowerCase() === "image")
  expect(importedImage).toBeTruthy()
  const importedImageId = importedImage?._image_id
  expect(typeof importedImageId).toBe("string")
  if (typeof importedImageId !== "string") {
    throw new Error("Expected imported image id")
  }

  expect(importedImageId).not.toBe(sourceImageId)
  await expect.poll(async () => playground.hasImageBlob(importedImageId)).toBe(true)
})

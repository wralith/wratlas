import { readFile } from "node:fs/promises"
import type { Locator, Page } from "@playwright/test"
import { expect } from "@playwright/test"

export type CanvasStorage = {
  activeCanvasId: string
  canvases: Array<{
    id: string
    name: string
    viewport?: {
      zoom: number
      x: number
      y: number
    }
    objects: Array<{
      type: string
      _image_id?: string
      left?: number
      top?: number
      [key: string]: unknown
    }>
  }>
}

type Point = {
  left: number
  top: number
}

const CANVAS_INDEX_KEY = "wratlas.canvas.v1.index"
const ASSETS_INDEX_KEY = "wratlas.assets.v1.index"
const IMAGE_DB_NAME = "wratlas-canvas-images-db"

export class PlaygroundPage {
  readonly page: Page
  readonly lowerCanvas: Locator
  readonly upperCanvas: Locator

  constructor(page: Page) {
    this.page = page
    this.lowerCanvas = page.locator('canvas[data-fabric="main"]')
    this.upperCanvas = page.locator('canvas[data-fabric="top"]')
  }

  resetBrowserStorage = async () => {
    await this.page.goto("/")

    await this.page.evaluate(async dbName => {
      localStorage.clear()

      await new Promise<void>(resolve => {
        const request = indexedDB.deleteDatabase(dbName)
        request.onsuccess = () => resolve()
        request.onerror = () => resolve()
        request.onblocked = () => resolve()
      })
    }, IMAGE_DB_NAME)
  }

  goto = async () => {
    await this.page.goto("/playground")
    await expect(this.lowerCanvas).toBeVisible()
    await expect(this.upperCanvas).toBeVisible()
  }

  addImage = async (filePath: string) => {
    await this.openContextMenuOnEmptyCanvas()

    const fileChooserPromise = this.page.waitForEvent("filechooser")
    await this.page.getByRole("menuitem", { name: "Add image" }).click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(filePath)
  }

  deleteSelectedObject = async () => {
    await this.page.keyboard.press("Delete")
  }

  openCanvasMenu = async () => {
    await this.page.getByRole("button", { name: "Select canvas" }).click()
  }

  createCanvas = async (name: string) => {
    await this.openCanvasMenu()
    await this.page.getByRole("button", { name: "Create Canvas" }).click()
    await this.page.locator("#canvas-name").fill(name)
    await this.page.getByRole("button", { name: "Add", exact: true }).click()
  }

  renameActiveCanvas = async (name: string) => {
    await this.openCanvasMenu()
    await this.page.getByRole("button", { name: "Rename Canvas" }).click()
    await this.page.locator("#canvas-name").fill(name)
    await this.page.getByRole("button", { name: "Rename" }).click()
  }

  deleteActiveCanvas = async () => {
    await this.openCanvasMenu()
    await this.page.getByRole("button", { name: "Delete Canvas" }).click()
    await this.page.getByRole("button", { name: "Delete", exact: true }).click()
  }

  openShortcuts = async () => {
    await this.page.getByRole("button", { name: "Keyboard shortcuts" }).click()
  }

  closeShortcuts = async () => {
    await this.page.getByRole("button", { name: "Close" }).click()
  }

  exportCanvas = async () => {
    const downloadPromise = this.page.waitForEvent("download")
    await this.page.getByRole("button", { name: "Export canvas" }).click()
    return downloadPromise
  }

  importCanvas = async (filePath: string, fileName?: string) => {
    const fileChooserPromise = this.page.waitForEvent("filechooser")
    await this.page.getByRole("button", { name: "Import canvas" }).click()
    const fileChooser = await fileChooserPromise

    if (!fileName) {
      await fileChooser.setFiles(filePath)
      return
    }

    const buffer = await readFile(filePath)
    await fileChooser.setFiles({
      name: fileName,
      mimeType: "application/zip",
      buffer,
    })
  }

  getStorage = async () => {
    return this.page.evaluate(indexKey => {
      const raw = localStorage.getItem(indexKey)
      if (!raw) {
        return { activeCanvasId: "", canvases: [] } as CanvasStorage
      }

      return JSON.parse(raw) as CanvasStorage
    }, CANVAS_INDEX_KEY)
  }

  getActiveCanvasObjectCount = async () => {
    const storage = await this.getStorage()
    const activeCanvas = storage.canvases.find(canvas => canvas.id === storage.activeCanvasId)
    return activeCanvas?.objects.length ?? 0
  }

  getFirstObjectPosition = async (): Promise<Point | null> => {
    const storage = await this.getStorage()
    const activeCanvas = storage.canvases.find(canvas => canvas.id === storage.activeCanvasId)
    const firstObject = activeCanvas?.objects[0]
    if (!firstObject) return null

    const left = firstObject.left
    const top = firstObject.top

    if (typeof left !== "number" || typeof top !== "number") {
      return null
    }

    return { left, top }
  }

  hasImageBlob = async (imageId: string) => {
    return this.page.evaluate(
      async ({ dbName, key }) => {
        const db = await new Promise<IDBDatabase | null>(resolve => {
          const request = indexedDB.open(dbName)
          request.onsuccess = () => resolve(request.result)
          request.onerror = () => resolve(null)
        })

        if (!db) return false

        const blob = await new Promise<Blob | null>(resolve => {
          const transaction = db.transaction("images", "readonly")
          const store = transaction.objectStore("images")
          const getRequest = store.get(key)
          getRequest.onsuccess = () => resolve((getRequest.result as Blob | undefined) ?? null)
          getRequest.onerror = () => resolve(null)
        })

        db.close()
        return !!blob
      },
      { dbName: IMAGE_DB_NAME, key: imageId },
    )
  }

  dragObjectFromCanvasPoint = async (from: Point, dx: number, dy: number) => {
    const box = await this.upperCanvas.boundingBox()
    if (!box) {
      throw new Error("Upper canvas bounding box is not available")
    }

    const startX = box.x + from.left + 24
    const startY = box.y + from.top + 24

    await this.page.mouse.move(startX, startY)
    await this.page.mouse.down()
    await this.page.mouse.move(startX + dx, startY + dy)
    await this.page.mouse.up()
  }

  openContextMenuOnFirstObject = async () => {
    const point = await this.getFirstObjectPosition()
    if (!point) {
      throw new Error("First canvas object position is not available")
    }

    await this.openContextMenuAtCanvasPoint(point.left + 24, point.top + 24)
  }

  openContextMenuOnEmptyCanvas = async () => {
    const box = await this.upperCanvas.boundingBox()
    if (!box) {
      throw new Error("Upper canvas bounding box is not available")
    }

    const x = Math.max(24, Math.floor(box.width / 2))
    const y = Math.max(72, Math.floor(box.height / 2))
    await this.openContextMenuAtCanvasPoint(x, y)
  }

  openContextMenuAtCanvasPoint = async (x: number, y: number) => {
    const box = await this.upperCanvas.boundingBox()
    if (!box) {
      throw new Error("Upper canvas bounding box is not available")
    }

    await this.page.mouse.click(box.x + x, box.y + y, { button: "right" })
  }

  switchCanvas = async (name: string) => {
    await this.openCanvasMenu()
    await this.page.getByRole("button", { name, exact: true }).click()
  }

  getZoomPercentValue = () => this.page.locator('[aria-label="Zoom percent"]').inputValue()

  hasAssetsStorage = async () => {
    return this.page.evaluate(key => !!localStorage.getItem(key), ASSETS_INDEX_KEY)
  }

  resetAssetsStorage = async () => {
    await this.page.goto("/")
    await this.page.evaluate(async key => {
      localStorage.removeItem(key)
      await new Promise<void>(resolve => {
        const request = indexedDB.deleteDatabase("wratlas-assets-db")
        request.onsuccess = () => resolve()
        request.onerror = () => resolve()
        request.onblocked = () => resolve()
      })
    }, ASSETS_INDEX_KEY)
  }
}

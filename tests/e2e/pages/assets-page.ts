import type { Page } from "@playwright/test"
import { expect } from "@playwright/test"

type AssetMeta = {
  id: string
  name: string
  type: string
  tags: string[]
  group: string | null
  notes: string
  width: number
  height: number
  fileSize: number
  createdAt: string
  updatedAt: string
}

type AssetStorage = {
  assets: AssetMeta[]
}

const ASSETS_INDEX_KEY = "wratlas.assets.v1.index"
const TOURS_KEY = "wratlas.tours"

export class AssetsPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  resetBrowserStorage = async () => {
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
    await this.page.evaluate(toursKey => {
      localStorage.setItem(toursKey, JSON.stringify({ assets_intro: true }))
    }, TOURS_KEY)
  }

  goto = async () => {
    await this.page.goto("/assets")
    await expect(this.page.getByRole("button", { name: "Import" })).toBeVisible()
  }

  importAsset = async (filePath: string) => {
    const fileChooserPromise = this.page.waitForEvent("filechooser")
    await this.page.getByRole("button", { name: "Import" }).click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(filePath)
  }

  getAssetCount = async () => {
    const storage = await this.getStorage()
    return storage.assets.length
  }

  getAssetNames = async () => {
    const storage = await this.getStorage()
    return storage.assets.map(a => a.name)
  }

  getStorage = async () => {
    return this.page.evaluate(key => {
      const raw = localStorage.getItem(key)
      if (!raw) return { assets: [] } as AssetStorage
      return JSON.parse(raw) as AssetStorage
    }, ASSETS_INDEX_KEY)
  }

  openContextMenuOnFirstAsset = async () => {
    await this.page.locator("[data-asset-id]").first().click({ button: "right" })
  }

  deleteAsset = async () => {
    await this.openContextMenuOnFirstAsset()
    await this.page.getByRole("menuitem", { name: "Delete" }).click()
  }
}

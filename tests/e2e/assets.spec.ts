import path from "node:path"
import { fileURLToPath } from "node:url"
import { expect, test } from "@playwright/test"
import { AssetsPage } from "./pages/assets-page"
import { PlaygroundPage } from "./pages/playground-page"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const sampleImagePath = path.resolve(__dirname, "./fixtures/sample-image.svg")

test.beforeEach(async ({ page }) => {
  const assets = new AssetsPage(page)
  await assets.resetBrowserStorage()
})

test("shows empty state when no assets exist", async ({ page }) => {
  const assets = new AssetsPage(page)
  await assets.goto()

  await expect(page.getByText("No assets found. Import some images to get started.")).toBeVisible()
})

test("import an image asset via import button", async ({ page }) => {
  const assets = new AssetsPage(page)
  await assets.goto()

  await assets.importAsset(sampleImagePath)

  await expect.poll(async () => assets.getAssetCount()).toBe(1)
  const names = await assets.getAssetNames()
  expect(names).toContain("sample-image.svg")
})

test("imported asset card displays name and dimensions", async ({ page }) => {
  const assets = new AssetsPage(page)
  await assets.goto()

  await assets.importAsset(sampleImagePath)

  const card = page.locator("[data-asset-id]").first()
  await expect(card).toBeVisible()
  await expect(card).toContainText("sample-image.svg")
  await expect(card).toContainText("160")
  await expect(card).toContainText("100")
})

test("rename asset via context menu", async ({ page }) => {
  const assets = new AssetsPage(page)
  await assets.goto()

  await assets.importAsset(sampleImagePath)
  await expect.poll(async () => assets.getAssetCount()).toBe(1)

  await assets.renameAsset("My Renamed Asset")
  await expect
    .poll(async () => {
      const names = await assets.getAssetNames()
      return names[0]
    })
    .toBe("My Renamed Asset")
})

test("delete asset via context menu", async ({ page }) => {
  const assets = new AssetsPage(page)
  await assets.goto()

  await assets.importAsset(sampleImagePath)
  await expect.poll(async () => assets.getAssetCount()).toBe(1)

  await assets.deleteAsset()

  await expect.poll(async () => assets.getAssetCount()).toBe(0)
})

test("search filters assets by name", async ({ page }) => {
  const assets = new AssetsPage(page)
  await assets.goto()

  await assets.importAsset(sampleImagePath)
  await expect.poll(async () => assets.getAssetCount()).toBe(1)

  const searchInput = page.getByPlaceholder("Search assets...")
  await searchInput.fill("nonexistent")

  await expect(page.getByText("No assets found.")).toBeVisible()
  await expect.poll(async () => page.locator("[data-asset-id]").count()).toBe(0)

  await searchInput.fill("sample")
  await expect.poll(async () => page.locator("[data-asset-id]").count()).toBe(1)
})

test("click on asset opens details modal", async ({ page }) => {
  const assets = new AssetsPage(page)
  await assets.goto()

  await assets.importAsset(sampleImagePath)

  await page.locator("[data-asset-id]").first().click()

  await expect(page.getByText("Asset Details")).toBeVisible()
  await expect(page.getByLabel("Name")).toHaveValue("sample-image.svg")
})

test("send asset to playground adds object to canvas", async ({ page }) => {
  const playground = new PlaygroundPage(page)
  const assets = new AssetsPage(page)

  await playground.resetBrowserStorage()
  await assets.resetBrowserStorage()

  await playground.goto()
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(0)

  await assets.goto()
  await assets.importAsset(sampleImagePath)
  await expect.poll(async () => assets.getAssetCount()).toBe(1)

  await assets.openContextMenuOnFirstAsset()

  await page.getByRole("menuitem", { name: "Send to Playground" }).hover()
  await page.getByRole("menuitem", { name: "Default Canvas" }).click()

  await expect.poll(async () => (await playground.getStorage()).canvases.some(c => c.objects.length > 0)).toBe(true)

  await playground.goto()
  await expect.poll(async () => playground.getActiveCanvasObjectCount()).toBe(1)
})

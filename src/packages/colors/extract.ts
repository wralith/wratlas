import { getPaletteSync } from "colorthief"

const load_image = (blob: Blob): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }
    img.src = url
  })

export const extract_palette_from_blob = async (blob: Blob, count = 5): Promise<string[]> => {
  const img = await load_image(blob)
  try {
    const palette = getPaletteSync(img, { colorCount: count })
    if (!palette) return []
    return palette.map(c => c.hex())
  } finally {
    URL.revokeObjectURL(img.src)
  }
}

export const extract_pixel_color = (img: HTMLImageElement, fracX: number, fracY: number): string => {
  const canvas = document.createElement("canvas")
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext("2d")
  if (!ctx) return "#000000"
  ctx.drawImage(img, 0, 0)
  const x = Math.floor(fracX * img.naturalWidth)
  const y = Math.floor(fracY * img.naturalHeight)
  const [r, g, b] = ctx.getImageData(x, y, 1, 1).data
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`
}

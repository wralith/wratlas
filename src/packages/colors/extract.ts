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

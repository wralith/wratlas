import type { Object as FabricObject } from "fabric"
import potpack from "potpack"

interface LayoutBox {
  w: number
  h: number
  x: number
  y: number
  img: FabricObject
}

interface ArrangeOptions {
  images: FabricObject[]
  viewport_width: number
  viewport_height: number
  padding: number
  header_offset: number
}

interface ArrangeResult {
  x: number
  y: number
  img: FabricObject
}

export const arrange_images = ({
  images,
  viewport_width,
  viewport_height,
  padding,
  header_offset,
}: ArrangeOptions): ArrangeResult[] => {
  if (images.length === 0) return []

  const boxes: LayoutBox[] = images.map(img => ({
    w: (img.width ?? 0) * (img.scaleX ?? 1) + padding,
    h: (img.height ?? 0) * (img.scaleY ?? 1) + padding,
    x: 0,
    y: 0,
    img,
  }))

  potpack(boxes)

  const packed_height = Math.max(...boxes.map(b => b.y + b.h))
  const available_height = viewport_height - header_offset - padding

  if (packed_height <= available_height) {
    return boxes.map(b => ({ x: b.x, y: b.y, img: b.img }))
  }

  const sorted = [...boxes].sort((a, b) => b.h - a.h)
  const placed: LayoutBox[] = []
  const remaining = new Set(sorted)

  let current_y = 0

  while (remaining.size > 0) {
    let current_x = 0
    let row_height = 0
    const max_width = viewport_width - padding * 2

    for (const box of sorted) {
      if (!remaining.has(box)) continue

      if (current_x + box.w > max_width && current_x > 0) {
        break
      }

      if (current_x + box.w <= max_width || current_x === 0) {
        box.x = current_x
        box.y = current_y
        placed.push(box)
        remaining.delete(box)
        current_x += box.w
        row_height = Math.max(row_height, box.h)
      }
    }

    current_y += row_height
  }

  return placed.map(b => ({ x: b.x, y: b.y, img: b.img }))
}

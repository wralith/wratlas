import { download_blob } from "@/lib/download"
import { add_notification } from "@/lib/notifications"
import { active_canvas, fabric_canvas } from "../state"

const DOT_TILE_SIZE = 24
const DOT_RADIUS = 1

const read_css_var = (element: Element, name: string, fallback: string): string => {
  const value = getComputedStyle(element).getPropertyValue(name).trim()
  return value || fallback
}

const create_dot_tile = (color: string) => {
  const tile = document.createElement("canvas")
  tile.width = DOT_TILE_SIZE
  tile.height = DOT_TILE_SIZE
  const ctx = tile.getContext("2d")
  if (!ctx) return null
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(DOT_TILE_SIZE / 2, DOT_TILE_SIZE / 2, DOT_RADIUS, 0, Math.PI * 2)
  ctx.fill()
  return tile
}

const remove_fabric_background = (canvas: HTMLCanvasElement, color: string) => {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.globalCompositeOperation = "destination-out"
  ctx.fillStyle = color
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.globalCompositeOperation = "source-over"
}

const build_output = (
  fabric_view: HTMLCanvasElement,
  bg_color: string,
  dot_color: string,
): HTMLCanvasElement | null => {
  const output = document.createElement("canvas")
  output.width = fabric_view.width
  output.height = fabric_view.height
  const ctx = output.getContext("2d")
  if (!ctx) return null

  ctx.fillStyle = bg_color
  ctx.fillRect(0, 0, output.width, output.height)

  const tile = create_dot_tile(dot_color)
  if (tile) {
    const pattern = ctx.createPattern(tile, "repeat")
    if (pattern) {
      ctx.fillStyle = pattern
      ctx.fillRect(0, 0, output.width, output.height)
    }
  }

  ctx.drawImage(fabric_view, 0, 0)
  return output
}

export const useCanvasPngExport = () => {
  const handleDownloadPng = async () => {
    try {
      const fabric = fabric_canvas.value
      if (!fabric) return

      const root = document.documentElement
      const bg_color = read_css_var(root, "--bg-base", "#282a36")
      const dot_color = read_css_var(root, "--color-border", "#44475a")

      const fabric_view = fabric.toCanvasElement(2)

      const fabric_bg = fabric.backgroundColor
      if (typeof fabric_bg === "string" && fabric_bg) {
        remove_fabric_background(fabric_view, fabric_bg)
      }

      const output = build_output(fabric_view, bg_color, dot_color)
      if (!output) {
        add_notification({ type: "error", title: "PNG export failed" })
        return
      }

      const blob = await new Promise<Blob | null>(resolve => {
        output.toBlob(resolve, "image/png")
      })
      if (!blob) {
        add_notification({ type: "error", title: "PNG export failed" })
        return
      }

      const name = active_canvas.value.name?.trim() || "canvas"
      download_blob(blob, `${name}.png`)
      add_notification({ type: "success", title: "PNG downloaded" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      add_notification({ type: "error", title: "PNG export failed", message })
    }
  }

  return { handleDownloadPng }
}

import type { Canvas as FabricCanvas } from "fabric"

export type ImageOptions = {
  originX?: "center" | "left" | "right"
  originY?: "center" | "top" | "bottom"
  scaleToWidth?: number
}

export const removeActiveObject = (canvas: FabricCanvas) => {
  const activeObj = canvas.getActiveObject()
  if (!activeObj) return
  canvas.remove(activeObj)
  canvas.discardActiveObject()
  canvas.requestRenderAll()
}

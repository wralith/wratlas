import type { Canvas as FabricCanvas } from "fabric"

export type ImageOptions = {
  originX?: "center" | "left" | "right"
  originY?: "center" | "top" | "bottom"
  scaleToWidth?: number
}

export const remove_active_object = (canvas: FabricCanvas) => {
  const activeObj = canvas.getActiveObject()
  if (!activeObj) return
  canvas.remove(activeObj)
  canvas.discardActiveObject()
  canvas.requestRenderAll()
}

export const get_active_image = (canvas: FabricCanvas) => {
  const active_object = canvas.getActiveObject()
  if (!active_object) return null
  if (active_object.type.toLowerCase() !== "image") return null
  return active_object
}

export const can_send_active_image_to_back = (canvas: FabricCanvas) => {
  const active_image = get_active_image(canvas)
  if (!active_image) return false

  const objects = canvas.getObjects()
  return objects[0] !== active_image
}

export const can_send_active_image_backward = (canvas: FabricCanvas) => {
  const active_image = get_active_image(canvas)
  if (!active_image) return false

  const objects = canvas.getObjects()
  const index = objects.indexOf(active_image)
  return index > 0
}

export const can_bring_active_image_to_front = (canvas: FabricCanvas) => {
  const active_image = get_active_image(canvas)
  if (!active_image) return false

  const objects = canvas.getObjects()
  return objects.at(-1) !== active_image
}

export const can_bring_active_image_forward = (canvas: FabricCanvas) => {
  const active_image = get_active_image(canvas)
  if (!active_image) return false

  const objects = canvas.getObjects()
  const index = objects.indexOf(active_image)
  return index >= 0 && index < objects.length - 1
}

export const send_active_image_to_back = (canvas: FabricCanvas) => {
  const active_image = get_active_image(canvas)
  if (!active_image) return false
  if (!can_send_active_image_to_back(canvas)) return false

  canvas.sendObjectToBack(active_image)
  canvas.setActiveObject(active_image)
  canvas.requestRenderAll()
  return true
}

export const send_active_image_backward = (canvas: FabricCanvas) => {
  const active_image = get_active_image(canvas)
  if (!active_image) return false
  if (!can_send_active_image_backward(canvas)) return false

  canvas.sendObjectBackwards(active_image)
  canvas.setActiveObject(active_image)
  canvas.requestRenderAll()
  return true
}

export const bring_active_image_to_front = (canvas: FabricCanvas) => {
  const active_image = get_active_image(canvas)
  if (!active_image) return false
  if (!can_bring_active_image_to_front(canvas)) return false

  canvas.bringObjectToFront(active_image)
  canvas.setActiveObject(active_image)
  canvas.requestRenderAll()
  return true
}

export const bring_active_image_forward = (canvas: FabricCanvas) => {
  const active_image = get_active_image(canvas)
  if (!active_image) return false
  if (!can_bring_active_image_forward(canvas)) return false

  canvas.bringObjectForward(active_image)
  canvas.setActiveObject(active_image)
  canvas.requestRenderAll()
  return true
}

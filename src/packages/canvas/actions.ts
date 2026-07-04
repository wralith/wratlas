import type { Canvas as FabricCanvas } from "fabric"

export type ImageOptions = {
  originX?: "center" | "left" | "right"
  originY?: "center" | "top" | "bottom"
  scaleToWidth?: number
}

export const remove_active_object = (canvas: FabricCanvas) => {
  const objects = canvas.getActiveObjects()
  if (objects.length === 0) return
  canvas.remove(...objects)
  canvas.discardActiveObject()
  canvas.requestRenderAll()
}

export const get_active_object = (canvas: FabricCanvas) => {
  const active_object = canvas.getActiveObject()
  if (!active_object) return null
  return active_object
}

export const can_send_active_object_to_back = (canvas: FabricCanvas) => {
  const active_object = get_active_object(canvas)
  if (!active_object) return false

  const objects = canvas.getObjects()
  return objects[0] !== active_object
}

export const can_send_active_object_backward = (canvas: FabricCanvas) => {
  const active_object = get_active_object(canvas)
  if (!active_object) return false

  const objects = canvas.getObjects()
  const index = objects.indexOf(active_object)
  return index > 0
}

export const can_bring_active_object_to_front = (canvas: FabricCanvas) => {
  const active_object = get_active_object(canvas)
  if (!active_object) return false

  const objects = canvas.getObjects()
  return objects.at(-1) !== active_object
}

export const can_bring_active_object_forward = (canvas: FabricCanvas) => {
  const active_object = get_active_object(canvas)
  if (!active_object) return false

  const objects = canvas.getObjects()
  const index = objects.indexOf(active_object)
  return index >= 0 && index < objects.length - 1
}

export const send_active_object_to_back = (canvas: FabricCanvas) => {
  const active_object = get_active_object(canvas)
  if (!active_object) return false
  if (!can_send_active_object_to_back(canvas)) return false

  canvas.sendObjectToBack(active_object)
  canvas.setActiveObject(active_object)
  canvas.requestRenderAll()
  return true
}

export const send_active_object_backward = (canvas: FabricCanvas) => {
  const active_object = get_active_object(canvas)
  if (!active_object) return false
  if (!can_send_active_object_backward(canvas)) return false

  canvas.sendObjectBackwards(active_object)
  canvas.setActiveObject(active_object)
  canvas.requestRenderAll()
  return true
}

export const bring_active_object_to_front = (canvas: FabricCanvas) => {
  const active_object = get_active_object(canvas)
  if (!active_object) return false
  if (!can_bring_active_object_to_front(canvas)) return false

  canvas.bringObjectToFront(active_object)
  canvas.setActiveObject(active_object)
  canvas.requestRenderAll()
  return true
}

export const bring_active_object_forward = (canvas: FabricCanvas) => {
  const active_object = get_active_object(canvas)
  if (!active_object) return false
  if (!can_bring_active_object_forward(canvas)) return false

  canvas.bringObjectForward(active_object)
  canvas.setActiveObject(active_object)
  canvas.requestRenderAll()
  return true
}

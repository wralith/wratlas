import { batch } from "@preact/signals"
import type { Canvas as FabricCanvas } from "fabric"
import { pan_x, pan_y, zoom_level } from "../state"

export const is_editable_target = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable
}

export const is_mod_key = (event: KeyboardEvent | WheelEvent) => event.metaKey || event.ctrlKey

export const sync_viewport_signals = (canvas: FabricCanvas) => {
  batch(() => {
    zoom_level.value = canvas.getZoom()
    const vpt = canvas.viewportTransform
    if (vpt) {
      pan_x.value = vpt[4]
      pan_y.value = vpt[5]
    }
  })
}

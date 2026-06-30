import { batch, untracked, useSignalEffect } from "@preact/signals"
import type { Canvas as FabricCanvas } from "fabric"
import { debounce } from "@/lib/debounce"
import { clamp_zoom } from "../constants"
import { create_canvas_snapshot_patch } from "../internal/snapshot"
import {
  active_canvas,
  active_canvas_id,
  canvas_controller,
  canvas_store,
  fabric_canvas,
  pan_x,
  pan_y,
  zoom_level,
} from "../state"

const SAVE_DEBOUNCE_MS = 100

type ViewportState = {
  zoom: number
  x: number
  y: number
}

const write_viewport = (canvas: FabricCanvas, viewport?: Partial<ViewportState>) => {
  const zoom = clamp_zoom(viewport?.zoom ?? 1)
  const x = viewport?.x ?? 0
  const y = viewport?.y ?? 0

  canvas.setViewportTransform([zoom, 0, 0, zoom, x, y])

  batch(() => {
    zoom_level.value = zoom
    pan_x.value = x
    pan_y.value = y
  })
}

export const usePersistence = () => {
  useSignalEffect(() => {
    const canvas = fabric_canvas.value
    const canvasId = active_canvas_id.value
    const isHydrating = canvas_controller.is_hydrating.value

    if (!canvas || !canvasId || isHydrating) return

    let isSettingUp = true

    const queueSave = debounce(() => {
      if (isSettingUp || canvas_controller.is_hydrating.value) return
      canvas_store.update_canvas(canvasId, create_canvas_snapshot_patch(canvas))
    }, SAVE_DEBOUNCE_MS)

    const initialViewport = untracked(() => active_canvas.value.viewport)
    write_viewport(canvas, initialViewport)

    canvas.requestRenderAll()
    isSettingUp = false

    const disposers = [
      canvas.on("object:added", queueSave),
      canvas.on("object:modified", queueSave),
      canvas.on("object:removed", queueSave),
      canvas.on("path:created", queueSave),
      canvas.on("mouse:up", queueSave),
      canvas.on("mouse:wheel", queueSave),
    ]

    return () => {
      queueSave.cancel()

      disposers.forEach(dispose => {
        dispose()
      })
    }
  })
}

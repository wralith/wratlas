import { batch, untracked, useSignalEffect } from "@preact/signals"
import type { Canvas as FabricCanvas } from "fabric"
import {
  activeCanvas,
  activeCanvasId,
  controller,
  canvas_store,
  fabricCanvas,
  panX,
  panY,
  zoomLevel,
} from "@/components/canvas/canvas.store"
import { create_canvas_snapshot_patch } from "@/lib/canvas-doc/snapshot"
import { debounce } from "@/lib/debounce"

const SAVE_DEBOUNCE_MS = 100

type ViewportState = {
  zoom: number
  x: number
  y: number
}

const writeViewport = (canvas: FabricCanvas, viewport?: Partial<ViewportState>) => {
  const zoom = viewport?.zoom ?? 1
  const x = viewport?.x ?? 0
  const y = viewport?.y ?? 0

  canvas.setViewportTransform([zoom, 0, 0, zoom, x, y])

  batch(() => {
    zoomLevel.value = zoom
    panX.value = x
    panY.value = y
  })
}

export const useCanvasPersistence = () => {
  useSignalEffect(() => {
    const canvas = fabricCanvas.value
    const canvasId = activeCanvasId.value
    const isHydrating = controller.is_hydrating.value

    if (!canvas || !canvasId || isHydrating) return

    let isSettingUp = true

    const queueSave = debounce(() => {
      if (isSettingUp || controller.is_hydrating.value) return
      canvas_store.update_canvas(canvasId, create_canvas_snapshot_patch(canvas))
    }, SAVE_DEBOUNCE_MS)

    const initialViewport = untracked(() => activeCanvas.value.viewport)
    writeViewport(canvas, initialViewport)

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

import { batch, useSignalEffect } from "@preact/signals"
import type { Canvas as FabricCanvas } from "fabric"
import { activeCanvasId, fabricCanvas, manager, panX, panY, zoomLevel } from "@/components/canvas/canvas.store"
import type { CanvasSnapshot } from "@/lib/canvas-doc/manager"

const SAVE_DEBOUNCE_MS = 300

type ViewportState = {
  zoom: number
  x: number
  y: number
}

const readViewport = (canvas: FabricCanvas): ViewportState => {
  const vpt = canvas.viewportTransform
  return {
    zoom: canvas.getZoom(),
    x: vpt?.[4] ?? 0,
    y: vpt?.[5] ?? 0,
  }
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

const toSnapshot = (canvas: FabricCanvas) => {
  // @ts-expect-error fabric canvas toJSON does not include custom properties by default, but we can pass them in as an array
  const snapshot = canvas.toJSON(["_image_id"]) as CanvasSnapshot
  return {
    ...snapshot,
    viewport: readViewport(canvas),
  }
}

export const useCanvasPersistence = () => {
  useSignalEffect(() => {
    const canvas = fabricCanvas.value
    const canvasId = activeCanvasId.value

    if (!canvas || !canvasId) return

    let isHydrating = true
    let saveTimer: ReturnType<typeof setTimeout> | undefined

    const queueSave = () => {
      if (isHydrating) return

      if (saveTimer) {
        clearTimeout(saveTimer)
      }

      saveTimer = setTimeout(() => {
        manager.update_active_canvas(toSnapshot(canvas))
      }, SAVE_DEBOUNCE_MS)
    }

    writeViewport(canvas, manager.active_canvas.viewport)
    canvas.requestRenderAll()
    isHydrating = false

    const disposers = [
      canvas.on("object:added", queueSave),
      canvas.on("object:modified", queueSave),
      canvas.on("object:removed", queueSave),
      canvas.on("path:created", queueSave),
      canvas.on("mouse:up", queueSave),
      canvas.on("mouse:wheel", queueSave),
    ]

    return () => {
      if (saveTimer) {
        clearTimeout(saveTimer)
      }

      if (!isHydrating) {
        manager.update_active_canvas(toSnapshot(canvas))
      }

      disposers.forEach(dispose => {
        dispose()
      })
    }
  })
}

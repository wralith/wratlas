import { batch, useSignalEffect } from "@preact/signals"
import type { TPointerEvent, TPointerEventInfo } from "fabric"
import { Point } from "fabric"
import { activeTool, fabricCanvas, panX, panY, zoomLevel } from "@/components/canvas/canvas.store"

export const usePanZoom = () => {
  useSignalEffect(() => {
    const canvas = fabricCanvas.value
    if (!canvas) return

    const handleWheel = (opt: TPointerEventInfo<WheelEvent>) => {
      const e = opt.e

      e.preventDefault()
      e.stopPropagation()

      const delta = -e.deltaY
      let zoom = canvas.getZoom()
      zoom *= 0.999 ** delta
      zoom = Math.min(Math.max(zoom, 0.1), 20)

      canvas.zoomToPoint(new Point(e.offsetX, e.offsetY), zoom)
      canvas.requestRenderAll()

      batch(() => {
        zoomLevel.value = zoom
        const vpt = canvas.viewportTransform
        if (vpt) {
          panX.value = vpt[4]
          panY.value = vpt[5]
        }
      })
    }

    let isPanning = false
    let lastX = 0
    let lastY = 0

    const handleMouseDown = (opt: TPointerEventInfo<TPointerEvent>) => {
      const e = opt.e

      if (e instanceof MouseEvent && e.button === 1) {
        isPanning = true
        lastX = e.clientX
        lastY = e.clientY
        canvas.selection = false
        canvas.defaultCursor = "grabbing"
        e.preventDefault()
      }
    }

    const handleMouseMove = (opt: TPointerEventInfo<MouseEvent>) => {
      if (!isPanning) return

      const ev = opt.e
      const vpt = canvas.viewportTransform
      if (vpt) {
        vpt[4] += ev.clientX - lastX
        vpt[5] += ev.clientY - lastY

        lastX = ev.clientX
        lastY = ev.clientY

        canvas.requestRenderAll()

        batch(() => {
          panX.value = vpt[4]
          panY.value = vpt[5]
        })
      }
    }

    const handleMouseUp = () => {
      if (!isPanning) {
        return
      }

      isPanning = false
      canvas.selection = true
      canvas.defaultCursor = "default"
    }

    const disposers = [
      canvas.on("mouse:wheel", handleWheel),
      canvas.on("mouse:down", handleMouseDown),
      canvas.on("mouse:move", handleMouseMove),
      canvas.on("mouse:up", handleMouseUp),
    ]

    return () => {
      disposers.forEach(d => {
        d()
      })
    }
  })
}

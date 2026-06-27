import { useSignalEffect } from "@preact/signals"
import { Point } from "fabric"
import { fabricCanvas, zoomLevel, panX, panY } from "../canvas.store"

export const usePanZoom = () => {
  useSignalEffect(() => {
    const canvas = fabricCanvas.value
    if (!canvas) return

    const handleWheel = (opt: { e: WheelEvent }) => {
      const e = opt.e
      const delta = -e.deltaY
      let zoom = canvas.getZoom()
      zoom *= 0.999 ** delta
      zoom = Math.min(Math.max(zoom, 0.1), 20)

      canvas.zoomToPoint(new Point(e.offsetX, e.offsetY), zoom)
      canvas.requestRenderAll()

      zoomLevel.value = zoom
      const vpt = canvas.viewportTransform
      if (vpt) {
        panX.value = vpt[4]
        panY.value = vpt[5]
      }
    }

    let isPanning = false
    let lastX = 0
    let lastY = 0

    const handleMouseDown = (opt: { e: MouseEvent }) => {
      const ev = opt.e
      if (ev.button === 1) {
        isPanning = true
        lastX = ev.clientX
        lastY = ev.clientY
        canvas.selection = false
        canvas.defaultCursor = "grabbing"
        ev.preventDefault()
      }
    }

    const handleMouseMove = (opt: { e: MouseEvent }) => {
      if (!isPanning) return
      const ev = opt.e
      const vpt = canvas.viewportTransform
      if (vpt) {
        vpt[4] += ev.clientX - lastX
        vpt[5] += ev.clientY - lastY
        lastX = ev.clientX
        lastY = ev.clientY
        canvas.requestRenderAll()
        panX.value = vpt[4]
        panY.value = vpt[5]
      }
    }

    const handleMouseUp = () => {
      if (isPanning) {
        isPanning = false
        canvas.selection = true
        canvas.defaultCursor = "default"
      }
    }

    const disposers = [
      canvas.on("mouse:wheel", handleWheel as any),
      canvas.on("mouse:down", handleMouseDown as any),
      canvas.on("mouse:move", handleMouseMove as any),
      canvas.on("mouse:up", handleMouseUp as any),
    ]

    return () => {
      disposers.forEach(d => d())
    }
  })
}

import { useSignalEffect } from "@preact/signals"
import type { TPointerEvent, TPointerEventInfo } from "fabric"
import { Point } from "fabric"
import { clamp_zoom } from "../constants"
import { is_mod_key, sync_viewport_signals } from "../internal/controls"
import { fabric_canvas } from "../state"

export const usePanZoom = () => {
  useSignalEffect(() => {
    const canvas = fabric_canvas.value
    if (!canvas) return

    const refreshViewport = () => {
      const vpt = canvas.viewportTransform
      if (!vpt) return

      canvas.setViewportTransform([...vpt])
      canvas.requestRenderAll()
      sync_viewport_signals(canvas)
    }

    const handleWheel = (opt: TPointerEventInfo<WheelEvent>) => {
      const e = opt.e

      e.preventDefault()
      e.stopPropagation()

      if (!canvas.viewportTransform) return

      if (is_mod_key(e)) {
        const delta = -e.deltaY
        let zoom = canvas.getZoom()
        zoom *= 0.999 ** delta
        zoom = clamp_zoom(zoom)

        canvas.zoomToPoint(new Point(e.offsetX, e.offsetY), zoom)
        refreshViewport()
        return
      }

      const vpt = canvas.viewportTransform
      vpt[4] -= e.deltaX
      vpt[5] -= e.deltaY
      refreshViewport()
    }

    let isPanning = false
    let isSpacePressed = false
    let lastX = 0
    let lastY = 0

    const startPanning = (clientX: number, clientY: number) => {
      isPanning = true
      lastX = clientX
      lastY = clientY
      canvas.selection = false
      canvas.defaultCursor = "grabbing"
    }

    const stopPanning = () => {
      if (!isPanning) return
      isPanning = false
      canvas.selection = true
      canvas.defaultCursor = "default"
      refreshViewport()
    }

    const handleMouseDown = (opt: TPointerEventInfo<TPointerEvent>) => {
      const e = opt.e

      if (e instanceof MouseEvent && (e.button === 1 || (e.button === 0 && isSpacePressed))) {
        startPanning(e.clientX, e.clientY)
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

        refreshViewport()
      }
    }

    const handleMouseUp = () => {
      stopPanning()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return
      if (e.repeat) return
      if (e.target instanceof HTMLElement && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) {
        return
      }

      isSpacePressed = true
      canvas.defaultCursor = isPanning ? "grabbing" : "grab"
      e.preventDefault()
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return
      isSpacePressed = false
      canvas.defaultCursor = isPanning ? "grabbing" : "default"
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    const disposers = [
      canvas.on("mouse:wheel", handleWheel),
      canvas.on("mouse:down", handleMouseDown),
      canvas.on("mouse:move", handleMouseMove),
      canvas.on("mouse:up", handleMouseUp),
    ]

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
      stopPanning()
      disposers.forEach(d => {
        d()
      })
    }
  })
}

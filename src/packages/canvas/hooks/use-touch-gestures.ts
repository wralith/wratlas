import { useSignalEffect } from "@preact/signals"
import type { TPointerEvent } from "fabric"
import { clamp_zoom } from "../constants"
import { clamp_viewport, sync_viewport_signals } from "../internal/controls"
import { fabric_canvas, last_mouse_scene_point } from "../state"

type TouchState = {
  touches: Map<number, { clientX: number; clientY: number }>
  initialDistance: number
  initialZoom: number
  lastCenter: { x: number; y: number }
  startPanX: number
  startPanY: number
  isPanning: boolean
}

const get_touch_distance = (t1: { clientX: number; clientY: number }, t2: { clientX: number; clientY: number }) => {
  const dx = t2.clientX - t1.clientX
  const dy = t2.clientY - t1.clientY
  return Math.sqrt(dx * dx + dy * dy)
}

const get_touch_center = (
  t1: { clientX: number; clientY: number },
  t2: { clientX: number; clientY: number },
): { x: number; y: number } => ({
  x: (t1.clientX + t2.clientX) / 2,
  y: (t1.clientY + t2.clientY) / 2,
})

export const useTouchGestures = () => {
  useSignalEffect(() => {
    const canvas = fabric_canvas.value
    if (!canvas) return

    const wrapper = canvas.wrapperEl
    if (!wrapper) return

    const state: TouchState = {
      touches: new Map(),
      initialDistance: 0,
      initialZoom: 1,
      lastCenter: { x: 0, y: 0 },
      startPanX: 0,
      startPanY: 0,
      isPanning: false,
    }

    const refresh = () => {
      clamp_viewport(canvas)
      canvas.requestRenderAll()
      sync_viewport_signals(canvas)
    }

    const handleTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]
        state.touches.set(t.identifier, { clientX: t.clientX, clientY: t.clientY })
      }

      if (state.touches.size === 2) {
        const entries = Array.from(state.touches.values())
        const t1 = entries[0]
        const t2 = entries[1]
        state.initialDistance = get_touch_distance(t1, t2)
        state.initialZoom = canvas.getZoom()
        state.lastCenter = get_touch_center(t1, t2)

        const vpt = canvas.viewportTransform
        if (vpt) {
          state.startPanX = vpt[4]
          state.startPanY = vpt[5]
        }
        state.isPanning = true
        canvas.selection = false
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()

      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]
        if (state.touches.has(t.identifier)) {
          state.touches.set(t.identifier, { clientX: t.clientX, clientY: t.clientY })
        }
      }

      if (state.touches.size === 1) {
        const [t] = state.touches.values()
        const scenePoint = canvas.getScenePoint({ clientX: t.clientX, clientY: t.clientY } as unknown as TPointerEvent)
        last_mouse_scene_point.value = { x: scenePoint.x, y: scenePoint.y }
        return
      }

      if (state.touches.size >= 2 && state.isPanning) {
        const entries = Array.from(state.touches.values())
        const t1 = entries[0]
        const t2 = entries[1]

        const currentDistance = get_touch_distance(t1, t2)
        const currentCenter = get_touch_center(t1, t2)

        if (state.initialDistance > 0) {
          const scale = currentDistance / state.initialDistance
          let zoom = state.initialZoom * scale
          zoom = clamp_zoom(zoom)

          const canvasPoint = canvas.getScenePoint({
            clientX: currentCenter.x,
            clientY: currentCenter.y,
          } as unknown as TPointerEvent)
          canvas.zoomToPoint(canvasPoint, zoom)
        }

        const deltaX = currentCenter.x - state.lastCenter.x
        const deltaY = currentCenter.y - state.lastCenter.y

        const vpt = canvas.viewportTransform
        if (vpt) {
          vpt[4] += deltaX
          vpt[5] += deltaY
        }

        state.lastCenter = currentCenter

        refresh()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        state.touches.delete(e.changedTouches[i].identifier)
      }

      if (state.touches.size < 2) {
        state.isPanning = false
        state.initialDistance = 0
        if (state.touches.size === 0) {
          canvas.selection = true
        }
      }

      refresh()
    }

    wrapper.addEventListener("touchstart", handleTouchStart, { passive: false })
    wrapper.addEventListener("touchmove", handleTouchMove, { passive: false })
    wrapper.addEventListener("touchend", handleTouchEnd)
    wrapper.addEventListener("touchcancel", handleTouchEnd)

    return () => {
      wrapper.removeEventListener("touchstart", handleTouchStart)
      wrapper.removeEventListener("touchmove", handleTouchMove)
      wrapper.removeEventListener("touchend", handleTouchEnd)
      wrapper.removeEventListener("touchcancel", handleTouchEnd)
    }
  })
}

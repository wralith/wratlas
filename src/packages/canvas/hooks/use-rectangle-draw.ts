import { useSignalEffect } from "@preact/signals"
import type { Rect as FabricRectType, TPointerEvent, TPointerEventInfo } from "fabric"
import { Rect } from "fabric"
import { active_tool, canvas_controller, fabric_canvas, is_rectangle_drawing, rectangle_color } from "../state"

const MIN_RECT_SIZE = 8

const normalize_hex = (value: string) => {
  const hex = value.trim()
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) return "#3b82f6"
  if (hex.length === 7) return hex

  const [r, g, b] = hex.slice(1)
  return `#${r}${r}${g}${g}${b}${b}`
}

const hex_to_rgba = (hex: string, alpha: number) => {
  const safe_hex = normalize_hex(hex)
  const r = Number.parseInt(safe_hex.slice(1, 3), 16)
  const g = Number.parseInt(safe_hex.slice(3, 5), 16)
  const b = Number.parseInt(safe_hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const useRectangleDraw = () => {
  useSignalEffect(() => {
    const canvas = fabric_canvas.value
    const tool = active_tool.value
    const color = normalize_hex(rectangle_color.value)

    if (!canvas) return

    canvas.selection = tool !== "draw"
    canvas.skipTargetFind = tool === "draw"
    canvas.defaultCursor = tool === "draw" ? "crosshair" : "default"

    if (tool !== "draw") {
      return
    }

    let draft: FabricRectType | null = null
    let start_x = 0
    let start_y = 0

    const is_primary_input = (e: Event) => {
      if (e instanceof MouseEvent || e instanceof PointerEvent) {
        return e.button === 0
      }
      return true
    }

    const handleMouseDown = (opt: TPointerEventInfo<TPointerEvent>) => {
      if (!is_primary_input(opt.e)) return

      const pointer = canvas.getScenePoint(opt.e)
      start_x = pointer.x
      start_y = pointer.y

      draft = new Rect({
        left: start_x,
        top: start_y,
        width: 1,
        height: 1,
        fill: hex_to_rgba(color, 0.22),
        originX: "left",
        originY: "top",
        selectable: false,
        evented: false,
      })

      canvas.add(draft)
      canvas.setActiveObject(draft)
      is_rectangle_drawing.value = true
      canvas.requestRenderAll()
      opt.e.preventDefault()
      opt.e.stopPropagation()
    }

    const handleMouseMove = (opt: TPointerEventInfo<TPointerEvent>) => {
      if (!draft) return

      const pointer = canvas.getScenePoint(opt.e)
      const width = pointer.x - start_x
      const height = pointer.y - start_y

      draft.set({
        left: width < 0 ? pointer.x : start_x,
        top: height < 0 ? pointer.y : start_y,
        width: Math.abs(width),
        height: Math.abs(height),
      })
      draft.setCoords()
      canvas.requestRenderAll()
    }

    const handleMouseUp = () => {
      if (!draft) return

      const rect = draft
      draft = null
      is_rectangle_drawing.value = false

      const width = (rect.width ?? 0) * (rect.scaleX ?? 1)
      const height = (rect.height ?? 0) * (rect.scaleY ?? 1)

      if (width < MIN_RECT_SIZE || height < MIN_RECT_SIZE) {
        canvas.remove(rect)
        canvas.discardActiveObject()
        canvas.requestRenderAll()
        active_tool.value = "select"
        void canvas_controller.save_state()
        return
      }

      rect.set({ selectable: true, evented: true })
      rect.setCoords()
      canvas.setActiveObject(rect)
      canvas.fire("object:modified", { target: rect })
      canvas.requestRenderAll()
      void canvas_controller.order_active_object_to_back()
      active_tool.value = "select"
      void canvas_controller.save_state()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      if (!draft) return

      canvas.remove(draft)
      draft = null
      is_rectangle_drawing.value = false
      canvas.discardActiveObject()
      canvas.requestRenderAll()
      void canvas_controller.save_state()
    }

    const disposers = [
      canvas.on("mouse:down", handleMouseDown),
      canvas.on("mouse:move", handleMouseMove),
      canvas.on("mouse:up", handleMouseUp),
    ]
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      disposers.forEach(dispose => {
        dispose()
      })

      if (draft) {
        canvas.remove(draft)
        canvas.requestRenderAll()
        draft = null
      }

      is_rectangle_drawing.value = false
    }
  })
}

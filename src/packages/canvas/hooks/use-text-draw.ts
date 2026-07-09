import { useSignalEffect } from "@preact/signals"
import type { TPointerEvent, TPointerEventInfo } from "fabric"
import { IText } from "fabric"
import { measure_text_width } from "../sidebar/helpers"
import { active_tool, canvas_controller, fabric_canvas, text_color, text_font_family, text_font_size } from "../state"

export const useTextDraw = () => {
  useSignalEffect(() => {
    const canvas = fabric_canvas.value
    const tool = active_tool.value

    if (!canvas) return

    canvas.selection = tool !== "text"
    canvas.skipTargetFind = tool === "text"
    canvas.defaultCursor = tool === "text" ? "text" : "default"

    if (tool !== "text") return

    const is_primary_input = (e: Event) => {
      if (e instanceof MouseEvent || e instanceof PointerEvent) {
        return e.button === 0
      }
      return true
    }

    const handleMouseDown = (opt: TPointerEventInfo<TPointerEvent>) => {
      if (!is_primary_input(opt.e)) return

      const existing = canvas.getActiveObject()
      if (existing && existing.type === "i-text") {
        ;(existing as IText).enterEditing()
        existing.setCoords()
        canvas.requestRenderAll()
        return
      }

      const pointer = canvas.getScenePoint(opt.e)
      const w = measure_text_width("Type here", text_font_family.value, text_font_size.value)

      const text = new IText("Type here", {
        left: pointer.x,
        top: pointer.y,
        fontSize: text_font_size.value,
        fontFamily: text_font_family.value,
        fill: text_color.value,
        width: Math.ceil(w) + 4,
        originX: "center",
        originY: "center",
        selectable: true,
        evented: true,
        editable: true,
      })

      canvas.add(text)
      canvas.setActiveObject(text)
      text.enterEditing()
      text.setCoords()
      canvas.requestRenderAll()
      void canvas_controller.order_active_object_to_back()
      active_tool.value = "select"
      void canvas_controller.save_state()
    }

    const dispose = canvas.on("mouse:down", handleMouseDown)

    return () => {
      dispose()
    }
  })
}

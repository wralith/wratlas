import { useSignalEffect } from "@preact/signals"
import type { Canvas as FabricCanvas, TPointerEvent, TPointerEventInfo } from "fabric"
import { useMemo, useRef, useState } from "preact/hooks"
import { sync_viewport_signals } from "./internal/controls"
import { remove_active_object } from "./actions"
import { canvas_controller, fabric_canvas } from "./state"
import { Menu, type MenuItem } from "@/ui/atoms/menu/menu"

type MenuTarget = "image" | "canvas" | null

type MenuState = {
  open: boolean
  x: number
  y: number
  target: MenuTarget
}

const initial_state: MenuState = {
  open: false,
  x: 0,
  y: 0,
  target: null,
}

const is_default_view = (canvas: FabricCanvas) => {
  const vpt = canvas.viewportTransform
  if (!vpt) return true
  return vpt[0] === 1 && vpt[1] === 0 && vpt[2] === 0 && vpt[3] === 1 && vpt[4] === 0 && vpt[5] === 0
}

export const CanvasContextMenu = () => {
  const canvas = fabric_canvas.value
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<MenuState>(initial_state)

  useSignalEffect(() => {
    const activeCanvas = fabric_canvas.value
    if (!activeCanvas) return

    const handleNativeContextMenu = (event: MouseEvent) => {
      event.preventDefault()
    }

    const handleMouseDown = (event: TPointerEventInfo<TPointerEvent>) => {
      const native = event.e
      if (!(native instanceof MouseEvent)) return

      if (native.button !== 2) {
        setState(initial_state)
        return
      }

      native.preventDefault()

      if (event.target?.type.toLowerCase() === "image") {
        activeCanvas.setActiveObject(event.target)
        activeCanvas.requestRenderAll()
        setState({
          open: true,
          x: native.clientX,
          y: native.clientY,
          target: "image",
        })
        return
      }

      activeCanvas.discardActiveObject()
      activeCanvas.requestRenderAll()

      setState({
        open: true,
        x: native.clientX,
        y: native.clientY,
        target: "canvas",
      })
    }

    activeCanvas.upperCanvasEl.addEventListener("contextmenu", handleNativeContextMenu)
    const disposeMouseDown = activeCanvas.on("mouse:down", handleMouseDown)

    return () => {
      activeCanvas.upperCanvasEl.removeEventListener("contextmenu", handleNativeContextMenu)
      disposeMouseDown()
    }
  })

  const items = useMemo<MenuItem[]>(() => {
    if (!canvas || !state.target) return []

    if (state.target === "image") {
      return [
        { id: "copy-image", label: "Copy image" },
        { id: "delete-image", label: "Delete image", danger: true },
      ]
    }

    return [
      { id: "add-image", label: "Add image" },
      { id: "reset-view", label: "Reset view", disabled: is_default_view(canvas) },
    ]
  }, [canvas, state.target])

  const handleSelect = (id: string) => {
    if (!canvas) return

    if (id === "copy-image") {
      void canvas_controller.copy_image_to_clipboard()
      return
    }

    if (id === "delete-image") {
      remove_active_object(canvas)
      return
    }

    if (id === "add-image") {
      inputRef.current?.click()
      return
    }

    if (id === "reset-view") {
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
      canvas.requestRenderAll()
      sync_viewport_signals(canvas)
    }
  }

  const handleFileChange = async (event: Event) => {
    const files = (event.target as HTMLInputElement).files
    if (!files?.length) return

    await canvas_controller.add_image(files)

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <>
      <Menu
        open={state.open}
        position={state.open ? { x: state.x, y: state.y } : null}
        items={items}
        onSelect={handleSelect}
        onClose={() => setState(initial_state)}
      />
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileChange} hidden />
    </>
  )
}

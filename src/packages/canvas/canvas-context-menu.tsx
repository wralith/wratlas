import { useSignal, useSignalEffect } from "@preact/signals"
import type { Canvas as FabricCanvas, TPointerEvent, TPointerEventInfo } from "fabric"
import { util } from "fabric"
import { useMemo, useRef } from "preact/hooks"
import { add_notification } from "@/lib/notifications"
import { asset_store } from "@/packages/assets/state"
import { extract_palette_from_blob } from "@/packages/colors/extract"
import { open_suggestion } from "@/packages/colors/state"
import { Box } from "@/ui/atoms/box/box"
import { Button } from "@/ui/atoms/button/button"
import { Menu, type MenuItem } from "@/ui/atoms/menu/menu"
import { Modal } from "@/ui/atoms/modal/modal"
import { Text } from "@/ui/atoms/text/text"
import {
  can_bring_active_object_forward,
  can_bring_active_object_to_front,
  can_send_active_object_backward,
  can_send_active_object_to_back,
  remove_active_object,
} from "./actions"
import { sync_viewport_signals } from "./internal/controls"
import { canvas_controller, fabric_canvas } from "./state"

type MenuTarget = "object" | "canvas" | null

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

const save_active_object_to_assets = async (canvas: FabricCanvas) => {
  const obj = canvas.getActiveObject()
  if (obj?.type?.toLowerCase() !== "image") return

  const blob = await new Promise<Blob | null>(resolve => {
    obj.toCanvasElement().toBlob(resolve, "image/png")
  })

  if (!blob) return

  const file = new File([blob], `canvas-image-${Date.now()}.png`, { type: "image/png" })
  await asset_store.add_asset(file)
}

const is_default_view = (canvas: FabricCanvas) => {
  const vpt = canvas.viewportTransform
  if (!vpt) return true
  return vpt[0] === 1 && vpt[1] === 0 && vpt[2] === 0 && vpt[3] === 1 && vpt[4] === 0 && vpt[5] === 0
}

export const CanvasContextMenu = () => {
  const canvas = fabric_canvas.value
  const inputRef = useRef<HTMLInputElement>(null)
  const state = useSignal<MenuState>(initial_state)
  const show_arrange_confirm = useSignal(false)

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
        state.value = initial_state
        return
      }

      native.preventDefault()

      if (event.target) {
        activeCanvas.setActiveObject(event.target)
        activeCanvas.requestRenderAll()
        state.value = {
          open: true,
          x: native.clientX,
          y: native.clientY,
          target: "object",
        }
        return
      }

      activeCanvas.discardActiveObject()
      activeCanvas.requestRenderAll()

      state.value = {
        open: true,
        x: native.clientX,
        y: native.clientY,
        target: "canvas",
      }
    }

    activeCanvas.upperCanvasEl.addEventListener("contextmenu", handleNativeContextMenu)
    const disposeMouseDown = activeCanvas.on("mouse:down", handleMouseDown)

    return () => {
      activeCanvas.upperCanvasEl?.removeEventListener("contextmenu", handleNativeContextMenu)
      disposeMouseDown()
    }
  })

  const is_image_object = canvas?.getActiveObject()?.type?.toLowerCase() === "image"

  const items = useMemo<MenuItem[]>(() => {
    if (!canvas || !state.value.target) return []

    if (state.value.target === "object") {
      return [
        {
          id: "order",
          label: "Order",
          children: [
            {
              id: "bring-forward",
              label: "Bring forward",
              disabled: !can_bring_active_object_forward(canvas),
            },
            {
              id: "bring-to-front",
              label: "Bring to front",
              disabled: !can_bring_active_object_to_front(canvas),
            },
            {
              id: "send-backward",
              label: "Send backward",
              disabled: !can_send_active_object_backward(canvas),
            },
            {
              id: "send-to-back",
              label: "Send to back",
              disabled: !can_send_active_object_to_back(canvas),
            },
          ],
        },
        { id: "copy-object", label: "Copy object" },
        ...(is_image_object ? [{ id: "save-to-assets" as const, label: "Save to Assets" }] : []),
        ...(is_image_object ? [{ id: "generate-palette" as const, label: "Generate palette" }] : []),
        { id: "delete-object", label: "Delete object", danger: true },
      ]
    }

    return [
      { id: "add-image", label: "Add image" },
      {
        id: "arrange",
        label: "Arrange",
        disabled: canvas.getObjects().filter(o => o.type?.toLowerCase() === "image").length === 0,
      },
      {
        id: "reset-view",
        label: "Reset view",
        disabled: is_default_view(canvas),
      },
    ]
  }, [canvas, state.value.target])

  const handleSelect = (id: string) => {
    if (!canvas) return

    switch (id) {
      case "copy-object":
        void canvas_controller.copy_image_to_clipboard()
        break
      case "bring-to-front":
        void canvas_controller.order_active_object_to_front()
        break
      case "bring-forward":
        void canvas_controller.order_active_object_forward()
        break
      case "send-to-back":
        void canvas_controller.order_active_object_to_back()
        break
      case "send-backward":
        void canvas_controller.order_active_object_backward()
        break
      case "save-to-assets":
        void save_active_object_to_assets(canvas)
        break
      case "generate-palette":
        void (async () => {
          const obj = canvas.getActiveObject()
          const image_id = (obj as { _image_id?: string } | undefined)?._image_id
          if (typeof image_id !== "string") {
            add_notification({ type: "error", title: "No image data found" })
            return
          }
          try {
            const blob = await canvas_controller.get_image_blob(image_id)
            if (!blob) {
              add_notification({ type: "error", title: "Could not read image" })
              return
            }
            const colors = await extract_palette_from_blob(blob, 5)
            if (colors.length === 0) {
              add_notification({ type: "error", title: "No colors detected" })
              return
            }
            open_suggestion(colors, image_id)
          } catch {
            add_notification({ type: "error", title: "Palette extraction failed" })
          }
        })()
        break
      case "delete-object":
        remove_active_object(canvas)
        break
      case "add-image":
        inputRef.current?.click()
        break
      case "arrange":
        show_arrange_confirm.value = true
        break
      case "reset-view": {
        const vpt = canvas.viewportTransform
        if (!vpt) break
        const fromZoom = vpt[0]
        const fromX = vpt[4]
        const fromY = vpt[5]
        if (fromZoom === 1 && fromX === 0 && fromY === 0) break

        util.animate({
          startValue: [fromZoom, fromX, fromY],
          endValue: [1, 0, 0],
          duration: 300,
          easing: util.ease.easeOutCubic,
          onChange: ([zoom, x, y]) => {
            canvas.setViewportTransform([zoom, 0, 0, zoom, x, y])
            canvas.renderAll()
          },
          onComplete: () => {
            sync_viewport_signals(canvas)
          },
        })
        break
      }
    }
  }

  const handleFileChange = async (event: Event) => {
    const files = (event.target as HTMLInputElement).files
    if (!files?.length) return

    await canvas_controller.add_image(files)
    add_notification({ type: "success", title: `${files.length} image${files.length > 1 ? "s" : ""} added to canvas` })

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <>
      <Menu
        open={state.value.open}
        position={state.value.open ? { x: state.value.x, y: state.value.y } : null}
        items={items}
        onSelect={handleSelect}
        onClose={() => {
          state.value = initial_state
        }}
      />
      <Modal
        open={show_arrange_confirm.value}
        onClose={() => {
          show_arrange_confirm.value = false
        }}
        header="Arrange images"
        content={
          <Box maxW={300}>
            <Text>Text and boxes won't be touched. This will break your current layout. Be cautious</Text>
          </Box>
        }
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                show_arrange_confirm.value = false
              }}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={() => {
                canvas_controller.arrange_images()
                add_notification({ type: "success", title: "Images arranged on canvas" })
                show_arrange_confirm.value = false
              }}
            >
              Confirm
            </Button>
          </>
        }
      />
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileChange} hidden />
    </>
  )
}

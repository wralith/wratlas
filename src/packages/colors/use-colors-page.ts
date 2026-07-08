import { useSignal } from "@preact/signals"
import type { JSX } from "preact"
import { add_notification } from "@/lib/notifications"
import type { PaletteMeta } from "./internal/types"
import { color_store } from "./state"

type PaletteMenuState = {
  open: boolean
  x: number
  y: number
  palette: PaletteMeta | null
}

const initial: PaletteMenuState = { open: false, x: 0, y: 0, palette: null }

export const useColorsPage = () => {
  const menu = useSignal<PaletteMenuState>(initial)
  const pending_delete = useSignal<string | null>(null)

  const open_context_menu = (e: JSX.TargetedMouseEvent<HTMLDivElement>, palette: PaletteMeta) => {
    e.preventDefault()
    menu.value = { open: true, x: e.clientX, y: e.clientY, palette }
  }

  const close_menu = () => {
    menu.value = initial
  }

  const request_delete = (id: string) => {
    close_menu()
    pending_delete.value = id
  }

  const confirm_delete = () => {
    const id = pending_delete.value
    if (id) {
      color_store.remove_palette(id)
      add_notification({ type: "info", title: "Palette deleted" })
    }
    pending_delete.value = null
  }

  const cancel_delete = () => {
    pending_delete.value = null
  }

  const handle_menu_select = (id: string) => {
    const palette = menu.value.palette
    if (!palette) return
    switch (id) {
      case "delete":
        request_delete(palette.id)
        break
      case "copy-colors":
        void navigator.clipboard.writeText(palette.colors.join(", "))
        add_notification({ type: "success", title: "Palette copied" })
        break
    }
  }

  return {
    menu,
    pending_delete,
    open_context_menu,
    close_menu,
    request_delete,
    confirm_delete,
    cancel_delete,
    handle_menu_select,
  }
}

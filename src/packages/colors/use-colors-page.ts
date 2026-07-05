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

  const open_context_menu = (e: JSX.TargetedMouseEvent<HTMLDivElement>, palette: PaletteMeta) => {
    e.preventDefault()
    menu.value = { open: true, x: e.clientX, y: e.clientY, palette }
  }

  const close_menu = () => {
    menu.value = initial
  }

  const delete_palette = (id: string) => {
    color_store.remove_palette(id)
    add_notification({ type: "info", title: "Palette deleted" })
  }

  const rename_palette = (id: string, name: string) => {
    color_store.update_palette(id, { name })
  }

  const handle_menu_select = (id: string) => {
    const palette = menu.value.palette
    if (!palette) return
    switch (id) {
      case "delete":
        delete_palette(palette.id)
        break
      case "copy-colors":
        void navigator.clipboard.writeText(palette.colors.join(", "))
        add_notification({ type: "success", title: "Palette copied" })
        break
    }
  }

  return {
    menu,
    open_context_menu,
    close_menu,
    delete_palette,
    rename_palette,
    handle_menu_select,
  }
}

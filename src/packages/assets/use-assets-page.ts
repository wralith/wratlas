import { useComputed, useSignal, useSignalEffect } from "@preact/signals"
import { useRef } from "preact/hooks"
import { canvas_controller, canvas_store } from "@/packages/canvas/state"
import { asset_store } from "./state"

type MenuState = {
  open: boolean
  x: number
  y: number
  asset_id: string
}

const initial_menu: MenuState = {
  open: false,
  x: 0,
  y: 0,
  asset_id: "",
}

export const useAssetsPage = () => {
  const asset_urls = useSignal<Record<string, string>>({})
  const urls_cache = useRef<Record<string, string>>({})
  const file_input_ref = useRef<HTMLInputElement>(null)
  const menu = useSignal<MenuState>(initial_menu)

  const { search_query, selected_tags, filtered_assets, all_tags, add_asset, remove_asset, get_asset_blob } =
    asset_store

  useSignalEffect(() => {
    const assets_arr = filtered_assets.value
    const current_ids = new Set(assets_arr.map(a => a.id))

    const load = async () => {
      const next: Record<string, string> = {}

      for (const asset of assets_arr) {
        const cached = urls_cache.current[asset.id]
        if (cached) {
          next[asset.id] = cached
          continue
        }
        const blob = await get_asset_blob(asset.id)
        if (blob) {
          next[asset.id] = URL.createObjectURL(blob)
        }
      }

      for (const id of Object.keys(urls_cache.current)) {
        if (!current_ids.has(id)) {
          URL.revokeObjectURL(urls_cache.current[id])
        }
      }

      urls_cache.current = next
      asset_urls.value = next
    }

    load()
  })

  useSignalEffect(() => {
    return () => {
      for (const url of Object.values(urls_cache.current)) {
        URL.revokeObjectURL(url)
      }
      urls_cache.current = {}
      asset_urls.value = {}
    }
  })

  const handle_import = () => {
    file_input_ref.current?.click()
  }

  const handle_file_change = async (e: Event) => {
    const input = e.target as HTMLInputElement
    if (!input.files?.length) return

    for (const file of Array.from(input.files)) {
      await add_asset(file)
    }

    input.value = ""
  }

  const toggle_tag = (tag: string) => {
    const current = selected_tags.value
    selected_tags.value = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]
  }

  const is_tag_selected = (tag: string) => selected_tags.value.includes(tag)

  const menu_items = useComputed(() => [
    {
      id: "send-to-playground",
      label: "Send to Playground",
      children: canvas_store.canvas_list.value.map(c => ({
        id: `canvas-${c.id}`,
        label: c.name,
      })),
    },
    { id: "delete", label: "Delete", danger: true },
  ])

  const send_to_playground = async (canvas_id: string) => {
    const { asset_id } = menu.value
    const blob = await get_asset_blob(asset_id)
    if (!blob) return
    const file = new File([blob], `asset-${asset_id}.${blob.type.split("/")[1] || "png"}`, { type: blob.type })
    await canvas_controller.add_image_to_canvas(canvas_id, file)
  }

  const delete_asset = async (asset_id: string) => {
    const url = urls_cache.current[asset_id]
    if (url) {
      URL.revokeObjectURL(url)
      delete urls_cache.current[asset_id]
    }
    await remove_asset(asset_id)
  }

  const open_context_menu = (asset_id: string, e: MouseEvent) => {
    e.preventDefault()
    menu.value = {
      open: true,
      x: e.clientX,
      y: e.clientY,
      asset_id,
    }
  }

  const close_menu = () => {
    menu.value = initial_menu
  }

  const handle_menu_select = (id: string) => {
    if (id.startsWith("canvas-")) {
      void send_to_playground(id.slice("canvas-".length))
      return
    }

    if (id === "delete") {
      void delete_asset(menu.value.asset_id)
    }
  }

  return {
    search_query,
    selected_tags,
    filtered_assets,
    all_tags,
    asset_urls,
    file_input_ref,
    handle_import,
    handle_file_change,
    toggle_tag,
    is_tag_selected,
    send_to_playground,
    delete_asset,
    menu,
    menu_items,
    open_context_menu,
    close_menu,
    handle_menu_select,
  }
}

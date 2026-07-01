import { useSignal, useSignalEffect } from "@preact/signals"
import { useRef } from "preact/hooks"
import { asset_store } from "./state"

export const useAssetsPage = () => {
  const asset_urls = useSignal<Record<string, string>>({})
  const urls_cache = useRef<Record<string, string>>({})
  const file_input_ref = useRef<HTMLInputElement>(null)

  const { search_query, selected_tags, filtered_assets, all_tags, add_asset, get_asset_blob } = asset_store

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

  const cleanup = () => {
    for (const url of Object.values(urls_cache.current)) {
      URL.revokeObjectURL(url)
    }
    urls_cache.current = {}
    asset_urls.value = {}
  }

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
    cleanup,
  }
}

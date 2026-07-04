import type { Signal } from "@preact/signals"
import { useEffect } from "preact/hooks"
import { SortableAssetCard } from "@/packages/assets/sortable-asset-card"
import { asset_store } from "@/packages/assets/state"
import { Flex } from "@/ui/atoms/flex/flex"
import { open_details } from "./asset-details-modal"

const read_order = (): string[] => {
  const cards = document.querySelectorAll<HTMLElement>("[data-asset-id]")
  return [...Array.from(cards)].map(el => el.getAttribute("data-asset-id")).filter((x): x is string => x !== null)
}

export const SortableGrid = ({
  asset_urls,
  open_context_menu,
}: {
  asset_urls: Signal<Record<string, string>>
  open_context_menu: (id: string, e: MouseEvent) => void
}) => {
  const urls = asset_urls.value
  const { filtered_assets, reorder_asset, selected_ids, toggle_selection } = asset_store

  useEffect(() => {
    const handler = () => {
      const order = read_order()
      for (let i = 0; i < order.length - 1; i++) {
        const current_id = order[i]
        const next_id = order[i + 1]
        const assets = asset_store.assets.value
        const current_idx = assets.findIndex(a => a.id === current_id)
        const next_idx = assets.findIndex(a => a.id === next_id)
        if (current_idx > next_idx) {
          reorder_asset(current_id, next_id)
          return
        }
      }
    }
    window.addEventListener("drag-finished", handler)
    return () => window.removeEventListener("drag-finished", handler)
  }, [])

  return (
    <Flex gap="md" wrap data-dnd-grid>
      {filtered_assets.value.map((asset, idx) => (
        <SortableAssetCard
          key={asset.id}
          id={asset.id}
          index={idx}
          name={asset.name}
          tags={asset.tags}
          width={asset.width}
          height={asset.height}
          thumbnailUrl={urls[asset.id] ?? ""}
          selected={selected_ids.value.includes(asset.id)}
          onToggle={() => toggle_selection(asset.id)}
          onContextMenu={e => open_context_menu(asset.id, e)}
          onClick={() => open_details(asset.id, urls[asset.id] ?? "")}
        />
      ))}
    </Flex>
  )
}

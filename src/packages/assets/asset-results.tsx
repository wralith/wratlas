import type { Signal } from "@preact/signals"
import { Search } from "lucide-preact"
import { asset_store } from "@/packages/assets/state"
import { Flex } from "@/ui/atoms/flex/flex"
import { SortableGrid } from "./sortable-grid"

export const AssetResults = ({
  asset_urls,
  open_context_menu,
}: {
  asset_urls: Signal<Record<string, string>>
  open_context_menu: (id: string, e: MouseEvent) => void
}) => {
  const { filtered_assets } = asset_store

  if (filtered_assets.value.length === 0) {
    return (
      <Flex direction="column" align="center" gap="sm" style="padding:64px 0;color:var(--text-muted)">
        <Search size={32} />
        <p>No assets found. Import some images to get started.</p>
      </Flex>
    )
  }

  return <SortableGrid asset_urls={asset_urls} open_context_menu={open_context_menu} />
}

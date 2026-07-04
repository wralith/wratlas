import type { Signal } from "@preact/signals"
import { useComputed } from "@preact/signals"
import { ImageUp, Search } from "lucide-preact"
import { useEffect } from "preact/hooks"
import { AssetDetailsModal, open_details } from "@/packages/assets/asset-details-modal"
import { SortableAssetCard } from "@/packages/assets/sortable-asset-card"
import { asset_store } from "@/packages/assets/state"
import { useAssetsPage } from "@/packages/assets/use-assets-page"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { Menu } from "@/ui/atoms/menu/menu"
import { Tag } from "@/ui/atoms/tag/tag"
import { PageLayout } from "@/ui/molecules/page-layout/page-layout"
import { Toolbar } from "@/ui/molecules/toolbar/toolbar"
import { toolbarWrap } from "./assets.css.ts"

const read_order = (): string[] => {
  const cards = document.querySelectorAll<HTMLElement>("[data-asset-id]")
  return [...Array.from(cards)].map(el => el.getAttribute("data-asset-id")).filter((x): x is string => x !== null)
}

const SortableGrid = ({
  asset_urls,
  open_context_menu,
}: {
  asset_urls: Signal<Record<string, string>>
  open_context_menu: (id: string, e: MouseEvent) => void
}) => {
  const urls = asset_urls.value
  const { filtered_assets, reorder_asset } = asset_store

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
          onContextMenu={e => open_context_menu(asset.id, e)}
          onClick={() => open_details(asset.id, urls[asset.id] ?? "")}
        />
      ))}
    </Flex>
  )
}

const AssetFiltersBar = ({
  file_input_ref,
  handle_import,
  handle_file_change,
}: {
  file_input_ref: { current: HTMLInputElement | null }
  handle_import: () => void
  handle_file_change: (e: Event) => void
}) => {
  const { search_query, all_tags, selected_tags } = asset_store
  const selected_set = useComputed(() => new Set(selected_tags.value))

  return (
    <div class={toolbarWrap}>
      <Toolbar>
        <Flex align="center" gap="md" style="flex:1">
          <Input
            placeholder="Search assets..."
            value={search_query.value}
            onInput={e => {
              search_query.value = (e.target as HTMLInputElement).value
            }}
            style="flex:1;max-width:320px"
          />
        </Flex>
        <Flex gap="sm">
          {all_tags.value.length > 0 && (
            <Flex gap="xs" wrap>
              {all_tags.value.map(tag => (
                <Tag
                  key={tag}
                  active={selected_set.value.has(tag)}
                  onClick={() => {
                    const current = selected_tags.value
                    selected_tags.value = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </Flex>
          )}
          <Button left={<ImageUp size={16} />} onClick={handle_import}>
            Import
          </Button>
          <input ref={file_input_ref} type="file" accept="image/*" multiple hidden onChange={handle_file_change} />
        </Flex>
      </Toolbar>
    </div>
  )
}

const AssetResults = ({
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

const AssetsPage = () => {
  const {
    asset_urls,
    file_input_ref,
    handle_import,
    handle_file_change,
    menu,
    menu_items,
    open_context_menu,
    close_menu,
    send_to_playground,
    delete_asset,
    download_asset,
  } = useAssetsPage()

  const handle_menu_select = (id: string) => {
    if (id.startsWith("canvas-")) {
      void send_to_playground(id.slice("canvas-".length))
      return
    }

    const asset_id = menu.value.asset_id

    switch (id) {
      case "delete":
        void delete_asset(asset_id)
        break
      case "download":
        void download_asset(asset_id)
        break
    }
  }

  return (
    <PageLayout>
      <AssetFiltersBar
        file_input_ref={file_input_ref}
        handle_import={handle_import}
        handle_file_change={handle_file_change}
      />
      <div style="padding:1rem;flex:1">
        <AssetResults asset_urls={asset_urls} open_context_menu={open_context_menu} />
      </div>

      <Menu
        open={menu.value.open}
        position={menu.value.open ? { x: menu.value.x, y: menu.value.y } : null}
        items={menu_items.value}
        onSelect={handle_menu_select}
        onClose={close_menu}
      />

      <AssetDetailsModal />
    </PageLayout>
  )
}

export default AssetsPage

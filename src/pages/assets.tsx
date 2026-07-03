import { useSignalEffect } from "@preact/signals"
import { ImageUp, Search } from "lucide-preact"
import { AssetDetailsModal, open_details } from "@/packages/assets/asset-details-modal"
import { AssetRenameModal, open_rename } from "@/packages/assets/asset-rename-modal"
import { SortableAssetCard } from "@/packages/assets/sortable-asset-card"
import { asset_store } from "@/packages/assets/state"
import { useAssetsPage } from "@/packages/assets/use-assets-page"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { Menu } from "@/ui/atoms/menu/menu"
import { Tag } from "@/ui/atoms/tag/tag"
import { PageLayout } from "@/ui/molecules/page-layout/page-layout"

const read_order = (): string[] => {
  const cards = document.querySelectorAll<HTMLElement>("[data-asset-id]")
  return [...cards].map(el => el.getAttribute("data-asset-id")).filter((x): x is string => x !== null)
}

const SortableGrid = ({
  asset_urls,
  open_context_menu,
}: {
  asset_urls: Record<string, string>
  open_context_menu: (id: string, e: MouseEvent) => void
}) => {
  const { filtered_assets, reorder_asset } = asset_store

  useSignalEffect(() => {
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
  })

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
          thumbnailUrl={asset_urls[asset.id] ?? ""}
          onContextMenu={e => open_context_menu(asset.id, e)}
          onClick={() => open_details(asset.id, asset_urls[asset.id] ?? "")}
        />
      ))}
    </Flex>
  )
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

  const { search_query, filtered_assets, all_tags, selected_tags } = asset_store

  const toggle_tag = (tag: string) => {
    const current = selected_tags.value
    selected_tags.value = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]
  }

  const is_tag_selected = (tag: string) => selected_tags.value.includes(tag)

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
      case "rename":
        open_rename(asset_id)
        break
    }
  }
  return (
    <PageLayout>
      <Flex direction="column" gap="lg">
        <Flex justify="between" align="center">
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
                  <Tag key={tag} active={is_tag_selected(tag)} onClick={() => toggle_tag(tag)}>
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
        </Flex>

        {filtered_assets.value.length === 0 ? (
          <Flex direction="column" align="center" gap="sm" style="padding:64px 0;color:var(--text-muted)">
            <Search size={32} />
            <p>No assets found. Import some images to get started.</p>
          </Flex>
        ) : (
          <SortableGrid asset_urls={asset_urls.value} open_context_menu={open_context_menu} />
        )}
      </Flex>

      <Menu
        open={menu.value.open}
        position={menu.value.open ? { x: menu.value.x, y: menu.value.y } : null}
        items={menu_items.value}
        onSelect={handle_menu_select}
        onClose={close_menu}
      />

      <AssetRenameModal />
      <AssetDetailsModal />
    </PageLayout>
  )
}

export default AssetsPage

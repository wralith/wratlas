import { useSignal } from "@preact/signals"
import { AssetDetailsModal } from "@/packages/assets/asset-details-modal"
import { AssetFiltersBar } from "@/packages/assets/asset-filters-bar"
import { AssetResults } from "@/packages/assets/asset-results"
import { BatchActionBar, SelectAllFloating } from "@/packages/assets/batch-action-bar"
import { asset_store } from "@/packages/assets/state"
import { useAssetsPage } from "@/packages/assets/use-assets-page"
import { Button } from "@/ui/atoms/button/button"
import { Menu } from "@/ui/atoms/menu/menu"
import { Modal } from "@/ui/atoms/modal/modal"
import { PageLayout } from "@/ui/molecules/page-layout/page-layout"

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

  const deleteModalOpen = useSignal(false)

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

  const handleBatchDeleteRequest = () => {
    deleteModalOpen.value = true
  }

  const handleBatchDeleteConfirm = async () => {
    const ids = [...asset_store.selected_ids.value]
    for (const id of ids) {
      await delete_asset(id)
    }
    asset_store.clear_selection()
    deleteModalOpen.value = false
  }

  return (
    <PageLayout>
      <AssetFiltersBar
        file_input_ref={file_input_ref}
        handle_import={handle_import}
        handle_file_change={handle_file_change}
      />
      <div style="padding:1rem;flex:1;padding-bottom:80px">
        <AssetResults asset_urls={asset_urls} open_context_menu={open_context_menu} />
      </div>

      <SelectAllFloating />
      <BatchActionBar onDeleteRequest={handleBatchDeleteRequest} />

      <Menu
        open={menu.value.open}
        position={menu.value.open ? { x: menu.value.x, y: menu.value.y } : null}
        items={menu_items.value}
        onSelect={handle_menu_select}
        onClose={close_menu}
      />

      <Modal
        open={deleteModalOpen.value}
        onClose={() => {
          deleteModalOpen.value = false
        }}
        header="Delete Assets"
        content={`Are you sure you want to delete ${asset_store.selected_ids.value.length} selected assets?`}
        footer={
          <>
            <Button
              size="small"
              onClick={() => {
                deleteModalOpen.value = false
              }}
            >
              Cancel
            </Button>
            <Button size="small" color="danger" onClick={handleBatchDeleteConfirm}>
              Delete
            </Button>
          </>
        }
      />

      <AssetDetailsModal />
    </PageLayout>
  )
}

export default AssetsPage

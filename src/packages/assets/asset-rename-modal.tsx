import { signal } from "@preact/signals"
import { asset_store } from "@/packages/assets/state"
import { Button } from "@/ui/atoms/button/button"
import { Input } from "@/ui/atoms/input/input"
import { Modal } from "@/ui/atoms/modal/modal"

type RenameState = {
  open: boolean
  asset_id: string
  rename_name?: string
}
const rename_state = signal<RenameState>({
  open: false,
  asset_id: "",
  rename_name: "",
})

export const open_rename = (asset_id: string) => {
  const asset = asset_store.assets.value.find(a => a.id === asset_id)
  if (!asset) return
  rename_state.value = { open: true, asset_id, rename_name: asset.name }
}

export const close_rename = () => {
  rename_state.value = { open: false, asset_id: "" }
}

const handle_rename = () => {
  const { asset_id, rename_name } = rename_state.value
  if (!asset_id || !rename_name?.trim()) return
  void asset_store.update_asset(asset_id, { name: rename_name.trim() })
  close_rename()
}

export const AssetRenameModal = () => (
  <Modal
    open={rename_state.value.open}
    onClose={close_rename}
    header="Rename Asset"
    content={
      <Input
        value={rename_state.value.rename_name}
        onInput={e => {
          rename_state.value = {
            ...rename_state.value,
            rename_name: e.currentTarget.value,
          }
        }}
        onKeyDown={e => {
          if (e.key === "Enter") handle_rename()
        }}
      />
    }
    footer={
      <>
        <Button size="small" onClick={close_rename}>
          Cancel
        </Button>
        <Button size="small" onClick={handle_rename}>
          Rename
        </Button>
      </>
    }
  />
)

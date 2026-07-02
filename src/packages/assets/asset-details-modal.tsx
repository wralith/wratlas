import { computed, signal } from "@preact/signals"
import { asset_store } from "@/packages/assets/state"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { Modal } from "@/ui/atoms/modal/modal"
import { TextArea } from "@/ui/atoms/text-area/text-area"

type DetailsFormState = {
  open: boolean
  asset_id: string
  name: string
  tags: string
  group: string
  notes: string
  thumbnail_url: string
}

const empty_details_state: DetailsFormState = {
  open: false,
  asset_id: "",
  name: "",
  tags: "",
  group: "",
  notes: "",
  thumbnail_url: "",
}

const details_state = signal<DetailsFormState>(empty_details_state)
const details_saving = signal(false)

const can_save = computed(() => details_state.value.name.trim().length > 0 && !details_saving.value)

export const open_details = (asset_id: string, thumbnail_url: string) => {
  const asset = asset_store.assets.value.find(a => a.id === asset_id)
  if (!asset) return
  details_state.value = {
    open: true,
    asset_id,
    name: asset.name,
    tags: asset.tags.join(", "),
    group: asset.group ?? "",
    notes: asset.notes,
    thumbnail_url,
  }
}

export const close_details = () => {
  details_state.value = empty_details_state
}

const set_field = <K extends keyof DetailsFormState>(key: K, value: DetailsFormState[K]) => {
  details_state.value = { ...details_state.value, [key]: value }
}

type TargetedInputEvent = Event & {
  currentTarget: HTMLInputElement | HTMLTextAreaElement
}

const bind_field =
  (key: keyof Pick<DetailsFormState, "name" | "tags" | "group" | "notes">) => (e: TargetedInputEvent) => {
    set_field(key, e.currentTarget.value)
  }

const handle_details_save = async () => {
  const { asset_id } = details_state.value
  if (!asset_id || details_saving.value) return
  details_saving.value = true
  try {
    await asset_store.update_asset(asset_id, {
      name: details_state.value.name.trim(),
      tags: details_state.value.tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean),
      group: details_state.value.group.trim() || null,
      notes: details_state.value.notes.trim(),
    })
    close_details()
  } catch (err) {
    // TODO: surface a toast/error state here
    console.error("Failed to save asset details", err)
  } finally {
    details_saving.value = false
  }
}

export const AssetDetailsModal = () => (
  <Modal
    open={details_state.value.open}
    onClose={close_details}
    header="Asset Details"
    wide
    content={
      <Flex direction="column" gap="md">
        {details_state.value.thumbnail_url && (
          <img
            src={details_state.value.thumbnail_url}
            alt={details_state.value.name}
            style="width:100%;max-height:180px;object-fit:contain;border-radius:4px;background:var(--bg-overlay)"
          />
        )}
        <Input label="Name" value={details_state.value.name} onInput={bind_field("name")} />
        <Input label="Tags (comma separated)" value={details_state.value.tags} onInput={bind_field("tags")} />
        <Input label="Group" value={details_state.value.group} onInput={bind_field("group")} />
        <TextArea label="Notes" value={details_state.value.notes} onInput={bind_field("notes")} />
      </Flex>
    }
    footer={
      <>
        <Button size="small" onClick={close_details} disabled={details_saving.value}>
          Cancel
        </Button>
        <Button size="small" onClick={handle_details_save} disabled={!can_save.value}>
          {details_saving.value ? "Saving…" : "Save"}
        </Button>
      </>
    }
  />
)

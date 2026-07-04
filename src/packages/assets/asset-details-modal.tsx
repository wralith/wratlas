import { effect, signal } from "@preact/signals"
import { debounce } from "@/lib/debounce"
import { asset_store } from "@/packages/assets/state"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { Modal } from "@/ui/atoms/modal/modal"
import { TextArea } from "@/ui/atoms/text-area/text-area"
import { TagInput } from "@/ui/molecules/tag-input/tag-input"

type DetailsFormState = {
  open: boolean
  asset_id: string
  name: string
  tags: string[]
  group: string
  notes: string
  thumbnail_url: string
}

const empty_details_state: DetailsFormState = {
  open: false,
  asset_id: "",
  name: "",
  tags: [],
  group: "",
  notes: "",
  thumbnail_url: "",
}

const details_state = signal<DetailsFormState>(empty_details_state)

const debounced_save = debounce((state: DetailsFormState) => {
  if (!state.open || !state.asset_id || !state.name.trim()) return
  void asset_store.update_asset(state.asset_id, {
    name: state.name.trim(),
    tags: state.tags,
    group: state.group.trim() || null,
    notes: state.notes.trim(),
  })
}, 300)

effect(() => {
  debounced_save(details_state.value)
})

export const open_details = (asset_id: string, thumbnail_url: string) => {
  const asset = asset_store.assets.value.find(a => a.id === asset_id)
  if (!asset) return
  debounced_save.cancel()
  details_state.value = {
    open: true,
    asset_id,
    name: asset.name,
    tags: [...asset.tags],
    group: asset.group ?? "",
    notes: asset.notes,
    thumbnail_url,
  }
}

export const close_details = () => {
  debounced_save.cancel()
  details_state.value = empty_details_state
}

const set_field = <K extends keyof DetailsFormState>(key: K, value: DetailsFormState[K]) => {
  details_state.value = { ...details_state.value, [key]: value }
}

type TargetedInputEvent = Event & {
  currentTarget: HTMLInputElement | HTMLTextAreaElement
}

const bind_field = (key: keyof Pick<DetailsFormState, "name" | "group" | "notes">) => (e: TargetedInputEvent) => {
  set_field(key, e.currentTarget.value)
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
        <TagInput
          label="Tags"
          value={details_state.value.tags}
          onChange={tags => set_field("tags", tags)}
          suggestions={asset_store.all_tags.value}
        />
        <Input label="Group" value={details_state.value.group} onInput={bind_field("group")} />
        <TextArea label="Notes" value={details_state.value.notes} onInput={bind_field("notes")} />
      </Flex>
    }
  />
)

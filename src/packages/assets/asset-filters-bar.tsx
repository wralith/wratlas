import { ImageUp } from "lucide-preact"
import { asset_store } from "@/packages/assets/state"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { MultiSelect } from "@/ui/molecules/multi-select/multi-select"
import { Toolbar } from "@/ui/molecules/toolbar/toolbar"
import { toolbarWrap } from "./asset-filters-bar.css.ts"

export const AssetFiltersBar = ({
  file_input_ref,
  handle_import,
  handle_file_change,
}: {
  file_input_ref: { current: HTMLInputElement | null }
  handle_import: () => void
  handle_file_change: (e: Event) => void
}) => {
  const { search_query, all_tags, selected_tags } = asset_store

  return (
    <div class={toolbarWrap}>
      <Toolbar>
        <Flex align="center" gap="md" style="flex:1;min-width:0">
          <Input
            placeholder="Search assets..."
            value={search_query.value}
            onInput={e => {
              search_query.value = (e.target as HTMLInputElement).value
            }}
            style="flex:1;max-width:320px"
          />
          <MultiSelect
            value={selected_tags.value}
            onChange={v => {
              selected_tags.value = v
            }}
            options={all_tags.value}
            placeholder="Filter by tags"
            maxWidth={400}
            height={200}
          />
        </Flex>
        <Flex gap="sm" style="flex-shrink:0">
          <Button left={<ImageUp size={16} />} onClick={handle_import}>
            Import
          </Button>
          <input ref={file_input_ref} type="file" accept="image/*" multiple hidden onChange={handle_file_change} />
        </Flex>
      </Toolbar>
    </div>
  )
}

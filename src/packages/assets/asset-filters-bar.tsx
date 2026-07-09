import { ImageUp } from "lucide-preact"
import { asset_store } from "@/packages/assets/state"
import { Box } from "@/ui/atoms/box/box"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { MultiSelect } from "@/ui/molecules/multi-select/multi-select"
import { Toolbar } from "@/ui/molecules/toolbar/toolbar"
import { toolbarWrapper } from "@/ui/molecules/toolbar/toolbar-wrapper.css"

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
    <div data-tour="assets-filters" class={toolbarWrapper}>
      <Toolbar>
        <Flex align="center" gap="md" flex="1" minW={0}>
          <Box flex="1" maxW={320} data-tour="assets-search">
            <Input
              placeholder="Search assets..."
              value={search_query.value}
              onInput={e => {
                search_query.value = (e.target as HTMLInputElement).value
              }}
            />
          </Box>
          <MultiSelect
            value={selected_tags.value}
            onChange={v => {
              selected_tags.value = v
            }}
            options={all_tags.value}
            placeholder="Tags"
            searchPlaceholder="Search tags..."
            maxWidth={400}
            height={200}
            hideSearch={false}
            visibleCount={3}
          />
        </Flex>
        <Flex gap="sm" data-tour="assets-import">
          <Button left={<ImageUp size={16} />} onClick={handle_import}>
            Import
          </Button>
          <input ref={file_input_ref} type="file" accept="image/*" multiple hidden onChange={handle_file_change} />
        </Flex>
      </Toolbar>
    </div>
  )
}

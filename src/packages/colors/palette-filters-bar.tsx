import { Search } from "lucide-preact"
import { color_store } from "@/packages/colors/state"
import { Box } from "@/ui/atoms/box/box"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { Text } from "@/ui/atoms/text/text"
import { Toolbar } from "@/ui/molecules/toolbar/toolbar"
import { toolbarWrapper } from "@/ui/molecules/toolbar/toolbar-wrapper.css"

export const PaletteFiltersBar = () => {
  const { search_query, palettes } = color_store

  return (
    <div data-tour="colors-filters" class={toolbarWrapper}>
      <Toolbar>
        <Flex align="center" gap="md" flex="1" minW={0}>
          <Box flex="1" maxW={320}>
            <Input
              placeholder="Search palettes..."
              value={search_query.value}
              onInput={e => {
                search_query.value = (e.target as HTMLInputElement).value
              }}
            />
          </Box>
          <Flex align="center" gap="xs">
            <Search size={14} />
            <Text color="muted">
              {palettes.value.length} palette{palettes.value.length === 1 ? "" : "s"}
            </Text>
          </Flex>
        </Flex>
      </Toolbar>
    </div>
  )
}

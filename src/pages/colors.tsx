import { ColorDetailsModal } from "@/packages/colors/color-details-modal"
import { PaletteFiltersBar } from "@/packages/colors/palette-filters-bar"
import { PalettesGrid } from "@/packages/colors/palettes-grid"
import { detail_palette } from "@/packages/colors/state"
import { ColorsTour } from "@/packages/colors/tour"
import { useColorsPage } from "@/packages/colors/use-colors-page"
import { Box } from "@/ui/atoms/box/box"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Menu, type MenuItem } from "@/ui/atoms/menu/menu"
import { Modal } from "@/ui/atoms/modal/modal"
import { Text } from "@/ui/atoms/text/text"
import { PageLayout } from "@/ui/molecules/page-layout/page-layout"

const ColorsPage = () => {
  const {
    menu,
    pending_delete,
    open_context_menu,
    close_menu,
    request_delete,
    confirm_delete,
    cancel_delete,
    handle_menu_select,
  } = useColorsPage()
  const selected_palette = detail_palette

  const menu_items: MenuItem[] = [
    { id: "copy-colors", label: "Copy colors" },
    { id: "delete", label: "Delete palette", danger: true },
  ]

  return (
    <PageLayout>
      <ColorsTour />
      <PaletteFiltersBar />
      <Box p="1rem" flex={1} pb={80}>
        <PalettesGrid
          open_context_menu={open_context_menu}
          onCardClick={p => {
            selected_palette.value = p
          }}
          onDeleteRequest={request_delete}
        />
      </Box>

      <Menu
        open={menu.value.open}
        position={menu.value.open ? { x: menu.value.x, y: menu.value.y } : null}
        items={menu_items}
        onSelect={handle_menu_select}
        onClose={close_menu}
      />

      <ColorDetailsModal
        palette={selected_palette.value}
        onClose={() => {
          selected_palette.value = null
        }}
      />

      <Modal
        open={pending_delete.value !== null}
        onClose={cancel_delete}
        header="Delete palette"
        content={<Text>Are you sure you want to delete this palette? This action cannot be undone.</Text>}
        footer={
          <Flex gap="sm">
            <Button variant="ghost" onClick={cancel_delete}>
              Cancel
            </Button>
            <Button color="danger" onClick={confirm_delete}>
              Delete
            </Button>
          </Flex>
        }
      />
    </PageLayout>
  )
}

export default ColorsPage

import { PaletteFiltersBar } from "@/packages/colors/palette-filters-bar"
import { PalettesGrid } from "@/packages/colors/palettes-grid"
import { useColorsPage } from "@/packages/colors/use-colors-page"
import { Box } from "@/ui/atoms/box/box"
import { Menu, type MenuItem } from "@/ui/atoms/menu/menu"
import { PageLayout } from "@/ui/molecules/page-layout/page-layout"

const ColorsPage = () => {
  const { menu, open_context_menu, close_menu, handle_menu_select } = useColorsPage()

  const menu_items: MenuItem[] = [
    { id: "copy-colors", label: "Copy colors" },
    { id: "delete", label: "Delete palette", danger: true },
  ]

  return (
    <PageLayout>
      <PaletteFiltersBar />
      <Box p="1rem" flex={1} pb={80}>
        <PalettesGrid open_context_menu={open_context_menu} />
      </Box>

      <Menu
        open={menu.value.open}
        position={menu.value.open ? { x: menu.value.x, y: menu.value.y } : null}
        items={menu_items}
        onSelect={handle_menu_select}
        onClose={close_menu}
      />
    </PageLayout>
  )
}

export default ColorsPage

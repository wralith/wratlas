import { ImageUp, Search } from "lucide-preact"
import { useAssetsPage } from "@/packages/assets/use-assets-page"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { Menu } from "@/ui/atoms/menu/menu"
import { Tag } from "@/ui/atoms/tag/tag"
import { ImageCard } from "@/ui/molecules/image-card/image-card"
import { PageLayout } from "@/ui/molecules/page-layout/page-layout"

const AssetsPage = () => {
  const {
    search_query,
    filtered_assets,
    all_tags,
    asset_urls,
    file_input_ref,
    handle_import,
    handle_file_change,
    toggle_tag,
    is_tag_selected,
    menu,
    menu_items,
    open_context_menu,
    close_menu,
    handle_menu_select,
  } = useAssetsPage()

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
          <Flex gap="md" wrap>
            {filtered_assets.value.map(asset => (
              <ImageCard
                key={asset.id}
                name={asset.name}
                tags={asset.tags}
                width={asset.width}
                height={asset.height}
                thumbnailUrl={asset_urls.value[asset.id] ?? ""}
                onContextMenu={e => open_context_menu(asset.id, e)}
              />
            ))}
          </Flex>
        )}
      </Flex>

      <Menu
        open={menu.value.open}
        position={menu.value.open ? { x: menu.value.x, y: menu.value.y } : null}
        items={menu_items.value}
        onSelect={handle_menu_select}
        onClose={close_menu}
      />
    </PageLayout>
  )
}

export default AssetsPage

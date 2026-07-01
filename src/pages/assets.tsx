import { ImageUp, Search } from "lucide-preact"
import { useEffect, useRef, useState } from "preact/hooks"
import { asset_store } from "@/packages/assets/state"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { Tag } from "@/ui/atoms/tag/tag"
import { ImageCard } from "@/ui/molecules/image-card/image-card"
import { PageLayout } from "@/ui/molecules/page-layout/page-layout"

const AssetsPage = () => {
  const { filtered_assets, search_query, selected_tags, all_tags, add_asset, get_asset_blob } = asset_store

  const [urls, set_urls] = useState<Record<string, string>>({})
  const urls_ref = useRef<Record<string, string>>({})
  const file_input_ref = useRef<HTMLInputElement>(null)
  const search_ref = useRef<HTMLInputElement>(null)

  const load_urls = async (ids: string[]) => {
    const next: Record<string, string> = {}

    for (const id of ids) {
      const existing = urls_ref.current[id]
      if (existing) {
        next[id] = existing
        continue
      }
      const blob = await get_asset_blob(id)
      if (blob) {
        next[id] = URL.createObjectURL(blob)
      }
    }

    for (const id of Object.keys(urls_ref.current)) {
      if (!next[id]) {
        URL.revokeObjectURL(urls_ref.current[id])
      }
    }

    urls_ref.current = next
    set_urls({ ...next })
  }

  useEffect(() => {
    const ids = filtered_assets.value.map(a => a.id)
    load_urls(ids)

    return () => {
      for (const url of Object.values(urls_ref.current)) {
        URL.revokeObjectURL(url)
      }
      urls_ref.current = {}
    }
  }, [])

  const handle_import = () => {
    file_input_ref.current?.click()
  }

  const handle_file_change = async (e: Event) => {
    const input = e.target as HTMLInputElement
    if (!input.files?.length) return

    for (const file of input.files) {
      await add_asset(file)
    }

    input.value = ""
    const ids = filtered_assets.value.map(a => a.id)
    await load_urls(ids)
  }

  const toggle_tag = (tag: string) => {
    const current = selected_tags.value
    if (current.includes(tag)) {
      selected_tags.value = current.filter(t => t !== tag)
    } else {
      selected_tags.value = [...current, tag]
    }
  }

  const is_tag_selected = (tag: string) => selected_tags.value.includes(tag)

  return (
    <PageLayout>
      <Flex direction="column" gap="lg">
        <Flex justify="between" align="center">
          <Flex align="center" gap="md" style="flex:1">
            <Input
              ref={search_ref}
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
                thumbnailUrl={urls[asset.id] ?? ""}
              />
            ))}
          </Flex>
        )}
      </Flex>
    </PageLayout>
  )
}

export default AssetsPage

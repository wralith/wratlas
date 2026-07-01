import { computed, effect, signal } from "@preact/signals"
import { createStore, del, get, set } from "idb-keyval"
import { nanoid } from "nanoid"
import { debounce } from "@/lib/debounce"
import { safe_parse_json } from "@/lib/safe-parse-json"
import type { AssetMeta, AssetStorage } from "./types"

const INDEX_KEY = "wratlas.assets.v1.index"
const image_blob_store = createStore("wratlas-assets-db", "images")

const get_image_size = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }
    img.src = url
  })
}

const get_initial_storage = (): AssetStorage => {
  const raw = localStorage.getItem(INDEX_KEY)
  return safe_parse_json<AssetStorage>(raw) ?? { assets: [] }
}

export const create_asset_store = () => {
  const storage = signal<AssetStorage>(get_initial_storage())
  const assets = computed(() => storage.value.assets)
  const search_query = signal("")
  const selected_tags = signal<string[]>([])

  const all_tags = computed(() => {
    const tags = new Set<string>()
    for (const asset of assets.value) {
      for (const tag of asset.tags) {
        tags.add(tag)
      }
    }
    return [...tags].sort()
  })

  const all_groups = computed(() => {
    const groups = new Set<string>()
    for (const asset of assets.value) {
      if (asset.group) groups.add(asset.group)
    }
    return [...groups].sort()
  })

  const filtered_assets = computed(() => {
    let result = assets.value
    const query = search_query.value.trim().toLowerCase()
    const tags = selected_tags.value

    if (query) {
      result = result.filter(a => a.name.toLowerCase().includes(query))
    }

    if (tags.length > 0) {
      result = result.filter(a => tags.some(t => a.tags.includes(t)))
    }

    return result
  })

  const debounced_save = debounce((data: AssetStorage) => {
    try {
      localStorage.setItem(INDEX_KEY, JSON.stringify(data))
    } catch (e) {
      console.error("Failed to save asset store:", e)
    }
  }, 200)

  effect(() => {
    debounced_save(storage.value)
  })

  const get_asset_blob = (id: string) => get<Blob>(id, image_blob_store)

  const add_asset = async (file: File, input?: { name?: string; tags?: string[]; group?: string }) => {
    const id = nanoid(8)
    const { width, height } = await get_image_size(file)

    const meta: AssetMeta = {
      id,
      name: input?.name ?? file.name,
      type: "image",
      tags: input?.tags ?? [],
      group: input?.group ?? null,
      notes: "",
      width,
      height,
      fileSize: file.size,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await set(id, file, image_blob_store)

    storage.value = {
      assets: [...storage.value.assets, meta],
    }

    return meta
  }

  const remove_asset = async (id: string) => {
    await del(id, image_blob_store)
    storage.value = {
      assets: storage.value.assets.filter(a => a.id !== id),
    }
  }

  const update_asset = async (id: string, updates: Partial<AssetMeta>) => {
    storage.value = {
      assets: storage.value.assets.map(a =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a,
      ),
    }
  }

  return {
    storage,
    assets,
    search_query,
    selected_tags,
    all_tags,
    all_groups,
    filtered_assets,

    add_asset,
    remove_asset,
    update_asset,
    get_asset_blob,
  }
}

export type AssetStore = ReturnType<typeof create_asset_store>

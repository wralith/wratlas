import { computed, effect, signal } from "@preact/signals"
import { nanoid } from "nanoid"
import { debounce } from "@/lib/debounce"
import { safe_parse_json } from "@/lib/safe-parse-json"
import type { ColorStorage, PaletteMeta } from "./types"

const INDEX_KEY = "wratlas.colors.v1.index"

const write_to_ls = (data: ColorStorage) => {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(data))
  } catch (e) {
    console.error("Failed to save color store:", e)
  }
}

const get_initial_storage = (): ColorStorage => {
  const raw = localStorage.getItem(INDEX_KEY)
  return safe_parse_json<ColorStorage>(raw) ?? { palettes: [] }
}

export const create_color_store = () => {
  const storage = signal<ColorStorage>(get_initial_storage())
  const palettes = computed(() => storage.value.palettes)

  const search_query = signal("")

  const filtered_palettes = computed(() => {
    const query = search_query.value.trim().toLowerCase()
    if (!query) return palettes.value
    return palettes.value.filter(p => p.name.toLowerCase().includes(query))
  })

  const debounced_save = debounce((data: ColorStorage) => write_to_ls(data), 200)
  effect(() => {
    debounced_save(storage.value)
  })
  addEventListener("beforeunload", () => write_to_ls(storage.value))

  const add_palette = (input: {
    name: string
    colors: string[]
    harmony: PaletteMeta["harmony"]
    source_image_id?: string
  }) => {
    const id = nanoid(8)
    const now = new Date().toISOString()
    const meta: PaletteMeta = {
      id,
      name: input.name,
      colors: input.colors,
      harmony: input.harmony,
      source_image_id: input.source_image_id,
      createdAt: now,
      updatedAt: now,
    }
    storage.value = { palettes: [...storage.value.palettes, meta] }
    return meta
  }

  const remove_palette = (id: string) => {
    storage.value = { palettes: storage.value.palettes.filter(p => p.id !== id) }
  }

  const update_palette = (id: string, updates: Partial<PaletteMeta>) => {
    storage.value = {
      palettes: storage.value.palettes.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p,
      ),
    }
  }

  const save_now = () => write_to_ls(storage.value)

  return {
    storage,
    palettes,
    search_query,
    filtered_palettes,
    add_palette,
    remove_palette,
    update_palette,
    save_now,
  }
}

export type ColorStore = ReturnType<typeof create_color_store>

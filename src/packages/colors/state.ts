import { signal } from "@preact/signals"
import { create_color_store } from "./internal/store"
import type { PaletteMeta } from "./internal/types"

export const color_store = create_color_store()

export type SuggestionState = {
  colors: string[]
  source_image_id: string | null
  image_url: string
} | null

export const suggested_palette = signal<SuggestionState>(null)

export const open_suggestion = (colors: string[], source_image_id: string | null, image_url: string) => {
  suggested_palette.value = { colors, source_image_id, image_url }
}

export const close_suggestion = () => {
  const prev = suggested_palette.value
  if (prev) URL.revokeObjectURL(prev.image_url)
  suggested_palette.value = null
}

export const detail_palette = signal<PaletteMeta | null>(null)

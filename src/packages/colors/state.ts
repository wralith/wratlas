import { signal } from "@preact/signals"
import { create_color_store } from "./internal/store"

export const color_store = create_color_store()

export type SuggestionState = {
  colors: string[]
  x: number
  y: number
  source_image_id: string | null
} | null

export const suggested_palette = signal<SuggestionState>(null)

export const open_suggestion = (colors: string[], x: number, y: number, source_image_id: string | null = null) => {
  suggested_palette.value = { colors, x, y, source_image_id }
}

export const close_suggestion = () => {
  suggested_palette.value = null
}

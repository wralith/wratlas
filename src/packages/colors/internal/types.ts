export type PaletteId = string

export type HarmonyType = "none" | "analogous" | "monochromatic" | "triad" | "tetrad" | "splitcomplement" | "complement"

export type PaletteMeta = {
  id: PaletteId
  name: string
  colors: string[]
  harmony: HarmonyType
  source_image_id?: string
  createdAt: string
  updatedAt: string
}

export type ColorStorage = {
  palettes: PaletteMeta[]
}

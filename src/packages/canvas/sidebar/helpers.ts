import type { FabricObject } from "fabric"
import { vars } from "@/styles/vars.css.ts"
import type { Tone } from "@/ui/atoms/color-swatch/color-swatch"
import { canvas_controller, fabric_canvas, sidebar_version } from "../state"

export type ColorKey = Tone

export const COLOR_TOKENS: Record<ColorKey, string> = {
  primary: vars.color.primary,
  secondary: vars.color.secondary,
  tertiary: vars.color.tertiary,
  success: vars.color.success,
  warning: vars.color.warning,
  danger: vars.color.danger,
  textPrimary: vars.text.primary,
  textSecondary: vars.text.secondary,
  textMuted: vars.text.muted,
}

export const resolve_color = (key: ColorKey): string => {
  const ref = COLOR_TOKENS[key]
  const name = ref.slice(4, -1).trim()
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#fff"
}

export const match_fill_to_key = (fill: string): ColorKey | undefined =>
  (Object.keys(COLOR_TOKENS) as ColorKey[]).find(key => resolve_color(key) === fill)

export const measure_text_width = (text: string, fontFamily: string, fontSize: number) => {
  const c = document.createElement("canvas")
  const ctx = c.getContext("2d")
  if (!ctx) return 200
  ctx.font = `${fontSize}px ${fontFamily}`
  return ctx.measureText(text).width
}

export const update_and_save = (obj: FabricObject, props: Record<string, unknown>) => {
  obj.set(props)
  obj.dirty = true
  obj.setCoords()
  fabric_canvas.value?.renderAll()
  sidebar_version.value++
  void canvas_controller.save_state()
}

export const fontOptions = [
  { value: "JetBrains Mono", label: "JetBrains Mono" },
  { value: "Instrument Serif", label: "Instrument Serif" },
  { value: "'Architects Daughter', cursive", label: "Architects Daughter" },
]

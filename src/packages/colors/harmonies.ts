import { TinyColor } from "@ctrl/tinycolor"
import type { HarmonyType } from "./internal/types"

export const build_harmony = (base: string, harmony: HarmonyType): string[] => {
  const color = new TinyColor(base)
  switch (harmony) {
    case "analogous":
      return color.analogous(5).map(c => c.toHexString())
    case "monochromatic":
      return color.monochromatic(5).map(c => c.toHexString())
    case "triad":
      return color.triad().map(c => c.toHexString())
    case "tetrad":
      return color.tetrad().map(c => c.toHexString())
    case "splitcomplement":
      return splitcomplement(color).map(c => c.toHexString())
    case "complement":
      return [color.toHexString(), color.complement().toHexString()]
    default:
      return [color.toHexString()]
  }
}

export const HARMONY_OPTIONS: { id: HarmonyType; label: string }[] = [
  { id: "none", label: "None" },
  { id: "analogous", label: "Analogous" },
  { id: "monochromatic", label: "Monochromatic" },
  { id: "triad", label: "Triad" },
  { id: "tetrad", label: "Tetrad" },
  { id: "splitcomplement", label: "Split complement" },
  { id: "complement", label: "Complement" },
]

const splitcomplement = (color: TinyColor): TinyColor[] => {
  var hsl = color.toHsl()
  return [
    color,
    new TinyColor({ h: (hsl.h + 150) % 360, s: hsl.s, l: hsl.l }),
    new TinyColor({ h: (hsl.h + 210) % 360, s: hsl.s, l: hsl.l }),
  ]
}

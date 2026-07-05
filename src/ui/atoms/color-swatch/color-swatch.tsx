import { vars } from "@/styles/vars.css.ts"
import { container, swatch } from "./color-swatch.css.ts"

export type Tone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "warning"
  | "danger"
  | "textPrimary"
  | "textSecondary"
  | "textMuted"

const ALL_DEFS: { key: Tone; label: string; varRef: string }[] = [
  { key: "primary", label: "Primary", varRef: vars.color.primary },
  { key: "secondary", label: "Secondary", varRef: vars.color.secondary },
  { key: "tertiary", label: "Tertiary", varRef: vars.color.tertiary },
  { key: "success", label: "Success", varRef: vars.color.success },
  { key: "warning", label: "Warning", varRef: vars.color.warning },
  { key: "danger", label: "Danger", varRef: vars.color.danger },
  { key: "textPrimary", label: "Text", varRef: vars.text.primary },
  { key: "textSecondary", label: "Text 2", varRef: vars.text.secondary },
  { key: "textMuted", label: "Muted", varRef: vars.text.muted },
]

const COLORS = () => {
  const seen = new Set<string>()
  return ALL_DEFS.filter(({ varRef }) => {
    const name = varRef.slice(4, -1).trim()
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    if (!value || seen.has(value)) return false
    seen.add(value)
    return true
  })
}

export type ColorSwatchesProps = {
  selected?: Tone
  onSelect: (tone: Tone) => void
}

export const ColorSwatches = ({ selected, onSelect }: ColorSwatchesProps) => {
  const defs = COLORS()

  return (
    <div class={container}>
      {defs.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          class={swatch({ tone: key, active: selected === key })}
          aria-label={label}
          onClick={() => onSelect(key)}
        />
      ))}
    </div>
  )
}

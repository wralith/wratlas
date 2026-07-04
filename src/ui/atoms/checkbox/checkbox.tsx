import { Check } from "lucide-preact"
import type { JSX } from "preact"
import { cn } from "@/lib/cn"
import { box, boxChecked } from "./checkbox.css.ts"

export type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  class?: string
} & JSX.IntrinsicElements["label"]

export const Checkbox = (props: CheckboxProps) => {
  const { checked, onChange, class: className, ...rest } = props

  return (
    <label class={cn(box, checked && boxChecked, className)} {...rest}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange((e.target as HTMLInputElement).checked)}
        style="display:none"
      />
      <Check size={12} style={{ visibility: checked ? "visible" : "hidden", flexShrink: 0 }} />
    </label>
  )
}

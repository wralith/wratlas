import { useSignal } from "@preact/signals"
import { Check, ChevronDown, X } from "lucide-preact"
import { useRef } from "preact/hooks"
import { cn } from "@/lib/cn"
import { useFloatingList } from "@/lib/use-floating-list"
import * as styles from "./multi-select.css.ts"

export type MultiSelectProps = {
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  placeholder?: string
  height?: string | number
  maxWidth?: string | number
}

export const MultiSelect = (props: MultiSelectProps) => {
  const { value, onChange, options, placeholder = "Select...", height, maxWidth } = props

  const rootRef = useRef<HTMLDivElement>(null)
  const open = useSignal(false)

  useFloatingList(rootRef, {
    value: open.value,
    set: v => {
      open.value = v
    },
  })

  const selectedSet = new Set(value)

  const toggle = (tag: string) => {
    onChange(selectedSet.has(tag) ? value.filter(t => t !== tag) : [...value, tag])
  }

  const clearAll = () => {
    onChange([])
    open.value = false
  }

  const pillAreaStyle = maxWidth ? `max-width:${typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth}` : undefined

  return (
    <div class={styles.root} ref={rootRef} style={pillAreaStyle}>
      <button
        type="button"
        class={styles.trigger}
        onClick={() => {
          open.value = !open.value
        }}
        aria-expanded={open.value}
      >
        <div class={styles.pills}>
          {value.length === 0 && <span class={styles.placeholder}>{placeholder}</span>}
          {value.map(tag => (
            <span key={tag} class={styles.pill}>
              {tag}
              <button
                type="button"
                class={styles.pillRemove}
                onClick={e => {
                  e.stopPropagation()
                  toggle(tag)
                }}
                aria-label={`Remove ${tag}`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        <ChevronDown size={14} class={styles.chevron} />
      </button>

      {open.value && (
        <div class={styles.panel}>
          <ul
            class={styles.list}
            style={height ? `max-height:${typeof height === "number" ? `${height}px` : height}` : undefined}
          >
            {options.length === 0 && <li class={styles.empty}>No options</li>}
            {options.map(option => (
              <li key={option}>
                <button
                  type="button"
                  class={cn(styles.option, selectedSet.has(option) && styles.optionSelected)}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => toggle(option)}
                >
                  <Check size={14} opacity={selectedSet.has(option) ? 1 : 0} />
                  {option}
                </button>
              </li>
            ))}
          </ul>

          {value.length > 0 && (
            <div class={styles.actions}>
              <button type="button" class={styles.deselectAll} onClick={clearAll}>
                <X size={12} />
                Deselect all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

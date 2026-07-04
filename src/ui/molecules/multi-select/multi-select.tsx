import { useSignal } from "@preact/signals"
import { Check, ChevronDown, X } from "lucide-preact"
import { useMemo, useRef } from "preact/hooks"
import { cn } from "@/lib/cn"
import { useFloatingList } from "@/lib/use-floating-list"
import { Input } from "@/ui/atoms/input/input"
import * as styles from "./multi-select.css.ts"

export type MultiSelectProps = {
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  placeholder?: string
  searchPlaceholder?: string
  hideSearch?: boolean
  visibleCount?: number
  height?: string | number
  maxWidth?: string | number
}

export const MultiSelect = (props: MultiSelectProps) => {
  const {
    value,
    onChange,
    options,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    hideSearch = true,
    visibleCount,
    height,
    maxWidth,
  } = props

  const rootRef = useRef<HTMLDivElement>(null)
  const open = useSignal(false)
  const query = useSignal("")

  useFloatingList(rootRef, {
    value: open.value,
    set: v => {
      open.value = v
      if (!v) query.value = ""
    },
  })

  const selectedSet = new Set(value)

  const filteredOptions = useMemo(() => {
    if (hideSearch) return options
    const normalizedQuery = query.value.trim().toLowerCase()
    if (!normalizedQuery) return options
    return options.filter(option => option.toLowerCase().includes(normalizedQuery))
  }, [options, query.value, hideSearch])

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
          {value.slice(0, visibleCount).map(tag => (
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
          {visibleCount !== undefined && value.length > visibleCount && (
            <span class={styles.pillMore}>+{value.length - visibleCount} more</span>
          )}
        </div>
        <ChevronDown size={14} class={styles.chevron} />
      </button>

      {open.value && (
        <div class={styles.panel}>
          {!hideSearch && (
            <div class={styles.search}>
              <Input
                type="text"
                value={query.value}
                onInput={e => {
                  query.value = (e.target as HTMLInputElement).value
                }}
                placeholder={searchPlaceholder}
              />
            </div>
          )}

          <ul
            class={styles.list}
            style={height ? `max-height:${typeof height === "number" ? `${height}px` : height}` : undefined}
          >
            {filteredOptions.length === 0 && <li class={styles.empty}>No options</li>}
            {filteredOptions.map(option => (
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

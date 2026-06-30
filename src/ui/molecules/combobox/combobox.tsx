import { Check, ChevronDown } from "lucide-preact"
import type { ComponentType } from "preact"
import { useEffect, useMemo, useRef, useState } from "preact/hooks"
import { cn } from "@/lib/cn"
import { Input } from "@/ui/atoms/input/input"
import * as styles from "./combobox.css.ts"

export type ComboboxOption = {
  id: string
  label: string
}

export type ComboboxAction = {
  id: string
  label: string
  icon?: ComponentType<{ size?: number | string }>
  tone?: "default" | "danger"
  disabled?: boolean
  onSelect: () => void | Promise<void>
}

type ComboboxProps = {
  value: string
  options: ComboboxOption[]
  onChange: (id: string) => void | Promise<void>
  actions?: ComboboxAction[]
  placeholder?: string
  searchPlaceholder?: string
  emptyLabel?: string
}

export const Combobox = (props: ComboboxProps) => {
  const {
    value,
    options,
    onChange,
    actions = [],
    placeholder = "Select",
    searchPlaceholder = "Search...",
    emptyLabel = "No results",
  } = props

  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  const selectedOption = options.find(option => option.id === value)

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return options
    return options.filter(option => option.label.toLowerCase().includes(normalizedQuery))
  }, [options, query])

  const handleSelect = async (id: string) => {
    await onChange(id)
    setOpen(false)
    setQuery("")
  }

  return (
    <div class={styles.root} ref={rootRef}>
      <button
        type="button"
        class={styles.trigger}
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span class={styles.triggerLabel}>{selectedOption?.label || placeholder}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div class={styles.panel}>
          <div class={styles.search}>
            <Input
              type="text"
              value={query}
              onInput={e => setQuery((e.target as HTMLInputElement).value)}
              placeholder={searchPlaceholder}
            />
          </div>

          <ul class={styles.list} role="listbox">
            {filteredOptions.length === 0 && <li class={styles.empty}>{emptyLabel}</li>}
            {filteredOptions.map(option => (
              <li key={option.id}>
                <button
                  type="button"
                  class={cn(styles.optionButton, option.id === value && styles.optionButtonSelected)}
                  onClick={() => void handleSelect(option.id)}
                >
                  <Check size={14} opacity={option.id === value ? 1 : 0} />
                  {option.label}
                </button>
              </li>
            ))}
          </ul>

          {actions.length > 0 && (
            <div class={styles.actions}>
              {actions.map(action => {
                const Icon = action.icon
                return (
                  <button
                    key={action.id}
                    type="button"
                    class={cn(styles.actionButton, action.tone === "danger" && styles.actionDanger)}
                    disabled={action.disabled}
                    onClick={() => {
                      void action.onSelect()
                      setOpen(false)
                      setQuery("")
                    }}
                  >
                    {Icon && <Icon size={14} />}
                    {action.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import { useSignal } from "@preact/signals"
import { Check, ChevronDown } from "lucide-preact"
import type { ComponentChildren, ComponentType } from "preact"
import { useMemo, useRef } from "preact/hooks"
import { cn } from "@/lib/cn"
import { useFloatingList } from "@/lib/use-floating-list"
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
  height?: string | number
  trigger?: ComponentChildren
  hideSearch?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
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
    height,
    trigger,
    hideSearch = false,
    open: controlledOpen,
    onOpenChange,
  } = props

  const rootRef = useRef<HTMLDivElement>(null)
  const internalOpen = useSignal(false)
  const query = useSignal("")

  const isControlled = controlledOpen !== undefined
  const openValue = isControlled ? controlledOpen : internalOpen.value

  const setOpen = (v: boolean) => {
    if (isControlled) {
      onOpenChange?.(v)
    } else {
      internalOpen.value = v
    }
  }

  useFloatingList(rootRef, { value: openValue, set: setOpen })

  const selectedOption = options.find(option => option.id === value)

  const filteredOptions = useMemo(() => {
    if (hideSearch) return options
    const normalizedQuery = query.value.trim().toLowerCase()
    if (!normalizedQuery) return options
    return options.filter(option => option.label.toLowerCase().includes(normalizedQuery))
  }, [options, query.value, hideSearch])

  const handleSelect = async (id: string) => {
    await onChange(id)
    setOpen(false)
    query.value = ""
  }

  return (
    <div class={styles.root} ref={rootRef}>
      {trigger ? (
        trigger
      ) : (
        <button
          type="button"
          class={styles.trigger}
          onClick={() => {
            setOpen(!openValue)
          }}
          aria-haspopup="listbox"
          aria-expanded={openValue}
          aria-label={placeholder}
        >
          <span class={styles.triggerLabel}>{selectedOption?.label || placeholder}</span>
          <ChevronDown size={14} />
        </button>
      )}

      {openValue && (
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
            {filteredOptions.length === 0 && <li class={styles.empty}>{emptyLabel}</li>}
            {filteredOptions.map(option => (
              <li key={option.id}>
                <button
                  type="button"
                  class={cn(styles.optionButton, option.id === value && styles.optionButtonSelected)}
                  onMouseDown={e => e.preventDefault()}
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
                      query.value = ""
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

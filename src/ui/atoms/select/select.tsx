import { autoUpdate, FloatingPortal, flip, offset, shift, useFloating } from "@floating-ui/react"
import { Check, ChevronDown } from "lucide-preact"
import type { JSX } from "preact"
import { useEffect, useId, useRef, useState } from "preact/hooks"
import { cn } from "@/lib/cn"
import * as styles from "./select.css.ts"

export type SelectOption = {
  id: string
  label: string
  disabled?: boolean
}

export type SelectProps = {
  value: string
  options: SelectOption[]
  onChange: (id: string) => void
  placeholder?: string
  ariaLabel?: string
}

export const Select = (props: SelectProps) => {
  const { value, options, onChange, placeholder = "Select", ariaLabel } = props
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const scopeId = useId()

  const { refs, floatingStyles } = useFloating({
    open,
    placement: "bottom-start",
    strategy: "fixed",
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  const selected = options.find(o => o.id === value)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return
      if (e.target.closest(`[data-select-scope="${scopeId}"]`)) return
      setOpen(false)
    }
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onEscape)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onEscape)
    }
  }, [open, scopeId])

  const handleSelect = (id: string) => {
    onChange(id)
    setOpen(false)
  }

  return (
    <div class={styles.root} ref={rootRef} data-select-scope={scopeId}>
      <button
        ref={refs.setReference as never}
        type="button"
        class={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen(v => !v)}
      >
        <span class={styles.triggerLabel}>{selected?.label ?? placeholder}</span>
        <span class={styles.triggerChevron} aria-hidden="true">
          <ChevronDown size={14} />
        </span>
      </button>

      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating as never}
            style={floatingStyles as JSX.CSSProperties}
            class={styles.panel}
            role="listbox"
            data-select-scope={scopeId}
          >
            <ul class={styles.list}>
              {options.map(option => (
                <li key={option.id}>
                  <button
                    type="button"
                    class={cn(styles.option, option.id === value && option.id)}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={option.id === value}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => handleSelect(option.id)}
                  >
                    <span class={styles.optionCheck} aria-hidden="true">
                      {option.id === value && <Check size={14} />}
                    </span>
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </FloatingPortal>
      )}
    </div>
  )
}

import { useSignal } from "@preact/signals"
import { X } from "lucide-preact"
import type { JSX } from "preact"
import { useMemo, useRef } from "preact/hooks"
import { KeyboardKey } from "@/ui/atoms/keyboard-key/keyboard-key"
import { Combobox } from "@/ui/molecules/combobox/combobox"
import * as styles from "./tag-input.css.ts"

export type TagInputProps = {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  label?: string
  placeholder?: string
  height?: string | number
}

export const TagInput = (props: TagInputProps) => {
  const { value, onChange, suggestions = [], label, placeholder = "Add tag...", height } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const draft = useSignal("")
  const open = useSignal(false)
  const activeIndex = useSignal(-1)

  const filtered = useMemo(() => {
    const q = draft.value.trim().toLowerCase()
    const set = new Set(value)
    const base = q ? suggestions.filter(s => s.toLowerCase().includes(q)) : suggestions
    return base.filter(s => !set.has(s))
  }, [suggestions, value, draft.value])

  const hasNoExactMatch = useMemo(() => {
    const q = draft.value.trim().toLowerCase()
    if (!q) return false
    return !suggestions.some(s => s.toLowerCase() === q)
  }, [suggestions, draft.value])

  const showNewTag = hasNoExactMatch && draft.value.trim().length > 0

  const options = useMemo(() => filtered.map(s => ({ id: s, label: s })), [filtered])

  const addTag = (raw: string) => {
    const tag = raw.trim()
    if (!tag || value.includes(tag)) return
    onChange([...value, tag])
    draft.value = ""
  }

  const removeTag = (tag: string) => {
    onChange(value.filter(t => t !== tag))
  }

  const handleInput = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    const val = (e.currentTarget as HTMLInputElement).value
    if (val.includes(",")) {
      const parts = val.split(",")
      for (let i = 0; i < parts.length - 1; i++) {
        addTag(parts[i])
      }
      draft.value = parts[parts.length - 1]
    } else {
      draft.value = val
    }
    open.value = true
    activeIndex.value = -1
  }

  const handleKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (activeIndex.value >= 0 && activeIndex.value < filtered.length) {
        addTag(filtered[activeIndex.value])
      } else {
        addTag(draft.value)
      }
      open.value = false
      activeIndex.value = -1
    } else if (e.key === "Backspace" && !draft.value && value.length > 0) {
      removeTag(value[value.length - 1])
    } else if (e.key === "ArrowDown" && open.value && filtered.length > 0) {
      e.preventDefault()
      activeIndex.value = Math.min(activeIndex.value + 1, filtered.length - 1)
    } else if (e.key === "ArrowUp" && open.value && filtered.length > 0) {
      e.preventDefault()
      activeIndex.value = Math.max(activeIndex.value - 1, 0)
    }
  }

  const handleBlur = () => {
    if (draft.value.trim()) {
      addTag(draft.value)
    }
    open.value = false
    activeIndex.value = -1
  }

  const focusInput = () => {
    inputRef.current?.focus()
  }

  const inputId = label ? label.toLowerCase().replace(/\s+/g, "-") : undefined

  const comboboxValue = activeIndex.value >= 0 && activeIndex.value < filtered.length ? filtered[activeIndex.value] : ""

  return (
    <div class={styles.wrapper}>
      {label && (
        <label for={inputId} class={styles.label}>
          {label}
        </label>
      )}
      <Combobox
        value={comboboxValue}
        options={options}
        onChange={id => {
          addTag(id)
          open.value = false
          activeIndex.value = -1
        }}
        hideSearch
        open={open.value}
        onOpenChange={v => {
          open.value = v
        }}
        height={height}
        trigger={
          <div class={styles.field} onClick={focusInput}>
            {value.map(tag => (
              <span key={tag} class={styles.tagPill}>
                {tag}
                <button
                  type="button"
                  class={styles.tagRemove}
                  onClick={e => {
                    e.stopPropagation()
                    removeTag(tag)
                  }}
                  aria-label={`Remove ${tag}`}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            <input
              ref={inputRef}
              id={inputId}
              class={styles.inlineInput}
              value={draft.value}
              placeholder={value.length === 0 ? placeholder : ""}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onFocus={() => {
                if (filtered.length > 0) open.value = true
              }}
            />
            {showNewTag && (
              <span class={styles.newTagHint}>
                New Tag
                <KeyboardKey>Enter</KeyboardKey>
              </span>
            )}
          </div>
        }
      />
    </div>
  )
}

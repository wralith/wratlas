import { useEffect, useRef } from "preact/hooks"
import { activeTheme, themeOptions } from "@/lib/theme"
import * as styles from "@/components/settings-dropdown.css.ts"

type Props = {
  onClose: () => void
}

export const SettingsDropdown = ({ onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  return (
    <div ref={ref} class={styles.panel}>
      <div class={styles.sectionLabel}>Theme</div>
      {themeOptions.map(option => (
        <button
          key={option.id}
          type="button"
          class={styles.themeItem({ active: activeTheme.value === option.id })}
          onClick={() => {
            activeTheme.value = option.id
            onClose()
          }}
        >
          <span class={styles.swatch({ theme: option.id })} />
          {option.label}
        </button>
      ))}
    </div>
  )
}

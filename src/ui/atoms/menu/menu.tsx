import { FloatingPortal, flip, offset, shift, useFloating } from "@floating-ui/react"
import type { JSX } from "preact"
import { useEffect } from "preact/hooks"
import { cn } from "@/lib/cn"
import * as styles from "./menu.css.ts"

export type MenuItem = {
  id: string
  label: string
  danger?: boolean
  disabled?: boolean
}

type Point = {
  x: number
  y: number
}

export type MenuProps = {
  open: boolean
  position: Point | null
  items: MenuItem[]
  onSelect: (id: string) => void
  onClose: () => void
}

export const Menu = (props: MenuProps) => {
  const { open, position, items, onSelect, onClose } = props

  const { refs, floatingStyles } = useFloating({
    open,
    placement: "bottom-start",
    strategy: "fixed",
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  })

  useEffect(() => {
    if (!open || !position) return

    refs.setPositionReference({
      getBoundingClientRect: () => new DOMRect(position.x, position.y, 0, 0),
    })
  }, [open, position, refs])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      const floatingEl = refs.floating.current
      if (!floatingEl) return
      if (floatingEl.contains(event.target as Node)) return
      onClose()
    }

    const onContextMenu = (event: MouseEvent) => {
      const floatingEl = refs.floating.current
      if (!floatingEl) return
      if (!floatingEl.contains(event.target as Node)) return
      event.preventDefault()
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      onClose()
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("contextmenu", onContextMenu)
    document.addEventListener("keydown", onEscape)

    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("contextmenu", onContextMenu)
      document.removeEventListener("keydown", onEscape)
    }
  }, [open, onClose, refs.floating])

  if (!open || !position || items.length === 0) return null

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={floatingStyles as JSX.CSSProperties}
        class={styles.menu}
        role="menu"
        aria-label="Canvas menu"
      >
        <ul class={styles.list}>
          {items.map(item => {
            const tone = item.danger ? "danger" : "default"

            return (
              <li key={item.id}>
                <button
                  type="button"
                  class={cn(styles.item, styles.itemTone[tone])}
                  disabled={item.disabled}
                  onClick={() => {
                    if (item.disabled) return
                    onSelect(item.id)
                    onClose()
                  }}
                  role="menuitem"
                >
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </FloatingPortal>
  )
}

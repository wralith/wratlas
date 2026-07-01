import {
  autoUpdate,
  FloatingPortal,
  flip,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react"
import { ChevronRight } from "lucide-preact"
import type { JSX } from "preact"
import { useEffect, useId, useState } from "preact/hooks"
import { cn } from "@/lib/cn"
import * as styles from "./menu.css.ts"

export type MenuItem = {
  id: string
  label: string
  danger?: boolean
  disabled?: boolean
  children?: MenuItem[]
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

type MenuRowProps = {
  item: MenuItem
  onSelect: (id: string) => void
  onClose: () => void
  scopeId: string
}

const MenuRow = ({ item, onSelect, onClose, scopeId }: MenuRowProps) => {
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const hasChildren = !!item.children?.length
  const tone = item.danger ? "danger" : "default"

  const { refs, floatingStyles, context } = useFloating({
    open: submenuOpen,
    onOpenChange: setSubmenuOpen,
    placement: "right-start",
    strategy: "fixed",
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  const hover = useHover(context, {
    enabled: hasChildren && !item.disabled,
    move: false,
    delay: { open: 70, close: 110 },
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([hover])

  if (!hasChildren) {
    return (
      <li>
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
  }

  return (
    <li>
      <button
        ref={refs.setReference}
        type="button"
        class={cn(styles.item, styles.itemTone[tone])}
        disabled={item.disabled}
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={submenuOpen}
        {...getReferenceProps()}
      >
        <span>{item.label}</span>
        <span class={styles.submenuArrow} aria-hidden="true">
          <ChevronRight size={14} />
        </span>
      </button>
      {submenuOpen ? (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles as JSX.CSSProperties}
            class={styles.menu}
            role="menu"
            data-menu-scope={scopeId}
            {...getFloatingProps()}
          >
            <ul class={styles.list}>
              {item.children?.map(child => (
                <MenuRow key={child.id} item={child} onSelect={onSelect} onClose={onClose} scopeId={scopeId} />
              ))}
            </ul>
          </div>
        </FloatingPortal>
      ) : null}
    </li>
  )
}

export const Menu = (props: MenuProps) => {
  const { open, position, items, onSelect, onClose } = props
  const scopeId = useId()

  const { refs, floatingStyles } = useFloating({
    open,
    placement: "bottom-start",
    strategy: "fixed",
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
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
      const target = event.target as HTMLElement
      if (target.closest(`[data-menu-scope="${scopeId}"]`)) return
      onClose()
    }

    const onContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(`[data-menu-scope="${scopeId}"]`)) return
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
  }, [open, onClose, scopeId])

  if (!open || !position || items.length === 0) return null

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={floatingStyles as JSX.CSSProperties}
        class={styles.menu}
        role="menu"
        aria-label="Canvas menu"
        data-menu-scope={scopeId}
      >
        <ul class={styles.list}>
          {items.map(item => (
            <MenuRow key={item.id} item={item} onSelect={onSelect} onClose={onClose} scopeId={scopeId} />
          ))}
        </ul>
      </div>
    </FloatingPortal>
  )
}

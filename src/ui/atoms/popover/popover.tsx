import type { ComponentChildren } from "preact"
import { useCallback, useEffect, useRef } from "preact/hooks"
import { cn } from "@/lib/cn"
import { panel, panelBottomEnd, panelBottomStart, panelTopEnd, panelTopStart, wrapper } from "./popover.css.ts"

export type PopoverPosition = "top-start" | "top-end" | "bottom-start" | "bottom-end" | "top" | "bottom"

export type PopoverProps = {
  open: boolean
  onClose: () => void
  trigger: ComponentChildren
  children: ComponentChildren
  position?: PopoverPosition
  class?: string
}

const positionMap: Record<PopoverPosition, string> = {
  top: panelTopStart,
  "top-start": panelTopStart,
  "top-end": panelTopEnd,
  bottom: panelBottomStart,
  "bottom-start": panelBottomStart,
  "bottom-end": panelBottomEnd,
}

export const Popover = (props: PopoverProps) => {
  const { open, onClose, trigger, children, position = "top", class: className } = props
  const rootRef = useRef<HTMLDivElement>(null)

  const handlePointerDown = useCallback(
    (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onClose()
    },
    [onClose],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, handlePointerDown, handleKeyDown])

  return (
    <div class={cn(wrapper, className)} ref={rootRef}>
      {trigger}
      {open && (
        <div class={cn(panel, positionMap[position])} onClick={e => e.stopPropagation()}>
          {children}
        </div>
      )}
    </div>
  )
}

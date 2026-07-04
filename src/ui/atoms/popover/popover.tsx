import type { ComponentChildren } from "preact"
import { useCallback, useEffect, useRef } from "preact/hooks"
import { cn } from "@/lib/cn"
import { panel, panelBottom, panelTop, wrapper } from "./popover.css.ts"

export type PopoverProps = {
  open: boolean
  onClose: () => void
  trigger: ComponentChildren
  children: ComponentChildren
  position?: "top" | "bottom"
  class?: string
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
        <div class={cn(panel, position === "top" ? panelTop : panelBottom)} onClick={e => e.stopPropagation()}>
          {children}
        </div>
      )}
    </div>
  )
}

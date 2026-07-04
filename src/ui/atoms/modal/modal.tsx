import { FloatingPortal } from "@floating-ui/react"
import type { ComponentChildren } from "preact"
import { useCallback, useEffect } from "preact/hooks"
import { cn } from "@/lib/cn"
import * as styles from "./modal.css.ts"

export type ModalProps = {
  open: boolean
  onClose: () => void
  header?: ComponentChildren
  content?: ComponentChildren
  footer?: ComponentChildren
  width?: string
  height?: string
  class?: string
}

export const Modal = (props: ModalProps) => {
  const { open, onClose, header, content, footer, width, height, class: className } = props

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <FloatingPortal>
      <div class={styles.backdrop} onClick={onClose}>
        <div
          class={cn(styles.modal, className)}
          style={{ width, height }}
          onClick={e => e.stopPropagation()}
          onKeyDown={e => {
            if (e.key === "Escape") onClose()
            e.stopPropagation()
          }}
          onKeyUp={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {header && (
            <div class={styles.header}>
              {typeof header === "string" ? <h2 class={styles.title}>{header}</h2> : header}
            </div>
          )}
          {content && <div class={styles.content}>{content}</div>}
          {footer && <div class={styles.footer}>{footer}</div>}
        </div>
      </div>
    </FloatingPortal>
  )
}

import type { ComponentChildren } from "preact"
import { useCallback, useEffect } from "preact/hooks"
import * as styles from "./modal.css.ts"

export type ModalProps = {
  open: boolean
  onClose: () => void
  header?: ComponentChildren
  content?: ComponentChildren
  footer?: ComponentChildren
}

export const Modal = (props: ModalProps) => {
  const { open, onClose, header, content, footer } = props

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
    <div class={styles.backdrop} onClick={onClose}>
      <div
        class={styles.modal}
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
  )
}

import { Fragment } from "preact/jsx-runtime"
import { Button } from "@/ui/atoms/button/button"
import { KeyboardKey } from "@/ui/atoms/keyboard-key/keyboard-key"
import { Modal } from "@/ui/atoms/modal/modal"
import * as styles from "./toolbar.css"

type CanvasToolbarShortcutsModalProps = {
  open: boolean
  onClose: () => void
}

export const CanvasToolbarShortcutsModal = (props: CanvasToolbarShortcutsModalProps) => {
  const { open, onClose } = props
  const modKeyLabel =
    typeof navigator !== "undefined" && navigator.platform.toLowerCase().includes("mac") ? "Cmd" : "Ctrl"

  return (
    <Modal
      open={open}
      onClose={onClose}
      header="Keyboard Shortcuts"
      content={
        <div class={styles.shortcutsList}>
          <ShortcutRow keys={[modKeyLabel, "Wheel"]} label="Zoom in / out" />
          <ShortcutRow keys={["Wheel"]} label="Pan canvas" />
          <ShortcutRow keys={[modKeyLabel, "Z"]} label="Undo" />
          <ShortcutRow keys={[modKeyLabel, "Shift", "Z"]} label="Redo" />
          <ShortcutRow keys={[modKeyLabel, "Y"]} label="Redo (alternative)" />
          <ShortcutRow keys={[modKeyLabel, "C"]} label="Copy selected object" />
          <ShortcutRow keys={[modKeyLabel, "+"]} label="Zoom in" />
          <ShortcutRow keys={[modKeyLabel, "-"]} label="Zoom out" />
          <ShortcutRow keys={[modKeyLabel, "0"]} label="Reset viewport" />
          <ShortcutRow keys={["Space", "Drag"]} label="Pan with hand tool" />
          <ShortcutRow keys={["Middle Mouse", "Drag"]} label="Pan with mouse" />
          <ShortcutRow keys={["Delete"]} label="Delete selected object" />
          <ShortcutRow keys={["Esc"]} label="Clear selection" />
        </div>
      }
      footer={
        <Button size="small" color="primary" onClick={onClose}>
          Close
        </Button>
      }
    />
  )
}

const ShortcutRow = (props: { keys: string[]; label: string }) => {
  const { keys, label } = props

  return (
    <div class={styles.shortcutsRow}>
      <span class={styles.shortcutLabel}>{label}</span>
      <div class={styles.shortcutKeys}>
        {keys.map((key, index) => (
          <Fragment key={`${key}-${index}`}>
            {index > 0 && <span class={styles.shortcutPlus}>+</span>}
            <span class={styles.shortcutKeyPart}>
              <KeyboardKey wide={key.length > 7}>{key}</KeyboardKey>
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

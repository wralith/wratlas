import type { ComponentChildren } from "preact"
import { cn } from "@/lib/cn"
import * as styles from "./keyboard-key.css"

export type KeyboardKeyProps = {
  wide?: boolean
  children: ComponentChildren
}

export const KeyboardKey = (props: KeyboardKeyProps) => {
  const { wide, children } = props

  return <kbd class={cn(styles.key, wide && styles.wide)}>{children}</kbd>
}

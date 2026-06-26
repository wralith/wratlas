import { clsx } from "clsx"
import type { ComponentChildren, JSX } from "preact"
import styles from "./anchor.module.css"

export type AnchorProps = {
  color?: "primary" | "secondary" | "muted"
  underline?: boolean
  left?: ComponentChildren
  right?: ComponentChildren
} & JSX.IntrinsicElements["a"]

export const Anchor = (props: AnchorProps) => {
  const { color = "muted", underline = false, left, right, children, ...rest } = props

  return (
    <a {...rest} data-color={color} data-underline={underline ? "" : undefined} class={clsx(styles.anchor, rest.class)}>
      {left && <span class={styles.icon}>{left}</span>}
      {children && <span class={styles.label}>{children}</span>}
      {right && <span class={styles.icon}>{right}</span>}
    </a>
  )
}

import { clsx } from "clsx"
import type { ComponentChildren, JSX } from "preact"
import { anchor, label, icon } from "./anchor.css.ts"

export type AnchorProps = {
  color?: "primary" | "secondary" | "muted"
  underline?: boolean
  left?: ComponentChildren
  right?: ComponentChildren
} & JSX.IntrinsicElements["a"]

export const Anchor = (props: AnchorProps) => {
  const { color = "muted", underline = false, left, right, children, ...rest } = props

  return (
    <a {...rest} class={clsx(anchor({ color, underline }), rest.class)}>
      {left && <span class={icon}>{left}</span>}
      {children && <span class={label}>{children}</span>}
      {right && <span class={icon}>{right}</span>}
    </a>
  )
}

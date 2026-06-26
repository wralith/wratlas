import { clsx } from "clsx"
import type { ButtonHTMLAttributes, ComponentChildren } from "preact"
import { button, label, labelIconOnly, spinner } from "./button.css.ts"

export type ButtonProps = {
  color?: "primary" | "secondary"
  size?: "icon-only" | "small" | "large"
  loading?: boolean
  left?: ComponentChildren
  right?: ComponentChildren
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = (props: ButtonProps) => {
  const { color, size, loading, left, right, children, ...rest } = props

  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      class={clsx(
        button({
          color,
          size: size !== "small" ? size : undefined,
        }),
        rest.class,
      )}
    >
      {loading && <span class={spinner} />}
      {!loading && left && <>{left}</>}
      {!loading && children && <span class={clsx(label, size === "icon-only" && labelIconOnly)}>{children}</span>}
      {!loading && right && <>{right}</>}
    </button>
  )
}

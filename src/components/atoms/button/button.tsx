import { clsx } from "clsx"
import type { ButtonHTMLAttributes, ComponentChildren } from "preact"
import styles from "./button.module.css"

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
      data-color={color}
      data-size={size}
      disabled={rest.disabled || loading}
      class={clsx(styles.button, rest.class)}
    >
      {loading && <span class={styles.spinner} />}
      {!loading && left && <>{left}</>}
      {!loading && children && <span class={styles.label}>{children}</span>}
      {!loading && right && <>{right}</>}
    </button>
  )
}

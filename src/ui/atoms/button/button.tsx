import type { RecipeVariants } from "@vanilla-extract/recipes"
import { clsx } from "clsx"
import type { ButtonHTMLAttributes, ComponentChildren } from "preact"
import { button, label, labelIconOnly, spinner } from "@/ui/atoms/button/button.css.ts"

type ButtonVariants = RecipeVariants<typeof button>

export type ButtonProps = ButtonVariants & {
  loading?: boolean
  left?: ComponentChildren
  right?: ComponentChildren
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = (props: ButtonProps) => {
  const { color, size, loading, left, right, children, ...rest } = props

  return (
    <button {...rest} disabled={rest.disabled || loading} class={clsx(button({ color, size }), rest.class)}>
      {loading && <span class={spinner} />}
      {!loading && left && <>{left}</>}
      {!loading && children && <span class={clsx(label, size === "icon-only" && labelIconOnly)}>{children}</span>}
      {!loading && right && <>{right}</>}
    </button>
  )
}

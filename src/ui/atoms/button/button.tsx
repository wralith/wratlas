import type { RecipeVariants } from "@vanilla-extract/recipes"
import type { ButtonHTMLAttributes, ComponentChildren } from "preact"
import { cn } from "@/lib/cn"
import { button, label, labelIconOnly, spinner } from "@/ui/atoms/button/button.css.ts"

type ButtonVariants = RecipeVariants<typeof button>

export type ButtonProps = ButtonVariants & {
  loading?: boolean
  left?: ComponentChildren
  right?: ComponentChildren
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = (props: ButtonProps) => {
  const { color, variant, size, loading, left, right, children, ...rest } = props

  return (
    <button {...rest} disabled={rest.disabled || loading} class={cn(button({ color, variant, size }), rest.class)}>
      {loading && <span class={spinner} />}
      {!loading && left && <>{left}</>}
      {!loading && children && <span class={cn(label, size === "icon-only" && labelIconOnly)}>{children}</span>}
      {!loading && right && <>{right}</>}
    </button>
  )
}

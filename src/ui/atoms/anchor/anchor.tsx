import type { RecipeVariants } from "@vanilla-extract/recipes"
import type { ComponentChildren, JSX } from "preact"
import { cn } from "@/lib/cn"
import { anchor, icon, label } from "@/ui/atoms/anchor/anchor.css.ts"

type AnchorVariants = RecipeVariants<typeof anchor>

export type AnchorProps = AnchorVariants & {
  left?: ComponentChildren
  right?: ComponentChildren
} & JSX.IntrinsicElements["a"]

export const Anchor = (props: AnchorProps) => {
  const { color, underline, left, right, children, ...rest } = props

  return (
    <a {...rest} class={cn(anchor({ color, underline }), rest.class)}>
      {left && <span class={icon}>{left}</span>}
      {children && <span class={label}>{children}</span>}
      {right && <span class={icon}>{right}</span>}
    </a>
  )
}

import type { RecipeVariants } from "@vanilla-extract/recipes"
import type { JSX } from "preact"
import { cn } from "@/lib/cn"
import { flex } from "@/ui/atoms/flex/flex.css.ts"

type FlexVariants = RecipeVariants<typeof flex>

export type FlexProps = FlexVariants & JSX.IntrinsicElements["div"]

export const Flex = (props: FlexProps) => {
  const { children, inline, direction, justify, align, wrap, gap, ...rest } = props

  return (
    <div {...rest} class={cn(flex({ inline, direction, justify, align, wrap, gap }), rest.class)}>
      {children}
    </div>
  )
}

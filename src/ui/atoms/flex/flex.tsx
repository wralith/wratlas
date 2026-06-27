import type { RecipeVariants } from "@vanilla-extract/recipes"
import { clsx } from "clsx"
import type { JSX } from "preact"
import { flex } from "@/ui/atoms/flex/flex.css.ts"

type FlexVariants = RecipeVariants<typeof flex>

export type FlexProps = FlexVariants & JSX.IntrinsicElements["div"]

export const Flex = (props: FlexProps) => {
  const { children, inline, direction, justify, align, wrap, gap, ...rest } = props

  return (
    <div {...rest} class={clsx(flex({ inline, direction, justify, align, wrap, gap }), rest.class)}>
      {children}
    </div>
  )
}

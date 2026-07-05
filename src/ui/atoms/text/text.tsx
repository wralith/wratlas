import type { RecipeVariants } from "@vanilla-extract/recipes"
import type { JSX } from "preact"
import { cn } from "@/lib/cn"
import { text } from "./text.css.ts"

type TextVariants = RecipeVariants<typeof text>

export type TextProps = TextVariants & {
  as?: keyof JSX.IntrinsicElements
} & Omit<JSX.IntrinsicElements["p"], "as">

export const Text = (props: TextProps) => {
  const { as, size, color, weight, children, ...rest } = props
  const Element = as ?? "p"

  return (
    // biome-ignore lint/suspicious/noExplicitAny: Preact JSX needs dynamic element types
    <Element {...(rest as any)} class={cn(text({ size, color, weight }), rest.class)}>
      {children}
    </Element>
  )
}

import type { RecipeVariants } from "@vanilla-extract/recipes"
import type { JSX } from "preact"
import { cn } from "@/lib/cn"
import { flex } from "@/ui/atoms/flex/flex.css.ts"

type FlexVariants = RecipeVariants<typeof flex>

export type FlexProps = FlexVariants & {
  w?: string | number
  h?: string | number
  flex?: string | number
} & JSX.IntrinsicElements["div"]

const resolve = (v: string | number | undefined, unit = "px"): string | undefined =>
  v !== undefined ? (typeof v === "number" ? `${v}${unit}` : v) : undefined

export const Flex = (props: FlexProps) => {
  const { children, inline, direction, justify, align, wrap, gap, w, h, flex: flexVal, style, ...rest } = props

  return (
    <div
      {...rest}
      class={cn(flex({ inline, direction, justify, align, wrap, gap }), rest.class)}
      style={
        {
          ...(w !== undefined ? { width: resolve(w) } : {}),
          ...(h !== undefined ? { height: resolve(h) } : {}),
          ...(flexVal !== undefined ? { flex: resolve(flexVal, "") } : {}),
          ...(typeof style === "object" ? style : {}),
        } as JSX.CSSProperties
      }
    >
      {children}
    </div>
  )
}

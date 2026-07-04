import type { RecipeVariants } from "@vanilla-extract/recipes"
import { cn } from "@/lib/cn"
import { Box, type BoxProps } from "@/ui/atoms/box/box"
import { flex } from "@/ui/atoms/flex/flex.css.ts"

type FlexVariants = RecipeVariants<typeof flex>

const resolveFlex = (v: string | number | undefined): string | undefined =>
  v !== undefined ? (typeof v === "number" ? `${v}` : v) : undefined

export type FlexProps = FlexVariants &
  BoxProps & {
    flex?: string | number
  }

export const Flex = (props: FlexProps) => {
  const { children, inline, direction, justify, align, wrap, gap, flex: flexVal, style, ...rest } = props

  return (
    <Box
      {...rest}
      class={cn(flex({ inline, direction, justify, align, wrap, gap }), rest.class)}
      style={{
        ...(flexVal !== undefined ? { flex: resolveFlex(flexVal) } : {}),
        ...(typeof style === "object" ? style : {}),
      }}
    >
      {children}
    </Box>
  )
}

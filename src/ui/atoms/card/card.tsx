import { cn } from "@/lib/cn"
import { Box, type BoxProps } from "@/ui/atoms/box/box"
import { borderless, card } from "@/ui/atoms/card/card.css.ts"

export type CardProps = BoxProps & {
  border?: boolean
}

export const Card = (props: CardProps) => {
  const { border = true, children, class: className, ...rest } = props

  return (
    <Box {...rest} class={cn(card, !border && borderless, className)}>
      {children}
    </Box>
  )
}

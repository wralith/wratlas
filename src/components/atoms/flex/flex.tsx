import { clsx } from "clsx"
import type { ComponentChildren, JSX } from "preact"
import { flex } from "./flex.css.ts"

export type FlexProps = {
  direction?: "row" | "column"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  align?: "start" | "center" | "end" | "stretch" | "baseline"
  wrap?: boolean
  gap?: "xs" | "sm" | "md" | "lg" | "xl"
  inline?: boolean
  children: ComponentChildren
} & JSX.IntrinsicElements["div"]

export const Flex = (props: FlexProps) => {
  const { direction, justify, align, wrap, gap, inline, children, ...rest } = props

  return (
    <div
      {...rest}
      class={clsx(
        flex({
          inline,
          direction: direction !== "row" ? direction : undefined,
          justify: justify !== "start" ? justify : undefined,
          align: align !== "start" ? align : undefined,
          wrap,
          gap,
        }),
        rest.class,
      )}
    >
      {children}
    </div>
  )
}

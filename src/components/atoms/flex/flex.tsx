import { clsx } from "clsx"
import type { ComponentChildren, JSX } from "preact"
import styles from "./flex.module.css"

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
      data-direction={direction}
      data-justify={justify}
      data-align={align}
      data-wrap={wrap ? "" : undefined}
      data-gap={gap}
      data-inline={inline ? "" : undefined}
      class={clsx(styles.flex, rest.class)}
    >
      {children}
    </div>
  )
}

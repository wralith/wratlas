import { clsx } from "clsx"
import type { JSX } from "preact"
import { card, borderless } from "./card.css.ts"

export type CardProps = {
  border?: boolean
} & JSX.IntrinsicElements["div"]

export const Card = (props: CardProps) => {
  const { border = true, children, ...rest } = props

  return (
    <div {...rest} class={clsx(card, !border && borderless, rest.class)}>
      {children}
    </div>
  )
}
